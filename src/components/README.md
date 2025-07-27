# Components Directory Structure

This directory contains all reusable components for the CapitalE website. The structure is organized by functionality, language, and clear naming conventions.

## 📁 Directory Structure

```
src/components/
├── README.md                    # This file - component organization guide
├── about/                       # About page components (en/es)
│   ├── en/
│   └── es/
├── blog/                        # Blog components (en/es)
│   ├── en/
│   └── es/
├── clkr/                        # CLKR (Colombian Legal Knowledge Repository) components (en/es)
│   ├── en/
│   └── es/
├── contact/                     # Contact page components (en/es)
│   ├── en/
│   └── es/
├── content/                     # Content rendering components
│   └── NotionBlock.astro        # Notion content block renderer
├── core/                        # Core application components
│   ├── common/                  # Common utility components (e.g., SocialSharing, Accordions)
│   ├── layout/                  # Layout-related components (Navbar, Footer, etc.)
│   └── navigation/              # Navigation components (Breadcrumb, TOC, etc.)
├── home/                        # Home page components (en/es)
│   ├── en/
│   └── es/
├── real-estate/                 # Real estate components (en/es)
│   ├── en/
│   └── es/
├── shared/                      # Shared components across languages (AnimatedLogoIcon, InfoSection, etc.)
├── terms/                       # Terms & conditions components (en/es)
│   ├── en/
│   └── es/
├── ui/                          # UI components (design system)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── cards/
│   └── forms/
├── visas/                       # Visa-related components (en/es)
│   ├── en/
│   └── es/
```

## 🏗️ Organization Principles

### 1. **Hierarchical Structure**
- **core/**: Essential application components (navbar, footer, etc.)
- **content/**: Content rendering and display components
- **features/**: Feature-specific components organized by domain
- **pages/**: Page-specific components organized by page type
- **ui/**: Reusable UI components (design system)
- **shared/**: Components shared across languages

### 2. **Naming Conventions**
- **PascalCase** for component files: `ComponentName.tsx`
- **Descriptive names** that clearly indicate purpose
- **Consistent suffixes**: 
  - `.tsx` for React components
  - `.astro` for Astro components
  - `.jsx` for legacy React components (to be migrated)

### 3. **File Organization**
- **One component per file**
- **Index files** for easy imports
- **Type definitions** in the same file or separate `.d.ts` files
- **Tests** alongside components (when applicable)

### 4. **Component Categories**

#### Core Components (`core/`)
Essential components that are used throughout the application:
- Layout components (navbar, footer, etc.)
- Navigation components (breadcrumbs, TOC, etc.)
- Common utility components (accordions, buttons, etc.)

#### Content Components (`content/`)
Components responsible for rendering and displaying content:
- Notion content renderers
- Content display components

#### Feature Components (`features/`)
Domain-specific components organized by business features:
- **blog/**: Blog-related functionality
- **real-estate/**: Real estate features
- **visa-services/**: Visa service features
- **clkr/**: CLKR repository features
- **resources/**: Resource tools and utilities

#### Page Components (`pages/`)
Components specific to particular pages:
- **home/**: Home page components
- **about/**: About page components
- **contact/**: Contact page components
- **services/**: Services page components

#### UI Components (`ui/`)
Reusable design system components:
- **buttons/**: Button variants
- **cards/**: Card components
- **forms/**: Form elements
- **navigation/**: Navigation UI elements
- **layout/**: Layout utilities
- **feedback/**: User feedback components

#### Shared Components (`shared/`)
Components shared across different languages or sections:
- Language-agnostic components
- Common UI patterns

## 🔄 Migration Strategy

### Phase 1: Create New Structure
1. Create new directory structure
2. Move components to appropriate locations
3. Update imports across the application

### Phase 2: Standardize Components
1. Convert `.jsx` files to `.tsx` with proper TypeScript
2. Standardize component interfaces
3. Add proper prop types and documentation

### Phase 3: Optimize and Refactor
1. Remove duplicate components
2. Create shared components where appropriate
3. Optimize component performance

## 📝 Component Guidelines

### 1. **Component Structure**
```typescript
// ComponentName.tsx
import React from 'react';

interface ComponentNameProps {
  // Define props interface
}

export const ComponentName: React.FC<ComponentNameProps> = ({ 
  // Destructure props
}) => {
  // Component logic
  
  return (
    // JSX
  );
};
```

### 2. **Import Organization**
```typescript
// External libraries
import React from 'react';
import { motion } from 'framer-motion';

// Internal components
import { Button } from '@/components/ui/buttons/Button';
import { Card } from '@/components/ui/cards/Card';

// Types and utilities
import type { ComponentProps } from '@/types';
import { formatDate } from '@/utils/date';
```

### 3. **File Naming**
- Use PascalCase for component files
- Use descriptive names that indicate purpose
- Include component type in name when necessary (e.g., `VisaCard.tsx`)

## 🚀 Usage Examples

### Importing Components
```typescript
// Core components
import { Navbar } from '@/components/core/layout/Navbar';
import { Footer } from '@/components/core/layout/Footer';

// Feature components
import { PropertyCard } from '@/components/features/real-estate/PropertyCard';
import { VisaCard } from '@/components/features/visa-services/VisaCard';

// UI components
import { Button } from '@/components/ui/buttons/Button';
import { Card } from '@/components/ui/cards/Card';

// Shared components
import { AnimatedLogoIcon } from '@/components/shared/AnimatedLogoIcon';
```

### Component Composition
```typescript
// pages/home/index.astro
import { HomePageHero } from '@/components/pages/home/HomePageHero';
import { ServicesGrid } from '@/components/pages/home/ServicesGrid';
import { ReviewsSection } from '@/components/pages/home/ReviewsSection';
```

## 📋 Maintenance Checklist

- [ ] All components follow naming conventions
- [ ] Components are in appropriate directories
- [ ] Imports are updated across the application
- [ ] TypeScript types are properly defined
- [ ] Components are properly documented
- [ ] No duplicate components exist
- [ ] Performance is optimized
- [ ] Tests are written (when applicable)

## 🔧 Development Workflow

1. **Creating New Components**
   - Determine the appropriate category
   - Follow naming conventions
   - Add proper TypeScript types
   - Document the component

2. **Modifying Existing Components**
   - Update imports if moving files
   - Maintain backward compatibility
   - Update documentation

3. **Refactoring Components**
   - Move to appropriate directory
   - Update all imports
   - Test functionality
   - Update documentation

This structure provides a clear, scalable, and maintainable organization for all components in the CapitalE website. 