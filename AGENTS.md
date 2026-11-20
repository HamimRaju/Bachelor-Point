# Repository guide

- Single Next.js App Router app. Routes and UI are in `src/app/`; server actions are in root `actions/` (the README's sample tree is stale); models are in `src/models/`, shared code in `src/lib/`. `@/*` maps to `src/*`; `@/actions/*` maps to root `actions/*`.
- Before changing Next.js APIs or conventions, read `node_modules/next/AGENTS.md` and the relevant installed guide under `node_modules/next/dist/docs/`. This app enables `cacheComponents` and `partialPrefetching` in `next.config.ts`.
- Runtime needs `.env.local` with `MONGODB_URI` and `BETTER_AUTH_SECRET`. Set `BETTER_AUTH_URL` to the canonical auth origin; `NEXT_PUBLIC_APP_URL` is optional and falls back to the browser origin. Better Auth uses the `bachelor-point` MongoDB database. `.env*` is gitignored.
- The sign-up allowlist is `src/lib/members.ts`; `src/lib/auth.ts` enforces it when creating users. Update the registry deliberately when membership changes.
- Use `npm run dev`, `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build`. `npm test` runs only `tests/task-rotation.test.mts` and requires Node 22.6+ (`--experimental-strip-types`).
- If the Next security gate blocks `npm run build`, rerun once as instructed. `next@16.4.0` is flagged; a successful retry does not resolve the dependency warning.
- `/api/seed` is authenticated `POST` only. It adds missing rotation tasks and inserts default bills only if the bill collection is empty; do not call it casually against a shared database.
