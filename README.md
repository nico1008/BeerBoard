# BeerBoard

BeerBoard is a welcoming global beer guide for beer lovers around the world. It combines an exactly 50-entry demonstration ranking, approachable beer profiles, public user reviews, comparisons, country and style discovery, and private saved beers.

The initial catalog is fictional demonstration data. The interface discloses that status and does not present the entries as verified claims about real breweries or beers.

## Stack

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- Outfit typography, Lucide icons, and GSAP motion on the discovery experience
- Supabase Postgres, Auth, RLS, `@supabase/supabase-js`, and `@supabase/ssr`
- Zod validation
- Vitest
- Vercel hosting

## Local setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set:

   ```text
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. Start the local Supabase stack with Docker available:

   ```powershell
   npx supabase start
   npx supabase db reset
   ```

4. Generate types from the applied schema:

   ```powershell
   npm run db:types
   ```

5. Start Next.js:

   ```powershell
   npm run dev
   ```

## Supabase configuration

The schema migration is in `supabase/migrations`. The repeatable 50-beer dataset is in `supabase/seed.sql`. Every public table has RLS enabled. Catalog roles receive explicit read grants because new Supabase projects may not expose SQL-created tables to the Data API automatically.

Configure Auth URL settings with:

- Site URL: the exact production Vercel URL or custom domain.
- Local redirect: `http://localhost:3000/**`
- Preview redirect: `https://*-<vercel-team-or-account-slug>.vercel.app/**`
- Production redirect: the exact production origin and callback path.

Authentication uses PKCE cookie-based SSR. `src/proxy.ts` refreshes sessions only around account and auth routes. Public catalog routes use a browser-safe unauthenticated server client and remain free of user-specific root-layout reads.

## Verification

```powershell
npm run lint
npm run typecheck
npm test
npm run test:db
npm run build
```

The database test requires a running local Supabase stack. It covers public review reads, review ownership, private saved beers, and profile ownership.

## Documentation

- `PRODUCT.md` — audience, product purpose, personality, and design principles.
- `DESIGN.md` — normative visual tokens and component rules.
- `docs/SCREENSHOT-FUNCTIONALITY.md` — screenshot-derived completion checklist.
- `docs/ARCHITECTURE.md` — application, database, authentication, and deployment architecture.
