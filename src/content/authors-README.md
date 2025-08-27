# Authors Collection Structure

This directory contains the author profiles for Capital M Law, organized by language.

## Structure

```
src/content/authors/
├── en/                    # English author profiles
│   ├── 1_danielluque.mdx
│   ├── 2_mafeduarte.mdx
│   ├── 3_sara.mdx
│   └── 4_mateomartinez.mdx
├── es/                    # Spanish author profiles
│   ├── 1_danielluque.mdx
│   ├── 2_mafeduarte.mdx
│   ├── 3_sara.mdx
│   └── 4_mateomartinez.mdx
└── README.md
```

## Author Schema

Each author file follows this structure:

```mdx
---
name: "Author Name"
role: "Professional Role"
email: "email@capitaleme.com"
image: "/images/team/author-image.jpg"
bio: "Professional biography and description"
lang: "en" | "es"
socialLinks:
    facebook: "https://facebook.com/..."
    twitter: "https://twitter.com/..."
    linkedin: "https://linkedin.com/..."
---
```

## Usage

### Get authors by language

```typescript
import { getAuthorsByLanguage } from '../../utils/authors';

// Get English authors
const englishAuthors = await getAuthorsByLanguage('en');

// Get Spanish authors
const spanishAuthors = await getAuthorsByLanguage('es');
```

### Get all authors

```typescript
import { getAllAuthors } from '../../utils/authors';

const allAuthors = await getAllAuthors();
```

### Get specific author

```typescript
import { getAuthorBySlug } from '../../utils/authors';

// Get author by slug and language
const author = await getAuthorBySlug('1_danielluque', 'en');

// Get author by slug (any language)
const author = await getAuthorBySlug('1_danielluque');
```

### Get team members for display

```typescript
import { getTeamMembers } from '../../utils/teamData';

// Get team members for specific language
const teamMembers = await getTeamMembers('en');
```

## Team Section Component

Use the `TeamSection` component to display team members:

```tsx
import TeamSection from '../../components/shared/TeamSection';

<TeamSection lang="en" />
```

## Adding New Authors

1. Create a new `.mdx` file in both `en/` and `es/` directories
2. Follow the naming convention: `{order}_{name}.mdx`
3. Ensure both language versions have the same slug structure
4. Update the schema if adding new fields

## Notes

- Each author must have a `lang` field to specify the language
- Images should be placed in `/public/images/team/`
- Social links are optional
- The `role` field is used for professional titles
- The `bio` field contains the detailed description
