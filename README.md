# Capital M Law Website (Astro)

## 🚀 Project Overview
This is a modern, multilingual legal services website built with [Astro](https://astro.build), using content collections, Supabase, and a clean, maintainable architecture. All data fetching is standardized, and static assets are served from the public directory.

## 📁 Directory Structure
```
/
├── public/
│   └── images/           # All static images (team, logo, blog, etc.)
├── src/
│   ├── assets/           # (Legacy) - All images should be in public/
│   ├── components/       # Astro/React UI components
│   ├── content/          # Astro content collections (authors, properties, blog, guides)
│   ├── layouts/          # Page layouts
│   ├── lib/              # Core data utilities (menuData.js, supabase.js, etc.)
│   ├── pages/            # Astro pages (routes)
│   ├── styles/           # CSS
│   ├── utils/            # Utility helpers (teamData.js, notion.js, etc.)
│   └── types/            # TypeScript types
├── scripts/              # Project scripts (cleanup, sync, etc.)
├── package.json
└── README.md
```

## 🔄 Data Flow & Best Practices
- **Single Source of Truth:** All menu and page data is fetched via `getAllMenuData` from `src/lib/menuData.js`.
- **Content Collections:** Team, authors, properties, blog, and guides are managed in `src/content/` and loaded dynamically using Astro's content collections API.
- **Supabase:** Used for dynamic data (e.g., CLKR articles, visas) via `src/lib/supabase.js`.
- **Static Assets:** All images are in `public/images/` and referenced with absolute paths (e.g., `/images/team/mafeduarte.jpg`).
- **Type Safety:** All components and data helpers use explicit TypeScript types and required props.
- **No Legacy Utilities:** All legacy/duplicate data utilities and scripts have been removed.

## 🧑‍💻 Developer Workflow
- Run `npm install` to install dependencies.
- Use `npm run dev` for local development.
- Use `npm run build` to build for production.
- All data fetching should use `getAllMenuData` or Astro content collections.
- Add new content (team, blog, etc.) as MDX files in `src/content/`.
- Add new images to `public/images/` and reference with absolute paths.
- Use explicit types for all props and data structures.

## 🧹 Maintenance & Contribution Guidelines
- Remove unused files, scripts, and legacy directories regularly.
- Keep all imports explicit (with file extensions) and up to date.
- Run a linter/formatter before committing (`npm run lint` if configured).
- Document any new utilities or data flows in this README.
- See `/scripts/` for project maintenance scripts.

## 📚 Learn More
- [Astro Documentation](https://docs.astro.build)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Supabase Documentation](https://supabase.com/docs)

---
For questions or contributions, please open an issue or pull request.
