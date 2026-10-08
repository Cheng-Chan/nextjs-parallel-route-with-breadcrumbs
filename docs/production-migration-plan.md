# Production Migration Plan: Page Headers to a Global AppNavbar

## Purpose and boundaries

This plan uses the Water Vending pilot to describe a gradual migration from route-owned `PageTopNavigation` headers to one dashboard-layout-owned `AppNavbar`. It is deliberately path-agnostic: a real application must first discover its own layout tree, route ownership, data sources, and deployment controls. No production repository or production file path is assumed or changed by this lab.

## Existing implementation audit

Before changing production code, record:

- Every route that renders `PageTopNavigation`, including conditional, nested-layout, loading, error, and not-found variants.
- Which layout currently owns the sidebar, main content region, sticky positioning, responsive breakpoints, and global controls.
- Header inputs such as titles, breadcrumb items, permissions, localization, entity lookups, actions, and feature flags.
- Routes that omit a header intentionally or render more than one header today.
- Existing Parallel Route slots and whether every hard-loadable route has a matching page or explicit `default.tsx` fallback.
- Server-versus-client boundaries, especially any page header that fetches data in the browser.
- Accessibility behavior, focus order, landmark names, narrow-screen overflow, and current automated coverage.
- Operational constraints: release cohorts, observability, rollback switches, and teams that own affected route groups.

Turn the audit into a route inventory with an owner and current/target header status. The inventory is the migration checklist; folder names should come from the production repository rather than this experiment.

## Target architecture

```text
DashboardLayout
├── AppSidebar
└── Main
    ├── AppNavbar (rendered once)
    │   ├── server-rendered @breadcrumbs slot
    │   └── global region/language/theme/notification/profile areas
    └── active page children

@breadcrumbs route branch
├── explicit static breadcrumb pages
├── explicit dynamic breadcrumb pages
├── loading and not-found boundaries where entity lookup is asynchronous
└── default.tsx for unmatched hard navigation
```

The dashboard layout owns placement. The navbar accepts an opaque `ReactNode` and has no feature-specific route logic. Each breadcrumb route owns its ordered items and performs any entity lookup on the server before using the shared, typed breadcrumb renderer.

## Soft migration sequence

1. **Baseline the current UI.** Capture route-level screenshots or structural assertions, header counts, destination URLs, accessibility semantics, and direct/soft/history behavior before refactoring.
2. **Add the shared primitives.** Introduce the typed breadcrumb renderer and a layout-capable `AppNavbar` without switching user-visible ownership yet.
3. **Add the slot safely.** Introduce the named breadcrumb slot with an explicit fallback, then add explicit breadcrumb matches for one low-risk pilot route family.
4. **Enable one route cohort.** Use the application's existing release mechanism or a dedicated route-group/layout boundary to render the global navbar for the pilot while suppressing its legacy page header.
5. **Validate the cohort.** Exercise every route depth, dynamic entity, loading state, not-found state, direct load, refresh, Link transition, and browser history transition.
6. **Expand in small cohorts.** Migrate related route families together. Resolve their entity labels in route-specific server code and keep the shared navbar unchanged.
7. **Retire the legacy header.** Remove `PageTopNavigation` only after the inventory shows no remaining consumer and regression tests cover the global shell.

## Temporary coexistence

During rollout, unmigrated routes continue to render their current page-level header. Migrated routes render breadcrumbs through the global shell and explicitly disable or omit their legacy header. Coexistence is a route-ownership decision, not a runtime pathname parser inside the navbar.

Prefer a boundary already aligned with the route tree or an explicit migration flag owned outside `AppNavbar`. The global navbar remains generic in both states. Do not make individual features add conditionals, entity repositories, or label maps to the navbar.

## Duplicate-header prevention

- Define exactly one header owner for every route in the migration inventory: `legacy` or `global`, never both.
- Make suppression of `PageTopNavigation` part of the same route-cohort change that enables the global navbar.
- Add an end-to-end assertion that each migrated route contains exactly one application navbar/header landmark.
- Search for residual page-level header imports before a cohort is signed off.
- Review loading, error, and not-found branches as separate render paths; they can otherwise reintroduce a second header.
- Keep page content free of global navigation after migration. Route-specific actions may remain in content, but they should not reproduce the application navbar.

## Route-by-route validation

For each inventory entry, verify this matrix and record evidence:

| Area | Checks |
| --- | --- |
| Rendering | Direct load, hard refresh, valid nested route, unknown entity, loading and error boundaries |
| Navigation | Parent links, sibling transitions, nested transitions, browser back, browser forward |
| Breadcrumbs | Exact labels, exact destinations, one current non-link item, no stale label during loading |
| Shell | One navbar, one sidebar, no legacy duplicate, feature pages do not modify global controls |
| Data | Dynamic label resolved server-side, authorization preserved, no browser-only entity fetch |
| Accessibility | Named navigation landmark, ordered list, hidden separators, `aria-current="page"`, focus order |
| Responsive UI | Narrow viewport wrapping, no horizontal overflow, sticky behavior where applicable |

The pilot route family should pass the full matrix before another cohort starts. Existing unrelated route tests must stay green after every cohort.

## Testing strategy

- Keep TypeScript strict checks, lint, and production builds as required gates.
- Run end-to-end navigation tests against a production server, using role-based locators and auto-retrying assertions rather than arbitrary sleeps.
- Assert exact breadcrumb trails and URLs for direct, soft, refresh, back, and forward navigation.
- Assert the loading breadcrumb replaces the old resolved trail while server data is pending.
- Cover known and unknown dynamic entities, including custom not-found UI and indexing metadata.
- Count full-document navigation requests where useful to distinguish Link navigation from reloads.
- Add narrow-screen checks and accessibility scans to the production pipeline already used by the application.
- Monitor client/server exceptions, not-found rates, navigation timing, and duplicate-header reports during a staged rollout.

## Rollback strategy

Keep the legacy page header available until its route cohort is signed off. If a cohort regresses, disable the cohort's global-navbar switch or restore its previous layout ownership, then redeploy; unaffected migrated cohorts can remain enabled when the release mechanism permits it.

Rollback should restore the previous header and breadcrumb source together so two headers cannot appear. The breadcrumb slot fallback must remain valid while routes are reverted. Because this change does not migrate persistent data, rollback requires no data repair. After rollback, preserve failure traces and route telemetry, fix the explicit route branch, and rerun the complete route matrix before trying the cohort again.

## Recommendation

Use Water Vending as the first production-shaped cohort only after the audit identifies its real route boundary and current header ownership. Ship the shared renderer and global shell behind a reversible cohort control, migrate one complete route family at a time, and require one-header plus navigation-history assertions before expansion. The lab shows that a feature can supply static and server-resolved dynamic breadcrumbs without adding feature logic to `AppNavbar`; preserving that boundary is the main architectural guardrail.
