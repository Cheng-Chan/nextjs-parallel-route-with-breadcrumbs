# Routing Learning Log

## Phase 0: App Router foundations

### File-system routing

The `src/app` directory defines the route tree. Each folder contributes a URL segment, while a `page.tsx` file makes that segment publicly accessible. For example, `src/app/dashboard/users/create/page.tsx` maps to `/dashboard/users/create`.

### Pages and layouts

A `page.tsx` file provides the UI for one route. A `layout.tsx` file wraps every page below its directory and persists while navigating among those routes. The root layout supplies the required `<html>` and `<body>` elements. The dashboard layout supplies shared navigation and renders its active nested route through the `children` prop.

### Nested routes

Nested folders create nested URLs. The users index, create page, user details page, and edit page all share the dashboard layout because they live below `src/app/dashboard`.

### Dynamic segments

A folder wrapped in square brackets, such as `[id]`, captures one URL segment. Next.js 16 supplies route `params` asynchronously, so the dynamic pages await `params` before rendering the captured `id`. Visiting `/dashboard/users/ada-lovelace` therefore renders `ada-lovelace` as the user ID.

### Navigation

`next/link` enables client-side transitions between routes and can prefetch links when appropriate. It is used for all navigation in this lab instead of plain internal `<a>` elements.

### Server Components

App Router components are Server Components by default. No file in this phase uses the `"use client"` directive because the pages and layouts need no browser state, effects, or event handlers.

### Phase boundary

Phase 0 intentionally did not add breadcrumbs or Parallel Routes. Those concepts were deferred until after the conventional nested route tree was understood and verified.

## Phase 1: Parallel Routes

### Named slots

A named slot is a folder that starts with `@`, such as `src/app/dashboard/@demo`. Next.js passes the rendered slot to its shared parent layout as a prop named after the folder. The dashboard layout therefore accepts both `children` (the implicit slot) and `demo` (the named slot), then decides where both React nodes appear.

The `@demo` folder is a routing convention rather than a URL segment. Its `page.tsx` renders alongside `dashboard/page.tsx` at `/dashboard`; there is no `/dashboard/@demo` URL.

### Matching and fallback states

The experiment deliberately defines only the index page inside `@demo`:

- `@demo/page.tsx` matches `/dashboard` and displays a violet “Matched demo slot” panel.
- `@demo/default.tsx` is the explicit fallback and displays an orange “Demo slot fallback” panel.
- Routes such as `/dashboard/users` and `/dashboard/settings` exist in the implicit `children` slot but have no corresponding route inside `@demo`.

The visible difference between the violet page and orange fallback makes slot state observable without reading the pathname in a Client Component. The dashboard layout and both slot files remain Server Components.

### Soft and hard navigation observations

Starting at `/dashboard` renders `@demo/page.tsx`. Following a dashboard `<Link>` to `/dashboard/users` is a soft navigation. The children slot changes to the Users page, while Next.js preserves the active violet demo page even though `@demo` has no matching `users` route.

The browser test recorded zero new document-navigation requests for that `<Link>` transition, confirming that it was a client-side navigation rather than a full document load. Going back to `/dashboard` and forward to `/dashboard/users` preserved the violet page in both history entries.

Loading `/dashboard/users` directly, or hard-refreshing it, produces a different result. There is no client router state to recover for the unmatched named slot, so Next.js renders the orange `@demo/default.tsx` fallback. Without that file, the unmatched slot would produce a 404.

After a hard refresh of `/dashboard/users`, soft navigation to `/dashboard` replaces the fallback with the matching `@demo/page.tsx`. Browser back returns to the earlier `/dashboard/users` history entry and restores its orange fallback. Back and forward therefore restore the client router state associated with their history entries, while a refresh reconstructs all slots from the URL and falls back for any unmatched slot.

### Experiment matrix

| Action | Children slot | `@demo` slot |
| --- | --- | --- |
| Directly load `/dashboard` | Dashboard overview | `page.tsx` |
| Soft navigate `/dashboard` → `/dashboard/users` | Users | Preserved `page.tsx` |
| Back to `/dashboard`, then forward to `/dashboard/users` | History entry restored | Preserved `page.tsx` |
| Hard refresh `/dashboard/users` | Users | `default.tsx` |
| Soft navigate refreshed `/dashboard/users` → `/dashboard`, then go back | Users history entry | Restored `default.tsx` |
| Directly load `/dashboard/settings` | Settings | `default.tsx` |
| Soft navigate an unmatched route → `/dashboard` | Dashboard overview | Matching `page.tsx` |

### Phase boundary

Phase 1 does not implement breadcrumbs, route-derived labels, or breadcrumb-specific slots. Those remain future work.

## Phase 2: Static breadcrumb slot

### Replacing the experiment

The experimental `@demo` slot was removed and replaced by `src/app/dashboard/@breadcrumbs`. The shared dashboard layout now receives `breadcrumbs` and `children` as `ReactNode` props. It renders the breadcrumb slot between the dashboard header and the active page, without inspecting the URL.

The slot has an explicit page for each route in this phase:

- `@breadcrumbs/page.tsx` renders **Dashboard** for `/dashboard`.
- `@breadcrumbs/users/page.tsx` renders **Dashboard / Users** for `/dashboard/users`.
- `@breadcrumbs/settings/page.tsx` renders **Dashboard / Settings** for `/dashboard/settings`.
- `@breadcrumbs/default.tsx` provides a safe Dashboard link when a hard load cannot match another breadcrumb subpage.

Each breadcrumb is semantic server-rendered HTML: a `<nav aria-label="Breadcrumb">` containing an ordered list. Parent items use Next.js `<Link>`, while the final item is plain text with `aria-current="page"` because it represents the active page.

### Rendering flow

For `/dashboard/users`, Next.js resolves two branches at the same route segment. The implicit `children` branch resolves `dashboard/users/page.tsx`, and the named branch resolves `dashboard/@breadcrumbs/users/page.tsx`. It passes both rendered React nodes to `dashboard/layout.tsx`, which controls their visual placement. The `@breadcrumbs` directory remains absent from the URL because it is a slot, not a URL segment.

No Client Component, `usePathname()`, URL splitting, dynamic entity lookup, or generic breadcrumb data model is involved. Each static route owns a small breadcrumb page, making its label and links explicit.

### Navigation results

| Test | Observed breadcrumb | Result |
| --- | --- | --- |
| Direct load `/dashboard` | Dashboard | Passed |
| Direct load `/dashboard/users` | Dashboard / Users | Passed |
| Refresh `/dashboard/users` | Dashboard / Users | Passed |
| Client navigate Dashboard → Users | Dashboard / Users | Passed; zero document requests |
| Client navigate Users → Settings | Dashboard / Settings | Passed; zero document requests |
| Refresh `/dashboard/settings` | Dashboard / Settings | Passed |
| Click the parent Dashboard breadcrumb | Dashboard at `/dashboard` | Passed; zero document requests |

Because all three tested URLs have matching pages inside `@breadcrumbs`, soft navigation replaces the slot with the correct trail instead of preserving stale unmatched content. Refresh produces the same trail because the server can resolve an exact breadcrumb route from the URL.

### Phase boundary

Phase 2 models only the requested static breadcrumb routes. Dynamic user labels and entity lookup are intentionally deferred to a later phase.

## Phase 3: Nested and dynamic breadcrumb routes

### Explicit route matching

The breadcrumb slot now mirrors the remaining user route shapes explicitly:

```text
@breadcrumbs/users/
├── create/page.tsx
└── [id]/
    ├── page.tsx
    └── edit/page.tsx
```

Static segments match by folder name. At `/dashboard/users/create`, both `dashboard/users/create/page.tsx` and `dashboard/@breadcrumbs/users/create/page.tsx` match the `users/create` segments. The breadcrumb page renders **Dashboard / Users / Create**.

The `[id]` folder matches one dynamic segment at the same position. `/dashboard/users/123` selects the `[id]/page.tsx` files in both the implicit page branch and the breadcrumb branch. Adding `/edit` selects each branch's nested `[id]/edit/page.tsx` instead.

### Asynchronous params

Next.js supplies `params` separately to every matched dynamic page. The dynamic breadcrumb pages declare `params: Promise<{ id: string }>` and await it before rendering. The resolved `id` is used as a temporary label, so no entity API or shared client state is needed:

- `/dashboard/users/123` renders **Dashboard / Users / 123**.
- `/dashboard/users/123/edit` renders **Dashboard / Users / 123 / Edit**.

On the Edit route, Dashboard, Users, and the ID are links to their parent routes; Edit is plain text marked with `aria-current="page"`. On the Detail route, the ID itself is the non-clickable current item.

### Parallel hierarchy versus page hierarchy

The rendered page hierarchy lives below the implicit `children` branch at `dashboard/users/...`. The breadcrumb hierarchy lives in a separate `@breadcrumbs/users/...` branch. Although both trees mirror the same URL segments, breadcrumb files do not wrap or import the content pages. Next.js matches both branches in parallel and passes their independently rendered nodes to the shared dashboard layout.

This separation lets the breadcrumb branch represent navigation hierarchy while the content branch remains focused on page UI. It also means both branches receive dynamic params independently.

### Navigation results

| Test | Observed breadcrumb | Result |
| --- | --- | --- |
| Direct load `/dashboard/users/create` | Dashboard / Users / Create | Passed |
| Refresh Create | Dashboard / Users / Create | Passed |
| Direct load `/dashboard/users/123` | Dashboard / Users / 123 | Passed |
| Refresh numeric detail | Dashboard / Users / 123 | Passed |
| Direct load `/dashboard/users/123/edit` | Dashboard / Users / 123 / Edit | Passed |
| Client navigate Create → Users | Dashboard / Users | Passed; zero document requests |
| Client navigate Users → `ada-lovelace` | Dashboard / Users / ada-lovelace | Passed; zero document requests |
| Client navigate Detail → Edit | Dashboard / Users / ada-lovelace / Edit | Passed; zero document requests |
| Refresh Edit | Dashboard / Users / ada-lovelace / Edit | Passed |
| Click the ID parent from Edit | Dashboard / Users / ada-lovelace | Passed; zero document requests |

Every supported depth now has an exact breadcrumb-slot match, so sibling and nested client navigations replace the slot instead of retaining old breadcrumb content.

### Phase boundary

Phase 3 uses raw route IDs as temporary labels. Resolving IDs to entity names remains future work.

## Phase 4: Server-resolved entity labels

### Server-only mock repository

`src/lib/users.ts` is guarded by the `server-only` marker and owns the mock records `123 → Sokha` and `456 → Dara`. `getUserById(id)` is asynchronous and waits 650 ms to simulate a real database or service call before returning a user or `null`.

The lookup is wrapped in React `cache()`. During one server render, the content page and the parallel breadcrumb page call the same function with the same ID, so React can reuse that request instead of repeating the repository work. Nothing from the repository is fetched through `useEffect()`, exposed through a Client Component, or sent to an external backend.

The server-rendered Users list reads the same repository to produce links for Sokha and Dara. Prefetching is disabled on the experiment's entity links so the intentionally slow navigation and its loading UI remain directly observable.

### Server rendering flow

For `/dashboard/users/123`, Next.js matches the dynamic content page and dynamic breadcrumb page in parallel. Each receives and awaits `params`, then calls the memoized `getUserById("123")`. Once the shared lookup resolves, the content page renders Sokha's profile and the breadcrumb slot renders **Dashboard / Users / Sokha**.

The Edit route follows the same flow and renders **Dashboard / Users / Sokha / Edit**. The user name is a parent link there, while Edit remains the non-clickable current item. Raw IDs are no longer used as visible labels for valid users.

### Loading behavior

Both dynamic branches define `loading.tsx` Server Components:

- `dashboard/users/[id]/loading.tsx` renders the content skeleton.
- `dashboard/@breadcrumbs/users/[id]/loading.tsx` renders **Dashboard / Users / Resolving user…**.

During the simulated delay, Next.js streams those fallbacks. Browser tests confirmed that the old entity breadcrumb is removed while loading, both loading states are visible, and the resolved name replaces them without a full document request.

### Not-found behavior

Every dynamic page checks the lookup result and calls Next.js `notFound()` when it receives `null`. Each dynamic branch has a colocated `not-found.tsx`, producing a breadcrumb ending in **User not found** and content with a return link to `/dashboard/users`. Next.js also injects `noindex` metadata.

Because a loading boundary begins streaming before the lookup finishes, the initial HTTP response has already started and retains status 200; the streamed React response carries Next.js's not-found signal and renders the defined 404 UI. This is the expected streamed not-found behavior rather than an application-level error response.

### Verification results

| Test | Result |
| --- | --- |
| Direct `/dashboard/users/123` | Dashboard / Users / Sokha |
| Direct `/dashboard/users/123/edit` | Dashboard / Users / Sokha / Edit |
| Direct `/dashboard/users/456` | Dashboard / Users / Dara |
| Direct `/dashboard/users/456/edit` | Dashboard / Users / Dara / Edit |
| Navigate Users → Sokha | Both loading fallbacks shown, then Sokha; zero document requests |
| Navigate Sokha → Edit | Loading shown, then Sokha / Edit; zero document requests |
| Navigate through Users → Dara | No Sokha trail remained; loading shown, then Dara |
| Refresh Dara | Dara remained in the breadcrumb and content |
| Direct unknown ID `999` | Custom user not-found UI and `noindex` rendered |

### Phase boundary

Phase 4 resolves names from a server-only in-memory repository. A production database, external API, mutations, and cache invalidation remain outside this phase.

## Phase 5: Reusable breadcrumb architecture

### Before and after

Before the refactor, nine route files each implemented their own `<nav>`, `<ol>`, links, separators, current-page markup, classes, and diagnostic trail formatting. The files repeated roughly 300 lines of JSX, and small styling or accessibility changes had to be copied across every route.

After the refactor, `src/components/breadcrumbs/breadcrumbs.tsx` owns rendering while every explicit `@breadcrumbs` route owns only its ordered item data and any route-specific entity resolution. Two repeated dashboard parent links live in `@breadcrumbs/breadcrumb-items.ts`. The parallel route tree and its matching behavior did not change.

### Typed data model and API

`Breadcrumbs` accepts a readonly array of `BreadcrumbItem` values and an optional `pending` flag. The item type is a discriminated union covering:

- A linked parent with `label` and `href`.
- A current item with `label` and `current: true`.
- Plain text without a destination, used by the pending “Resolving user…” state.

The type prevents a current item from also declaring an `href`, preserving the rule that active breadcrumbs are non-clickable. Route pages use a small API such as:

```tsx
<Breadcrumbs
  items={[
    dashboardBreadcrumbLink,
    usersBreadcrumbLink,
    { label: user.name, current: true },
  ]}
/>
```

The component derives separators and the full diagnostic trail from the ordered items. Static, dynamic, loading, default, and not-found breadcrumb files all use the same renderer.

### Separation of responsibilities

The reusable component knows how to render breadcrumb data but knows nothing about dashboard routes, params, users, or repositories. Conversely, the dynamic parallel-route pages still await params, call the server-only `getUserById()`, handle `notFound()`, and then pass the resolved label into the renderer.

This keeps entity resolution on the server and preserves explicit parallel-route ownership. No global state, context, catch-all route, pathname parsing, or custom routing layer was introduced.

### Accessibility and responsive behavior

The shared renderer provides one `<nav aria-label="Breadcrumb">` containing an ordered list. Separators are presentational list items with `aria-hidden="true"`, while the active non-link text receives `aria-current="page"`. Pending navigation uses `aria-busy="true"`.

The list uses wrapping flex layout, constrained widths, and breakable labels. Browser verification at a 320 px viewport confirmed that Dashboard, Users, Detail, Edit, Settings, and not-found trails remain within the breadcrumb container.

### Tradeoffs

The item model intentionally describes only labels, destinations, and current state. It does not add icons, arbitrary render callbacks, nested configuration, global route metadata, or automatic URL interpretation. Route pages still contain small explicit arrays; this slight repetition keeps route ownership visible and avoids turning the component into a routing framework.

### Verification results

- Every existing static and dynamic trail rendered unchanged.
- Parent destinations remained correct, including Sokha → `/dashboard/users/123` on Edit.
- Each resolved route rendered exactly one non-link current item.
- Separator counts matched route depth and remained hidden from assistive technology.
- Sokha and Dara transitions showed the pending state with no stale trail and no document reload.
- Refresh preserved **Dashboard / Users / Sokha / Edit**.
- Unknown users retained the custom not-found breadcrumb and `noindex` behavior.
- The reusable renderer and all route files remained Server Components.

### Phase boundary

Phase 5 establishes a reusable rendering layer without changing route discovery or entity resolution. Broader route metadata, catch-all breadcrumb generation, and client-managed breadcrumb state remain outside this phase.

## Phase 6: Dashboard shell and global AppNavbar

### Updated component tree

The dashboard layout now owns a single application shell:

```text
DashboardLayout
├── AppSidebar
│   └── Dashboard navigation links
└── Main column
    ├── AppNavbar
    │   ├── breadcrumbs ReactNode
    │   └── application-context placeholders
    └── main
        └── children ReactNode
```

`AppSidebar` contains the existing brand and dashboard links. `AppNavbar` renders once in `dashboard/layout.tsx`, receives the parallel-route `breadcrumbs` node, and places it on the left. Region, Language, Theme, Notifications, and Profile appear on the right as clearly labeled, non-interactive text placeholders.

### Server and client boundaries

`DashboardLayout`, `AppSidebar`, `AppNavbar`, the reusable `Breadcrumbs` renderer, and every breadcrumb route remain Server Components. No `"use client"` boundary or hydrated control was added.

The data flow remains one-way and server-owned:

1. The matching `@breadcrumbs` page resolves any params and user data on the server.
2. Next.js passes that rendered node to `DashboardLayout` as `breadcrumbs`.
3. The layout passes the opaque node to `AppNavbar`.
4. `AppNavbar` positions the node but does not inspect routes, fetch users, or construct breadcrumb items.

Future interactive controls should replace individual placeholders with small Client Components rather than converting the entire navbar.

### Responsive shell

At large breakpoints the dashboard uses a 16 rem sidebar column and a minimum-zero main column. The sidebar becomes a top section on narrow screens, while the navbar stacks breadcrumbs above the application-context list. Both the breadcrumb list and placeholder list wrap.

Browser checks at 320 px confirmed that the sidebar precedes the navbar vertically, the navbar remains inside the viewport, and a four-level dynamic breadcrumb does not overflow. At desktop width the sidebar and navbar/main column render side by side.

### Verification results

- Exactly one `AppNavbar`, one `<header>`, and one `AppSidebar` rendered at initial load, after navigation history, and after refresh.
- The breadcrumb navigation rendered inside the navbar on every checked route.
- No dashboard page rendered an additional header or navbar.
- All five right-side placeholders rendered, with no links, buttons, inputs, or selects.
- Users → Sokha → Edit, back to Detail and Users, then forward to Detail and Edit preserved correct breadcrumbs with zero document requests.
- Refresh preserved **Dashboard / Users / Sokha / Edit** and did not duplicate the shell.
- All static, dynamic, loading, and not-found routes retained their previous behavior.

### Architectural concerns

The placeholders intentionally provide no controls yet, so they should not be presented as interactive. When real region, language, theme, notification, or profile behavior is introduced, each state owner and client boundary will need to be chosen deliberately. The navbar should continue to receive server-rendered breadcrumbs rather than becoming responsible for route parsing or entity lookup.

### Phase boundary

Phase 6 establishes the global dashboard shell only. It does not implement sidebar state, theme switching, localization, notifications, profile menus, or additional backend integration.

## Phase 7: Automated Parallel Route hardening

### Playwright configuration

Playwright Test is now a development dependency with a Chromium project. `playwright.config.ts` uses one worker, stable production base URL `http://127.0.0.1:3100`, failure-only screenshots, retained failure traces, and the built-in `webServer` lifecycle. The server command runs `next build` followed by `next start`, so the suite exercises the production App Router rather than the development server.

Tests use accessibility locators and application-owned state attributes. Assertions are auto-retrying; the suite contains no fixed sleeps and does not suppress failures. Generated reports and test artifacts are ignored by Git.

### Automated scenarios

Four tests in `tests/e2e/breadcrumbs.spec.ts` cover:

1. Direct loading of all eight supported static, nested, and dynamic routes.
2. Hard refresh of `/dashboard/users/123/edit`.
3. The complete sequence: Users → Sokha detail → Sokha edit → Back → Users → Dara detail → Settings → Refresh → Back → Forward.
4. Direct loading of unknown Detail and Edit IDs with the streamed not-found boundaries.

The shared assertion verifies the exact trail, current label, parent destination URLs, one non-link `aria-current="page"`, hidden separator count, and one global navbar. Slow entity transitions additionally verify both loading boundaries and assert that no resolved breadcrumb trail remains while the replacement is loading.

The navigation sequence counts document-navigation requests. Only the initial direct load and intentional refresh create document requests; Links and browser history transitions remain client-side.

### Results

The unchanged suite passed all four tests against the production build in 17.1 seconds:

```text
4 passed (17.1s)
```

No breadcrumb, routing, loading, accessibility, or not-found application bug was reproduced, so no production architecture change was made in this phase.

### Environment-dependent failure

The first `pnpm test:e2e` attempt built and started the application successfully but all four browser launches failed before test code ran. This WSL image lacks Chromium runtime libraries `libnspr4.so`, `libnss3.so`, and `libasound.so.2`, and sudo is unavailable.

For verification, those three Ubuntu packages were downloaded and extracted into an isolated temporary directory, supplied through `LD_LIBRARY_PATH`, and removed after the successful run. On a normal development or CI host, `pnpm exec playwright install --with-deps chromium` installs the supported browser and operating-system dependencies before `pnpm test:e2e`.

### Remaining risks

- The committed suite currently targets Chromium only; Firefox and WebKit differences are not covered.
- The mock repository and fixed delay do not model production database failures, timeouts, or cache invalidation.
- Streamed unknown-user responses intentionally begin with HTTP 200 before `notFound()` resolves; tests assert the rendered not-found UI and `noindex`, not a transport-level 404.
- The tests validate structure, behavior, and narrow-layout invariants but do not use visual snapshots.

### Phase boundary

Phase 7 adds production end-to-end coverage and records current edge-case behavior. It does not redesign the Server Component or Parallel Route architecture.

## Phase 8: Water Vending architecture pilot

### Feature integration

The Water Vending pilot adds list, create, detail, and edit pages below `/dashboard/water-vending`. Its explicit `@breadcrumbs/water-vending` branch mirrors those route shapes and feeds the same reusable `Breadcrumbs` component used by Users. The dashboard layout and `AppNavbar` did not gain any Water Vending knowledge; the only shared-shell change is a sidebar link to enter the feature.

The resulting trails are:

- `/dashboard/water-vending` → **Dashboard / Water Vending**
- `/dashboard/water-vending/create` → **Dashboard / Water Vending / Create**
- `/dashboard/water-vending/004915` → **Dashboard / Water Vending / 004915**
- `/dashboard/water-vending/004915/edit` → **Dashboard / Water Vending / 004915 / Edit**

### Server-resolved vending data

`src/lib/vending-machines.ts` is marked `server-only` and stores the mock vending unit `004915`. Both the content and breadcrumb branches await Next.js 16 asynchronous params and call the cached `getVendingMachineByCode()` lookup. The resolved `displayCode` supplies the breadcrumb label, while the detail page reuses the entity's location and status. A simulated delay makes both route-local loading boundaries observable.

Unknown codes call `notFound()` in both branches. Their colocated boundaries render **Vending unit not found**, a parent link to Water Vending, content-level recovery navigation, and Next.js `noindex` metadata. As with Users, the loading boundary means this streamed not-found result starts with HTTP 200.

### Architecture assessment

This pilot demonstrates that feature growth is additive at the route edge: a feature contributes pages, explicit breadcrumb matches, server lookup code, and an entry link. The global navbar continues to position an opaque breadcrumb React node and therefore requires no per-feature conditions, pathname parsing, or client hydration.

The main tradeoff remains explicit file count. Four feature routes require matching breadcrumb pages plus loading and not-found boundaries. That repetition is intentional: route ownership, parent destinations, server data dependencies, and error behavior remain visible instead of moving into a global routing framework.

### Automated coverage

The Phase 7 Playwright suite now directly loads all four Water Vending routes and checks exact labels, destination URLs, separators, active-page semantics, and single-navbar ownership. A dedicated sequence covers list → create → back → detail → edit → back/forward → refresh, including loading fallbacks and document-navigation counts. Unknown detail and edit codes exercise the streamed not-found boundaries. Existing Users scenarios remain unchanged as regression coverage.

All six scenarios passed against the production build in 29.5 seconds. The WSL host still required the same temporary Chromium runtime-library workaround documented in Phase 7; the application and test code ran unchanged.

### Production migration learning

`docs/production-migration-plan.md` translates the pilot into a gradual, reversible rollout. A real application should first inventory page-level headers and route ownership, then migrate complete route cohorts. During coexistence each route must have one explicit header owner—legacy or global—and end-to-end tests should enforce that invariant. No production paths are assumed by the plan.

### Phase boundary

Phase 8 validates the architecture with mock data only. It does not connect a vending backend, implement forms or mutations, alter production code, or introduce automatic catch-all breadcrumbs.

## Phase 9: Catch-all breadcrumb evaluation

An isolated `experiment/phase-9-catch-all` branch replaced the explicit Settings and Water Vending breadcrumb pages with `@breadcrumbs/[...segments]`, while Users remained explicit as a precedence control. The catch-all received `segments: string[]` asynchronously and successfully mapped static routes, action segments, vending codes, and Edit routes. Server-only cached vending lookup continued to work.

All six existing production navigation scenarios passed. A seventh probe proved that explicit Users routes take precedence over the catch-all, but also exposed a dangerous fallback: when a valid content route lacked a central breadcrumb mapping, `notFound()` from the breadcrumb slot caused the entire response to be HTTP 404 with `noindex`, even though the valid page and fallback breadcrumb both rendered.

The experiment reduced seven files to three but reduced implementation size by only ten lines, from 143 to 133. The 102-line catch-all page required 11 route-shape decisions and replaced route-local loading and error semantics with centralized branching. The final seven-scenario production suite passed in 33.2 seconds after encoding the observed fallback behavior.

The catch-all experiment is preserved at commit `7e15cf1`, while `main` was restored to the explicit Phase 8 route architecture. The recommendation is to retain explicit breadcrumb routes for feature ownership and failure isolation. Full evidence and comparison are in `docs/phase-9-catch-all-evaluation.md`.

### Phase boundary

Phase 9 evaluates but does not adopt catch-all breadcrumb generation. It introduces no global pathname parser and makes no production change.

## Water Vending breadcrumb presentation update

The shared breadcrumb renderer now uses a compact white surface, muted parent links, `>` separators hidden from assistive technology, and a dark bold current-page label. Its semantic `nav`, ordered list, parent links, and non-link `aria-current="page"` behavior remain unchanged.

Water Vending trails intentionally present the feature and page type rather than the full dashboard and entity hierarchy:

- Feature root: **Water Vending**
- Detail: **Water Vending > Detail**
- System Log: **Water Vending > System Log**
- Create: **Water Vending > Create**
- Edit: **Water Vending > Edit**

The new `/dashboard/water-vending/[code]/system-log` page uses the same asynchronous server-only entity lookup, loading boundary, and not-found behavior as Detail and Edit. Validity remains server-resolved even though the visible breadcrumb no longer exposes the entity code.
