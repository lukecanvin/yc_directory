# Project Structure & Organization

## Directory Layout

```
├── app/                    # Next.js App Router
│   ├── (root)/            # Route groups for organization
│   ├── api/               # API routes
│   ├── studio/            # Sanity Studio pages
│   ├── fonts/             # Local font files (Work Sans)
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout with font setup
├── components/            # React components
│   ├── ui/               # Reusable UI primitives
│   └── *.tsx             # Feature-specific components
├── lib/                  # Utility functions and actions
│   ├── actions.ts        # Server actions
│   ├── utils.ts          # General utilities
│   └── validation.ts     # Form validation schemas
├── sanity/               # Sanity CMS configuration
│   ├── lib/              # Sanity client and queries
│   ├── schemaTypes/      # Content schemas
│   ├── env.ts            # Environment configuration
│   ├── structure.ts      # Studio structure
│   └── types.ts          # Generated types
└── public/               # Static assets
```

## Naming Conventions

- **Components**: PascalCase (e.g., `StartupCard.tsx`, `SearchForm.tsx`)
- **Files**: camelCase for utilities, kebab-case for configs
- **Folders**: lowercase with hyphens for routes, camelCase for components
- **Route Groups**: Parentheses for organization `(root)`

## Component Organization

- **Feature Components**: Top-level in `/components` (StartupCard, Navbar)
- **UI Primitives**: In `/components/ui` (shadcn/ui pattern)
- **Page Components**: Co-located with routes in `/app`

## Import Patterns

- Use `@/*` path alias for all internal imports
- Group imports: external libraries first, then internal modules
- Server-only code marked with `"use server"` or `server-only` import

## File Responsibilities

- **actions.ts**: Server actions for form submissions and data mutations
- **validation.ts**: Zod schemas for form and data validation
- **utils.ts**: Utility functions (cn for className merging)
- **auth.ts**: NextAuth configuration and callbacks
- **layout.tsx**: Font loading, metadata, and global providers

## Sanity Integration

- Schema types in `/sanity/schemaTypes`
- Generated types in `/sanity/types.ts` (auto-generated)
- Client configurations in `/sanity/lib`
- Studio structure customization in `/sanity/structure.ts`