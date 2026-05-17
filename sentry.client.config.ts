import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: parseFloat(
      process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0.05"
    ),
    // Never send auth tokens or payment fields to Sentry
    beforeSend(event) {
      scrubSensitiveFields(event);
      return event;
    },
    // Replay only in production — off in dev to avoid noise
    replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.01 : 0,
    replaysOnErrorSampleRate: process.env.NODE_ENV === "production" ? 0.5 : 0,
  });
}

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "access",
  "refresh",
  "authorization",
  "card_number",
  "cvv",
  "apikey",
  "api_key",
  "secret",
]);

function scrubSensitiveFields(event: Sentry.ErrorEvent) {
  const req = (event as any).request;
  if (!req) return;
  for (const section of ["data", "headers", "cookies"] as const) {
    if (req[section] && typeof req[section] === "object") {
      for (const key of Object.keys(req[section])) {
        if (SENSITIVE_KEYS.has(key.toLowerCase())) {
          req[section][key] = "[Filtered]";
        }
      }
    }
  }
}
