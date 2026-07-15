# BeerBoard Architecture

## Experience layer

The public catalog uses an editorial discovery system rather than dashboard chrome. `BeerDiscovery` owns the discovery hero, style marquee, route cards, and the desktop-only GSAP scroll story. It checks `prefers-reduced-motion` before adding scroll behavior. Ranked results use `BeerRankingTable`, which renders a semantic ordered list shared by global, country, and style routes.

Outfit is loaded through `next/font`. Lucide is the only interface icon library. Beer specimens derive their liquid tone from reported SRM ranges so the visual carries product meaning.

## System overview

BeerBoard is a Next.js 16 App Router application hosted on Vercel. Supabase is the production database and authentication provider. PostgreSQL is the source of truth for catalog rows, assessment inputs, generated scores, rankings, release freshness, public user reviews, and private saved beers.

Public catalog routes use Server Components and a browser-safe publishable key through `src/lib/supabase/public.ts`. They do not read cookies or authenticated state. The account control is a focused Client Component boundary. Protected routes use `src/lib/supabase/server.ts` and validate the current user with `auth.getUser()` before reading or mutating owned data.

## Route ownership

| Surface | Route | Owning data |
| --- | --- | --- |
| Global ranking | `/beers` | `beer_catalog` security-invoker view |
| Beer detail | `/beers/[slug]` | `beer_catalog`, descriptors, public `reviews` |
| Comparison | `/compare` | Two `beer_catalog` rows |
| Countries | `/countries`, `/countries/[slug]` | `country_summaries`, filtered catalog |
| Styles | `/styles`, `/styles/[slug]` | `style_summaries`, filtered catalog |
| My reviews | `/reviews` | User-owned `reviews`, joined catalog |
| Saved beers | `/saved` | User-owned `ledger_entries`, joined catalog |
| Legacy saved-beer redirect | `/ledger` | Redirects to `/saved` |
| Settings | `/settings` | User-owned `profiles` row |
| Auth | `/login`, `/signup`, reset routes | Supabase Auth |
| Exports | `/api/export/beers`, `/api/export/compare` | Current validated query result |

## Database schema

### Catalog

- `dataset_releases` owns release title, audit timestamp, and demonstration disclosure.
- `countries` and `styles` own taxonomy and educational context.
- `breweries` belongs to a country.
- `beers` belongs to a release, brewery, country, and style. Technical values are nullable.
- `beer_assessments` owns assessment inputs, sensory values, verdicts, and the generated Index score.
- `descriptors` and `beer_descriptors` provide normalized sensory labels and intensity.

### Accounts

- `profiles` has the same UUID as `auth.users`. It stores display name and theme preference.
- `reviews` stores one 1–5 rating and 10–1000 character review per user and beer. Reviews are public; only their author can create, update, or delete them.
- `ledger_entries` is the legacy internal table name for private saved beers. Its composite `(user_id, beer_id)` primary key prevents duplicates.

### Views

- `beer_catalog` joins catalog entities and calculates global rank from the stored generated score.
- `country_summaries` derives counts, mean score, brewery coverage, and leading beer.
- `style_summaries` derives indexed examples, mean score, and leading beer.

Every view uses `security_invoker = true`, so callers remain subject to underlying table policies.

## Canonical score

`beer_assessments.index_score` is a stored generated column:

```text
quality × 35%
+ balance × 25%
+ distinctiveness × 20%
+ technical execution × 20%
```

This SQL expression is the only scoring implementation. TypeScript and React read the generated value and never recalculate it.

## Authentication and cookies

- `@supabase/ssr` stores PKCE sessions in cookies.
- `src/proxy.ts` refreshes auth sessions for protected and authentication routes.
- The proxy copies Supabase-provided no-store response headers when cookies are refreshed.
- Server Actions and protected pages call `auth.getUser()` before authorization-sensitive work.
- `auth.getSession()` and user-editable metadata are never used for authorization.
- The root layout does not read the session, so public routes do not become personalized or dynamic because of account chrome.

## RLS and grants

RLS is enabled on every public table.

- `anon` and `authenticated` receive explicit `SELECT` grants and read-only policies on catalog tables.
- Browser roles receive no insert, update, or delete grants on catalog entities, assessment inputs, rankings, descriptors, or dataset releases.
- A user can select and update only the profile where `auth.uid() = id`.
- Reviews are publicly readable. Authenticated users can insert, update, and delete only reviews where `auth.uid() = user_id`.
- A user can select, insert, and delete only their saved-beer rows where `auth.uid() = user_id`.
- Profile updates use both `USING` and `WITH CHECK`.
- The user-creation and review-author triggers are `SECURITY DEFINER` functions in the non-exposed `private` schema. Both have an empty search path and execution revoked from public roles. The review trigger snapshots the server-owned profile display name so clients cannot choose another author name.

`supabase/tests/rls.sql` provides negative cross-user tests and positive owner tests.

## Data behavior

- `supabase/seed.sql` truncates and recreates one release with exactly 50 fictional beers.
- Counts, averages, ranks, country summaries, style summaries, and freshness come from database queries.
- Technical nulls render as “Not reported.” They never silently become zero.
- Comparison notes are deterministic TypeScript descriptions of measurable tradeoffs. They do not create an overall winner.
- CSV exports use the same validated URL filter state as the current screen.

### Known contract gaps

- The style detail route currently coerces an absent sensory-profile value to `0`. Missing sensory
  values must remain missing and render as “Not reported.”
- Some country/style aggregate surfaces render an em dash for missing values, and the empty-catalog
  mean path returns `0`. These must use the shared missing-value contract instead.
- The ranking route shows the release audit date, while the demonstration disclosure is only in the
  global footer. A release-level disclosure must appear with the ranked result and export context.

## Caching and rendering

Public catalog pages export a one-hour revalidation interval and use no user cookies. Public reviews load through the browser-safe catalog client. The review form resolves the signed-in user's draft after mount, keeping the page cacheable. Protected routes export `dynamic = "force-dynamic"` and must not be cached. Responses that update auth cookies inherit Supabase SSR no-store headers through the proxy cookie adapter.

## Deployment

Vercel requires these environment variables in Preview and Production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

No service-role key is required by the current application. User mutations run with the signed-in user’s session and remain subject to RLS.

Deployment order:

1. Review the migration for destructive statements.
2. Apply the migration to the confirmed BeerBoard Supabase project.
3. Seed and verify exactly 50 beers.
4. Generate database types from that project.
5. Run advisors and ownership tests.
6. Add Vercel environment variables and allowed Supabase Auth redirects.
7. Run lint, type-check, unit tests, database tests, and production build.
8. Create and inspect a Vercel preview deployment.
