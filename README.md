# Cartify

A premium ecommerce frontend, built to look and feel like a real production
application from day one — ready to plug into a Spring Boot backend later
with no UI redesign required.

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS v4 (CSS-first `@theme` tokens, see `src/styles/tokens.css`)
- React Router v6
- Framer Motion (page transitions, micro-interactions)
- Zustand (client state — theme, cart, wishlist, etc.)

## Design tokens

- **Colors**: `ink` (dark surfaces), `porcelain` (light surfaces), `cobalt` (primary
  accent), `gold` (sparing luxury accent for prices/badges/ratings).
- **Type**: `Fraunces` (display/editorial), `Inter` (UI/body), `JetBrains Mono`
  (all prices & tabular data — the "price ticker" signature detail).
- Dark mode via a `.dark` class on `<html>`, toggled by `useThemeStore`
  (`src/store/useThemeStore.ts`), persisted to `localStorage`.

## Folder structure

```
src/
  app/            route configuration (router.tsx)
  components/
    layout/       RootLayout, AdminLayout (header/footer/sidebar land here later)
    shared/       cross-feature components (PhasePlaceholder, PageTransition)
    ui/           design-system primitives (Button, Card, Modal, etc. — Phase 1)
  features/       one folder per feature area (home, catalog, product, cart, ...)
  hooks/          shared React hooks
  store/          Zustand stores
  types/          shared TypeScript interfaces (mirrors future API shape)
  mocks/          realistic mock data (products, categories, brands, orders, ...)
  lib/            utilities (cn, formatPrice, formatDate)
  styles/         Tailwind v4 token file
```

## Routing

Every page in the full Cartify spec is already routed in
`src/app/router.tsx`, rendering a `PhasePlaceholder` until its real UI is
built in its assigned phase. This means navigation, deep links, and the
overall app shell are testable end-to-end starting now — no route is ever
"missing," it just hasn't been designed yet.

## Commands

```bash
npm install
npm run dev        # start local dev server
npm run build       # type-check + production build
npm run typecheck   # type-check only
npm run preview     # preview the production build
```

## Backend integration (future)

All mock data lives in `src/mocks/*.ts` and mirrors the shape defined in
`src/types/index.ts`. When the Spring Boot API is ready, these files are
swapped for real `fetch`/API-client calls — component code does not change.
