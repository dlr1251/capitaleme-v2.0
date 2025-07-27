/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
    readonly SUPABASE_URL: string
    readonly SUPABASE_SERVICE_ROLE_KEY: string
    readonly NOTION_API_KEY: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

declare module "*.json" {
  const value: any;
  export default value;
}