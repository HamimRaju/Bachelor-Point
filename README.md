# 🏠 Bachelor Point

<p align="center">
  <strong>Shared living, in sync.</strong><br />
  A simple home hub for chores, bills, and shared spending.
</p>

<p align="center">
  <a href="https://bachelor-point2026.vercel.app"><strong>Open the live app →</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/HamimRaju/Bachelor-Point">Source repository</a>
</p>

<p align="center">
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" />
  <img alt="React 19" src="https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-database-47a248?logo=mongodb&logoColor=white" />
  <img alt="Mongoose 9" src="https://img.shields.io/badge/Mongoose-9-880000?logo=mongoose&logoColor=white" />
</p>

---

## At a glance

Bachelor Point helps a five-person flat coordinate everyday responsibilities and shared costs. Members sign in with an authorized account and see the same shared household data.

| | |
|---|---|
| 🔄 **Fair chore rotation** | Independent task rotations, completion history, and skip-without-losing-your-turn behavior. Only the assigned member can act. |
| 🧾 **Bills & shared expenses** | Fixed Wi-Fi, Moyla, and rent bills with per-member payment indicators; add shared expenses and track each member’s balance. |
| 🏡 **One shared dashboard** | See the current task turns, expenses, and flatmate directory in a mobile-friendly interface. |

## Built with

- **Next.js App Router** with React and TypeScript
- **Tailwind CSS** for styling
- **Better Auth** for sessions and email/password sign-in
- **MongoDB + Mongoose** for shared data
- **Turbopack** for local development and builds

## Run locally

### Requirements

- Node.js **22.6 or newer** (the test command uses Node’s built-in TypeScript stripping)
- npm
- A MongoDB database, local or hosted

### 1. Install dependencies

```bash
git clone https://github.com/HamimRaju/Bachelor-Point.git
cd Bachelor-Point
npm install
```

### 2. Configure the environment

Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/bachelor-point
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000

# Optional; defaults to the browser's current origin
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Use the canonical public origin for `BETTER_AUTH_URL` in a deployed environment. Better Auth stores its data in the `bachelor-point` database. Environment files are git-ignored.

### 3. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign-up is limited to the five email addresses in `src/lib/members.ts`.

## Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check the app |
| `npm test` | Run the task-rotation unit tests |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm audit` | Check dependencies for known advisories |

`npm test` currently runs `tests/task-rotation.test.mts` only and does not require MongoDB.

## Project map

```text
actions/                 Authenticated server actions
src/
  app/                   App Router pages, layouts, and API routes
  components/            Shared UI components
  lib/                   Auth, database, member registry, and app logic
  models/                Mongoose schemas
tests/                   Task-rotation tests
```

### Data notes

- `src/lib/members.ts` is the source of truth for the five authorized flatmates. Task rotation and fixed-bill payment status use these member IDs.
- Fixed-bill payment status is stored separately in `FixedBillPayment`; it is not the legacy `Bill` seed collection.
- `POST /api/seed` requires an authenticated member. It adds any missing rotation tasks and inserts legacy default `Bill` records only when that collection is empty. Use it only when you intend to initialize those records, especially against a shared database.

---

<p align="center">
  Made for real flatmates, not group-chat chaos.<br />
  Built with ❤️ by <a href="https://github.com/HamimRaju">Sheikh Hamim Islam Raju</a>
</p>
