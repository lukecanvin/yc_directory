# YC Directory

A Next.js application for browsing and managing a directory of startups, inspired by Y Combinator's directory.

## Features

- **Browse and Search:** Easily browse and search for startups in the directory.
- **Detailed Profiles:** View detailed information for each startup.
- **User Authentication:** Secure user authentication powered by NextAuth.js.
- **Content Management:** Startup data is managed through Sanity, providing a flexible and powerful CMS.

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production.
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at scale.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js.
- [Sanity](https://www.sanity.io/) - The unified content platform.

## Getting Started

First, set up your local environment variables by creating a `.env.local` file with the following variables:

```
AUTH_GITHUB_ID
AUTH_GITHUB_SECRET
AUTH_SECRET
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_PROJECT_ID
SANITY_WRITE_TOKEN
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Sanity Documentation](https://www.sanity.io/docs) - learn about Sanity and how to use it.
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction) - learn about NextAuth.js.
