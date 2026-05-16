# Allergy Tracker

A self-hosted daily allergy symptom diary. Log symptoms with intensity levels and correlate them with automatic weather and pollen data to support treatment decisions.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-required-336791?logo=postgresql)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Daily symptom logging** — record symptoms (runny nose, itchy eyes, sneezing, etc.) with a 1-5 intensity scale and optional notes
- **Two-user support** — track symptoms for two people (e.g. a household) with configurable names
- **Weather context** — current temperature, humidity, wind, and conditions pulled automatically via [Open-Meteo](https://open-meteo.com/) (no API key required)
- **Pollen context** — daily pollen counts for birch, grasses, ambrosia, mugwort, alder, and hazel
- **History view** — browse past entries with all associated weather and pollen data
- **Data export** — export your diary to CSV/JSON for further analysis
- **Configurable location** — set your latitude/longitude once in the settings
- **Self-hosted** — your data stays in your own PostgreSQL database

## Quick Start

### Docker (recommended)

Create a `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: allergy_tracker
      POSTGRES_USER: allergy
      POSTGRES_PASSWORD: changeme
    volumes:
      - pgdata:/var/lib/postgresql/data

  app:
    image: ghcr.io/didiladi/allergy-tracker:latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://allergy:changeme@db:5432/allergy_tracker
    depends_on:
      - db

volumes:
  pgdata:
```

Then:

```bash
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) and go to **Einstellungen** to configure your location.

### Local Development

**Prerequisites:** Node.js 22+, PostgreSQL

```bash
git clone https://github.com/didiladi/allergy-tracker.git
cd allergy-tracker

npm install

# Configure your database connection
cp .env.example .env
# Edit .env and set DATABASE_URL

# Run database migrations and generate Prisma client
npx prisma migrate deploy
npx prisma generate

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string, e.g. `postgresql://user:pass@host:5432/dbname` |

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- [Prisma 7](https://www.prisma.io/) ORM with PostgreSQL
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Open-Meteo](https://open-meteo.com/) — free weather and pollen API, no key required
- [lucide-react](https://lucide.dev/) for icons

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get started.

## Security

To report a vulnerability, see [SECURITY.md](SECURITY.md).

## License

MIT — see [LICENSE](LICENSE).
