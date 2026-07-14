# Screenshot Functionality Audit

This is the implementation checklist for the four supplied screenshots. The screenshots establish the minimum capability, not the target visual design. BearBoard uses a fictional demonstration dataset and must disclose that status wherever rankings are presented as a group.

## Assumptions

- “BearBoard Index” is a deterministic 0–100 score derived from one canonical assessment formula.
- The seeded release contains exactly 50 beers. All counts and aggregates derive from those database rows.
- Search applies to beer, brewery, country, and style names.
- “Add to Ledger” means a signed-in user-owned saved-beer record, not a decorative bookmark.
- Comparison notes describe tradeoffs. They never manufacture an overall winner.
- CSV exports reflect the current filtered or compared result and provide success or error feedback.

## Shared application shell

| Screenshot / surface | Visible element | Intended behavior | Route / component | Supabase data | Responsive behavior | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| All / header | BearBoard wordmark | Navigate to global ranking | `/`, `SiteHeader` | None | Remains visible; compact mobile wordmark | Keyboard and route test |
| All / header | Beers | Open ranking and show active state | `/beers`, `PrimaryNav` | `beers` | Moves into mobile menu | Route and focus test |
| All / header | Countries | Open country catalog and show active state | `/countries`, `PrimaryNav` | `countries`, `beers` | Moves into mobile menu | Route test |
| All / header | Compare | Open comparison and show active state | `/compare`, `PrimaryNav` | `beers`, assessments | Moves into mobile menu | Route test |
| All / header | Styles | Open style catalog and show active state | `/styles`, `PrimaryNav` | `styles`, `beers` | Moves into mobile menu | Route test |
| Ranking / header | Search icon | Open focused global search | `/search`, `SearchTrigger` | Public catalog tables | Full-width mobile search | Keyboard and query test |
| All / header | Settings control | Open real settings route | `/settings`, `AccountNav` | User profile | Account entry on small screens | Protected-route test |
| All / header | Avatar / account | Signed-in menu; signed-out authentication entry | `/login`, account menu | Supabase Auth, `profiles` | Touch-sized menu trigger | Auth state test |
| All / header | Mobile navigation | Open and close navigation, trap no focus, restore focus | `MobileNav` | None | Replaces desktop links below breakpoint | Keyboard and viewport test |
| All / footer | Methodology | Explain score, inputs, limitations, and demonstration status | `/methodology` | `dataset_releases` | Stacks into readable groups | Content test |
| All / footer | About | Explain product purpose | `/about` | None | Stacks | Route test |
| All / footer | Contact | Provide functional contact path | `/contact` | None | Stacks | Form/link test |
| All / footer | Data Counters | Show live database-derived totals | `/data-counters` | Aggregate public catalog data | Responsive definition list | Query test |

## Screenshot 4 — global beer ranking

| Visible element | Intended behavior | Route / component | Supabase data | Responsive behavior | Verification |
| --- | --- | --- | --- | --- | --- |
| “Global Top 50” title | Establish exactly 50 seeded ranked entries | `/beers`, `RankingHeader` | `beers`, assessments | Smaller fixed scale; no overflow | Count query and viewport test |
| Demonstration context | Disclose fictional data and dataset limitations | `DatasetNotice` | `dataset_releases` | Full-width notice | Content assertion |
| Last audited timestamp | Show current release date and freshness | `DataFreshness` | `dataset_releases` | Moves below title | Seed query |
| Search | Filter beer, brewery, country, and style | `RankingFilters` | Catalog search query | Dedicated mobile filter panel | URL/query test |
| Country filter | Select a country or all | `RankingFilters` | `countries` | Native/select-friendly mobile control | Filter test |
| Style filter | Select a style or all | `RankingFilters` | `styles` | Native/select-friendly mobile control | Filter test |
| Minimum score | Validate and apply 0–100 threshold | `RankingFilters` | assessment score | Numeric keyboard on mobile | Validation test |
| Sort options | Sort by rank, score, name, ABV, country, or style | `RankingFilters` | Query ordering | Included in mobile filters | URL/order test |
| Apply filters | Persist validated filters in query string | `RankingFilters` | Read-only query | Sticky action row in mobile panel | Navigation test |
| Clear filters | Remove filter parameters and restore defaults | `RankingFilters` | Read-only query | Adjacent clear action | Navigation test |
| Export CSV | Download current filtered result | `/api/export/beers`, `ExportButton` | Current catalog query | Full-width or icon plus text | CSV content test |
| Ranking columns | Show rank, beer, brewery, country, style, ABV, score | `BeerRankingTable` | Joined catalog rows | Converts to labeled rows/cards without hiding fields | DOM and viewport test |
| Beer names | Link directly to details | `/beers/[slug]` | `beers` | Primary tap target | Link test |
| Progressive loading | Show 10 entries initially and load pages | `Pagination` | Range query | Full-width controls | Pagination query test |
| Empty results | Explain no matches and offer clear filters | `RankingEmptyState` | Empty query result | Full-width | Empty-state test |
| Missing measurement | Render “Not reported” rather than zero | `Measurement` | Nullable fields | No truncation | Fixture test |

## Screenshot 3 — beer detail

| Visible element | Intended behavior | Route / component | Supabase data | Responsive behavior | Verification |
| --- | --- | --- | --- | --- | --- |
| Beer name | Identify the selected beer | `/beers/[slug]`, `BeerHero` | `beers` | Wraps safely on narrow screens | Long-name test |
| Brewery | Link to brewery-filtered discovery | `BeerHero` | `breweries` | Inline metadata wraps | Link test |
| Country | Link to country detail | `/countries/[slug]` | `countries` | Touch target | Link test |
| Style | Link to style detail | `/styles/[slug]` | `styles` | Touch target | Link test |
| Index score | Show derived score with methodology context | `IndexScore` | `beer_assessments` | Remains visible without dominating | Formula test |
| Rank | Show current global rank | `BeerHero` | derived assessment ranking | Included beside score | Rank query test |
| Chemical markers | Show ABV, IBU, gravity, color, and nullable values | `TechnicalMeasurements` | `beers`, assessments | Two-column list becomes one column | Null/display test |
| Editorial verdict | Explain strengths, tradeoffs, and limitations | `EditorialVerdict` | assessment notes | Single readable column | Content test |
| Sensory radar | Plot sensory dimensions | `SensoryProfile` | assessment sensory values | Scales without horizontal scrolling | SVG/accessibility test |
| Visualization alternative | Provide table/list with the same values | `SensoryProfile` | same values | Always accessible; optional disclosure visually | Screen-reader test |
| Dominant descriptors | Show descriptor names and intensities | `DescriptorList` | `beer_descriptors` | Wraps as chips/list | Query test |
| Specimen artwork | Intentional generated bottle/label treatment | `BeerSpecimen` | beer identity fields | Compact above content on mobile | Image/alt test |
| Add to Ledger | Save/remove current beer; prompt auth when signed out | `LedgerButton`, server action | `ledger_entries`, Auth | Full-width mobile action | Signed-in/out tests |
| Compare | Add beer to Subject A and navigate to comparison | `CompareLink` | beer ID | Full-width mobile action | Query-string test |
| Methodology context | Link to scoring explanation | `/methodology` | `dataset_releases` | Inline callout | Link test |
| Not found | Handle invalid slug credibly | `not-found.tsx` | Empty query | Responsive | 404 test |

## Screenshot 2 — system comparison

| Visible element | Intended behavior | Route / component | Supabase data | Responsive behavior | Verification |
| --- | --- | --- | --- | --- | --- |
| Subject A selector | Search and select first beer | `/compare`, `BeerSelector` | `beers` | Full-width stacked field | Selection test |
| Subject B selector | Search and select a different beer | `/compare`, `BeerSelector` | `beers` | Full-width stacked field | Same-beer prevention test |
| Swap action | Exchange A and B query parameters | `ComparisonToolbar` | None | Touch-sized | URL test |
| Shareable URL | Persist both beer slugs in query string | `/compare?a=&b=` | Catalog lookup | Same behavior | Direct-navigation test |
| Invalid selection | Explain missing/unknown/same beer and preserve valid choice | `ComparisonEmptyState` | Lookup result | Stacked guidance | Invalid-query tests |
| Technical measurements | Compare ABV, IBU, gravity, color, calories where known | `TechnicalComparison` | beers, assessments | Labeled paired rows | Null and viewport tests |
| Sensory audit | Compare normalized sensory dimensions | `SensoryComparison` | assessments | Paired bars become compact rows | Value test |
| Higher/lower/equal states | State direction with text, icon, and value—not color alone | `ComparisonMetric` | computed values | No information loss | Unit tests |
| Deterministic analysis | Generate tradeoff notes from canonical comparison rules | `buildComparisonNotes` | selected measurements | Readable single column | Snapshot/unit test |
| No overall winner | Avoid claiming superiority across unlike metrics | `ComparisonNotes` | None | Same behavior | Copy assertion |
| Export data | Download both subjects and compared metrics | `/api/export/compare` | selected rows | Full-width mobile action | CSV test |

## Screenshot 1 — countries

| Visible element | Intended behavior | Route / component | Supabase data | Responsive behavior | Verification |
| --- | --- | --- | --- | --- | --- |
| Global output heading | Introduce catalog-wide country analysis | `/countries`, `CountriesHeader` | aggregate queries | Balanced smaller heading | Viewport test |
| Index volume | Show total assessed beers | `CatalogStats` | count of beers | Metrics become vertical definition list | Aggregate test |
| Global mean | Show average index score | `CatalogStats` | assessment average | Same | Aggregate test |
| Active regions | Show represented countries | `CatalogStats` | country count | Same | Aggregate test |
| Country score | Show average derived score | `CountryList` | country aggregate | Clear decimal and definition | Aggregate test |
| Beer count | Show beers represented | `CountryList` | country aggregate | Labeled | Aggregate test |
| Brewery count | Show distinct breweries | `CountryList` | brewery aggregate | Labeled | Aggregate test |
| Leading beer | Link to highest-ranked beer | `CountryList` | ranked join | Full-width tap target | Query/link test |
| Country navigation | Open a country detail page | `/countries/[slug]` | selected country | Whole heading/link accessible | Route test |
| Ranked country beers | Show ordered beers for one country | `CountryRanking` | filtered catalog | Responsive rows | Rank test |
| Style distribution | Show counts and percentages by style | `StyleDistribution` | grouped catalog | Chart plus table alternative | Aggregate/a11y test |

## Implied Styles area

| Visible / implied element | Intended behavior | Route / component | Supabase data | Responsive behavior | Verification |
| --- | --- | --- | --- | --- | --- |
| Searchable style catalog | Search style and family names | `/styles`, `StyleCatalog` | `styles` | Full-width search and stacked results | Search test |
| Style families | Group styles into credible families | `StyleCatalog` | `styles.family` | Collapsible only where useful | Group test |
| Typical ABV / IBU | Show nullable ranges | `StyleSummary` | style range fields | Labeled compact values | Null/range test |
| Sensory profile | Explain expected dimensions and descriptors | `StyleSummary` | style sensory JSON | List plus visualization | Accessibility test |
| Indexed examples | Link to representative ranked beers | `StyleSummary` | joined beers | Stacked links | Query test |
| Highest-ranked beer | Show and link the leading example | `StyleSummary` | ordered assessment | Clear primary link | Query test |
| Style details | Open a dedicated style route | `/styles/[slug]` | selected style | One-column mobile layout | Route test |
| Related styles | Link meaningful adjacent styles | `RelatedStyles` | related style IDs | Wrapping list | Relationship test |

## Supporting flows and states

| Capability | Intended behavior | Route / component | Supabase data | Responsive behavior | Verification |
| --- | --- | --- | --- | --- | --- |
| Sign up | Email/password registration with return path | `/signup` | Supabase Auth, `profiles` trigger | Single-column form | Auth integration test |
| Log in | Email/password sign-in with clear errors | `/login` | Supabase Auth | Single-column form | Auth test |
| Log out | End server session and return to public catalog | server action | Supabase Auth | Account menu action | Auth test |
| Password reset | Request reset email and set a new password | `/forgot-password`, `/reset-password` | Supabase Auth | Single-column forms | Auth flow test |
| Auth callback | Exchange PKCE code and honor safe return path | `/auth/callback` | Supabase Auth | Nonvisual | Route test |
| Ledger | List and remove user-owned saved beers | `/ledger` | `ledger_entries`, catalog joins | Responsive list | Ownership test |
| Settings | Update display name and theme preference | `/settings` | `profiles` | Single-column form | Mutation/RLS test |
| Theme | Light, dark, or system mode with persistent accessible control | `ThemeControl` | profile preference when signed in; local storage otherwise | Available in mobile/account navigation | Interaction test |
| Loading | Use structural skeletons only around real async reads | route `loading.tsx` | Any asynchronous query | Matches final layout | Suspense test |
| Database error | Explain temporary failure and offer retry | route `error.tsx` | Failed queries | Full-width guidance | Forced-error test |
| Export feedback | Announce preparation, success, and failure | `ExportButton` | Export route | Touch-friendly | Live-region test |
| Keyboard navigation | Logical focus order, skip link, visible focus, Escape behavior | Shared components | None | All viewports | Keyboard audit |
| Long/missing data | Wrap long names; render “Not reported” for null | Shared data components | Nullable catalog fields | No clipping | Fixture/viewport test |
| Demo disclosure | Identify fictional catalog and release | `DatasetNotice` | `dataset_releases` | Never hidden | Content test |

## Completion review

Before release, compare each implemented surface against this file. Every row must have a working route or component, database source, responsive treatment, and a reproducible verification result.
