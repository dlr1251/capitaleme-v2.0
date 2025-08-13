# CapitalEme Website - Technical Documentation

## Project Overview

CapitalEme is a multilingual (English/Spanish) business website built with **Astro 5.6.1** and **React 19.1.0**, featuring content management through Notion, real-time data synchronization with Supabase, and deployment on Vercel. The project serves as a comprehensive platform for business services including visa consulting, real estate, and CLKR (Colombia Legal Knowledge Repository) modules.

## 🏗️ Architecture & Tech Stack

### Core Technologies
- **Framework**: Astro 5.6.1 (SSR mode)
- **Frontend**: React 19.1.0 + TypeScript 5.8.3
- **Styling**: Tailwind CSS 3.0.24 + Flowbite
- **Database**: Supabase (PostgreSQL)
- **CMS**: Notion API integration
- **Deployment**: Vercel
- **Language**: TypeScript with strict mode

### Key Integrations
- **Notion**: Content management and synchronization
- **Supabase**: Database and real-time features
- **Algolia**: Search functionality
- **SendGrid**: Email services
- **Google APIs**: Analytics and services
- **Vercel Analytics**: Performance monitoring

## 📁 Project Structure

```
capitaleme/
├── src/
│   ├── components/          # React and Astro components
│   │   ├── about/          # About page components
│   │   ├── blog/           # Blog functionality
│   │   ├── clkr/           # CLKR module components
│   │   ├── contact/        # Contact page components
│   │   ├── core/           # Core layout components
│   │   │   ├── layout/     # Navbar, Footer, etc.
│   │   │   └── navigation/ # Navigation components
│   │   ├── home/           # Homepage components (en/es)
│   │   ├── real-estate/    # Real estate components
│   │   ├── shared/         # Reusable components
│   │   ├── terms/          # Terms and conditions
│   │   ├── ui/             # UI components (shadCN style)
│   │   └── visas/          # Visa-related components
│   ├── content/            # Content files (MDX)
│   │   ├── authors/        # Author information
│   │   ├── posts/          # Blog posts
│   │   ├── properties/     # Real estate properties
│   │   └── visas/          # Visa content
│   ├── context/            # React contexts
│   ├── data/               # Static data and types
│   ├── layouts/            # Astro page layouts
│   ├── lib/                # Utility libraries
│   ├── pages/              # Astro pages (routing)
│   │   ├── en/             # English routes
│   │   └── es/             # Spanish routes
│   ├── server/             # Server-side utilities
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper utilities
├── public/                 # Static assets
├── scripts/                # Build and sync scripts
└── supabase-debug.log      # Database debugging logs
```

## 🚀 Getting Started

### Prerequisites
- **Node.js**: >=18.20.8
- **npm** or **yarn**
- **Supabase** account and project
- **Notion** API access
- **Vercel** account (for deployment)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# Notion Configuration
NOTION_API_KEY=your_notion_integration_token
NOTION_VISAS_DATABASE_ID=your_visas_database_id
NOTION_CLKR_DATABASE_ID=your_clkr_database_id

# Email Services
SENDGRID_API_KEY=your_sendgrid_api_key

# Google Services
GOOGLE_ANALYTICS_ID=your_ga_id
GOOGLE_ADS_ID=your_gads_id

# Other Services
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_SEARCH_KEY=your_search_key
ALGOLIA_ADMIN_KEY=your_admin_key
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd capitaleme

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start dev server
npm run start            # Alias for dev

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Content Synchronization
npm run sync-clkr        # Sync CLKR content from Notion
npm run sync-visas       # Sync visa content from Notion
npm run sync-notion-algolia  # Sync content to Algolia

# Testing & Debugging
npm run test-supabase    # Test Supabase connection
npm run optimize         # Performance optimization
```

## 🌐 Internationalization (i18n)

The project supports **English (en)** and **Spanish (es)** with the following structure:

- **Routing**: `/en/` and `/es/` prefixes
- **Content**: Language-specific folders in `src/content/`
- **Components**: Language-aware components in `src/components/home/en/` and `src/components/home/es/`
- **Context**: React context for language management (`src/context/LanguageContext.tsx`)

### Language Switching
- URL-based routing (`/en/about`, `/es/about`)
- React context for component-level language state
- Automatic language detection from URL

## 🗄️ Database Schema

### Supabase Tables

#### CLKR Articles
```sql
- id: uuid (primary key)
- notion_id: text (unique, from Notion page ID)
- title: text
- slug: text (unique)
- description: text
- content: text (full article content)
- module: text
- lang: text (en/es)
- reading_time: integer
- last_edited: timestamp
- created_at: timestamp
- updated_at: timestamp
```

#### Visas
```sql
- id: uuid (primary key)
- notion_id: text (unique, from Notion page ID)
- title: text
- slug: text (unique)
- description: text
- content: text
- category: text
- country: text
- countries: text[]
- is_popular: boolean
- beneficiaries: text
- work_permit: text
- processing_time: text
- requirements: text
- emoji: text
- alcance: text
- duration: text
- lang: text (en/es)
- last_edited: timestamp
- created_at: timestamp
- updated_at: timestamp
```

## 🔄 Content Synchronization

### Notion to Supabase Sync

The project automatically synchronizes content from Notion to Supabase using the `syncNotionToSupabase.server.js` script:

1. **CLKR Articles**: Legal knowledge repository content
2. **Visa Information**: Immigration and visa details
3. **Blog Posts**: Marketing and informational content

### Sync Process
1. Fetch content from Notion databases
2. Transform and validate data
3. Upsert to Supabase tables
4. Handle conflicts and updates
5. Log synchronization results

## 🎨 UI/UX Guidelines

### Design System
- **Colors**: Primary (#16345F), Secondary (#00AA81), Tertiary (#9BB8E0)
- **Typography**: Outfit font family
- **Framework**: Tailwind CSS with Flowbite components
- **Style**: Minimalistic, shadCN-inspired design

### Component Guidelines
- Use `@heroicons/react` for icons
- Maintain consistent color schemes per module
- Follow shadCN styling patterns
- Implement responsive design for all components

### Animation
- Floating animations for visual elements
- Framer Motion for complex interactions
- CSS keyframes for simple animations

## 📱 Component Architecture

### React Components
- **Functional components** with TypeScript
- **Hooks** for state management
- **Context** for global state (language, theme)
- **Props interfaces** for type safety

### Astro Components
- **Server-side rendering** for performance
- **Hybrid rendering** (React + Astro)
- **MDX support** for content management

### Component Categories
1. **Core Components**: Layout, navigation, common UI
2. **Feature Components**: Blog, visas, real estate, CLKR
3. **Shared Components**: Reusable across features
4. **UI Components**: Buttons, forms, cards, etc.

## 🚀 Performance Optimizations

### Build Optimizations
- **Code splitting** with manual chunks
- **Tree shaking** for unused code removal
- **Image optimization** with Astro's image handling
- **CSS purging** with Tailwind

### Runtime Optimizations
- **Lazy loading** for components
- **Virtual scrolling** for large lists
- **Debounced search** for better UX
- **Caching strategies** for API calls

## 🔍 Search & Discovery

### Algolia Integration
- **Real-time search** across all content
- **Faceted search** by category, language, etc.
- **Typo tolerance** and relevance ranking
- **Analytics** and search insights

### Search Features
- **Global search** across all content types
- **Filtered search** by content category
- **Language-aware** search results
- **Search suggestions** and autocomplete

## 📊 Analytics & Monitoring

### Vercel Analytics
- **Web vitals** monitoring
- **Performance metrics** tracking
- **User behavior** analysis
- **Real-time** dashboard

### Google Analytics
- **Page views** and user sessions
- **Conversion tracking** for business goals
- **Audience insights** and demographics
- **Custom events** for business metrics

## 🚀 Deployment

### Vercel Configuration
- **Automatic deployments** from Git
- **Preview deployments** for pull requests
- **Edge functions** for server-side logic
- **CDN** for global performance

### Build Process
1. **Type checking** with TypeScript
2. **Astro build** with optimizations
3. **Static asset** optimization
4. **Deployment** to Vercel edge network

## 🧪 Testing & Quality Assurance

### Code Quality
- **TypeScript strict mode** enabled
- **ESLint** for code linting
- **Prettier** for code formatting
- **Git hooks** for pre-commit checks

### Testing Strategy
- **Component testing** with React Testing Library
- **Integration testing** for API endpoints
- **E2E testing** for critical user flows
- **Performance testing** with Lighthouse

## 🔧 Troubleshooting

### Common Issues

#### Supabase Connection
```bash
# Check environment variables
npm run test-supabase

# Verify database schema
# Check supabase-debug.log for errors
```

#### Notion Sync Issues
```bash
# Verify API key permissions
# Check database IDs in environment
# Run sync scripts manually
npm run sync-visas
npm run sync-clkr
```

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run build
```

### Debug Scripts
- `debug-clkr.astro` - CLKR module debugging
- `debug-visas.astro` - Visa system debugging
- `test-supabase.js` - Database connection testing

## 📚 Development Resources

### Documentation
- [Astro Documentation](https://docs.astro.build/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Notion API Documentation](https://developers.notion.com/)

### Key Dependencies
- **Astro**: Modern static site generator
- **React**: UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase**: Open-source Firebase alternative
- **Notion API**: Content management integration

## 🤝 Contributing Guidelines

### Code Standards
- **TypeScript strict mode** compliance
- **Component-based architecture** patterns
- **Responsive design** for all components
- **Accessibility** best practices
- **Performance** optimization focus

### Git Workflow
1. **Feature branches** from main
2. **Pull request** reviews required
3. **Type checking** must pass
4. **Build verification** before merge
5. **Deployment** to staging environment

### Code Review Checklist
- [ ] TypeScript types are correct
- [ ] Component follows design system
- [ ] Responsive design implemented
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Tests added for new functionality

## 📞 Support & Contact

For technical questions or development support:
- **Repository**: Check issues and discussions
- **Documentation**: Review this README and code comments
- **Team**: Contact the development team lead

---

**Last Updated**: December 2024  
**Version**: 0.0.1  
**Maintainer**: Development Team
