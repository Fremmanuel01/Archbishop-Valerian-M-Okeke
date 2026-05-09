import * as Sentry from "@sentry/nextjs";

// Client-side Sentry init. Reads NEXT_PUBLIC_SENTRY_DSN so the env
// variable is bundled into the client. If unset (default), the SDK
// stays inactive — no network requests, no overhead.

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
