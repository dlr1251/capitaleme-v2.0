import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import { requireAuth } from '../../../lib/middleware/auth.js';
import { supabase } from '../../../lib/supabase.server.js';
import { calculateReadingTimeFromText } from '../../../utils/readingTime.js';

export const GET: APIRoute = requireAuth(async (context, user) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const lang = url.searchParams.get('lang'); // Don't default to 'en' - make it optional
    const published = url.searchParams.get('published');
    const archived = url.searchParams.get('archived');

    if (id) {
      const { data, error } = await supabase
        .from('clkr_articles')
        .select('*')
        .eq('id', id)
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

      return new Response(JSON.stringify({ data: [data] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let query = supabase
      .from('clkr_articles')
      .select('*')
      .order('created_at', { ascending: false });

    // Only filter by lang if explicitly provided
    if (lang && lang !== 'all') {
      query = query.eq('lang', lang);
    }

    if (published !== null) {
      query = query.eq('published', published === 'true');
    }

    if (archived === 'true') {
      query = query.eq('archived', true);
    } else if (archived === 'false') {
      query = query.or('archived.is.null,archived.eq.false');
    }

    const { data, error } = await query;

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

export const POST: APIRoute = requireAuth(async (context, user) => {
  try {
    const body = await context.request.json();
    const {
      title,
      slug,
      description,
      content,
      module,
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

    // Calculate reading time from content
    const reading_time = content ? calculateReadingTimeFromText(content) : null;

    const insertData = {
      title,
      slug,
      description,
      content,
      module,
      lang,
      published: published || false,
      reading_time,
      archived: false,
      notion_id: body?.notion_id && typeof body.notion_id === 'string' && body.notion_id.trim() !== ''
        ? body.notion_id
        : crypto.randomUUID(),
      last_edited: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('[API:clkr] POST - Inserting CLKR article:', { title, slug, lang, published });

    const { data, error } = await supabase
      .from('clkr_articles')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('[API:clkr] POST - Error inserting CLKR article:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return new Response(
        JSON.stringify({ error: error.message || 'Failed to create CLKR article' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[API:clkr] POST - CLKR article created successfully:', data?.id);

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
    const updateData: any = {
      ...body,
      updated_at: new Date().toISOString(),
      last_edited: new Date().toISOString(),
    };

    // Ensure we don't try to update non-existent columns
    if ('featured' in updateData) {
      delete updateData.featured;
    }

    // Recalculate reading time if content changed
    if (updateData.content) {
      updateData.reading_time = calculateReadingTimeFromText(updateData.content);
    }

    const { data, error } = await supabase
      .from('clkr_articles')
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
      .from('clkr_articles')
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

