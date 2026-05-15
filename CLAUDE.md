@AGENTS.md

# allergy-tracker

Self-hosted daily allergy symptom diary. Track symptoms alongside weather and pollen data to support treatment decisions.

## Stack

- Next.js 16 (App Router) + TypeScript
- Prisma 7 with `@prisma/adapter-pg` (Postgres adapter required at runtime in Prisma 7)
- PostgreSQL
- Tailwind CSS, lucide-react
- Open-Meteo API for weather + pollen data (free, no API key)

## Key conventions

- Prisma 7: `url` is NOT in `schema.prisma` — it's in `prisma.config.ts` (CLI) and in `lib/prisma.ts` via `PrismaPg` adapter (runtime)
- Generated client: `app/generated/prisma/` — import as `@/app/generated/prisma/client`
- Prisma singleton: `lib/prisma.ts`
- All UI is in German

## Dev commands

```bash
npm run dev          # dev server on port 3000
npm run build        # production build (runs prisma generate + migrate deploy)
npx prisma generate  # regenerate client after schema changes
npx prisma migrate dev --name <name>  # create a new migration
```

## Environment

```
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/allergy_tracker
```

## Deployment

Standard Next.js standalone build — run anywhere PostgreSQL is reachable.

```bash
docker build -t allergy-tracker:latest .
docker run -e DATABASE_URL=... -p 3000:3000 allergy-tracker:latest
```
