# FitLog — Workout Library

FitLog is a responsive workout library and daily training log. Browse exercises,
review form instructions, build a plan of up to five lifts, and keep saved
workouts on hand for later.

## Features

- Browse 12 API-powered exercises with muscle groups, equipment, and stats.
- Search by workout name, muscle group, or equipment; sort by duration,
  calories, or rating.
- Open responsive workout detail pages with exercise specs and step-by-step
  instructions.
- Add lifts to a five-exercise daily plan, save them for later, and track
  completed work.
- Review plan totals for exercises, minutes, and calories; remove items from
  either list.
- Persist plan, saved, and completed exercise IDs in browser `localStorage`.
- Use the responsive dark interface on mobile, tablet, and desktop.

## Built with

- Next.js 16 App Router
- React 19
- Tailwind CSS 4 and custom responsive CSS
- FitLog workout API with a backup endpoint

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run build
npm start
```

The app loads exercise data through the `/api/workouts` route. It tries
`https://api.abcz.workers.dev/api/fitlog` first and falls back to
`https://api.api-store.workers.dev/api/fitlog`. Plan and saved selections are
stored locally in the current browser and are not synced between devices.

## Routes

- `/` — workout library, search, and sorting
- `/workout/[id]` — exercise details and add/save actions
- `/my-plan` — today's plan and summary metrics
- `/my-plan?tab=saved` — saved exercises
