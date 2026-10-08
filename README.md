# Next Routing Lab

An isolated Next.js 16 project for learning App Router concepts in small,
deliberate phases.

## Getting started

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), then enter the dashboard.

## Routes

- `/dashboard`
- `/dashboard/users`
- `/dashboard/users/create`
- `/dashboard/users/[id]`
- `/dashboard/users/[id]/edit`
- `/dashboard/settings`
- `/dashboard/water-vending`
- `/dashboard/water-vending/create`
- `/dashboard/water-vending/[code]`
- `/dashboard/water-vending/[code]/edit`
- `/dashboard/water-vending/[code]/system-log`

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## End-to-end tests

Install Chromium and its operating-system dependencies once, then run the
production Playwright suite:

```bash
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
```

The Playwright configuration builds the application and starts `next start` on
port 3100 before running the tests.

See [`docs/learning-log.md`](docs/learning-log.md) for the routing notes and
[`docs/production-migration-plan.md`](docs/production-migration-plan.md) for the
gradual page-header migration strategy.
