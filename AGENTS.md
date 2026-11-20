# Repository guide

- Single Next.js App Router app: routes/UI are in `src/app/`, server actions in root `actions/` (the README tree is stale), Mongoose models in `src/models/`, and shared code in `src/lib/`. `@/*` maps to `src/*`; `@/actions/*` maps to root `actions/*`.
- `next.config.ts` enables `cacheComponents` and `partialPrefetching` and configures Tailwind through Turbopack. Before changing Next.js APIs/conventions, read `node_modules/next/AGENTS.md` and the relevant guide under `node_modules/next/dist/docs/`.
- Runtime requires `.env.local` with `MONGODB_URI`, `BETTER_AUTH_SECRET`, and canonical `BETTER_AUTH_URL`. `NEXT_PUBLIC_APP_URL` is optional and falls back to the browser origin. Better Auth uses the `bachelor-point` MongoDB database; `.env*` is gitignored.
- `src/lib/members.ts` is the authorized five-member registry; `src/lib/auth.ts` enforces it at signup. Task rotation and fixed-bill payments also use these member IDs, so update membership deliberately.
- Bills in the Expenses UI are fixed config (`wifi`, `moyla`, `rent`); shared payment status lives separately in `FixedBillPayment`. The `Bill` model is legacy seed data—do not use it as the fixed-bill payment ledger.
- Verify with `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build`; `npm run dev` starts local development. `npm audit` checks dependency advisories.
- `npm test` runs only `tests/task-rotation.test.mts`, using Node’s `--experimental-strip-types`; use Node 22.6+. The tested rotation modules use explicit `.ts` imports for this runner.
- `/api/seed` accepts authenticated `POST` only. It adds missing rotation tasks and inserts legacy default bills only when the `Bill` collection is empty; do not call it casually against a shared database.
