import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/middleware/auth.js';
import { supabase } from '../../../lib/supabase.server.js';

export const GET: APIRoute = requireAuth(async (context, user) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const lang = url.searchParams.get('lang'); // Don't default to 'en' - make it optional
    const published = url.searchParams.get('published');
    const archived = url.searchParams.get('archived');

    if (id) {
      const { data, error } = await supabase
        .from('blog_posts')
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
      .from('blog_posts')
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
      category,
      author,
      lang,
      pub_date,
      image,
      published = false,
      featured = false,
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

    const insertData = {
      title,
      slug,
      description,
      content,
      category,
      author,
      lang,
      pub_date: pub_date || (published ? new Date().toISOString() : null),
      image,
      published: published || false,
      featured: featured || false,
      archived: false,
      last_edited: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('[API:blog] POST - Inserting blog post:', { title, slug, lang, published });

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('[API:blog] POST - Error inserting blog post:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return new Response(
        JSON.stringify({ error: error.message || 'Failed to create blog post' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[API:blog] POST - Blog post created successfully:', data?.id);

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

    // If publishing for the first time, set pub_date
    if (updateData.published === true && !body.pub_date) {
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('pub_date')
        .eq('id', id)
        .single();
      
      if (!existing?.pub_date) {
        updateData.pub_date = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('blog_posts')
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
      .from('blog_posts')
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

