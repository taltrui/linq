# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for "Linq" - a business management application with quotations, client management, and job tracking features. The project uses a modern full-stack architecture with NestJS backend and React frontend.

## Architecture

**Monorepo Structure:**
- `apps/api/` - NestJS backend API with PostgreSQL database
- `apps/web/` - React frontend with Vite, TanStack Router, and TailwindCSS
- `packages/api-client/` - Shared TypeScript API client with Zod schemas
- `packages/eslint-config/` - Shared ESLint configurations
- `packages/typescript-config/` - Shared TypeScript configurations

**Backend (NestJS):**
- Uses Prisma ORM with PostgreSQL database
- JWT authentication with Passport
- Modular architecture: Auth, Users, Companies, Clients, Jobs, Quotations
- Prisma schema split across multiple files in `apps/api/prisma/schema/`
- Generated Prisma client outputs to `apps/api/generated/prisma/`

**Frontend (React):**
- Vite + React 19 + TypeScript
- TanStack Router for routing with file-based routes
- TanStack Query for data fetching
- TailwindCSS for styling with Radix UI components
- Form handling with TanStack React Form and Zod validation
- Authentication context with protected routes

**Database:**
- PostgreSQL with Docker Compose setup
- PgAdmin available at localhost:5050
- Prisma migrations in `apps/api/prisma/migrations/`

## Development Commands

**Root level (uses Turbo):**
```bash
pnpm dev              # Start all apps in development mode
pnpm build            # Build all packages and apps
pnpm lint             # Lint all packages and apps
pnpm format           # Format code with Prettier
```

**API (apps/api/):**
```bash
pnpm dev              # Start API in watch mode (includes Prisma generate)
pnpm build            # Build API (includes Prisma generate)
pnpm start:prod       # Start in production mode
pnpm db:migrate       # Run Prisma migrations
pnpm test             # Run unit tests
pnpm test:e2e         # Run e2e tests
pnpm test:cov         # Run tests with coverage
```

**Web (apps/web/):**
```bash
pnpm dev              # Start Vite dev server
pnpm build            # Build for production (includes TypeScript check)
pnpm lint             # Run ESLint
pnpm preview          # Preview production build
```

**Database:**
```bash
docker-compose up -d  # Start PostgreSQL and PgAdmin
```

## Key Technologies

- **Package Manager:** pnpm with workspaces
- **Build System:** Turbo for monorepo orchestration
- **Backend:** NestJS, Prisma, PostgreSQL, JWT authentication
- **Frontend:** React 19, Vite, TanStack Router/Query, TailwindCSS
- **Validation:** Zod schemas (shared via api-client package)
- **Styling:** TailwindCSS v4 with Radix UI components
- **Database:** PostgreSQL with Docker

## Coding Guidelines

Follow these key principles when working with this codebase:

**Code Quality:**
- Write simple, readable, and maintainable code
- Use early returns to avoid nested conditions
- Prefer descriptive names for variables and functions
- Prefix event handlers with "handle" (e.g., handleClick)
- Use constants over functions where possible
- Write functional, immutable code unless it becomes verbose
- Only modify code sections related to the task at hand

**Frontend Specific (React/TypeScript):**
- Use functional components with TypeScript interfaces
- Prefer interfaces over types
- Avoid enums; use maps instead
- Use the "function" keyword for pure functions
- Use curly braces for all conditionals
- Structure files: exported component, subcomponents, helpers, static content, types
- Use lowercase with dashes for directories (e.g., components/auth-wizard)
- Favor named exports for components

**TanStack Router Specific:**
- File-based routing is used with automatic route generation
- Routes are in `apps/web/src/routes/` directory
- Route tree is auto-generated in `routeTree.gen.ts`
- Use `createFileRoute` for defining routes
- Router context and authentication are configured globally

## Important Notes

- Always run `pnpm prisma:generate` after schema changes in the API
- The API serves on port 3000, web on port 5173 (Vite default)
- Shared types and schemas are in `packages/api-client/`
- Authentication is required for most routes (protected by guards)
- Database credentials are in docker-compose.yml for local development
- TanStack Router generates route trees automatically
- Commit the generated `routeTree.gen.ts` file to git

## Testing

- Backend uses Jest for unit and e2e tests
- Test files follow `.spec.ts` and `.e2e-spec.ts` naming conventions
- Run `pnpm test` in api directory for unit tests
- Run `pnpm test:e2e` in api directory for e2e tests