# Tech Stack & Build System

## Core Technologies

- **Next.js 15** (canary) - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5** - Type safety and developer experience
- **Tailwind CSS 4** - Utility-first styling with custom configuration
- **NextAuth.js 5** (beta) - Authentication with GitHub provider
- **Sanity 3** - Headless CMS for content management

## Key Libraries

- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: class-variance-authority, clsx, tailwind-merge
- **Content**: markdown-it, @uiw/react-md-editor, sanity-plugin-markdown
- **Utilities**: slugify, sonner (notifications), next-themes

## Build & Development Commands

```bash
# Development
npm run dev          # Start dev server with automatic typegen
npm run build        # Production build with typegen
npm run start        # Start production server
npm run lint         # ESLint checking

# Sanity Integration
npm run typegen      # Generate Sanity types (runs automatically)
```

## Configuration Notes

- Uses npm as package manager (v10.9.2)
- TypeScript with strict mode and Next.js plugin
- Path aliases: `@/*` maps to project root
- Next.js experimental features: PPR incremental, after hooks
- Image optimization with remote patterns allowed
- Sanity Studio mounted at `/studio` route

## Environment Variables Required

```
AUTH_GITHUB_ID
AUTH_GITHUB_SECRET
AUTH_SECRET
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_PROJECT_ID
SANITY_WRITE_TOKEN
```