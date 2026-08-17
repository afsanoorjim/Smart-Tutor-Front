# Smart Tutor — teacher progress dashboard (web)

Next.js 14 (App Router) + TypeScript + Tailwind. Talks to your Django API.

## Local setup

```bash
npm install
cp .env.local.example .env.local
# edit .env.local -> NEXT_PUBLIC_API_URL=http://localhost:8000/api (or your Render URL)
npm run dev
```

Visit http://localhost:3000 — you'll land on `/login`.

## Project structure

```
app/
  login/page.tsx              login screen
  signup/page.tsx             create account screen
  (dashboard)/layout.tsx      sidebar shell
  (dashboard)/dashboard/      class/student list
  (dashboard)/students/[id]/  individual student detail
lib/
  api.ts                      fetch wrapper -> your Django API
  types.ts                    shared Student/ClassGroup/Progress types
components/
  Sidebar.tsx
  ProgressLedger.tsx          mastery indicator (tally-mark style)
```

## Expected Django API endpoints

`lib/api.ts` expects these routes (adjust paths there to match your actual API):

- `POST /api/auth/login/` -> `{ token, name }`
- `POST /api/auth/signup/` -> `{ token, name }` (body: `{ name, email, password }`)
- `GET /api/students/` -> `Student[]`
- `GET /api/classes/` -> `ClassGroup[]`
- `GET /api/classes/:id/students/` -> `Student[]`
- `GET /api/students/:id/` -> `StudentDetail`

See `lib/types.ts` for exact shapes. Update the `Student`/`StudentDetail` fields
to match whatever your Django serializers actually return, then adjust the
pages that read them.

Auth uses a bearer token stored in `localStorage` (`auth_token`). If your
Django backend uses session cookies instead, swap the `Authorization` header
in `lib/api.ts` for `credentials: "include"`.

## Deploying (free)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com), "Add New Project", import the repo.
3. In Vercel's project settings, add the environment variable
   `NEXT_PUBLIC_API_URL` pointing at your deployed Django API (e.g. the
   Render URL, ending in `/api`).
4. Deploy. Every push to `main` auto-deploys after this.

Make sure your Django `CORS_ALLOWED_ORIGINS` / `ALLOWED_HOSTS` include your
Vercel domain once you have it (e.g. `your-app.vercel.app`).
