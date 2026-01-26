# Flow-X Copilot Instructions

## Architecture Overview
Flow-X is a Next.js 16 application using the app router, built with TypeScript and Tailwind CSS v4. It features a comprehensive authentication system powered by better-auth, with email/password login and mandatory email verification. The backend uses Neon PostgreSQL database with Drizzle ORM for schema management and migrations.

Key components:
- **Authentication**: better-auth handles sessions, email verification, and user management via API routes in `app/api/auth/`
- **Database**: Drizzle ORM with Neon serverless; schemas in `db/` (auth-schema.ts for auth tables)
- **Email Service**: Nodemailer with SMTP for transactional emails, using EJS templates from `templates/emails/`
- **UI Framework**: shadcn/ui components (Radix UI primitives) in `components/ui/`
- **Client State**: SWR for data fetching, custom hooks in `hooks/` for auth operations

## Developer Workflows
- **Development**: `npm run dev` starts the dev server on localhost:3000
- **Database**: 
  - `npm run db:generate` creates migration files
  - `npm run db:migrate` applies migrations
  - `npm run db:push` pushes schema changes directly
  - `npm run db:studio` opens Drizzle Studio for DB inspection
- **Build**: `npm run build` for production build
- **Linting**: `npm run lint` runs ESLint

## Key Patterns & Conventions
- **Auth Integration**: Use `auth.api` methods in API routes (e.g., `auth.api.getSession(req)` in `/api/auth/me`). Client-side auth via `useAuth()` hook for signup/login, `useUser()` hook (SWR-based) for current user state
- **API Routes**: Follow Next.js app router structure; auth routes handle JSON requests/responses with error handling
- **Database Queries**: Use Drizzle ORM with the `db` instance from `lib/auth.ts`; define schemas in `db/` with relations
- **Email Sending**: Use `EmailService.sendVerificationEmail()` with user data; templates rendered via EJS
- **Component Structure**: Dashboard uses layout with `Sidebar` and `TopBar`; pages in `app/dashboard/` extend this layout
- **Styling**: Tailwind CSS with custom gradients (e.g., `bg-linear-to-br from-[#0B0F14] to-[#0E1320]` for dashboard); use `cn()` utility from `lib/utils.ts` for class merging
- **Forms**: React Hook Form with Zod validation via `@hookform/resolvers/zod`
- **Error Handling**: API routes return JSON with error messages; client hooks manage loading/error states

## Integration Points
- **External Services**: Neon DB (DATABASE_URL), SMTP for emails (SMTP_HOST, etc.), better-auth secret (BETTER_AUTH_SECRET)
- **Cross-Component Communication**: Auth state shared via SWR in `useUser()`; mutations trigger revalidation
- **File Organization**: 
  - `lib/` for shared utilities (auth setup, utils)
  - `services/` for business logic (email sending)
  - `components/` for UI, with `auth/` for auth modals, `dashboard/` for dashboard-specific components

## Examples
- Adding a new auth API: Create `app/api/auth/[endpoint]/route.ts` using `auth.api` methods
- Database schema changes: Update tables in `db/auth-schema.ts`, run `npm run db:generate` then `npm run db:migrate`
- Sending emails: Call `EmailService.sendVerificationEmail({to, name, url})` with template data
- Client auth: Use `useAuth().signup(name, email, password)` for registration flow