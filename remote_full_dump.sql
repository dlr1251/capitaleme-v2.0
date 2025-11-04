


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."auto_reject_offers"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    rules RECORD;
    validation_result JSONB;
BEGIN
    -- Get negotiation rules for the property
    SELECT * INTO rules FROM negotiation_rules WHERE property_id = NEW.property_id;
    
    IF rules IS NOT NULL AND rules.auto_reject_enabled THEN
        -- Validate the offer
        validation_result := validate_offer_against_rules(
            NEW.property_id,
            NEW.offer_price,
            NEW.payment_method,
            NEW.closing_date
        );
        
        -- If validation fails, auto-reject
        IF NOT (validation_result->>'valid')::boolean THEN
            NEW.auto_rejected := TRUE;
            NEW.rejection_reason := validation_result->>'reason';
            NEW.status := 'rejected';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."auto_reject_offers"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_competitiveness_score"("p_offer_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    offer RECORD;
    property RECORD;
    score INTEGER := 0;
    price_ratio DECIMAL;
    days_to_close INTEGER;
BEGIN
    SELECT * INTO offer FROM offers WHERE id = p_offer_id;
    SELECT * INTO property FROM properties WHERE id = offer.property_id;
    
    -- Price competitiveness (40% weight)
    IF property.price > 0 THEN
        price_ratio := (offer.offer_price::DECIMAL / property.price::DECIMAL) * 100;
        IF price_ratio >= 95 THEN score := score + 40;
        ELSIF price_ratio >= 90 THEN score := score + 30;
        ELSIF price_ratio >= 85 THEN score := score + 20;
        ELSIF price_ratio >= 80 THEN score := score + 10;
        END IF;
    END IF;
    
    -- Payment method competitiveness (20% weight)
    CASE offer.payment_method
        WHEN 'cash' THEN score := score + 20;
        WHEN 'bank_transfer' THEN score := score + 15;
        WHEN 'financing' THEN score := score + 10;
        WHEN 'installments' THEN score := score + 5;
    END CASE;
    
    -- Closing date competitiveness (20% weight)
    days_to_close := offer.closing_date - CURRENT_DATE;
    IF days_to_close <= 30 THEN score := score + 20;
    ELSIF days_to_close <= 60 THEN score := score + 15;
    ELSIF days_to_close <= 90 THEN score := score + 10;
    ELSIF days_to_close <= 120 THEN score := score + 5;
    END IF;
    
    -- Conditions competitiveness (20% weight)
    IF offer.conditions IS NULL OR array_length(offer.conditions, 1) IS NULL THEN
        score := score + 20; -- No conditions = most competitive
    ELSIF array_length(offer.conditions, 1) <= 2 THEN
        score := score + 15;
    ELSIF array_length(offer.conditions, 1) <= 4 THEN
        score := score + 10;
    ELSE
        score := score + 5;
    END IF;
    
    RETURN LEAST(score, 100);
END;
$$;


ALTER FUNCTION "public"."calculate_competitiveness_score"("p_offer_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_negotiation_progress"("p_offer_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    offer RECORD;
    progress INTEGER := 0;
    milestones JSONB;
BEGIN
    SELECT * INTO offer FROM offers WHERE id = p_offer_id;
    milestones := COALESCE(offer.milestones_completed, '{}'::jsonb);
    
    -- Milestone weights (total 100%)
    IF (milestones->>'offer_sent')::boolean THEN progress := progress + 20; END IF;
    IF (milestones->>'visit_completed')::boolean THEN progress := progress + 15; END IF;
    IF (milestones->>'price_agreed')::boolean THEN progress := progress + 25; END IF;
    IF (milestones->>'payment_agreed')::boolean THEN progress := progress + 15; END IF;
    IF (milestones->>'closing_date_agreed')::boolean THEN progress := progress + 10; END IF;
    IF (milestones->>'conditions_agreed')::boolean THEN progress := progress + 10; END IF;
    IF offer.status = 'accepted' THEN progress := progress + 5; END IF;
    
    RETURN progress;
END;
$$;


ALTER FUNCTION "public"."calculate_negotiation_progress"("p_offer_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_property_availability"("p_property_id" "uuid", "p_date" "date", "p_time" time without time zone) RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  day_of_week INTEGER;
  availability_record RECORD;
  blocked_count INTEGER;
BEGIN
  -- Get day of week (0=Sunday, 1=Monday, etc)
  day_of_week := EXTRACT(DOW FROM p_date);
  
  -- Check if date is blocked
  SELECT COUNT(*) INTO blocked_count
  FROM blocked_dates
  WHERE property_id = p_property_id 
  AND blocked_date = p_date;
  
  IF blocked_count > 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Check if property has availability for this day
  SELECT * INTO availability_record
  FROM property_availability
  WHERE property_id = p_property_id 
  AND day_of_week = day_of_week
  AND enabled = TRUE;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if time falls within any available time slot
  FOR i IN 1..array_length(availability_record.time_slots, 1) LOOP
    IF p_time >= split_part(availability_record.time_slots[i], '-', 1)::TIME
       AND p_time <= split_part(availability_record.time_slots[i], '-', 2)::TIME THEN
      RETURN TRUE;
    END IF;
  END LOOP;
  
  RETURN FALSE;
END;
$$;


ALTER FUNCTION "public"."check_property_availability"("p_property_id" "uuid", "p_date" "date", "p_time" time without time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_unused_attachments"("days_old" integer DEFAULT 30) RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM offer_attachments
  WHERE uploaded_at < NOW() - INTERVAL '1 day' * days_old
  AND offer_id IN (
    SELECT o.id FROM offers o WHERE o.status IN ('cancelled', 'rejected')
  );

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;


ALTER FUNCTION "public"."cleanup_unused_attachments"("days_old" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."cleanup_unused_attachments"("days_old" integer) IS 'Removes attachments from old cancelled/rejected offers';



CREATE OR REPLACE FUNCTION "public"."close_negotiation_transaction"("p_offer_id" "uuid", "p_property_id" "uuid", "p_buyer_id" "uuid", "p_seller_id" "uuid") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_accepted_offer RECORD;
  v_other_offers_count INTEGER;
BEGIN
  -- Start transaction
  BEGIN
    -- Get the accepted offer details
    SELECT * INTO v_accepted_offer
    FROM offers
    WHERE id = p_offer_id AND property_id = p_property_id AND buyer_id = p_buyer_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Offer not found or does not match criteria';
    END IF;

    -- Accept the selected offer
    UPDATE offers
    SET status = 'accepted', updated_at = NOW()
    WHERE id = p_offer_id;

    -- Reject all other offers for this property
    UPDATE offers
    SET status = 'not_selected', updated_at = NOW()
    WHERE property_id = p_property_id AND id != p_offer_id AND status NOT IN ('accepted', 'cancelled');

    GET DIAGNOSTICS v_other_offers_count = ROW_COUNT;

    -- Update property status to sold
    UPDATE properties
    SET status = 'sold', updated_at = NOW()
    WHERE id = p_property_id;

    -- Return success data
    RETURN json_build_object(
      'success', true,
      'accepted_offer_id', p_offer_id,
      'rejected_offers_count', v_other_offers_count,
      'property_id', p_property_id
    );

  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback happens automatically
      RETURN json_build_object(
        'success', false,
        'error', SQLERRM
      );
  END;
END;
$$;


ALTER FUNCTION "public"."close_negotiation_transaction"("p_offer_id" "uuid", "p_property_id" "uuid", "p_buyer_id" "uuid", "p_seller_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."close_negotiation_transaction"("p_offer_id" "uuid", "p_property_id" "uuid", "p_buyer_id" "uuid", "p_seller_id" "uuid") IS 'Atomically closes a negotiation by accepting one offer and rejecting others';



CREATE OR REPLACE FUNCTION "public"."create_counter_offer"("p_original_offer_id" "uuid", "p_new_price" bigint, "p_new_payment_method" character varying, "p_new_closing_date" "date", "p_new_conditions" "text"[], "p_reason" "text") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    original_offer RECORD;
    new_offer_id UUID;
BEGIN
    -- Get original offer data
    SELECT * INTO original_offer FROM offers WHERE id = p_original_offer_id;
    
    -- Create new offer
    INSERT INTO offers (
        property_id,
        buyer_id,
        offer_price,
        payment_method,
        closing_date,
        conditions,
        status,
        currency,
        exchange_rate
    ) VALUES (
        original_offer.property_id,
        original_offer.buyer_id,
        p_new_price,
        p_new_payment_method,
        p_new_closing_date,
        p_new_conditions,
        'pending',
        original_offer.currency,
        original_offer.exchange_rate
    ) RETURNING id INTO new_offer_id;
    
    -- Create history entry
    INSERT INTO offer_history (
        offer_id,
        version,
        action,
        actor_id,
        actor_role,
        offer_price,
        payment_method,
        closing_date,
        conditions,
        changes,
        reason
    ) VALUES (
        new_offer_id,
        1,
        'countered',
        original_offer.buyer_id,
        'buyer',
        p_new_price,
        p_new_payment_method,
        p_new_closing_date,
        p_new_conditions,
        jsonb_build_object(
            'price_change', p_new_price - original_offer.offer_price,
            'payment_method_change', p_new_payment_method != original_offer.payment_method,
            'closing_date_change', p_new_closing_date != original_offer.closing_date
        ),
        p_reason
    );
    
    RETURN new_offer_id;
END;
$$;


ALTER FUNCTION "public"."create_counter_offer"("p_original_offer_id" "uuid", "p_new_price" bigint, "p_new_payment_method" character varying, "p_new_closing_date" "date", "p_new_conditions" "text"[], "p_reason" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_ai_advisory"("p_user_id" "uuid", "p_property_id" "uuid", "p_context" "jsonb", "p_level" character varying) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    advisory_content JSONB;
    context_type VARCHAR;
    property_data RECORD;
BEGIN
    context_type := p_context->>'type';
    
    -- Get property data for context
    SELECT * INTO property_data FROM properties WHERE id = p_property_id;
    
    -- Generate advisory based on context and level
    CASE context_type
        WHEN 'property_upload' THEN
            advisory_content := jsonb_build_object(
                'title', 'Recomendaciones para Publicar tu Propiedad',
                'content', 'Te ayudamos a configurar las mejores condiciones de venta...',
                'level', p_level,
                'suggestions', jsonb_build_array(
                    'Establece un precio competitivo basado en el mercado local',
                    'Configura condiciones de pago flexibles para atraer más compradores',
                    'Considera incluir gastos notariales en el precio para facilitar la venta'
                )
            );
        WHEN 'offer_creation' THEN
            advisory_content := jsonb_build_object(
                'title', 'Guía para Crear una Oferta Atractiva',
                'content', 'Aprende a estructurar tu oferta para maximizar las posibilidades de aceptación...',
                'level', p_level,
                'suggestions', jsonb_build_array(
                    'Incluye un precio competitivo pero realista',
                    'Propón condiciones de pago claras y factibles',
                    'Establece un plazo de cierre razonable'
                )
            );
        ELSE
            advisory_content := jsonb_build_object(
                'title', 'Asesoría Personalizada',
                'content', 'Te proporcionamos recomendaciones específicas para tu situación...',
                'level', p_level
            );
    END CASE;
    
    RETURN advisory_content;
END;
$$;


ALTER FUNCTION "public"."generate_ai_advisory"("p_user_id" "uuid", "p_property_id" "uuid", "p_context" "jsonb", "p_level" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_advisory_for_context"("p_context" character varying, "p_user_role" character varying, "p_property_type" character varying DEFAULT NULL::character varying) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    advisory_data JSONB;
BEGIN
    -- Simulate AI-generated advisory based on context
    advisory_data := jsonb_build_object(
        'context', p_context,
        'advice', CASE 
            WHEN p_context = 'offer_creation' THEN
                jsonb_build_object(
                    'title', 'Consejos para crear una oferta competitiva',
                    'content', 'Asegúrate de incluir un precio competitivo, método de pago claro y plazo de cierre realista.',
                    'level', 'fundamental'
                )
            WHEN p_context = 'price_negotiation' THEN
                jsonb_build_object(
                    'title', 'Estrategias de negociación de precio',
                    'content', 'Considera el valor de mercado, estado de la propiedad y condiciones del comprador.',
                    'level', 'best_practices'
                )
            WHEN p_context = 'legal_considerations' THEN
                jsonb_build_object(
                    'title', 'Aspectos legales importantes',
                    'content', 'Verifica la documentación legal, estudios de título y permisos necesarios.',
                    'level', 'advanced'
                )
            ELSE
                jsonb_build_object(
                    'title', 'Asesoría general',
                    'content', 'Consulta con un profesional para obtener orientación específica.',
                    'level', 'fundamental'
                )
        END,
        'timestamp', NOW()
    );
    
    RETURN advisory_data;
END;
$$;


ALTER FUNCTION "public"."get_advisory_for_context"("p_context" character varying, "p_user_role" character varying, "p_property_type" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_audit_logs_with_users"("limit_count" integer DEFAULT 100, "offset_count" integer DEFAULT 0, "user_filter" "uuid" DEFAULT NULL::"uuid", "action_filter" "text" DEFAULT NULL::"text", "resource_filter" "text" DEFAULT NULL::"text") RETURNS TABLE("id" "uuid", "user_id" "uuid", "user_name" "text", "user_email" "text", "action_type" "text", "resource_type" "text", "resource_id" "uuid", "changes" "jsonb", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    al.id,
    al.user_id,
    COALESCE(p.name, 'System') as user_name,
    COALESCE(u.email, 'system@platform.com') as user_email,
    al.action_type,
    al.resource_type,
    al.resource_id,
    al.changes,
    al.created_at
  FROM audit_logs al
  LEFT JOIN auth.users u ON al.user_id = u.id
  LEFT JOIN profiles p ON al.user_id = p.id
  WHERE (user_filter IS NULL OR al.user_id = user_filter)
    AND (action_filter IS NULL OR al.action_type = action_filter)
    AND (resource_filter IS NULL OR al.resource_type = resource_filter)
  ORDER BY al.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;


ALTER FUNCTION "public"."get_audit_logs_with_users"("limit_count" integer, "offset_count" integer, "user_filter" "uuid", "action_filter" "text", "resource_filter" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_audit_logs_with_users"("limit_count" integer, "offset_count" integer, "user_filter" "uuid", "action_filter" "text", "resource_filter" "text") IS 'Returns audit logs with user details and filtering options';



CREATE OR REPLACE FUNCTION "public"."get_audit_statistics"("days_back" integer DEFAULT 30) RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_logs', COUNT(*),
    'actions_by_type', (
      SELECT json_object_agg(action_type, count)
      FROM (
        SELECT action_type, COUNT(*) as count
        FROM audit_logs
        WHERE created_at >= NOW() - INTERVAL '1 day' * days_back
        GROUP BY action_type
        ORDER BY count DESC
      ) t
    ),
    'top_users', (
      SELECT json_agg(json_build_object('user_id', user_id, 'name', name, 'count', count))
      FROM (
        SELECT al.user_id, COALESCE(p.name, 'System') as name, COUNT(*) as count
        FROM audit_logs al
        LEFT JOIN profiles p ON al.user_id = p.id
        WHERE al.created_at >= NOW() - INTERVAL '1 day' * days_back
        GROUP BY al.user_id, p.name
        ORDER BY count DESC
        LIMIT 5
      ) t
    )
  ) INTO result
  FROM audit_logs
  WHERE created_at >= NOW() - INTERVAL '1 day' * days_back;

  RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_audit_statistics"("days_back" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_audit_statistics"("days_back" integer) IS 'Returns aggregated statistics about audit activity';



CREATE OR REPLACE FUNCTION "public"."get_available_time_slots"("p_property_id" "uuid", "p_date" "date") RETURNS "text"[]
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  day_of_week INTEGER;
  availability_record RECORD;
  result_slots TEXT[] := '{}';
BEGIN
  -- Get day of week
  day_of_week := EXTRACT(DOW FROM p_date);
  
  -- Check if date is blocked
  IF EXISTS (
    SELECT 1 FROM blocked_dates
    WHERE property_id = p_property_id 
    AND blocked_date = p_date
  ) THEN
    RETURN result_slots;
  END IF;
  
  -- Get availability for this day
  SELECT * INTO availability_record
  FROM property_availability
  WHERE property_id = p_property_id 
  AND day_of_week = day_of_week
  AND enabled = TRUE;
  
  IF NOT FOUND THEN
    RETURN result_slots;
  END IF;
  
  -- Return available time slots
  RETURN availability_record.time_slots;
END;
$$;


ALTER FUNCTION "public"."get_available_time_slots"("p_property_id" "uuid", "p_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_contract_details"("contract_id" "uuid") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'contract', json_build_object(
      'id', c.id,
      'final_price', c.final_price,
      'closing_date', c.closing_date,
      'payment_method', c.payment_method,
      'conditions', c.conditions,
      'contract_url', c.contract_url,
      'status', c.status,
      'created_at', c.created_at,
      'signed_at', c.signed_at
    ),
    'offer', json_build_object(
      'id', o.id,
      'offer_price', o.offer_price,
      'conditions', o.conditions,
      'created_at', o.created_at
    ),
    'property', json_build_object(
      'id', p.id,
      'title', p.title,
      'address', p.address,
      'city', p.city,
      'area', p.area,
      'bedrooms', p.bedrooms,
      'bathrooms', p.bathrooms
    ),
    'buyer', json_build_object(
      'id', ub.id,
      'name', ub.raw_user_meta_data->>'name',
      'email', ub.email
    ),
    'seller', json_build_object(
      'id', us.id,
      'name', us.raw_user_meta_data->>'name',
      'email', us.email
    )
  ) INTO result
  FROM contracts c
  JOIN offers o ON c.offer_id = o.id
  JOIN properties p ON c.property_id = p.id
  LEFT JOIN auth.users ub ON c.buyer_id = ub.id
  LEFT JOIN auth.users us ON c.seller_id = us.id
  WHERE c.id = contract_id;

  RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_contract_details"("contract_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_contract_details"("contract_id" "uuid") IS 'Returns complete contract information with related offer, property, and user data';



CREATE OR REPLACE FUNCTION "public"."get_negotiation_insights"("p_property_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    insights JSONB;
    total_offers INTEGER;
    avg_price BIGINT;
    price_range JSONB;
    common_conditions TEXT[];
    avg_closing_days INTEGER;
BEGIN
    -- Get basic statistics
    SELECT 
        COUNT(*),
        AVG(offer_price),
        MIN(offer_price),
        MAX(offer_price),
        AVG(closing_date - CURRENT_DATE)
    INTO total_offers, avg_price, price_range->'min', price_range->'max', avg_closing_days
    FROM offers 
    WHERE property_id = p_property_id AND status != 'rejected';
    
    -- Get common conditions
    SELECT array_agg(DISTINCT unnest(conditions))
    INTO common_conditions
    FROM offers 
    WHERE property_id = p_property_id AND conditions IS NOT NULL;
    
    insights := jsonb_build_object(
        'total_offers', total_offers,
        'average_price', avg_price,
        'price_range', price_range,
        'average_closing_days', avg_closing_days,
        'common_conditions', common_conditions,
        'market_activity', CASE 
            WHEN total_offers >= 5 THEN 'high'
            WHEN total_offers >= 3 THEN 'medium'
            ELSE 'low'
        END
    );
    
    RETURN insights;
END;
$$;


ALTER FUNCTION "public"."get_negotiation_insights"("p_property_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_negotiation_timeline"("p_offer_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    timeline JSONB := '[]'::jsonb;
    history_record RECORD;
BEGIN
    FOR history_record IN 
        SELECT * FROM offer_history 
        WHERE offer_id = p_offer_id 
        ORDER BY created_at ASC
    LOOP
        timeline := timeline || jsonb_build_object(
            'id', history_record.id,
            'action', history_record.action,
            'actor_role', history_record.actor_role,
            'offer_price', history_record.offer_price,
            'changes', history_record.changes,
            'reason', history_record.reason,
            'created_at', history_record.created_at
        );
    END LOOP;
    
    RETURN timeline;
END;
$$;


ALTER FUNCTION "public"."get_negotiation_timeline"("p_offer_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_offer_attachment_count"("offer_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
BEGIN
  RETURN (
    SELECT COUNT(*) FROM offer_attachments
    WHERE offer_attachments.offer_id = $1
  );
END;
$_$;


ALTER FUNCTION "public"."get_offer_attachment_count"("offer_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_offer_attachment_count"("offer_id" "uuid") IS 'Returns the number of attachments for a given offer';



CREATE OR REPLACE FUNCTION "public"."get_offer_net_efficiency_index"("p_offer_id" "uuid") RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    offer RECORD;
    property RECORD;
    net_value DECIMAL;
    closing_days INTEGER;
    efficiency_index DECIMAL;
BEGIN
    SELECT * INTO offer FROM offers WHERE id = p_offer_id;
    SELECT * INTO property FROM properties WHERE id = offer.property_id;
    
    -- Calculate net value (considering taxes and fees)
    net_value := offer.price * 0.95; -- Assuming 5% in taxes/fees
    
    -- Calculate closing days
    closing_days := EXTRACT(DAYS FROM (offer.closing_date - CURRENT_DATE));
    
    -- Calculate efficiency index (net value / closing days)
    IF closing_days > 0 THEN
        efficiency_index := net_value / closing_days;
    ELSE
        efficiency_index := 0;
    END IF;
    
    RETURN efficiency_index;
END;
$$;


ALTER FUNCTION "public"."get_offer_net_efficiency_index"("p_offer_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_property_feedback_stats"("property_id" "uuid") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_reviews', COUNT(*),
    'avg_property_rating', ROUND(AVG(property_rating)::numeric, 1),
    'avg_service_rating', ROUND(AVG(service_rating)::numeric, 1),
    'avg_overall_satisfaction', ROUND(AVG(overall_satisfaction)::numeric, 1),
    'avg_purchase_interest', ROUND(AVG(purchase_interest)::numeric, 1),
    'rating_distribution', json_build_object(
      '5_stars', COUNT(*) FILTER (WHERE overall_satisfaction = 5),
      '4_stars', COUNT(*) FILTER (WHERE overall_satisfaction = 4),
      '3_stars', COUNT(*) FILTER (WHERE overall_satisfaction = 3),
      '2_stars', COUNT(*) FILTER (WHERE overall_satisfaction = 2),
      '1_star', COUNT(*) FILTER (WHERE overall_satisfaction = 1)
    )
  ) INTO result
  FROM visit_feedback vf
  JOIN visits v ON vf.visit_id = v.id
  WHERE v.property_id = property_id;

  RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_property_feedback_stats"("property_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_property_feedback_stats"("property_id" "uuid") IS 'Returns aggregated feedback statistics for a property';



CREATE OR REPLACE FUNCTION "public"."get_unread_count"("p_user_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    unread_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO unread_count
    FROM notifications
    WHERE user_id = p_user_id AND read = FALSE;
    
    RETURN unread_count;
END;
$$;


ALTER FUNCTION "public"."get_unread_count"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_notifications"("p_user_id" "uuid", "p_limit" integer DEFAULT 50, "p_offset" integer DEFAULT 0) RETURNS TABLE("id" "uuid", "type" character varying, "title" character varying, "message" "text", "data" "jsonb", "read" boolean, "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.type,
        n.title,
        n.message,
        n.data,
        n.read,
        n.created_at
    FROM notifications n
    WHERE n.user_id = p_user_id
    ORDER BY n.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;


ALTER FUNCTION "public"."get_user_notifications"("p_user_id" "uuid", "p_limit" integer, "p_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_active_negotiations"("property_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM offers
    WHERE offers.property_id = $1
    AND status IN ('pending', 'countered')
  );
END;
$_$;


ALTER FUNCTION "public"."has_active_negotiations"("property_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."has_active_negotiations"("property_id" "uuid") IS 'Checks if a property has any active negotiations';



CREATE OR REPLACE FUNCTION "public"."log_offer_status_change"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO audit_logs (user_id, action_type, resource_type, resource_id, changes)
    VALUES (NEW.buyer_id, 'offer_status_changed', 'offer', NEW.id, jsonb_build_object(
      'old_status', OLD.status,
      'new_status', NEW.status,
      'property_id', NEW.property_id,
      'changed_by', auth.uid()
    ));
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."log_offer_status_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_property_status_change"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO audit_logs (user_id, action_type, resource_type, resource_id, changes)
    VALUES (NEW.owner_id, 'property_status_changed', 'property', NEW.id, jsonb_build_object(
      'old_status', OLD.status,
      'new_status', NEW.status,
      'changed_by', auth.uid()
    ));
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."log_property_status_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_user_role_change"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO audit_logs (user_id, action_type, resource_type, resource_id, changes)
    VALUES (NEW.id, 'user_role_changed', 'user', NEW.id, jsonb_build_object(
      'old_role', OLD.role,
      'new_role', NEW.role,
      'changed_by', auth.uid()
    ));
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."log_user_role_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_verification_status_change"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
    INSERT INTO audit_logs (user_id, action_type, resource_type, resource_id, changes)
    VALUES (NEW.id, 'verification_status_changed', 'user', NEW.id, jsonb_build_object(
      'old_status', OLD.verification_status,
      'new_status', NEW.verification_status,
      'changed_by', auth.uid()
    ));
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."log_verification_status_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mark_all_notifications_read"("p_user_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE notifications 
    SET read = TRUE, updated_at = NOW()
    WHERE user_id = p_user_id AND read = FALSE;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$;


ALTER FUNCTION "public"."mark_all_notifications_read"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mark_notification_read"("p_notification_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    UPDATE notifications 
    SET read = TRUE, updated_at = NOW()
    WHERE id = p_notification_id;
    
    RETURN FOUND;
END;
$$;


ALTER FUNCTION "public"."mark_notification_read"("p_notification_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."send_negotiation_notification"("p_offer_id" "uuid", "p_notification_type" character varying, "p_message" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    offer_data RECORD;
    property_data RECORD;
BEGIN
    -- Get offer and property data
    SELECT o.*, p.title as property_title, p.address
    INTO offer_data
    FROM offers o
    JOIN properties p ON o.property_id = p.id
    WHERE o.id = p_offer_id;
    
    -- Here you would integrate with your notification system
    -- For now, we'll just log the notification
    RAISE NOTICE 'Notification: % - % - %', p_notification_type, offer_data.property_title, p_message;
    
    -- In a real implementation, you would:
    -- 1. Insert into a notifications table
    -- 2. Send email/SMS/push notification
    -- 3. Update user dashboard
END;
$$;


ALTER FUNCTION "public"."send_negotiation_notification"("p_offer_id" "uuid", "p_notification_type" character varying, "p_message" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."send_notification"("p_user_id" "uuid", "p_type" character varying, "p_title" character varying, "p_message" "text", "p_data" "jsonb" DEFAULT NULL::"jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (p_user_id, p_type, p_title, p_message, p_data)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$;


ALTER FUNCTION "public"."send_notification"("p_user_id" "uuid", "p_type" character varying, "p_title" character varying, "p_message" "text", "p_data" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_offer_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    property_title VARCHAR;
    seller_id UUID;
BEGIN
    -- Get property title and seller ID
    SELECT p.title, p.owner_id INTO property_title, seller_id
    FROM properties p
    WHERE p.id = NEW.property_id;
    
    -- Send notification to seller
    PERFORM send_notification(
        seller_id,
        'offer_received',
        'Nueva Oferta Recibida',
        'Has recibido una nueva oferta de $' || NEW.offer_price::TEXT || ' para ' || property_title,
        jsonb_build_object(
            'offer_id', NEW.id,
            'property_id', NEW.property_id,
            'property_title', property_title,
            'offer_price', NEW.offer_price,
            'buyer_id', NEW.buyer_id
        )
    );
    
    RETURN NEW;
END;
$_$;


ALTER FUNCTION "public"."trigger_offer_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_offer_notifications"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Send notification when offer status changes
    IF OLD.status != NEW.status THEN
        CASE NEW.status
            WHEN 'accepted' THEN
                PERFORM send_negotiation_notification(
                    NEW.id,
                    'offer_accepted',
                    'Tu oferta ha sido aceptada!'
                );
            WHEN 'rejected' THEN
                PERFORM send_negotiation_notification(
                    NEW.id,
                    'offer_rejected',
                    'Tu oferta ha sido rechazada. ' || COALESCE(NEW.rejection_reason, '')
                );
        END CASE;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_offer_notifications"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_offer_status_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    property_title VARCHAR;
    notification_type VARCHAR;
    notification_title VARCHAR;
    notification_message TEXT;
BEGIN
    -- Only send notification if status changed
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;
    
    -- Get property title
    SELECT p.title INTO property_title
    FROM properties p
    WHERE p.id = NEW.property_id;
    
    -- Determine notification type and message
    CASE NEW.status
        WHEN 'accepted' THEN
            notification_type := 'offer_accepted';
            notification_title := 'Oferta Aceptada';
            notification_message := 'Tu oferta de $' || NEW.offer_price::TEXT || ' para ' || property_title || ' ha sido aceptada!';
        WHEN 'rejected' THEN
            notification_type := 'offer_rejected';
            notification_title := 'Oferta Rechazada';
            notification_message := 'Tu oferta de $' || NEW.offer_price::TEXT || ' para ' || property_title || ' ha sido rechazada.';
        WHEN 'countered' THEN
            notification_type := 'counter_offer';
            notification_title := 'Contraoferta Recibida';
            notification_message := 'Has recibido una contraoferta para ' || property_title;
        ELSE
            RETURN NEW;
    END CASE;
    
    -- Send notification to buyer
    PERFORM send_notification(
        NEW.buyer_id,
        notification_type,
        notification_title,
        notification_message,
        jsonb_build_object(
            'offer_id', NEW.id,
            'property_id', NEW.property_id,
            'property_title', property_title,
            'offer_price', NEW.offer_price,
            'status', NEW.status
        )
    );
    
    RETURN NEW;
END;
$_$;


ALTER FUNCTION "public"."trigger_offer_status_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_contract_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_contract_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_negotiation_progress"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Update progress when offer changes
    NEW.negotiation_progress := calculate_negotiation_progress(NEW.id);
    
    -- Update milestones based on status changes
    IF OLD.status != NEW.status THEN
        CASE NEW.status
            WHEN 'accepted' THEN
                NEW.milestones_completed := COALESCE(NEW.milestones_completed, '{}'::jsonb) || 
                    '{"offer_accepted": true}'::jsonb;
            WHEN 'rejected' THEN
                NEW.milestones_completed := COALESCE(NEW.milestones_completed, '{}'::jsonb) || 
                    '{"offer_rejected": true}'::jsonb;
        END CASE;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_negotiation_progress"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_notifications_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_notifications_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_verification_status"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Update user's verification status when document status changes
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE profiles 
    SET 
      verification_status = 'verified',
      verification_reviewed_at = NOW(),
      verification_reviewed_by = NEW.reviewed_by
    WHERE id = NEW.user_id;
  ELSIF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    UPDATE profiles 
    SET 
      verification_status = 'rejected',
      verification_reviewed_at = NOW(),
      verification_reviewed_by = NEW.reviewed_by,
      verification_rejection_reason = NEW.rejection_reason
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_verification_status"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_visit_feedback_status"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Mark visit as having feedback
  UPDATE visits
  SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('has_feedback', true)
  WHERE id = NEW.visit_id;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_visit_feedback_status"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_offer_against_rules"("p_property_id" "uuid", "p_offer_price" bigint, "p_payment_method" character varying, "p_closing_date" "date") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    rules RECORD;
    validation_result JSONB;
BEGIN
    SELECT * INTO rules FROM negotiation_rules WHERE property_id = p_property_id;
    
    IF rules IS NULL THEN
        RETURN jsonb_build_object('valid', true);
    END IF;
    
    -- Validate price
    IF rules.min_price IS NOT NULL AND p_offer_price < rules.min_price THEN
        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'Precio mínimo no alcanzado',
            'min_required', rules.min_price,
            'suggestion', 'Aumenta tu oferta a al menos ' || rules.min_price || ' COP'
        );
    END IF;
    
    -- Validate closing date
    IF rules.max_closing_days IS NOT NULL AND 
       (p_closing_date - CURRENT_DATE) > rules.max_closing_days THEN
        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'Plazo de cierre excede el máximo permitido',
            'max_days', rules.max_closing_days,
            'suggestion', 'Propone un cierre en máximo ' || rules.max_closing_days || ' días'
        );
    END IF;
    
    -- Validate payment method
    IF rules.required_payment_methods IS NOT NULL AND 
       NOT (p_payment_method = ANY(rules.required_payment_methods)) THEN
        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'Método de pago no aceptado',
            'accepted_methods', rules.required_payment_methods,
            'suggestion', 'Usa uno de los métodos aceptados: ' || array_to_string(rules.required_payment_methods, ', ')
        );
    END IF;
    
    RETURN jsonb_build_object('valid', true);
END;
$$;


ALTER FUNCTION "public"."validate_offer_against_rules"("p_property_id" "uuid", "p_offer_price" bigint, "p_payment_method" character varying, "p_closing_date" "date") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."administrative_transitions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid",
    "offer_id" "uuid",
    "transition_type" character varying(50) NOT NULL,
    "old_owner_id" "uuid",
    "new_owner_id" "uuid",
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "required_documents" "text"[],
    "submitted_documents" "text"[],
    "notes" "text",
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "administrative_transitions_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'failed'::character varying])::"text"[])))
);


ALTER TABLE "public"."administrative_transitions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."advisory_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "property_id" "uuid",
    "session_type" character varying(50) NOT NULL,
    "context" "jsonb" NOT NULL,
    "advice_given" "jsonb" NOT NULL,
    "user_feedback" "jsonb",
    "effectiveness_score" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "advisory_sessions_effectiveness_score_check" CHECK ((("effectiveness_score" >= 1) AND ("effectiveness_score" <= 5)))
);


ALTER TABLE "public"."advisory_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "action_type" "text" NOT NULL,
    "resource_type" "text" NOT NULL,
    "resource_id" "uuid" NOT NULL,
    "changes" "jsonb",
    "ip_address" "inet",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


COMMENT ON TABLE "public"."audit_logs" IS 'Comprehensive audit trail for all platform actions and changes';



COMMENT ON COLUMN "public"."audit_logs"."resource_type" IS 'Type of resource being acted upon (user, property, offer, etc)';



COMMENT ON COLUMN "public"."audit_logs"."changes" IS 'JSON object containing before/after values and metadata';



CREATE TABLE IF NOT EXISTS "public"."blocked_dates" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "property_id" "uuid" NOT NULL,
    "blocked_date" "date" NOT NULL,
    "reason" "text",
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."blocked_dates" OWNER TO "postgres";


COMMENT ON TABLE "public"."blocked_dates" IS 'Specific dates when properties are not available for visits';



CREATE TABLE IF NOT EXISTS "public"."blog_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "content" "text" NOT NULL,
    "excerpt" "text",
    "author_id" "uuid" NOT NULL,
    "status" character varying(20) DEFAULT 'draft'::character varying,
    "featured_image" "text",
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "category" character varying(50) DEFAULT 'general'::character varying,
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "blog_posts_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['draft'::character varying, 'published'::character varying, 'archived'::character varying])::"text"[])))
);


ALTER TABLE "public"."blog_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."case_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "case_id" "uuid" NOT NULL,
    "document_type" character varying(20) NOT NULL,
    "document_url" "text" NOT NULL,
    "signed_by" "uuid",
    "signed_at" timestamp with time zone,
    "status" character varying(20) DEFAULT 'draft'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "title" character varying(255) NOT NULL,
    "description" "text",
    "version" integer DEFAULT 1,
    "last_modified" timestamp with time zone DEFAULT "now"(),
    "modified_by" "uuid",
    CONSTRAINT "case_documents_document_type_check" CHECK ((("document_type")::"text" = ANY ((ARRAY['promesa'::character varying, 'otrosi'::character varying, 'oferta'::character varying, 'escritura'::character varying, 'legal'::character varying])::"text"[]))),
    CONSTRAINT "case_documents_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['draft'::character varying, 'pending_signature'::character varying, 'signed'::character varying, 'completed'::character varying])::"text"[])))
);


ALTER TABLE "public"."case_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cases" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lawyer_id" "uuid" NOT NULL,
    "buyer_id" "uuid" NOT NULL,
    "seller_id" "uuid" NOT NULL,
    "property_id" "uuid" NOT NULL,
    "status" character varying(20) DEFAULT 'active'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "cases_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'closed'::character varying, 'pending'::character varying])::"text"[])))
);


ALTER TABLE "public"."cases" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "case_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "receiver_id" "uuid" NOT NULL,
    "message" "text" NOT NULL,
    "read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "message_type" character varying(20) DEFAULT 'text'::character varying,
    "document_url" "text",
    "document_name" character varying(255),
    CONSTRAINT "chat_messages_message_type_check" CHECK ((("message_type")::"text" = ANY ((ARRAY['text'::character varying, 'document'::character varying, 'image'::character varying, 'system'::character varying])::"text"[])))
);


ALTER TABLE "public"."chat_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contracts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "offer_id" "uuid" NOT NULL,
    "property_id" "uuid" NOT NULL,
    "buyer_id" "uuid" NOT NULL,
    "seller_id" "uuid" NOT NULL,
    "final_price" numeric(15,2) NOT NULL,
    "closing_date" "date" NOT NULL,
    "payment_method" "text" NOT NULL,
    "conditions" "text",
    "contract_url" "text",
    "status" "text" DEFAULT 'pending_signature'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "signed_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    CONSTRAINT "contracts_status_check" CHECK (("status" = ANY (ARRAY['pending_signature'::"text", 'signed'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."contracts" OWNER TO "postgres";


COMMENT ON TABLE "public"."contracts" IS 'Legal contracts generated when negotiations close';



COMMENT ON COLUMN "public"."contracts"."status" IS 'Contract status: pending_signature, signed, completed, cancelled';



CREATE TABLE IF NOT EXISTS "public"."favorites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "property_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."favorites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fiscal_simulations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "offer_id" "uuid",
    "simulation_type" character varying(50) NOT NULL,
    "base_amount" bigint NOT NULL,
    "currency" character varying(10) DEFAULT 'COP'::character varying,
    "notary_fees" bigint DEFAULT 0,
    "registration_tax" bigint DEFAULT 0,
    "income_tax" bigint DEFAULT 0,
    "vat" bigint DEFAULT 0,
    "other_taxes" bigint DEFAULT 0,
    "total_taxes" bigint NOT NULL,
    "net_amount" bigint NOT NULL,
    "optimization_suggestions" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fiscal_simulations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."intent_letters" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "offer_id" "uuid",
    "property_id" "uuid",
    "buyer_id" "uuid",
    "seller_id" "uuid",
    "content" "text" NOT NULL,
    "status" character varying(20) DEFAULT 'draft'::character varying,
    "buyer_signed_at" timestamp with time zone,
    "seller_signed_at" timestamp with time zone,
    "buyer_signature" "text",
    "seller_signature" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "intent_letters_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['draft'::character varying, 'pending_signatures'::character varying, 'signed'::character varying, 'cancelled'::character varying])::"text"[])))
);


ALTER TABLE "public"."intent_letters" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."knowledge_base" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "property_id" "uuid",
    "category" character varying(50) NOT NULL,
    "level" character varying(20) NOT NULL,
    "title" character varying(255) NOT NULL,
    "content" "text" NOT NULL,
    "context" "jsonb",
    "source" character varying(50) DEFAULT 'ai_generated'::character varying,
    "is_read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "knowledge_base_level_check" CHECK ((("level")::"text" = ANY ((ARRAY['fundamental'::character varying, 'best_practices'::character varying, 'advanced'::character varying])::"text"[])))
);


ALTER TABLE "public"."knowledge_base" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."legal_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid",
    "offer_id" "uuid",
    "document_type" character varying(50) NOT NULL,
    "title" character varying(255) NOT NULL,
    "content" "text" NOT NULL,
    "version" integer DEFAULT 1,
    "status" character varying(20) DEFAULT 'draft'::character varying,
    "requires_signatures" boolean DEFAULT false,
    "buyer_signed_at" timestamp with time zone,
    "seller_signed_at" timestamp with time zone,
    "lawyer_approved_at" timestamp with time zone,
    "file_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "legal_documents_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['draft'::character varying, 'pending_review'::character varying, 'approved'::character varying, 'signed'::character varying, 'cancelled'::character varying])::"text"[])))
);


ALTER TABLE "public"."legal_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."login_attempts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "email" character varying(255) NOT NULL,
    "ip_address" "inet",
    "user_agent" "text",
    "success" boolean NOT NULL,
    "failure_reason" "text",
    "attempted_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."login_attempts" OWNER TO "postgres";


COMMENT ON TABLE "public"."login_attempts" IS 'Login attempt tracking for security monitoring';



CREATE TABLE IF NOT EXISTS "public"."negotiation_rules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid",
    "min_price" bigint,
    "max_closing_days" integer,
    "required_payment_methods" character varying(20)[],
    "auto_reject_enabled" boolean DEFAULT true,
    "manual_review_threshold" boolean DEFAULT false,
    "special_conditions" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."negotiation_rules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" character varying(50) NOT NULL,
    "title" character varying(255) NOT NULL,
    "message" "text" NOT NULL,
    "read" boolean DEFAULT false,
    "related_id" "uuid",
    "related_type" character varying(50),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "read_at" timestamp with time zone,
    "data" "jsonb",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "notifications_related_type_check" CHECK ((("related_type")::"text" = ANY ((ARRAY['property'::character varying, 'offer'::character varying, 'visit'::character varying, 'contract'::character varying])::"text"[]))),
    CONSTRAINT "notifications_type_check" CHECK ((("type")::"text" = ANY ((ARRAY['offer_received'::character varying, 'offer_accepted'::character varying, 'offer_rejected'::character varying, 'counter_offer'::character varying, 'negotiation_update'::character varying, 'system'::character varying, 'visit_scheduled'::character varying, 'contract_ready'::character varying, 'payment_received'::character varying])::"text"[])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


COMMENT ON COLUMN "public"."notifications"."data" IS 'Additional data for the notification in JSON format';



CREATE TABLE IF NOT EXISTS "public"."offer_attachments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "offer_id" "uuid" NOT NULL,
    "uploaded_by" "uuid" NOT NULL,
    "file_url" "text" NOT NULL,
    "file_name" "text" NOT NULL,
    "file_type" "text" NOT NULL,
    "file_size" integer,
    "uploaded_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."offer_attachments" OWNER TO "postgres";


COMMENT ON TABLE "public"."offer_attachments" IS 'File attachments uploaded during offer negotiations';



COMMENT ON COLUMN "public"."offer_attachments"."file_url" IS 'Supabase Storage URL for the file';



COMMENT ON COLUMN "public"."offer_attachments"."file_type" IS 'MIME type of the file (pdf, doc, jpg, etc)';



CREATE TABLE IF NOT EXISTS "public"."offer_comparisons" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid",
    "seller_id" "uuid",
    "offer_ids" "uuid"[] NOT NULL,
    "comparison_data" "jsonb",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."offer_comparisons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."offer_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "offer_id" "uuid",
    "version" integer NOT NULL,
    "action" character varying(20),
    "actor_id" "uuid",
    "actor_role" character varying(20),
    "offer_price" bigint NOT NULL,
    "payment_method" character varying(20),
    "closing_date" "date",
    "conditions" "text"[],
    "changes" "jsonb",
    "reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "offer_history_action_check" CHECK ((("action")::"text" = ANY ((ARRAY['created'::character varying, 'countered'::character varying, 'accepted'::character varying, 'rejected'::character varying, 'expired'::character varying])::"text"[]))),
    CONSTRAINT "offer_history_actor_role_check" CHECK ((("actor_role")::"text" = ANY ((ARRAY['buyer'::character varying, 'seller'::character varying, 'agent'::character varying, 'lawyer'::character varying])::"text"[])))
);


ALTER TABLE "public"."offer_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."offers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid" NOT NULL,
    "buyer_id" "uuid" NOT NULL,
    "lawyer_id" "uuid",
    "offer_price" bigint NOT NULL,
    "original_price" bigint NOT NULL,
    "payment_method" character varying(20) NOT NULL,
    "financing_details" "jsonb",
    "crypto_details" "jsonb",
    "closing_date" "date" NOT NULL,
    "conditions" "text"[] DEFAULT '{}'::"text"[],
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "counter_offer" "jsonb",
    "metrics" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "negotiation_progress" integer DEFAULT 0,
    "auto_rejected" boolean DEFAULT false,
    "rejection_reason" "text",
    "milestones_completed" "jsonb" DEFAULT '{}'::"jsonb",
    "currency" character varying(10) DEFAULT 'COP'::character varying,
    "exchange_rate" numeric(10,4) DEFAULT 1.0,
    "competitiveness_score" integer DEFAULT 0,
    CONSTRAINT "offers_competitiveness_score_check" CHECK ((("competitiveness_score" >= 0) AND ("competitiveness_score" <= 100))),
    CONSTRAINT "offers_negotiation_progress_check" CHECK ((("negotiation_progress" >= 0) AND ("negotiation_progress" <= 100))),
    CONSTRAINT "offers_offer_price_check" CHECK (("offer_price" > 0)),
    CONSTRAINT "offers_original_price_check" CHECK (("original_price" > 0)),
    CONSTRAINT "offers_payment_method_check" CHECK ((("payment_method")::"text" = ANY ((ARRAY['cash'::character varying, 'financing'::character varying, 'crypto'::character varying, 'mixed'::character varying, 'bank_transfer'::character varying, 'installments'::character varying])::"text"[]))),
    CONSTRAINT "offers_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'rejected'::character varying, 'countered'::character varying, 'expired'::character varying])::"text"[])))
);


ALTER TABLE "public"."offers" OWNER TO "postgres";


COMMENT ON CONSTRAINT "offers_payment_method_check" ON "public"."offers" IS 'Payment method constraint: allows cash, financing, crypto, mixed, bank_transfer, and installments';



CREATE TABLE IF NOT EXISTS "public"."payment_plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "offer_id" "uuid",
    "payment_number" integer NOT NULL,
    "amount" bigint NOT NULL,
    "currency" character varying(10) DEFAULT 'COP'::character varying NOT NULL,
    "exchange_rate" numeric(10,4),
    "payment_method" character varying(50) NOT NULL,
    "due_date" "date" NOT NULL,
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "payment_reference" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "payment_plans_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'overdue'::character varying, 'cancelled'::character varying])::"text"[])))
);


ALTER TABLE "public"."payment_plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text",
    "full_name" "text",
    "avatar_url" "text",
    "phone" "text",
    "bio" "text",
    "location" "text",
    "website" "text",
    "role" "text" DEFAULT 'user'::"text",
    "status" "text" DEFAULT 'active'::"text",
    "preferences" "jsonb" DEFAULT '{}'::"jsonb",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "last_login_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "email_verified" boolean DEFAULT false,
    "verification_status" character varying(20) DEFAULT 'unverified'::character varying,
    "verification_submitted_at" timestamp with time zone,
    "verification_reviewed_at" timestamp with time zone,
    "verification_reviewed_by" "uuid",
    "verification_rejection_reason" "text",
    "phone_verified" boolean DEFAULT false,
    "address" "text",
    "date_of_birth" "date",
    "nationality" character varying(100),
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['user'::"text", 'agent'::"text", 'lawyer'::"text", 'admin'::"text", 'super_admin'::"text"]))),
    CONSTRAINT "profiles_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text", 'suspended'::"text", 'pending'::"text"]))),
    CONSTRAINT "profiles_verification_status_check" CHECK ((("verification_status")::"text" = ANY ((ARRAY['unverified'::character varying, 'pending'::character varying, 'verified'::character varying, 'rejected'::character varying])::"text"[])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."profiles" IS 'User profiles that extend auth.users with additional information, roles, and preferences';



COMMENT ON COLUMN "public"."profiles"."email_verified" IS 'Whether the user has verified their email address';



COMMENT ON COLUMN "public"."profiles"."verification_status" IS 'Identity verification status: unverified, pending, verified, rejected';



COMMENT ON COLUMN "public"."profiles"."verification_submitted_at" IS 'When the user submitted verification documents';



COMMENT ON COLUMN "public"."profiles"."verification_reviewed_at" IS 'When an admin reviewed the verification';



COMMENT ON COLUMN "public"."profiles"."verification_reviewed_by" IS 'Admin who reviewed the verification';



COMMENT ON COLUMN "public"."profiles"."verification_rejection_reason" IS 'Reason for verification rejection';



CREATE TABLE IF NOT EXISTS "public"."properties" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "address" character varying(255) NOT NULL,
    "neighborhood" character varying(100) NOT NULL,
    "city" character varying(100) NOT NULL,
    "coordinates" "jsonb" NOT NULL,
    "bedrooms" integer NOT NULL,
    "bathrooms" integer NOT NULL,
    "area" integer NOT NULL,
    "parking" integer DEFAULT 0,
    "floor" integer,
    "total_floors" integer,
    "year_built" integer,
    "property_type" character varying(20) NOT NULL,
    "strata" integer,
    "price" bigint NOT NULL,
    "minimum_offer_price" bigint,
    "monthly_costs" integer,
    "accepts_crypto" boolean DEFAULT false,
    "financing" boolean DEFAULT false,
    "visit_price" integer DEFAULT 49000,
    "status" character varying(20) DEFAULT 'draft'::character varying,
    "verified" boolean DEFAULT false,
    "premium" boolean DEFAULT false,
    "images" "text"[] DEFAULT '{}'::"text"[],
    "virtual_tour" "text",
    "freedom_tradition" "text",
    "legal_documents" "text"[] DEFAULT '{}'::"text"[],
    "owner_id" "uuid" NOT NULL,
    "agent_id" "uuid",
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "features" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "published_at" timestamp with time zone,
    CONSTRAINT "properties_area_check" CHECK (("area" > 0)),
    CONSTRAINT "properties_bathrooms_check" CHECK (("bathrooms" >= 0)),
    CONSTRAINT "properties_bedrooms_check" CHECK (("bedrooms" >= 0)),
    CONSTRAINT "properties_parking_check" CHECK (("parking" >= 0)),
    CONSTRAINT "properties_price_check" CHECK (("price" > 0)),
    CONSTRAINT "properties_property_type_check" CHECK ((("property_type")::"text" = ANY ((ARRAY['apartment'::character varying, 'house'::character varying, 'townhouse'::character varying, 'office'::character varying, 'commercial'::character varying])::"text"[]))),
    CONSTRAINT "properties_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['draft'::character varying, 'pending'::character varying, 'published'::character varying, 'sold'::character varying, 'rented'::character varying, 'archived'::character varying])::"text"[]))),
    CONSTRAINT "properties_strata_check" CHECK ((((("property_type")::"text" = 'house'::"text") AND ("strata" = 0)) OR ((("property_type")::"text" = ANY ((ARRAY['apartment'::character varying, 'townhouse'::character varying, 'office'::character varying, 'commercial'::character varying])::"text"[])) AND ("strata" >= 1) AND ("strata" <= 6)))),
    CONSTRAINT "properties_visit_price_check" CHECK (("visit_price" > 0))
);


ALTER TABLE "public"."properties" OWNER TO "postgres";


COMMENT ON CONSTRAINT "properties_strata_check" ON "public"."properties" IS 'Strata constraint: houses must have strata = 0, other property types must have strata between 1 and 6';



CREATE TABLE IF NOT EXISTS "public"."property_availability" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "property_id" "uuid" NOT NULL,
    "day_of_week" integer NOT NULL,
    "time_slots" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "visit_duration" integer DEFAULT 60,
    "max_visits_per_day" integer DEFAULT 5,
    "advance_booking_hours" integer DEFAULT 24,
    "enabled" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "property_availability_advance_booking_hours_check" CHECK (("advance_booking_hours" >= 0)),
    CONSTRAINT "property_availability_day_of_week_check" CHECK ((("day_of_week" >= 0) AND ("day_of_week" <= 6))),
    CONSTRAINT "property_availability_max_visits_per_day_check" CHECK (("max_visits_per_day" > 0)),
    CONSTRAINT "property_availability_visit_duration_check" CHECK (("visit_duration" > 0))
);


ALTER TABLE "public"."property_availability" OWNER TO "postgres";


COMMENT ON TABLE "public"."property_availability" IS 'Weekly availability schedule for properties';



COMMENT ON COLUMN "public"."property_availability"."day_of_week" IS 'Day of week: 0=Sunday, 1=Monday, ..., 6=Saturday';



COMMENT ON COLUMN "public"."property_availability"."time_slots" IS 'Array of time slots in format ["09:00-12:00", "14:00-17:00"]';



COMMENT ON COLUMN "public"."property_availability"."visit_duration" IS 'Duration of each visit in minutes';



COMMENT ON COLUMN "public"."property_availability"."max_visits_per_day" IS 'Maximum number of visits allowed per day';



COMMENT ON COLUMN "public"."property_availability"."advance_booking_hours" IS 'Minimum hours in advance for booking';



CREATE TABLE IF NOT EXISTS "public"."property_deliveries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid",
    "offer_id" "uuid",
    "delivery_date" "date",
    "delivery_time" time without time zone,
    "delivery_address" "text",
    "condition_photos" "text"[],
    "inventory_items" "jsonb",
    "buyer_notes" "text",
    "seller_notes" "text",
    "delivery_act_url" "text",
    "status" character varying(20) DEFAULT 'scheduled'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "property_deliveries_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['scheduled'::character varying, 'completed'::character varying, 'cancelled'::character varying, 'rescheduled'::character varying])::"text"[])))
);


ALTER TABLE "public"."property_deliveries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."public_offers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid",
    "seller_id" "uuid",
    "offer_type" character varying(20) NOT NULL,
    "starting_price" bigint,
    "current_price" bigint,
    "reserve_price" bigint,
    "auction_end_date" timestamp with time zone,
    "dutch_auction_decrement" bigint DEFAULT 0,
    "dutch_auction_interval" integer DEFAULT 3600,
    "is_active" boolean DEFAULT true,
    "total_offers_received" integer DEFAULT 0,
    "price_range_visible" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "public_offers_offer_type_check" CHECK ((("offer_type")::"text" = ANY ((ARRAY['fixed_price'::character varying, 'auction'::character varying, 'dutch_auction'::character varying])::"text"[])))
);


ALTER TABLE "public"."public_offers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."verification_documents" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "document_type" character varying(20) NOT NULL,
    "document_url" "text" NOT NULL,
    "selfie_url" "text",
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "reviewed_by" "uuid",
    "reviewed_at" timestamp with time zone,
    "rejection_reason" "text",
    "submitted_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "verification_documents_document_type_check" CHECK ((("document_type")::"text" = ANY ((ARRAY['passport'::character varying, 'cedula'::character varying, 'cedula_extranjeria'::character varying, 'other'::character varying])::"text"[]))),
    CONSTRAINT "verification_documents_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::"text"[])))
);


ALTER TABLE "public"."verification_documents" OWNER TO "postgres";


COMMENT ON TABLE "public"."verification_documents" IS 'User identity verification documents and selfies';



CREATE TABLE IF NOT EXISTS "public"."visit_feedback" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "property_rating" integer NOT NULL,
    "service_rating" integer NOT NULL,
    "overall_satisfaction" integer NOT NULL,
    "purchase_interest" integer,
    "comments" "text",
    "is_anonymous" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "visit_feedback_overall_satisfaction_check" CHECK ((("overall_satisfaction" >= 1) AND ("overall_satisfaction" <= 5))),
    CONSTRAINT "visit_feedback_property_rating_check" CHECK ((("property_rating" >= 1) AND ("property_rating" <= 5))),
    CONSTRAINT "visit_feedback_purchase_interest_check" CHECK ((("purchase_interest" >= 1) AND ("purchase_interest" <= 5))),
    CONSTRAINT "visit_feedback_service_rating_check" CHECK ((("service_rating" >= 1) AND ("service_rating" <= 5)))
);


ALTER TABLE "public"."visit_feedback" OWNER TO "postgres";


COMMENT ON TABLE "public"."visit_feedback" IS 'User feedback collected after property visits';



COMMENT ON COLUMN "public"."visit_feedback"."is_anonymous" IS 'Whether the feedback should be attributed to the user or remain anonymous';



CREATE TABLE IF NOT EXISTS "public"."visits" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid" NOT NULL,
    "visitor_id" "uuid" NOT NULL,
    "scheduled_date" "date" NOT NULL,
    "scheduled_time" time without time zone NOT NULL,
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "visit_price" integer NOT NULL,
    "paid" boolean DEFAULT false,
    "payment_method" character varying(20),
    "nda_accepted" boolean DEFAULT false,
    "feedback" "text",
    "rating" integer,
    "notes" "text",
    "documents_unlocked" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    CONSTRAINT "visits_payment_method_check" CHECK ((("payment_method")::"text" = ANY ((ARRAY['cash'::character varying, 'card'::character varying, 'crypto'::character varying])::"text"[]))),
    CONSTRAINT "visits_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5))),
    CONSTRAINT "visits_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'completed'::character varying, 'cancelled'::character varying, 'rescheduled'::character varying])::"text"[]))),
    CONSTRAINT "visits_visit_price_check" CHECK (("visit_price" > 0))
);


ALTER TABLE "public"."visits" OWNER TO "postgres";


ALTER TABLE ONLY "public"."administrative_transitions"
    ADD CONSTRAINT "administrative_transitions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisory_sessions"
    ADD CONSTRAINT "advisory_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blocked_dates"
    ADD CONSTRAINT "blocked_dates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blocked_dates"
    ADD CONSTRAINT "blocked_dates_property_id_blocked_date_key" UNIQUE ("property_id", "blocked_date");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."case_documents"
    ADD CONSTRAINT "case_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cases"
    ADD CONSTRAINT "cases_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contracts"
    ADD CONSTRAINT "contracts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_user_id_property_id_key" UNIQUE ("user_id", "property_id");



ALTER TABLE ONLY "public"."fiscal_simulations"
    ADD CONSTRAINT "fiscal_simulations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."intent_letters"
    ADD CONSTRAINT "intent_letters_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."knowledge_base"
    ADD CONSTRAINT "knowledge_base_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."legal_documents"
    ADD CONSTRAINT "legal_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."login_attempts"
    ADD CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."negotiation_rules"
    ADD CONSTRAINT "negotiation_rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."offer_attachments"
    ADD CONSTRAINT "offer_attachments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."offer_comparisons"
    ADD CONSTRAINT "offer_comparisons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."offer_history"
    ADD CONSTRAINT "offer_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."offers"
    ADD CONSTRAINT "offers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_plans"
    ADD CONSTRAINT "payment_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."property_availability"
    ADD CONSTRAINT "property_availability_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."property_availability"
    ADD CONSTRAINT "property_availability_property_id_day_of_week_key" UNIQUE ("property_id", "day_of_week");



ALTER TABLE ONLY "public"."property_deliveries"
    ADD CONSTRAINT "property_deliveries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."public_offers"
    ADD CONSTRAINT "public_offers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."verification_documents"
    ADD CONSTRAINT "verification_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."visit_feedback"
    ADD CONSTRAINT "visit_feedback_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."visits"
    ADD CONSTRAINT "visits_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_administrative_transitions_offer_id" ON "public"."administrative_transitions" USING "btree" ("offer_id");



CREATE INDEX "idx_advisory_sessions_user_id" ON "public"."advisory_sessions" USING "btree" ("user_id");



CREATE INDEX "idx_audit_logs_action_type" ON "public"."audit_logs" USING "btree" ("action_type");



CREATE INDEX "idx_audit_logs_created_at" ON "public"."audit_logs" USING "btree" ("created_at");



CREATE INDEX "idx_audit_logs_resource_id" ON "public"."audit_logs" USING "btree" ("resource_id");



CREATE INDEX "idx_audit_logs_resource_type" ON "public"."audit_logs" USING "btree" ("resource_type");



CREATE INDEX "idx_audit_logs_user_id" ON "public"."audit_logs" USING "btree" ("user_id");



CREATE INDEX "idx_blocked_dates_date" ON "public"."blocked_dates" USING "btree" ("blocked_date");



CREATE INDEX "idx_blocked_dates_property_id" ON "public"."blocked_dates" USING "btree" ("property_id");



CREATE INDEX "idx_blog_posts_status" ON "public"."blog_posts" USING "btree" ("status");



CREATE INDEX "idx_case_documents_case" ON "public"."case_documents" USING "btree" ("case_id");



CREATE INDEX "idx_cases_lawyer" ON "public"."cases" USING "btree" ("lawyer_id");



CREATE INDEX "idx_chat_messages_case" ON "public"."chat_messages" USING "btree" ("case_id");



CREATE INDEX "idx_contracts_buyer_id" ON "public"."contracts" USING "btree" ("buyer_id");



CREATE INDEX "idx_contracts_offer_id" ON "public"."contracts" USING "btree" ("offer_id");



CREATE INDEX "idx_contracts_property_id" ON "public"."contracts" USING "btree" ("property_id");



CREATE INDEX "idx_contracts_seller_id" ON "public"."contracts" USING "btree" ("seller_id");



CREATE INDEX "idx_contracts_status" ON "public"."contracts" USING "btree" ("status");



CREATE INDEX "idx_favorites_user" ON "public"."favorites" USING "btree" ("user_id");



CREATE INDEX "idx_fiscal_simulations_offer_id" ON "public"."fiscal_simulations" USING "btree" ("offer_id");



CREATE INDEX "idx_knowledge_base_level" ON "public"."knowledge_base" USING "btree" ("level");



CREATE INDEX "idx_knowledge_base_property_id" ON "public"."knowledge_base" USING "btree" ("property_id");



CREATE INDEX "idx_knowledge_base_user_id" ON "public"."knowledge_base" USING "btree" ("user_id");



CREATE INDEX "idx_legal_documents_offer_id" ON "public"."legal_documents" USING "btree" ("offer_id");



CREATE INDEX "idx_login_attempts_attempted_at" ON "public"."login_attempts" USING "btree" ("attempted_at");



CREATE INDEX "idx_login_attempts_email" ON "public"."login_attempts" USING "btree" ("email");



CREATE INDEX "idx_login_attempts_user_id" ON "public"."login_attempts" USING "btree" ("user_id");



CREATE INDEX "idx_negotiation_rules_property_id" ON "public"."negotiation_rules" USING "btree" ("property_id");



CREATE INDEX "idx_notifications_created_at" ON "public"."notifications" USING "btree" ("created_at");



CREATE INDEX "idx_notifications_read" ON "public"."notifications" USING "btree" ("read");



CREATE INDEX "idx_notifications_type" ON "public"."notifications" USING "btree" ("type");



CREATE INDEX "idx_notifications_user" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_offer_attachments_offer_id" ON "public"."offer_attachments" USING "btree" ("offer_id");



CREATE INDEX "idx_offer_attachments_uploaded_at" ON "public"."offer_attachments" USING "btree" ("uploaded_at");



CREATE INDEX "idx_offer_attachments_uploaded_by" ON "public"."offer_attachments" USING "btree" ("uploaded_by");



CREATE INDEX "idx_offer_history_actor_id" ON "public"."offer_history" USING "btree" ("actor_id");



CREATE INDEX "idx_offer_history_created_at" ON "public"."offer_history" USING "btree" ("created_at");



CREATE INDEX "idx_offer_history_offer_id" ON "public"."offer_history" USING "btree" ("offer_id");



CREATE INDEX "idx_offers_auto_rejected" ON "public"."offers" USING "btree" ("auto_rejected");



CREATE INDEX "idx_offers_buyer" ON "public"."offers" USING "btree" ("buyer_id");



CREATE INDEX "idx_offers_buyer_id" ON "public"."offers" USING "btree" ("buyer_id");



CREATE INDEX "idx_offers_competitiveness_score" ON "public"."offers" USING "btree" ("competitiveness_score");



CREATE INDEX "idx_offers_negotiation_progress" ON "public"."offers" USING "btree" ("negotiation_progress");



CREATE INDEX "idx_offers_property" ON "public"."offers" USING "btree" ("property_id");



CREATE INDEX "idx_offers_property_id" ON "public"."offers" USING "btree" ("property_id");



CREATE INDEX "idx_offers_status" ON "public"."offers" USING "btree" ("status");



CREATE INDEX "idx_payment_plans_offer_id" ON "public"."payment_plans" USING "btree" ("offer_id");



CREATE INDEX "idx_profiles_email_verified" ON "public"."profiles" USING "btree" ("email_verified");



CREATE INDEX "idx_profiles_verification_status" ON "public"."profiles" USING "btree" ("verification_status");



CREATE INDEX "idx_properties_city" ON "public"."properties" USING "btree" ("city");



CREATE INDEX "idx_properties_owner" ON "public"."properties" USING "btree" ("owner_id");



CREATE INDEX "idx_properties_status" ON "public"."properties" USING "btree" ("status");



CREATE INDEX "idx_property_availability_day" ON "public"."property_availability" USING "btree" ("day_of_week");



CREATE INDEX "idx_property_availability_enabled" ON "public"."property_availability" USING "btree" ("enabled");



CREATE INDEX "idx_property_availability_property_id" ON "public"."property_availability" USING "btree" ("property_id");



CREATE INDEX "idx_property_deliveries_offer_id" ON "public"."property_deliveries" USING "btree" ("offer_id");



CREATE INDEX "idx_public_offers_property_id" ON "public"."public_offers" USING "btree" ("property_id");



CREATE INDEX "idx_verification_documents_status" ON "public"."verification_documents" USING "btree" ("status");



CREATE INDEX "idx_verification_documents_user_id" ON "public"."verification_documents" USING "btree" ("user_id");



CREATE INDEX "idx_visit_feedback_created_at" ON "public"."visit_feedback" USING "btree" ("created_at");



CREATE INDEX "idx_visit_feedback_user_id" ON "public"."visit_feedback" USING "btree" ("user_id");



CREATE INDEX "idx_visit_feedback_visit_id" ON "public"."visit_feedback" USING "btree" ("visit_id");



CREATE INDEX "idx_visits_property" ON "public"."visits" USING "btree" ("property_id");



CREATE INDEX "idx_visits_visitor" ON "public"."visits" USING "btree" ("visitor_id");



CREATE INDEX "profiles_created_at_idx" ON "public"."profiles" USING "btree" ("created_at");



CREATE INDEX "profiles_email_idx" ON "public"."profiles" USING "btree" ("email");



CREATE INDEX "profiles_role_idx" ON "public"."profiles" USING "btree" ("role");



CREATE INDEX "profiles_status_idx" ON "public"."profiles" USING "btree" ("status");



CREATE OR REPLACE TRIGGER "audit_offer_status_changes" AFTER UPDATE ON "public"."offers" FOR EACH ROW EXECUTE FUNCTION "public"."log_offer_status_change"();



CREATE OR REPLACE TRIGGER "audit_property_status_changes" AFTER UPDATE ON "public"."properties" FOR EACH ROW EXECUTE FUNCTION "public"."log_property_status_change"();



CREATE OR REPLACE TRIGGER "audit_user_role_changes" AFTER UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."log_user_role_change"();



CREATE OR REPLACE TRIGGER "audit_verification_status_changes" AFTER UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."log_verification_status_change"();



CREATE OR REPLACE TRIGGER "contract_updated_at" BEFORE UPDATE ON "public"."contracts" FOR EACH ROW EXECUTE FUNCTION "public"."update_contract_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_auto_reject_offers" BEFORE INSERT ON "public"."offers" FOR EACH ROW EXECUTE FUNCTION "public"."auto_reject_offers"();



CREATE OR REPLACE TRIGGER "trigger_offer_status_notifications" AFTER UPDATE ON "public"."offers" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_offer_notifications"();



CREATE OR REPLACE TRIGGER "trigger_send_offer_notification" AFTER INSERT ON "public"."offers" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_offer_notification"();



CREATE OR REPLACE TRIGGER "trigger_send_offer_status_notification" AFTER UPDATE ON "public"."offers" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_offer_status_notification"();



CREATE OR REPLACE TRIGGER "trigger_update_negotiation_progress" BEFORE UPDATE ON "public"."offers" FOR EACH ROW EXECUTE FUNCTION "public"."update_negotiation_progress"();



CREATE OR REPLACE TRIGGER "trigger_update_notifications_updated_at" BEFORE UPDATE ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "public"."update_notifications_updated_at"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_property_availability_updated_at" BEFORE UPDATE ON "public"."property_availability" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_verification_documents_updated_at" BEFORE UPDATE ON "public"."verification_documents" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_verification_status_trigger" AFTER UPDATE ON "public"."verification_documents" FOR EACH ROW EXECUTE FUNCTION "public"."update_verification_status"();



CREATE OR REPLACE TRIGGER "visit_feedback_submitted" AFTER INSERT ON "public"."visit_feedback" FOR EACH ROW EXECUTE FUNCTION "public"."update_visit_feedback_status"();



ALTER TABLE ONLY "public"."administrative_transitions"
    ADD CONSTRAINT "administrative_transitions_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."administrative_transitions"
    ADD CONSTRAINT "administrative_transitions_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."advisory_sessions"
    ADD CONSTRAINT "advisory_sessions_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."blocked_dates"
    ADD CONSTRAINT "blocked_dates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."blocked_dates"
    ADD CONSTRAINT "blocked_dates_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."case_documents"
    ADD CONSTRAINT "case_documents_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id");



ALTER TABLE ONLY "public"."cases"
    ADD CONSTRAINT "cases_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id");



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id");



ALTER TABLE ONLY "public"."contracts"
    ADD CONSTRAINT "contracts_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contracts"
    ADD CONSTRAINT "contracts_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contracts"
    ADD CONSTRAINT "contracts_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contracts"
    ADD CONSTRAINT "contracts_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id");



ALTER TABLE ONLY "public"."fiscal_simulations"
    ADD CONSTRAINT "fiscal_simulations_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."offer_history"
    ADD CONSTRAINT "fk_offer_history_offer" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id");



ALTER TABLE ONLY "public"."offers"
    ADD CONSTRAINT "fk_offers_property" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id");



ALTER TABLE ONLY "public"."intent_letters"
    ADD CONSTRAINT "intent_letters_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."intent_letters"
    ADD CONSTRAINT "intent_letters_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id");



ALTER TABLE ONLY "public"."knowledge_base"
    ADD CONSTRAINT "knowledge_base_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."legal_documents"
    ADD CONSTRAINT "legal_documents_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."legal_documents"
    ADD CONSTRAINT "legal_documents_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."login_attempts"
    ADD CONSTRAINT "login_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."negotiation_rules"
    ADD CONSTRAINT "negotiation_rules_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."offer_attachments"
    ADD CONSTRAINT "offer_attachments_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."offer_attachments"
    ADD CONSTRAINT "offer_attachments_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."offer_comparisons"
    ADD CONSTRAINT "offer_comparisons_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."offer_history"
    ADD CONSTRAINT "offer_history_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."offers"
    ADD CONSTRAINT "offers_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id");



ALTER TABLE ONLY "public"."payment_plans"
    ADD CONSTRAINT "payment_plans_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_verification_reviewed_by_fkey" FOREIGN KEY ("verification_reviewed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."property_availability"
    ADD CONSTRAINT "property_availability_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."property_deliveries"
    ADD CONSTRAINT "property_deliveries_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."property_deliveries"
    ADD CONSTRAINT "property_deliveries_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."public_offers"
    ADD CONSTRAINT "public_offers_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."verification_documents"
    ADD CONSTRAINT "verification_documents_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."verification_documents"
    ADD CONSTRAINT "verification_documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."visit_feedback"
    ADD CONSTRAINT "visit_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."visit_feedback"
    ADD CONSTRAINT "visit_feedback_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."visits"
    ADD CONSTRAINT "visits_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id");



CREATE POLICY "Admins can update verification documents" ON "public"."verification_documents" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['admin'::"text", 'super_admin'::"text"]))))));



CREATE POLICY "Admins can view all login attempts" ON "public"."login_attempts" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['admin'::"text", 'super_admin'::"text"]))))));



CREATE POLICY "Admins can view all verification documents" ON "public"."verification_documents" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['admin'::"text", 'super_admin'::"text"]))))));



CREATE POLICY "Anyone can view availability for published properties" ON "public"."property_availability" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."properties"
  WHERE (("properties"."id" = "property_availability"."property_id") AND (("properties"."status")::"text" = 'published'::"text")))));



CREATE POLICY "Anyone can view blocked dates for published properties" ON "public"."blocked_dates" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."properties"
  WHERE (("properties"."id" = "blocked_dates"."property_id") AND (("properties"."status")::"text" = 'published'::"text")))));



CREATE POLICY "Enable all access for service role" ON "public"."profiles" USING (true);



CREATE POLICY "Property owners can manage their availability" ON "public"."property_availability" USING ((EXISTS ( SELECT 1
   FROM "public"."properties"
  WHERE (("properties"."id" = "property_availability"."property_id") AND ("properties"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Property owners can manage their blocked dates" ON "public"."blocked_dates" USING ((EXISTS ( SELECT 1
   FROM "public"."properties"
  WHERE (("properties"."id" = "blocked_dates"."property_id") AND ("properties"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Property owners can update their offers" ON "public"."offers" FOR UPDATE USING (("auth"."uid"() IN ( SELECT "properties"."owner_id"
   FROM "public"."properties"
  WHERE ("properties"."id" = "offers"."property_id"))));



CREATE POLICY "System can insert login attempts" ON "public"."login_attempts" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can create offers" ON "public"."offers" FOR INSERT WITH CHECK (("auth"."uid"() = "buyer_id"));



CREATE POLICY "Users can insert their own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can insert their own verification documents" ON "public"."verification_documents" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own notifications" ON "public"."notifications" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view offers for their properties" ON "public"."offers" FOR SELECT USING ((("auth"."uid"() IN ( SELECT "properties"."owner_id"
   FROM "public"."properties"
  WHERE ("properties"."id" = "offers"."property_id"))) OR ("auth"."uid"() = "buyer_id")));



CREATE POLICY "Users can view their own login attempts" ON "public"."login_attempts" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own notifications" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own verification documents" ON "public"."verification_documents" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."administrative_transitions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisory_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "audit_logs_insert" ON "public"."audit_logs" FOR INSERT WITH CHECK (true);



CREATE POLICY "audit_logs_read" ON "public"."audit_logs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['admin'::"text", 'super_admin'::"text"]))))));



ALTER TABLE "public"."blocked_dates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."case_documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cases" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contracts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "contracts_insert" ON "public"."contracts" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['admin'::"text", 'super_admin'::"text"]))))));



CREATE POLICY "contracts_read" ON "public"."contracts" FOR SELECT USING ((("buyer_id" = "auth"."uid"()) OR ("seller_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['admin'::"text", 'super_admin'::"text"])))))));



CREATE POLICY "contracts_update" ON "public"."contracts" FOR UPDATE USING ((("buyer_id" = "auth"."uid"()) OR ("seller_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['admin'::"text", 'super_admin'::"text"])))))));



ALTER TABLE "public"."favorites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fiscal_simulations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."intent_letters" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."knowledge_base" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."legal_documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."login_attempts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."negotiation_rules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."offer_attachments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "offer_attachments_delete" ON "public"."offer_attachments" FOR DELETE USING (("uploaded_by" = "auth"."uid"()));



CREATE POLICY "offer_attachments_insert" ON "public"."offer_attachments" FOR INSERT WITH CHECK ((("uploaded_by" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."offers" "o"
  WHERE (("o"."id" = "offer_attachments"."offer_id") AND (("o"."buyer_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
           FROM "public"."properties" "p"
          WHERE (("p"."id" = "o"."property_id") AND ("p"."owner_id" = "auth"."uid"()))))))))));



CREATE POLICY "offer_attachments_read" ON "public"."offer_attachments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."offers" "o"
  WHERE (("o"."id" = "offer_attachments"."offer_id") AND (("o"."buyer_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
           FROM "public"."properties" "p"
          WHERE (("p"."id" = "o"."property_id") AND ("p"."owner_id" = "auth"."uid"())))))))));



ALTER TABLE "public"."offer_comparisons" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."offer_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."offers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."properties" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."property_availability" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."property_deliveries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."public_offers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."verification_documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."visit_feedback" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "visit_feedback_insert" ON "public"."visit_feedback" FOR INSERT WITH CHECK ((("user_id" = "auth"."uid"()) OR (("is_anonymous" = true) AND ("user_id" IS NULL))));



CREATE POLICY "visit_feedback_read_own" ON "public"."visit_feedback" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "visit_feedback_read_property_owner" ON "public"."visit_feedback" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."visits" "v"
     JOIN "public"."properties" "p" ON (("v"."property_id" = "p"."id")))
  WHERE (("v"."id" = "visit_feedback"."visit_id") AND ("p"."owner_id" = "auth"."uid"())))));



ALTER TABLE "public"."visits" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."auto_reject_offers"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_reject_offers"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_reject_offers"() TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_competitiveness_score"("p_offer_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_competitiveness_score"("p_offer_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_competitiveness_score"("p_offer_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_negotiation_progress"("p_offer_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_negotiation_progress"("p_offer_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_negotiation_progress"("p_offer_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_property_availability"("p_property_id" "uuid", "p_date" "date", "p_time" time without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."check_property_availability"("p_property_id" "uuid", "p_date" "date", "p_time" time without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_property_availability"("p_property_id" "uuid", "p_date" "date", "p_time" time without time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_unused_attachments"("days_old" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_unused_attachments"("days_old" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_unused_attachments"("days_old" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."close_negotiation_transaction"("p_offer_id" "uuid", "p_property_id" "uuid", "p_buyer_id" "uuid", "p_seller_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."close_negotiation_transaction"("p_offer_id" "uuid", "p_property_id" "uuid", "p_buyer_id" "uuid", "p_seller_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."close_negotiation_transaction"("p_offer_id" "uuid", "p_property_id" "uuid", "p_buyer_id" "uuid", "p_seller_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_counter_offer"("p_original_offer_id" "uuid", "p_new_price" bigint, "p_new_payment_method" character varying, "p_new_closing_date" "date", "p_new_conditions" "text"[], "p_reason" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_counter_offer"("p_original_offer_id" "uuid", "p_new_price" bigint, "p_new_payment_method" character varying, "p_new_closing_date" "date", "p_new_conditions" "text"[], "p_reason" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_counter_offer"("p_original_offer_id" "uuid", "p_new_price" bigint, "p_new_payment_method" character varying, "p_new_closing_date" "date", "p_new_conditions" "text"[], "p_reason" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_ai_advisory"("p_user_id" "uuid", "p_property_id" "uuid", "p_context" "jsonb", "p_level" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."generate_ai_advisory"("p_user_id" "uuid", "p_property_id" "uuid", "p_context" "jsonb", "p_level" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_ai_advisory"("p_user_id" "uuid", "p_property_id" "uuid", "p_context" "jsonb", "p_level" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_advisory_for_context"("p_context" character varying, "p_user_role" character varying, "p_property_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."get_advisory_for_context"("p_context" character varying, "p_user_role" character varying, "p_property_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_advisory_for_context"("p_context" character varying, "p_user_role" character varying, "p_property_type" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_audit_logs_with_users"("limit_count" integer, "offset_count" integer, "user_filter" "uuid", "action_filter" "text", "resource_filter" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_audit_logs_with_users"("limit_count" integer, "offset_count" integer, "user_filter" "uuid", "action_filter" "text", "resource_filter" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_audit_logs_with_users"("limit_count" integer, "offset_count" integer, "user_filter" "uuid", "action_filter" "text", "resource_filter" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_audit_statistics"("days_back" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_audit_statistics"("days_back" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_audit_statistics"("days_back" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_available_time_slots"("p_property_id" "uuid", "p_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."get_available_time_slots"("p_property_id" "uuid", "p_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_available_time_slots"("p_property_id" "uuid", "p_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_contract_details"("contract_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_contract_details"("contract_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_contract_details"("contract_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_negotiation_insights"("p_property_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_negotiation_insights"("p_property_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_negotiation_insights"("p_property_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_negotiation_timeline"("p_offer_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_negotiation_timeline"("p_offer_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_negotiation_timeline"("p_offer_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_offer_attachment_count"("offer_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_offer_attachment_count"("offer_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_offer_attachment_count"("offer_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_offer_net_efficiency_index"("p_offer_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_offer_net_efficiency_index"("p_offer_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_offer_net_efficiency_index"("p_offer_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_property_feedback_stats"("property_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_property_feedback_stats"("property_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_property_feedback_stats"("property_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_unread_count"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_unread_count"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_unread_count"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_notifications"("p_user_id" "uuid", "p_limit" integer, "p_offset" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_notifications"("p_user_id" "uuid", "p_limit" integer, "p_offset" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_notifications"("p_user_id" "uuid", "p_limit" integer, "p_offset" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."has_active_negotiations"("property_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."has_active_negotiations"("property_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_active_negotiations"("property_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."log_offer_status_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_offer_status_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_offer_status_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_property_status_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_property_status_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_property_status_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_user_role_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_user_role_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_user_role_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_verification_status_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_verification_status_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_verification_status_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."mark_all_notifications_read"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."mark_all_notifications_read"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."mark_all_notifications_read"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."mark_notification_read"("p_notification_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."mark_notification_read"("p_notification_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."mark_notification_read"("p_notification_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."send_negotiation_notification"("p_offer_id" "uuid", "p_notification_type" character varying, "p_message" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."send_negotiation_notification"("p_offer_id" "uuid", "p_notification_type" character varying, "p_message" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_negotiation_notification"("p_offer_id" "uuid", "p_notification_type" character varying, "p_message" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."send_notification"("p_user_id" "uuid", "p_type" character varying, "p_title" character varying, "p_message" "text", "p_data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."send_notification"("p_user_id" "uuid", "p_type" character varying, "p_title" character varying, "p_message" "text", "p_data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_notification"("p_user_id" "uuid", "p_type" character varying, "p_title" character varying, "p_message" "text", "p_data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_offer_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_offer_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_offer_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_offer_notifications"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_offer_notifications"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_offer_notifications"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_offer_status_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_offer_status_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_offer_status_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_contract_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_contract_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_contract_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_negotiation_progress"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_negotiation_progress"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_negotiation_progress"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_notifications_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_notifications_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_notifications_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_verification_status"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_verification_status"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_verification_status"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_visit_feedback_status"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_visit_feedback_status"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_visit_feedback_status"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_offer_against_rules"("p_property_id" "uuid", "p_offer_price" bigint, "p_payment_method" character varying, "p_closing_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."validate_offer_against_rules"("p_property_id" "uuid", "p_offer_price" bigint, "p_payment_method" character varying, "p_closing_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_offer_against_rules"("p_property_id" "uuid", "p_offer_price" bigint, "p_payment_method" character varying, "p_closing_date" "date") TO "service_role";


















GRANT ALL ON TABLE "public"."administrative_transitions" TO "anon";
GRANT ALL ON TABLE "public"."administrative_transitions" TO "authenticated";
GRANT ALL ON TABLE "public"."administrative_transitions" TO "service_role";



GRANT ALL ON TABLE "public"."advisory_sessions" TO "anon";
GRANT ALL ON TABLE "public"."advisory_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."advisory_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."blocked_dates" TO "anon";
GRANT ALL ON TABLE "public"."blocked_dates" TO "authenticated";
GRANT ALL ON TABLE "public"."blocked_dates" TO "service_role";



GRANT ALL ON TABLE "public"."blog_posts" TO "anon";
GRANT ALL ON TABLE "public"."blog_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_posts" TO "service_role";



GRANT ALL ON TABLE "public"."case_documents" TO "anon";
GRANT ALL ON TABLE "public"."case_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."case_documents" TO "service_role";



GRANT ALL ON TABLE "public"."cases" TO "anon";
GRANT ALL ON TABLE "public"."cases" TO "authenticated";
GRANT ALL ON TABLE "public"."cases" TO "service_role";



GRANT ALL ON TABLE "public"."chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages" TO "service_role";



GRANT ALL ON TABLE "public"."contracts" TO "anon";
GRANT ALL ON TABLE "public"."contracts" TO "authenticated";
GRANT ALL ON TABLE "public"."contracts" TO "service_role";



GRANT ALL ON TABLE "public"."favorites" TO "anon";
GRANT ALL ON TABLE "public"."favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."favorites" TO "service_role";



GRANT ALL ON TABLE "public"."fiscal_simulations" TO "anon";
GRANT ALL ON TABLE "public"."fiscal_simulations" TO "authenticated";
GRANT ALL ON TABLE "public"."fiscal_simulations" TO "service_role";



GRANT ALL ON TABLE "public"."intent_letters" TO "anon";
GRANT ALL ON TABLE "public"."intent_letters" TO "authenticated";
GRANT ALL ON TABLE "public"."intent_letters" TO "service_role";



GRANT ALL ON TABLE "public"."knowledge_base" TO "anon";
GRANT ALL ON TABLE "public"."knowledge_base" TO "authenticated";
GRANT ALL ON TABLE "public"."knowledge_base" TO "service_role";



GRANT ALL ON TABLE "public"."legal_documents" TO "anon";
GRANT ALL ON TABLE "public"."legal_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."legal_documents" TO "service_role";



GRANT ALL ON TABLE "public"."login_attempts" TO "anon";
GRANT ALL ON TABLE "public"."login_attempts" TO "authenticated";
GRANT ALL ON TABLE "public"."login_attempts" TO "service_role";



GRANT ALL ON TABLE "public"."negotiation_rules" TO "anon";
GRANT ALL ON TABLE "public"."negotiation_rules" TO "authenticated";
GRANT ALL ON TABLE "public"."negotiation_rules" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."offer_attachments" TO "anon";
GRANT ALL ON TABLE "public"."offer_attachments" TO "authenticated";
GRANT ALL ON TABLE "public"."offer_attachments" TO "service_role";



GRANT ALL ON TABLE "public"."offer_comparisons" TO "anon";
GRANT ALL ON TABLE "public"."offer_comparisons" TO "authenticated";
GRANT ALL ON TABLE "public"."offer_comparisons" TO "service_role";



GRANT ALL ON TABLE "public"."offer_history" TO "anon";
GRANT ALL ON TABLE "public"."offer_history" TO "authenticated";
GRANT ALL ON TABLE "public"."offer_history" TO "service_role";



GRANT ALL ON TABLE "public"."offers" TO "anon";
GRANT ALL ON TABLE "public"."offers" TO "authenticated";
GRANT ALL ON TABLE "public"."offers" TO "service_role";



GRANT ALL ON TABLE "public"."payment_plans" TO "anon";
GRANT ALL ON TABLE "public"."payment_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_plans" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."properties" TO "anon";
GRANT ALL ON TABLE "public"."properties" TO "authenticated";
GRANT ALL ON TABLE "public"."properties" TO "service_role";



GRANT ALL ON TABLE "public"."property_availability" TO "anon";
GRANT ALL ON TABLE "public"."property_availability" TO "authenticated";
GRANT ALL ON TABLE "public"."property_availability" TO "service_role";



GRANT ALL ON TABLE "public"."property_deliveries" TO "anon";
GRANT ALL ON TABLE "public"."property_deliveries" TO "authenticated";
GRANT ALL ON TABLE "public"."property_deliveries" TO "service_role";



GRANT ALL ON TABLE "public"."public_offers" TO "anon";
GRANT ALL ON TABLE "public"."public_offers" TO "authenticated";
GRANT ALL ON TABLE "public"."public_offers" TO "service_role";



GRANT ALL ON TABLE "public"."verification_documents" TO "anon";
GRANT ALL ON TABLE "public"."verification_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."verification_documents" TO "service_role";



GRANT ALL ON TABLE "public"."visit_feedback" TO "anon";
GRANT ALL ON TABLE "public"."visit_feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."visit_feedback" TO "service_role";



GRANT ALL ON TABLE "public"."visits" TO "anon";
GRANT ALL ON TABLE "public"."visits" TO "authenticated";
GRANT ALL ON TABLE "public"."visits" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































RESET ALL;
