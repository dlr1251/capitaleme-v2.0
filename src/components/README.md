# Components Directory Structure

This directory contains all reusable components for the CapitalE website. The structure is organized by functionality and follows clear naming conventions.

## 📁 Directory Structure

```
src/components/
├── README.md                    # This file - component organization guide
├── core/                        # Core application components
│   ├── layout/                  # Layout-related components
│   │   ├── Navbar.tsx          # Main navigation bar
│   │   ├── NavbarMobile.tsx    # Mobile navigation
│   │   ├── Footer.astro        # Site footer
│   │   └── ContactBar.astro    # Contact information bar
│   ├── navigation/              # Navigation components
│   │   ├── BreadCrumb.astro    # Breadcrumb navigation
│   │   ├── TableOfContents.astro # Table of contents
│   │   ├── MobileTOC.astro     # Mobile table of contents
│   │   └── ResourcesTOC.jsx    # Resources table of contents
│   └── common/                  # Common utility components
│       ├── Accordion.jsx        # Reusable accordion component
│       ├── AccordionFAQ.jsx     # FAQ accordion component
│       ├── CalendlyButton.jsx   # Calendly integration button
│       ├── WhatsAppButton.astro # WhatsApp contact button
│       ├── SocialSharing.jsx    # Social media sharing
│       ├── AnimatedNewsPanel.jsx # Animated news panel
│       └── GoogleTag.astro      # Google Analytics tag
├── content/                     # Content rendering components
│   ├── NotionBlock.astro       # Notion content block renderer
│   └── TableOfContentsHeading.astro # Table of contents headings
├── features/                    # Feature-specific components
│   ├── blog/                    # Blog-related components
│   │   ├── BlogCard.tsx        # Blog post card
│   │   ├── BlogExplorer.tsx    # Blog post explorer
│   │   ├── BlogPageHero.tsx    # Blog page hero section
│   │   ├── BlogPageLatest.astro # Latest blog posts section
│   │   └── CoverImage.tsx      # Blog cover image component
│   ├── real-estate/             # Real estate components
│   │   ├── PropertyCard.tsx    # Property listing card
│   │   ├── PropertyGallery.tsx # Property image gallery
│   │   ├── PropertyFilters.tsx # Property search filters
│   │   ├── Calculator.tsx      # Real estate calculator
│   │   ├── CLKRRepository.tsx  # CLKR repository component
│   │   ├── RealEstateGuide.tsx # Real estate guide
│   │   ├── SellerFeatures.tsx  # Seller features section
│   │   └── PropertySearchService.tsx # Property search service
│   ├── visa-services/           # Visa service components
│   │   ├── VisaCard.tsx        # Visa information card
│   │   ├── VisaFilterWidget.tsx # Visa filtering widget
│   │   ├── AllVisaFilterWidget.tsx # All visa filter widget
│   │   ├── ConsultationSection.tsx # Visa consultation section
│   │   ├── ServiceProcess.tsx  # Service process steps
│   │   ├── VisasHero.tsx       # Visa services hero section
│   │   ├── LatestBlogSection.tsx # Latest blog section for visas
│   │   └── ApostilleCountries.tsx # Apostille countries component
│   ├── clkr/                    # CLKR (Colombian Legal Knowledge Repository)
│   │   ├── CLKRConsultationForm.tsx # CLKR consultation form
│   │   └── CLKRRepository.tsx  # CLKR repository component
│   └── resources/               # Resource components
│       ├── CountryExemptionCheck.tsx # Country exemption checker
│       └── DaysCounter.tsx      # Days counter component
├── pages/                       # Page-specific components
│   ├── home/                    # Home page components
│   │   ├── HomePageHero.tsx    # Home page hero section
│   │   ├── HomePageVisas.tsx   # Home page visas section
│   │   ├── HomePageRealEstate.tsx # Home page real estate section
│   │   ├── HomePageCLKR.tsx    # Home page CLKR section
│   │   ├── ServicesGrid.tsx    # Services grid section
│   │   ├── ReviewsSection.tsx  # Customer reviews section
│   │   └── ValuesSection.tsx   # Company values section
│   ├── about/                   # About page components
│   │   ├── AboutPageHero.tsx   # About page hero
│   │   ├── AboutPageMission.tsx # About page mission section
│   │   ├── AboutPageGallery.astro # About page gallery
│   │   └── OurTeam.tsx         # Team members section
│   ├── contact/                 # Contact page components
│   │   ├── ContactForm.astro   # Contact form
│   │   └── ContactPageCard.astro # Contact page card
│   └── services/                # Services page components
│       ├── ServicesHero.tsx    # Services page hero
│       └── ServicesGrid.tsx    # Services grid
├── ui/                          # UI components (design system)
│   ├── buttons/                 # Button components
│   │   ├── PrimaryButton.tsx   # Primary button
│   │   ├── SecondaryButton.tsx # Secondary button
│   │   └── IconButton.tsx      # Icon button
│   ├── cards/                   # Card components
│   │   ├── BaseCard.tsx        # Base card component
│   │   ├── InfoCard.tsx        # Information card
│   │   ├── FeatureCard.tsx     # Feature card
│   │   ├── TestimonialCard.tsx # Testimonial card
│   │   ├── GoogleReviews.tsx   # Google reviews card
│   │   └── PropertyCard.tsx    # Property card (moved from features)
│   ├── forms/                   # Form components
│   │   ├── Input.tsx           # Input field
│   │   ├── Select.tsx          # Select dropdown
│   │   ├── Checkbox.tsx        # Checkbox component
│   │   ├── TextArea.tsx        # Text area component
│   │   └── ContactForm.astro   # Contact form (moved from pages)
│   ├── navigation/              # Navigation UI components
│   │   ├── Menu.tsx            # Menu component
│   │   ├── Dropdown.tsx        # Dropdown menu
│   │   └── Pagination.tsx      # Pagination component
│   ├── layout/                  # Layout UI components
│   │   ├── Container.tsx       # Container component
│   │   ├── Grid.tsx            # Grid layout
│   │   ├── Flex.tsx            # Flex layout
│   │   └── Section.tsx         # Section wrapper
│   └── feedback/                # Feedback components
│       ├── Loading.tsx         # Loading spinner
│       ├── Error.tsx           # Error message
│       └── Success.tsx         # Success message
└── shared/                      # Shared components across languages
    ├── AnimatedLogoIcon.tsx    # Animated logo component
    ├── FloatingTeamAvatars.tsx # Floating team avatars
    ├── InfoSection.tsx         # Information section
    └── ValuesSection.tsx       # Values section (moved from pages)
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