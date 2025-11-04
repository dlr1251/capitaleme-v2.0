import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/middleware/auth.js';
import { supabase } from '../../../lib/supabase.server.js';

export const GET: APIRoute = requireAuth(async (context, user) => {
  const requestStartTime = Date.now();
  console.log('[API:visas] GET request received');
  console.log('[API:visas] User authenticated:', user?.id, user?.email);
  
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const lang = url.searchParams.get('lang'); // Don't default to 'en' - make it optional
    const published = url.searchParams.get('published');
    const archived = url.searchParams.get('archived');
    
    console.log('[API:visas] Query parameters:', { id, lang, published, archived });

    // If id is provided, return single item
    if (id) {
      console.log('[API:visas] Fetching single visa by id:', id);
      console.log('[API:visas] Querying Supabase table: "visas"');
      const queryStartTime = Date.now();
      
      const { data, error } = await supabase
        .from('visas')
        .select('*')
        .eq('id', id)
        .single();
      
      const queryElapsed = Date.now() - queryStartTime;
      console.log('[API:visas] Single visa query executed in', queryElapsed, 'ms');

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(JSON.stringify({ data: [data] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[API:visas] ========== BUILDING QUERY FOR SUPABASE ==========');
    console.log('[API:visas] Building query for Supabase table: "visas"');
    console.log('[API:visas] Query will SELECT * FROM visas');
    console.log('[API:visas] This will fetch ALL visas from the Supabase database');
    
    let query = supabase
      .from('visas')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('[API:visas] Base query created for "visas" table');
    console.log('[API:visas] Query object:', { from: 'visas', select: '*', orderBy: 'created_at' });

    // Only filter by lang if explicitly provided
    if (lang && lang !== 'all') {
      query = query.eq('lang', lang);
    }

    if (published !== null) {
      query = query.eq('published', published === 'true');
    }

    // Handle archived filter - if archived=false, show non-archived (including null)
    if (archived === 'true') {
      query = query.eq('archived', true);
    } else if (archived === 'false') {
      // Show items where archived is false OR null
      // Using PostgREST filter: show where archived is null OR archived is false
      query = query.or('archived.is.null,archived.eq.false');
    }
    // If archived is not specified, show all (including archived items)

    console.log('[API:visas] Fetching visas with filters:', {
      lang,
      published,
      archived,
      filtersApplied: {
        lang: lang && lang !== 'all',
        published: published !== null,
        archived: archived !== null,
      },
    });

    console.log('[API:visas] ========== EXECUTING SUPABASE QUERY ==========');
    console.log('[API:visas] About to query Supabase "visas" table');
    console.log('[API:visas] Query builder configured, executing query...');
    console.log('[API:visas] This query will fetch visas from Supabase database table: "visas"');
    const queryStartTime = Date.now();
    
    console.log('[API:visas] Executing: SELECT * FROM visas ...');
    const { data, error } = await query;
    
    const queryElapsed = Date.now() - queryStartTime;
    console.log('[API:visas] ========== SUPABASE QUERY COMPLETED ==========');
    console.log('[API:visas] Supabase query executed in', queryElapsed, 'ms');
    console.log('[API:visas] Querying table: "visas"');
    console.log('[API:visas] Query result - has data:', !!data, 'has error:', !!error);

    if (error) {
      console.error('[API:visas] ERROR querying Supabase "visas" table:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        table: 'visas',
      });
    } else {
      console.log('[API:visas] SUCCESS: Query to Supabase "visas" table completed without errors');
    }

    const elapsed = Date.now() - requestStartTime;
    console.log('[API:visas] Query completed in', elapsed, 'ms');
    console.log('[API:visas] Query result:', {
      dataCount: data?.length || 0,
      error: error?.message || null,
      errorCode: error?.code || null,
      errorDetails: error?.details || null,
      hasData: !!data,
      dataType: Array.isArray(data) ? 'array' : typeof data,
      firstItem: data?.[0] ? {
        id: data[0].id,
        title: data[0].title,
        lang: data[0].lang,
        published: data[0].published,
        archived: data[0].archived,
        hasArchivedField: 'archived' in (data[0] || {}),
        hasPublishedField: 'published' in (data[0] || {}),
      } : null,
    });

    if (error) {
      console.error('[API:visas] Returning error response:', error.message);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[API:visas] Returning success response with', data?.length || 0, 'items');
    const response = new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('[API:visas] Response created, total time:', Date.now() - requestStartTime, 'ms');
    return response;
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

export const POST: APIRoute = requireAuth(async (context, user) => {
  try {
    const body = await context.request.json();
    const {
      title,
      slug,
      description,
      content,
      category,
      country,
      countries,
      is_popular,
      beneficiaries,
      work_permit,
      processing_time,
      requirements,
      emoji,
      alcance,
      duration,
      lang,
      published = false,
    } = body;

    if (!title || !slug || !lang) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: title, slug, lang' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { data, error } = await supabase
      .from('visas')
      .insert({
        title,
        slug,
        description,
        content,
        category,
        country,
        countries: countries || [],
        is_popular: is_popular || false,
        beneficiaries,
        work_permit,
        processing_time,
        requirements,
        emoji,
        alcance,
        duration,
        lang,
        category: category || 'Visitor',
        published: published || false,
        archived: false,
        last_edited: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

export const PUT: APIRoute = requireAuth(async (context, user) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Missing id parameter' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await context.request.json();
    const {
      title,
      slug,
      description,
      content,
      category,
      country,
      countries,
      is_popular,
      beneficiaries,
      work_permit,
      processing_time,
      requirements,
      emoji,
      alcance,
      duration,
      lang,
      published,
      archived,
    } = body;

    const updateData: any = {
      updated_at: new Date().toISOString(),
      last_edited: new Date().toISOString(),
    };

    // Only include fields that are provided and valid
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (country !== undefined) updateData.country = country;
    if (countries !== undefined) updateData.countries = countries;
    if (is_popular !== undefined) updateData.is_popular = is_popular;
    if (beneficiaries !== undefined) updateData.beneficiaries = beneficiaries;
    if (work_permit !== undefined) updateData.work_permit = work_permit;
    if (processing_time !== undefined) updateData.processing_time = processing_time;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (emoji !== undefined) updateData.emoji = emoji;
    if (alcance !== undefined) updateData.alcance = alcance;
    if (duration !== undefined) updateData.duration = duration;
    if (lang !== undefined) updateData.lang = lang;
    if (published !== undefined) updateData.published = published;
    if (archived !== undefined) updateData.archived = archived;

    const { data, error } = await supabase
      .from('visas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

export const DELETE: APIRoute = requireAuth(async (context, user) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Missing id parameter' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Soft delete: set archived to true
    const { data, error } = await supabase
      .from('visas')
      .update({
        archived: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

