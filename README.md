# Pizza Ordering Full-Stack Project

A full‑stack demo pizza ordering application consisting of:

- **Frontend:** `pizza-project/` – React 19 + Vite 7, TanStack Router + React Query, modular routes (lazy loaded), custom hooks, Vitest + Testing Library (+ browser tests with happy-dom / @vitest/browser & Playwright infra).
- **Backend API:** `citr-v9-project/api/` – Fastify + SQLite (promised-sqlite3) exposing pizza catalog, pizza of the day, ordering, past orders (paginated), and contact form endpoints; serves static pizza images.

> Parts of the backend folder originate from the "Complete Intro to React v9" course material. The frontend here customizes and extends those concepts into a cohesive pizza shop.

---

## Quick Start (Windows Friendly)

### 1. Prerequisites

- Node.js 20.x LTS recommended (matches course baseline).
- npm (bundled with Node).  
  (No environment variables required.)

### 2. Install Dependencies

Open two terminals from the project root:

Frontend:

```
cd pizza-project
npm install
```

Backend API:

```
cd citr-v9-project\api
npm install
```

### 3. Run Development Servers

Backend (port 3000 by default):

```
cd citr-v9-project\api
npm run dev
```

> dev vs start (Why dev here?): `npm run dev` uses `node --watch server.js`, automatically restarting the Fastify server whenever you change backend files. Use this while coding. `npm start` runs `node server.js` once with no watching – better for a production-like run or when you want stable logs.

Frontend (Vite dev server, typically port 5173):

```
cd pizza-project
npm run dev
```

### Dev vs Production Commands (Summary)

| Layer    | Development (hot reload / watch)        | Production-style local run                             |
| -------- | --------------------------------------- | ------------------------------------------------------ |
| Backend  | `cd citr-v9-project\api && npm run dev` | `cd citr-v9-project\api && npm start`                  |
| Frontend | `cd pizza-project && npm run dev`       | `cd pizza-project && npm run build && npm run preview` |

Typical two-terminal dev workflow:

```
# Terminal 1 (API)
cd citr-v9-project\api
npm run dev

# Terminal 2 (Frontend)
cd pizza-project
npm run dev
```

Production-style preview (no file watching):

```
cd citr-v9-project\api
npm start server

cd ..\..\pizza-project
npm run build
npm run preview
```

If you only run `npm start` in the backend during development you will NOT see automatic restarts after code edits; remember to re-run it manually or prefer the `dev` script.

Visit: http://localhost:5173 (frontend) – it proxies/fetches API calls to http://localhost:3000 where necessary (ensure both are running).

### 4. Build (Frontend)

```
cd pizza-project
npm run build
npm run preview
```

### 5. Run Tests

All tests (Node + browser):

```
cd pizza-project
npm test
```

Browser-focused (happy-dom / @vitest/browser):

```
npm run test:browser
```

Coverage:

```
npm run coverage
```

Interactive UI:

```
npm run test:ui
```

---

## Project Structure

```
my-pizza-project/
  README.md                <-- (this file)
  pizza-project/           <-- React frontend (app + tests)
    src/
      routes/              <-- File‑based route modules (TanStack Router lazy routes)
      api/                 <-- Fetch wrappers for backend endpoints
      __tests__/           <-- Vitest specs + snapshots
      usePizzaOfTheDay.jsx <-- Custom data-fetch hook with useDebugValue
      PizzaOfTheDay.jsx    <-- Sidebar / footer style promo component
      Cart.jsx, Header.jsx, Pizza.jsx, Modal.jsx, contexts.jsx
  citr-v9-project/
    api/                   <-- Fastify server (SQLite db + static assets)
      server.js            <-- All endpoints
      pizza.sqlite         <-- Seeded database
      public/              <-- Static assets (fonts, images)
```

---

## Frontend Highlights

- **TanStack Router** for modern routing (code-splitting via `createLazyFileRoute`).
- **React Query (TanStack Query)** for data caching, pagination (past orders), and background refetch control.
- **Context API** for simple cart state (`CartContext`).
- **Custom Hook** `usePizzaOfTheDay` demonstrates `useDebugValue` & async fetch lifecycle.
- **Testing**: Component tests (JSDOM/happy-dom), hook tests with mocked `fetch`, snapshot example, and browser-capable Vitest configuration.
- **Devtools**: React Query Devtools & TanStack Router Devtools mounted in root route for observability.

### Key Components

- `routes/order.lazy.jsx` – build & submit cart (checkout triggers POST /api/order).
- `routes/past.lazy.jsx` – pagination + modal detail fetch with dependent queries.
- `routes/contact.lazy.jsx` – mutation example with optimistic UI state handling.
- `Cart.jsx` – derives total cost each render (could be memoized if large carts).
- `PizzaOfTheDay.jsx` – daily rotating selection computed server-side.

---

## Backend (Fastify + SQLite)

Single file server (`server.js`) opens `pizza.sqlite` and exposes REST endpoints while serving static assets under `/public/`.

### Endpoint Summary

| Method | Path                      | Description                            | Notes / Params                                                                        |
| ------ | ------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------- |
| GET    | /api/pizzas               | List all pizza types with size pricing | Builds size map per pizza                                                             |
| GET    | /api/pizza-of-the-day     | Deterministic daily pizza              | Based on days since epoch                                                             |
| POST   | /api/order                | Create order from cart array           | Body: `{ cart: [{ pizza, size, price? }] }` (price in body ignored; server trusts DB) |
| GET    | /api/orders               | (Basic) list order ids/date/time       | Used internally (not currently in UI)                                                 |
| GET    | /api/order?id=123         | Single order (legacy style)            | Returns order + items + total                                                         |
| GET    | /api/past-orders?page=N   | Paginated recent orders (descending)   | Artificial 5s delay, limit 10 per page (server `limit=20` var unused vs query)        |
| GET    | /api/past-order/:order_id | Detailed order (modern route)          | Used by modal in past orders page                                                     |
| POST   | /api/contact              | Accept contact form                    | Body: `{ name, email, message }`                                                      |

### Data Notes

- Images resolved as `/public/pizzas/<pizza_type_id>.webp`.
- Order creation merges duplicate pizza/size pairs into quantities before insertion.
- Transaction handling with explicit BEGIN / COMMIT / ROLLBACK for atomic order writes.

### Error Handling

- 400 on invalid order or contact form payload.
- 404 for missing past order id.
- 500 for DB errors (logs via pino-pretty).

---

## Development Workflow Tips

1. Start API first to avoid frontend fetch errors.
2. Use Devtools panels (appearing in the app) to inspect query cache & routes.
3. For test-driven changes to hooks, rely on `@testing-library/react`'s `renderHook` and `waitFor` utilities (see `usePizzaOfTheDay.node.test.jsx`).
4. Snapshot tests (e.g., `Cart.browser.test.jsx`) help catch presentational regressions—update snapshots intentionally (`npx vitest -u`).

---

## Extending / Next Ideas

- Add authentication + user accounts (persist orders per user).
- Replace inline state cart with Zustand or Redux Toolkit if complexity grows.
- Implement optimistic updates for order placement (temporary order id while posting).
- Add currency / locale selector (`Intl.NumberFormat`) via a custom hook (`useCurrency`).
- Pagination server param unification (currently limit = 20 vs response 10) – adjust for consistency.
- Extract endpoint handlers into modules & add unit tests for data-layer logic.

---

## Performance Considerations

- React Query `staleTime` tuned (e.g., 30s for paginated list) to reduce redundant network traffic.
- Modal detail query only enabled when an order is focused (`enabled: !!focusedOrder`).
- Could add HTTP caching headers (ETag / Cache-Control) on static pizza list & images for further gains.

---

## Testing Cheatsheet

| Goal             | Command                |
| ---------------- | ---------------------- |
| All tests        | `npm test`             |
| Browser tests    | `npm run test:browser` |
| Coverage         | `npm run coverage`     |
| Update snapshots | `npx vitest -u`        |
| UI runner        | `npm run test:ui`      |

---

## Tooling & Libraries

- React 19, Vite 7, JSX + Fast Refresh
- TanStack Router / React Query + Devtools
- Testing: Vitest, @testing-library/react, happy-dom, fetch mocking
- Fastify, promised-sqlite3, sqlite3, @fastify/static, pino-pretty
- Font Awesome (icons)

---

## Minimal Architecture Diagram

```
[ React (Vite Dev Server) ]  -->  HTTP fetch  --> [ Fastify API ] --> [ SQLite DB ]
          |                                          |
          |---- static assets (/public via API) <----|
          |---- Devtools (Query & Router)            |
```

---

## Coding Conventions

- ES Modules throughout (`type": "module"`).
- Currency formatting centralized with `Intl.NumberFormat` (USD).
- Lazy routes as `*.lazy.jsx` to reinforce intent & enable code-splitting.
- Side-effects in hooks isolated inside `useEffect` blocks.

---

## Known Quirks

- `Cart.browser.test.jsx` imports `../cart` (case sensitivity can break on Linux). Consider renaming import to `../Cart` for portability.
- Artificial delay (5s) on `/api/past-orders` – useful for demonstrating loading states; remove or gate via ENV for production.
- `/api/orders` & `/api/order?id=` endpoints are functionally superseded by the `/api/past-*` endpoints.

---

## License / Attribution

- Backend scaffold and database from the "Complete Intro to React v9" course (Brian Holt / Frontend Masters) – original code under Apache 2.0 + CC-BY-NC-4.0 for content; respect original licensing.
- Additional frontend modifications here provided under the same Apache 2.0 intent unless otherwise noted.

(Insert your own explicit LICENSE file if distributing.)

---

## Support

Open an issue or extend with a PR (describe change, include tests where reasonable). For educational exploration, feel free to fork and experiment.

Enjoy building & customizing your pizza shop! 🍕
