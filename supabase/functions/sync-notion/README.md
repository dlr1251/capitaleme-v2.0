# Supabase Edge Function: Sync Notion to Supabase

Esta edge function sincroniza contenido desde Notion hacia las tablas de Supabase para visas, CLKR, blog y guides.

## Configuración

### Variables de Entorno

Configura las siguientes variables de entorno en tu proyecto de Supabase:

```bash
# Notion API
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Notion Database IDs
NOTION_VISAS_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_CLKR_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  
NOTION_BLOG_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_GUIDES_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Seguridad
SYNC_SECRET=tu_secreto_super_seguro_aqui

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Vercel (opcional)
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
```

### Estructura de Tablas Supabase

La función espera las siguientes tablas en Supabase:

#### Tabla `visas`
```sql
CREATE TABLE visas (
  id SERIAL PRIMARY KEY,
  notion_id TEXT UNIQUE,
  title TEXT,
  slug TEXT,
  description TEXT,
  content TEXT,
  category TEXT,
  country TEXT,
  countries TEXT[],
  is_popular BOOLEAN DEFAULT FALSE,
  beneficiaries TEXT,
  work_permit TEXT,
  processing_time TEXT,
  requirements TEXT,
  emoji TEXT,
  alcance TEXT,
  duration TEXT,
  lang TEXT DEFAULT 'en',
  type TEXT DEFAULT 'Visitor',
  last_edited TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla `clkr_articles`
```sql
CREATE TABLE clkr_articles (
  id SERIAL PRIMARY KEY,
  notion_id TEXT UNIQUE,
  title TEXT,
  slug TEXT,
  description TEXT,
  content TEXT,
  module TEXT,
  lang TEXT DEFAULT 'en',
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  reading_time INTEGER,
  last_edited TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla `blog_posts`
```sql
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  notion_id TEXT UNIQUE,
  title TEXT,
  slug TEXT,
  description TEXT,
  content TEXT,
  lang TEXT DEFAULT 'en',
  category TEXT,
  author TEXT,
  pub_date TIMESTAMP WITH TIME ZONE,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  image TEXT,
  last_edited TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla `guides`
```sql
CREATE TABLE guides (
  id SERIAL PRIMARY KEY,
  notion_id TEXT UNIQUE,
  title TEXT,
  slug TEXT,
  description TEXT,
  content TEXT,
  lang TEXT DEFAULT 'en',
  category TEXT,
  author TEXT,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  last_edited TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Uso

### Sincronizar Todo
```bash
curl -X POST https://tu-proyecto.supabase.co/functions/v1/sync-notion \
  -H "Authorization: Bearer tu_secreto_super_seguro_aqui" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Sincronizar Tipo Específico
```bash
curl -X POST https://tu-proyecto.supabase.co/functions/v1/sync-notion \
  -H "Authorization: Bearer tu_secreto_super_seguro_aqui" \
  -H "Content-Type: application/json" \
  -d '{"content_type": "visas"}'
```

### Sincronizar Página Específica
```bash
curl -X POST https://tu-proyecto.supabase.co/functions/v1/sync-notion \
  -H "Authorization: Bearer tu_secreto_super_seguro_aqui" \
  -H "Content-Type: application/json" \
  -d '{"content_type": "visas", "page_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"}'
```

## Respuestas

### Éxito
```json
{
  "ok": true,
  "results": [
    {"content_type": "visas", "synced": 5},
    {"content_type": "clkr", "synced": 12},
    {"content_type": "blog", "synced": 3},
    {"content_type": "guides", "synced": 8}
  ]
}
```

### Error
```json
{
  "error": "Descripción del error"
}
```

## Despliegue

1. Instala la CLI de Supabase:
```bash
npm install -g supabase
```

2. Inicia sesión en Supabase:
```bash
supabase login
```

3. Despliega la función:
```bash
supabase functions deploy sync-notion
```

## Webhooks de Notion

Para sincronización automática, configura webhooks en Notion que apunten a esta función con el secreto configurado.
