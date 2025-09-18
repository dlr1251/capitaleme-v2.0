// @ts-nocheck
// deno.json tiene "imports": {"npm:": "npm:"}
import { serve } from "https://deno.land/std/http/server.ts";
import { Client } from "npm:@notionhq/client";

interface Env {
  NOTION_TOKEN: string;
  NOTION_VISAS_DB_ID: string;
  NOTION_CLKR_DB_ID: string;
  NOTION_BLOG_DB_ID: string;
  NOTION_GUIDES_DB_ID: string;
  SYNC_SECRET: string;
  VERCEL_DEPLOY_HOOK_URL: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const env = Deno.env.get.bind(Deno.env);

const notion = new Client({ auth: env("NOTION_TOKEN") });

// Database configurations
const DATABASES = {
  visas: {
    notionDbId: env("NOTION_VISAS_DB_ID")!,
    supabaseTable: "visas",
    mapFunction: mapNotionToVisa
  },
  clkr: {
    notionDbId: env("NOTION_CLKR_DB_ID")!,
    supabaseTable: "clkr_articles", 
    mapFunction: mapNotionToCLKR
  },
  blog: {
    notionDbId: env("NOTION_BLOG_DB_ID")!,
    supabaseTable: "blog_posts",
    mapFunction: mapNotionToBlog
  },
  guides: {
    notionDbId: env("NOTION_GUIDES_DB_ID")!,
    supabaseTable: "guides",
    mapFunction: mapNotionToGuide
  }
};

async function fetchNotionPages(dbId: string, pageId?: string) {
  if (pageId) {
    // Pull puntual por page_id
    const page = await notion.pages.retrieve({ page_id: pageId });
    return [page];
  }
  // Fallback: pull por database (últimos editados, por ejemplo)
  const resp = await notion.databases.query({
    database_id: dbId,
    sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
    page_size: 25
  });
  return resp.results;
}

// Mapping functions for each content type
function mapNotionToVisa(page: any) {
  const id = page.id;
  const lastEdited = page.last_edited_time;
  const props = page.properties || {};
  
  // Extract title
  const titleProp = props.Title || props.Nombre || props.Name;
  let title = "";
  if (titleProp?.type === "title") {
    title = (titleProp.title ?? []).map((t: any) => t.plain_text).join("") ?? "";
  }

  // Generate slug from title
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Extract description
  const descriptionProp = props.Description || props.Descripcion;
  const description = descriptionProp?.rich_text?.map((t: any) => t.plain_text).join("") ?? "";

  // Extract content
  const contentProp = props.Content || props.Contenido;
  const content = contentProp?.rich_text?.map((t: any) => t.plain_text).join("\n") ?? "";

  // Extract category
  const category = props.Category?.select?.name || props.Categoria?.select?.name || "";

  // Extract country
  const country = props.Country?.select?.name || props.Pais?.select?.name || "";

  // Extract countries array
  const countries = props.Countries?.multi_select?.map((c: any) => c.name) || 
                   props.Paises?.multi_select?.map((c: any) => c.name) || [];

  // Extract boolean flags
  const isPopular = props.Popular?.checkbox || props.Destacado?.checkbox || false;

  // Extract other fields
  const beneficiaries = props.Beneficiaries?.rich_text?.map((t: any) => t.plain_text).join("") || 
                       props.Beneficiarios?.rich_text?.map((t: any) => t.plain_text).join("") || "";
  
  const workPermit = props.WorkPermit?.rich_text?.map((t: any) => t.plain_text).join("") || 
                     props.PermisoTrabajo?.rich_text?.map((t: any) => t.plain_text).join("") || "";
  
  const processingTime = props.ProcessingTime?.rich_text?.map((t: any) => t.plain_text).join("") || 
                        props.TiempoProcesamiento?.rich_text?.map((t: any) => t.plain_text).join("") || "";
  
  const requirements = props.Requirements?.rich_text?.map((t: any) => t.plain_text).join("") || 
                      props.Requisitos?.rich_text?.map((t: any) => t.plain_text).join("") || "";
  
  const emoji = props.Emoji?.rich_text?.map((t: any) => t.plain_text).join("") || "";
  const alcance = props.Alcance?.rich_text?.map((t: any) => t.plain_text).join("") || "";
  const duration = props.Duration?.rich_text?.map((t: any) => t.plain_text).join("") || 
                   props.Duracion?.rich_text?.map((t: any) => t.plain_text).join("") || "";

  // Extract language
  const lang = (props.Lang?.select?.name || props.Idioma?.select?.name || 'en').toLowerCase();

  // Extract visa type
  const type = props.Type?.select?.name || props.Tipo?.select?.name || 'Visitor';

  return {
    notion_id: id,
    title,
    slug,
    description,
    content,
    category,
    country,
    countries,
    is_popular: isPopular,
    beneficiaries,
    work_permit: workPermit,
    processing_time: processingTime,
    requirements,
    emoji,
    alcance,
    duration,
    lang,
    type,
    last_edited: lastEdited
  };
}

function mapNotionToCLKR(page: any) {
  const id = page.id;
  const lastEdited = page.last_edited_time;
  const props = page.properties || {};
  
  // Extract title
  const titleProp = props.Name || props.Title || props.Nombre;
  let title = "";
  if (titleProp?.type === "title") {
    title = (titleProp.title ?? []).map((t: any) => t.plain_text).join("") ?? "";
  }

  // Generate slug from title
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Extract description
  const description = props.Description?.rich_text?.map((t: any) => t.plain_text).join("") || 
                     props.Descripcion?.rich_text?.map((t: any) => t.plain_text).join("") || "";

  // Extract content
  const content = props.Content?.rich_text?.map((t: any) => t.plain_text).join("\n") || 
                  props.Contenido?.rich_text?.map((t: any) => t.plain_text).join("\n") || "";

  // Extract module
  const module = props.Module?.select?.name || props.Modulo?.select?.name || "General";

  // Extract language
  const lang = (props.Lang?.select?.name || props.Idioma?.select?.name || 'en').toLowerCase();

  // Extract boolean flags
  const published = props.Published?.checkbox || props.Publicado?.checkbox || false;
  const featured = props.Featured?.checkbox || props.Destacado?.checkbox || false;

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return {
    notion_id: id,
    title,
    slug,
    description,
    content,
    module,
    lang,
    published,
    featured,
    reading_time: readingTime,
    last_edited: lastEdited
  };
}

function mapNotionToBlog(page: any) {
  const id = page.id;
  const lastEdited = page.last_edited_time;
  const props = page.properties || {};
  
  // Extract title
  const titleProp = props.Nombre || props.Title || props.Name;
  let title = "";
  if (titleProp?.type === "title") {
    title = (titleProp.title ?? []).map((t: any) => t.plain_text).join("") ?? "";
  }

  // Generate slug from title
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Extract description
  const description = props.Description?.rich_text?.map((t: any) => t.plain_text).join("") || 
                     props.Descripcion?.rich_text?.map((t: any) => t.plain_text).join("") || "";

  // Extract content
  const content = props.Content?.rich_text?.map((t: any) => t.plain_text).join("\n") || 
                  props.Contenido?.rich_text?.map((t: any) => t.plain_text).join("\n") || "";

  // Extract language
  const lang = (props.Lang?.select?.name || props.Idioma?.select?.name || 'en').toLowerCase();

  // Extract category
  const category = props.Category?.select?.name || props.Categoria?.select?.name || "";

  // Extract author
  const author = props.Author?.rich_text?.map((t: any) => t.plain_text).join("") || 
                 props.Autor?.rich_text?.map((t: any) => t.plain_text).join("") || "";

  // Extract publication date
  const pubDate = props.PubDate?.date?.start || 
                  props.FechaPublicacion?.date?.start || 
                  props.CreatedDate?.date?.start || 
                  lastEdited;

  // Extract boolean flags
  const published = props.Published?.checkbox || props.Publicado?.checkbox || false;
  const featured = props.Featured?.checkbox || props.Destacado?.checkbox || false;

  // Extract image
  const image = props.Image?.rich_text?.map((t: any) => t.plain_text).join("") || 
                props.Imagen?.rich_text?.map((t: any) => t.plain_text).join("") || "";

  return {
    notion_id: id,
    title,
    slug,
    description,
    content,
    lang,
    category,
    author,
    pub_date: pubDate,
    published,
    featured,
    image,
    last_edited: lastEdited
  };
}

function mapNotionToGuide(page: any) {
  const id = page.id;
  const lastEdited = page.last_edited_time;
  const props = page.properties || {};
  
  // Extract title
  const titleProp = props.Title || props.Nombre || props.Name;
  let title = "";
  if (titleProp?.type === "title") {
    title = (titleProp.title ?? []).map((t: any) => t.plain_text).join("") ?? "";
  }

  // Generate slug from title
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Extract description
  const description = props.Description?.rich_text?.map((t: any) => t.plain_text).join("") || 
                     props.Descripcion?.rich_text?.map((t: any) => t.plain_text).join("") || "";

  // Extract content
  const content = props.Content?.rich_text?.map((t: any) => t.plain_text).join("\n") || 
                  props.Contenido?.rich_text?.map((t: any) => t.plain_text).join("\n") || "";

  // Extract language
  const lang = (props.Lang?.select?.name || props.Idioma?.select?.name || 'en').toLowerCase();

  // Extract category
  const category = props.Category?.select?.name || props.Categoria?.select?.name || "";

  // Extract author
  const author = props.Author?.rich_text?.map((t: any) => t.plain_text).join("") || 
                 props.Autor?.rich_text?.map((t: any) => t.plain_text).join("") || "";

  // Extract boolean flags
  const published = props.Published?.checkbox || props.Publicado?.checkbox || false;
  const featured = props.Featured?.checkbox || props.Destacado?.checkbox || false;

  return {
    notion_id: id,
    title,
    slug,
    description,
    content,
    lang,
    category,
    author,
    published,
    featured,
    last_edited: lastEdited
  };
}

async function upsertRows(tableName: string, rows: any[]) {
  const url = `${env("SUPABASE_URL")}/rest/v1/${tableName}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "apikey": env("SUPABASE_SERVICE_ROLE_KEY")!,
      "Authorization": `Bearer ${env("SUPABASE_SERVICE_ROLE_KEY")}`,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates"
    },
    body: JSON.stringify(rows)
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Supabase upsert failed for ${tableName}: ${resp.status} ${txt}`);
  }
}

async function triggerVercelDeploy() {
  const hook = env("VERCEL_DEPLOY_HOOK_URL");
  if (!hook) return;
  const r = await fetch(hook, { method: "POST" });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Vercel deploy hook failed: ${r.status} ${t}`);
  }
}

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    // Flexible auth: accepts SYNC_SECRET, service_role/anon via Authorization or apikey headers, or ?secret=
    const url = new URL(req.url);
    const authHeader = req.headers.get("authorization") ?? "";
    const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const apiKeyHeader = req.headers.get("apikey") ?? req.headers.get("x-api-key") ?? "";
    const secretParam = url.searchParams.get("secret") ?? "";

    const validTokens = [
      env("SYNC_SECRET") || "",
      env("SUPABASE_SERVICE_ROLE_KEY") || "",
      env("SUPABASE_ANON_KEY") || ""
    ].filter(Boolean) as string[];

    const presented = [bearer, apiKeyHeader, secretParam].filter(Boolean) as string[];
    const isAuthorized = presented.some((t) => validTokens.includes(t));

    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { content_type, page_id } = await req.json().catch(() => ({ }));
    
    // If content_type is specified, sync only that type
    if (content_type && DATABASES[content_type as keyof typeof DATABASES]) {
      const dbConfig = DATABASES[content_type as keyof typeof DATABASES];
      const pages = await fetchNotionPages(dbConfig.notionDbId, page_id);
      
      if (!pages.length) {
        return new Response(JSON.stringify({ ok: true, msg: `No ${content_type} pages to sync` }), { status: 200 });
      }

      const rows = pages.map(dbConfig.mapFunction);
      await upsertRows(dbConfig.supabaseTable, rows);
      
      return new Response(JSON.stringify({ 
        ok: true, 
        content_type, 
        synced: rows.length 
      }), { status: 200 });
    }

    // If no content_type specified, sync all databases
    const results = [] as Array<Record<string, unknown>>;
    for (const [contentType, dbConfig] of Object.entries(DATABASES)) {
      try {
        const pages = await fetchNotionPages(dbConfig.notionDbId, page_id);
        if (pages.length > 0) {
          const rows = pages.map(dbConfig.mapFunction);
          await upsertRows(dbConfig.supabaseTable, rows);
          results.push({ content_type: contentType, synced: rows.length });
        }
      } catch (error) {
        console.error(`Error syncing ${contentType}:`, error);
        results.push({ content_type: contentType, error: (error as Error).message });
      }
    }

    // Trigger Vercel deploy after all syncs
    await triggerVercelDeploy();

    return new Response(JSON.stringify({ 
      ok: true, 
      results 
    }), { status: 200 });

  } catch (err) {
    console.error("Sync error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
