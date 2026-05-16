# Contributing to Allergy Tracker

Thank you for your interest in contributing. This document explains how to report bugs, suggest features, and submit code changes.

## Reporting Bugs

Open an issue using the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml) template. Please include:

- Steps to reproduce the issue
- Expected vs. actual behavior
- Your environment (OS, Node version, Docker or bare-metal)

## Suggesting Features

Open an issue using the [Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml) template. Describe the problem you want to solve, not just the solution.

## Local Development Setup

**Prerequisites:** Node.js 22+, PostgreSQL 15+

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/allergy-tracker.git
cd allergy-tracker

# 2. Install dependencies
npm install

# 3. Configure the database
cp .env.example .env
# Edit .env: set DATABASE_URL to your local PostgreSQL instance

# 4. Set up the database schema
npx prisma migrate deploy
npx prisma generate

# 5. Start the dev server
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

After changing `prisma/schema.prisma`, create a new migration:

```bash
npx prisma migrate dev --name describe-your-change
```

## Submitting a Pull Request

1. Create a branch from `main`: `git checkout -b feat/my-feature`
2. Make your changes
3. Run lint: `npm run lint`
4. Ensure the app builds: `npm run build`
5. Push and open a PR against `main`

Use the PR template — it has a short checklist that keeps reviews fast.

## Code Style

- **TypeScript strict mode** is enforced; no `any` without justification
- **ESLint** must pass (`npm run lint`) before submitting
- Keep changes focused — one logical change per PR
- Comments only where the *why* is non-obvious

## Notes

- The UI language is German — this is intentional and should be kept as-is
- Open-Meteo is used for weather and pollen data; no API key is needed
- The Prisma 7 database URL is configured in `prisma.config.ts` (CLI) and `lib/prisma.ts` (runtime) — not in `schema.prisma`

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
