# Security (Frontend – Public Repo)

This repo is **public**. Never commit secrets. Only public or build-time config may be committed.

## Secrets & environment

- **Never commit** `.env`, `.env.local`, or any env file with real keys. Only `.env.example` (with placeholders) may be committed.
- **`NEXT_PUBLIC_*`** – These are **bundled into the client**. Use them only for values that are safe to expose (e.g. API base URL, Stripe publishable key, PostHog key, VAPID **public** key). **Never** set Waafi/Stripe **secret** keys or webhook secrets as `NEXT_PUBLIC_*`.
- **Waafi / Stripe secrets** – Use only server-side env vars (`WAAFI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, etc.) in API routes. They are read in `src/app/api/*` and must not be exposed to the browser.

## Endpoints & behavior

- **`/api/test-waafipay`** – Returns 404 in production so config and test helpers are not exposed.
- **Stripe webhook** – Verbose logging is disabled in production to avoid leaking env state or event details into logs.

## Safe to expose (examples)

- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_*_PRICE_ID`
- `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (public key for push only)
- `NEXT_PUBLIC_SHAKE_API_KEY` (if acceptable for your threat model)

## Reporting a vulnerability

If you find a security issue, report it privately to the maintainers rather than in a public issue.
