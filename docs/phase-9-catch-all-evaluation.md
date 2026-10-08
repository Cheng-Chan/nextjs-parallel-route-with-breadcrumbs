# Phase 9: Catch-All Parallel Route Evaluation

## Experiment boundary

Phase 8 was committed as baseline `de7deba` on `main`. The isolated branch `experiment/phase-9-catch-all` contains experiment commit `7e15cf1`. The experiment replaced the explicit Settings and Water Vending breadcrumb pages with `@breadcrumbs/[...segments]`, retained Users as an explicit-route control, and added one intentionally unmapped probe page.

After collecting evidence, `main` was restored to the explicit Phase 8 implementation. The experimental branch remains available for inspection and comparison.

Next.js defines `[...segments]` as a catch-all Dynamic Segment whose asynchronous `params` value is an array of all captured path segments. Parallel Route slots still use partial rendering during soft navigation and `default.tsx` for unmatched slots on a hard load. In this experiment, the catch-all matched every non-root dashboard subpath, so its resolver—not `default.tsx`—became responsible for unsupported non-root paths. See the official [Dynamic Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) and [Parallel Routes](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes) references.

## Explicit-route architecture assessment

The explicit architecture mirrors each supported content route in `@breadcrumbs`. Route files only declare their ordered breadcrumb items and route-specific server work. Dynamic Users and Water Vending pages await their own params, resolve entities through server-only cached repositories, and own contextual loading and not-found boundaries.

Its primary cost is file count. Settings plus the six Water Vending breadcrumb files use seven files and 143 lines. Most repetition is structural rather than behavioral and is already reduced by the shared typed `Breadcrumbs` component and shared parent items.

The benefits are strong ownership, local error semantics, route-specific loading labels, direct correspondence with the App Router tree, and small review surfaces. Adding a feature cannot silently change unrelated breadcrumb resolution.

## Catch-all architecture assessment

The experiment reduced those seven explicit files to three catch-all files, but only reduced implementation size from 143 to 133 lines. The catch-all page alone grew to 102 lines and required 11 route-shape decisions to distinguish Settings, Water Vending, Create, Detail, Edit, malformed depths, and missing entities.

Static and dynamic resolution worked:

- `segments = ["settings"]` rendered Settings.
- `segments = ["water-vending"]` rendered the feature root.
- `segments = ["water-vending", "create"]` rendered Create.
- `segments = ["water-vending", "004915"]` performed the cached server lookup and rendered the display code.
- `segments = ["water-vending", "004915", "edit"]` resolved the entity and rendered Edit.

Specific routes had precedence over the catch-all. Source assertions proved that all Users routes continued to render their explicit breadcrumb pages, while Settings and Water Vending rendered through `[...segments]` on direct loads, refreshes, soft navigation, and browser history restoration.

Server Components and server-only repositories remained compatible. However, generic loading could only say **Resolving route…**, whereas explicit Water Vending loading could name its domain. Missing vending entities also required the catch-all to manually reproduce the feature's not-found breadcrumb while the content branch independently called `notFound()`.

## Fallback finding

An intentionally valid content route with no catch-all mapping caused the breadcrumb resolver to call `notFound()`. Its local breadcrumb not-found UI and the valid page content both rendered, but the complete response was HTTP 404 and received `noindex` metadata. Refresh produced the same result.

This is a significant coupling hazard: forgetting to update the central breadcrumb resolver can misclassify a valid page as not found. Returning a generic breadcrumb instead would avoid the 404 but could hide missing route ownership and produce low-quality navigation. The explicit implementation instead requires a visible route file and keeps each feature's not-found semantics local.

## Comparison

| Criterion | Explicit routes | Catch-all experiment |
| --- | --- | --- |
| Code duplication | More small files; shared renderer removes JSX duplication | 7 files became 3, but only 143 lines became 133 |
| Routing correctness | File system expresses supported route shapes | Central condition order and segment-length checks express route shapes |
| Dynamic entities | Route-local server lookup with domain-specific params | Server lookup works, but the resolver must identify each domain and param position |
| Server Components | Fully compatible | Fully compatible |
| Hard/soft navigation | Passed direct, refresh, Link, back, and forward tests | Same supported scenarios passed |
| Loading behavior | Contextual per-feature pending trails | One generic catch-all boundary unless more nested explicit structure is reintroduced |
| Not-found behavior | Contextual and colocated with the dynamic route | Missing entities require manual duplication; unmapped valid routes can become global 404/noindex responses |
| Slot/default behavior | `default.tsx` protects genuinely unmatched hard loads | Catch-all shadows `default.tsx` for non-root paths; resolver fallback becomes authoritative |
| Stale-slot risk | Exact matches prevent staleness for supported routes; omissions must be tested | Broad match reduces unmatched-slot preservation but raises wrong-mapping and fallback risks |
| Adding a feature | Add small files beside the feature's route shape | Edit a central switch and its cross-feature tests |
| Large-platform ownership | Features remain independently reviewable | Central resolver becomes a coupling and merge-conflict hotspot |

## Verification evidence

- `pnpm lint`: passed on the experiment.
- `pnpm typecheck`: passed on the experiment.
- `pnpm build`: passed with Next.js 16.4.0.
- Original six production E2E scenarios: passed with the hybrid catch-all.
- Final experimental suite: seven passed in 33.2 seconds.
- The seventh scenario verified explicit-route precedence and the observed 404/noindex fallback behavior.
- The standard WSL Chromium runtime-library workaround from Phase 7 was still required; test code ran unchanged by that environment setup.

Runtime duration is not treated as a useful architecture performance comparison because the final suite added a seventh scenario and build/start time dominates this small sample. Test reliability and semantic outcomes are the relevant measurements.

## Limitations

- Only the current dashboard shapes and one entity repository were tested.
- The experiment did not cover localization, authorization-dependent trails, route groups, intercepted routes, or multiple entity types in one trail.
- A larger resolver would likely need registries or handler abstractions, recreating a custom routing layer that the architecture intentionally avoids.
- Catch-all ordering is easy to make ambiguous when a static action name can also be a valid dynamic identifier.
- A generic loading boundary loses feature-specific context; restoring it requires nested boundaries or more explicit routes.
- The experiment ran in Chromium only.

## Recommendation

Keep explicit `@breadcrumbs` routes as the production architecture. They align breadcrumb ownership with the App Router, keep entity resolution and error behavior local, and have the strongest failure isolation for a large administration platform.

Do not merge the catch-all experiment into `main`. A narrowly scoped catch-all can be useful when all captured paths intentionally share one behavior, such as dismissing an unmatched modal slot, but it should not become a global breadcrumb pathname parser. The measured file reduction did not justify the centralized condition tree or the valid-page 404 risk.

## Final learning summary

Catch-all params are technically capable of producing both static and server-resolved dynamic breadcrumbs, and explicit sibling routes correctly take precedence. That answers feasibility, not suitability. For breadcrumbs, route semantics, domain-specific loading, entity failures, and ownership matter more than minimizing files. The explicit architecture remains the safer and more maintainable choice.
