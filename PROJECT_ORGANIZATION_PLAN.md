# Capital M Law - Project Organization Plan

## 🎯 Overview
This document outlines a comprehensive plan to organize, optimize, and refactor the Capital M Law project to improve maintainability, performance, and code quality.

## 📊 Current State Analysis

### Critical Issues Identified
- **34 TypeScript errors** preventing clean builds (property name mismatches, import path issues, implicit any, prop type mismatches)
- **121 warnings** about unused imports and variables
- **Component duplication** between English and Spanish versions
- **Inconsistent naming conventions**
- **Large, complex components** that need refactoring
- **Missing TypeScript** in many components

### Performance Issues
- **Bundle size**: Unused dependencies and code
- **Image optimization**: Not using Astro's image optimization
- **Code splitting**: No lazy loading implementation
- **Caching**: No proper caching strategies

## 🛠️ Phase 1: Critical Fixes (Week 1)

### Day 1-2: TypeScript Errors
- [x] Fix Layout component props interface
- [x] Add proper type annotations to VisasSectionLegacy
- [x] Remove deprecated HTML attributes
- [ ] Fix property name mismatches in country data usage
- [ ] Update all import paths for countries data
- [ ] Fix remaining TypeScript errors
- [ ] Add proper error boundaries

### Day 3-4: Unused Code Cleanup
- [x] Remove unused React imports
- [x] Remove unused icon imports
- [ ] Remove unused variables and functions
- [ ] Clean up unused dependencies
- [ ] Remove console.log statements

### Day 5-7: Build Configuration
- [ ] Fix missing content directories
- [ ] Resolve Notion API integration issues
- [ ] Update deprecated Node.js modules
- [ ] Fix build warnings

## 🏗️ Phase 2: Code Quality (Week 2-3)

### Component Architecture
- [ ] **Standardize component structure**
  ```
  components/
  ├── ui/              # Reusable UI components
  ├── features/        # Feature-specific components
  ├── layouts/         # Layout components
  ├── shared/          # Shared utilities
  └── pages/           # Page-specific components
  ```

- [ ] **Create component templates**
  - Standardized prop interfaces
  - Consistent error handling
  - Proper TypeScript types
  - Accessibility features

### TypeScript Migration
- [ ] Convert all `.jsx` files to `.tsx`
- [ ] Add proper type definitions
- [ ] Create shared type libraries
- [ ] Implement strict TypeScript configuration

### Code Splitting
- [ ] Implement lazy loading for components
- [ ] Add dynamic imports for heavy components
- [ ] Optimize bundle splitting
- [ ] Add loading states

## ⚡ Phase 3: Performance Optimization (Week 4-5)

### Image Optimization
- [ ] Implement Astro's image optimization
- [ ] Convert images to WebP format
- [ ] Add responsive image sizes
- [ ] Implement lazy loading for images

### Bundle Optimization
- [ ] Remove unused dependencies
- [ ] Implement tree shaking
- [ ] Optimize CSS delivery
- [ ] Add compression

### Caching Strategy
- [ ] Implement service worker
- [ ] Add proper cache headers
- [ ] Implement CDN caching
- [ ] Add offline support

## 🎨 Phase 4: User Experience (Week 6-7)

### Accessibility
- [ ] Add ARIA labels
- [ ] Implement keyboard navigation
- [ ] Add screen reader support
- [ ] Ensure color contrast compliance

### SEO Optimization
- [ ] Implement structured data
- [ ] Add meta tag management
- [ ] Optimize for Core Web Vitals
- [ ] Add sitemap generation

### Internationalization
- [ ] Consolidate duplicate components
- [ ] Implement proper i18n strategy
- [ ] Add language switching
- [ ] Optimize for multiple locales

## 🧪 Phase 5: Testing & Quality Assurance (Week 8)

### Testing Strategy
- [ ] Add unit tests for critical components
- [ ] Implement integration tests
- [ ] Add end-to-end tests
- [ ] Set up testing CI/CD

### Code Quality Tools
- [ ] Add ESLint configuration
- [ ] Implement Prettier formatting
- [ ] Add Husky pre-commit hooks
- [ ] Set up automated code reviews

## 🚀 Phase 6: Deployment & Monitoring (Week 9-10)

### CI/CD Pipeline
- [ ] Set up automated testing
- [ ] Implement staging environment
- [ ] Add deployment automation
- [ ] Set up rollback procedures

### Monitoring & Analytics
- [ ] Add error tracking
- [ ] Implement performance monitoring
- [ ] Add user analytics
- [ ] Set up alerting

## 📋 Implementation Checklist

### Immediate Actions (Today)
- [x] Fix TypeScript errors in Layout component
- [x] Remove unused React imports
- [x] Fix deprecated HTML attributes
- [ ] Fix property name mismatches in country data usage
- [ ] Update all import paths for countries data
- [ ] Run cleanup script
- [ ] Test build process (attempted, failed due to new errors)

### Week 1 Goals
- [ ] Zero TypeScript errors (critical for progress)
- [ ] Zero unused imports
- [ ] Clean build process
- [ ] Basic component structure

### Week 2 Goals
- [ ] Complete TypeScript migration
- [ ] Implement code splitting
- [ ] Add error boundaries
- [ ] Optimize bundle size

### Week 3 Goals
- [ ] Implement image optimization
- [ ] Add caching strategies
- [ ] Improve performance metrics
- [ ] Add accessibility features

### Month 1 Goals
- [ ] Complete refactoring
- [ ] Implement testing
- [ ] Set up CI/CD
- [ ] Add monitoring

## 🎯 Success Metrics

### Code Quality
- **TypeScript Coverage**: 100%
- **Test Coverage**: >90%
- **Linting Errors**: 0
- **Unused Code**: 0

### Performance
- **Initial Load Time**: <2s
- **Bundle Size**: <500KB
- **Core Web Vitals**: All green
- **Lighthouse Score**: >90

### User Experience
- **Accessibility**: WCAG 2.1 AA compliant
- **SEO**: 100% structured data
- **Mobile Performance**: Optimized
- **Internationalization**: Complete

## 📚 Resources & Tools

### Development Tools
- **TypeScript**: For type safety
- **ESLint**: For code quality
- **Prettier**: For code formatting
- **Husky**: For git hooks

### Testing Tools
- **Vitest**: For unit testing
- **Playwright**: For E2E testing
- **Testing Library**: For component testing

### Performance Tools
- **Lighthouse**: For performance audits
- **WebPageTest**: For detailed analysis
- **Bundle Analyzer**: For bundle optimization

### Monitoring Tools
- **Sentry**: For error tracking
- **Vercel Analytics**: For performance monitoring
- **Google Analytics**: For user analytics

## 🔄 Maintenance Plan

### Weekly Tasks
- [ ] Review and update dependencies
- [ ] Check for security vulnerabilities
- [ ] Monitor performance metrics
- [ ] Review error logs

### Monthly Tasks
- [ ] Update documentation
- [ ] Review and optimize code
- [ ] Update testing strategy
- [ ] Plan new features

### Quarterly Tasks
- [ ] Major dependency updates
- [ ] Architecture review
- [ ] Performance audit
- [ ] Security audit

## 📞 Support & Communication

### Team Responsibilities
- **Lead Developer**: Overall project coordination
- **Frontend Developer**: Component development
- **Backend Developer**: API integration
- **DevOps Engineer**: Deployment and monitoring

### Communication Channels
- **Daily Standups**: Progress updates
- **Weekly Reviews**: Milestone check-ins
- **Monthly Planning**: Strategy alignment
- **Quarterly Reviews**: Long-term planning

## Current Structure
- **New Data Location:**
  - Countries: `src/data/countries.ts`
  - Visas: `src/data/visas.ts`
- **Filter Logic:**
  - All visa/country filtering should use pure functions in `src/filters/visaFilters.ts`.
- **UI Components:**
  - New filter UI: `src/components/VisaFilterWidget.tsx`

## Migration Steps
1. **Replace all legacy visa/country filter code** with the new system in all pages/components.
2. **Remove or archive old data files** (e.g., `src/content/countries/Countries.ts`).
3. **Type all remaining legacy components** (especially in real estate, reviews, and visa services).
4. **Systematically resolve all implicit any/never[] errors.**
5. **Add tests for new filter logic and data (optional).**

## Next Actions
- Prioritize refactoring files with the most errors (see analysis report).
- Ensure all new code is fully typed and uses the new data/filter structure.
- Document any new patterns or conventions in the README.

## Current Status
- Blog, review, visa filter, and real estate filter components are now fully typed and type safe.
- New data model for countries/visas is in use in all new code.

## Next Steps
1. Refactor and type all core/common components (Accordion, AnimatedNewsPanel, SocialSharing, etc.)
2. Update or remove legacy visa/country imports and migrate to new data model
3. Fix prop type mismatches in page-level and layout components
4. Continue systematic migration until all errors are resolved
5. Remove or archive all legacy, untyped, or unused files

## Current Build Status
- **Build is currently broken** due to property name mismatches and import path errors for 'countries'.

## Next Steps
- Fix all property name mismatches for country data
- Update all import paths for 'countries' in every file that uses it
- Re-run the build after making these fixes

---

*This plan is a living document and should be updated as the project evolves.* 