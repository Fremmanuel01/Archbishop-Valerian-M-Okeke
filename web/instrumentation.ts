import * as Sentry from "@sentry/nextjs";

// Sentry initialisation runs once per cold-start. If SENTRY_DSN is not
// set (the default for previews and local dev), we skip init entirely so
// nothing about the SDK touches request paths. In production set
// SENTRY_DSN in Vercel envs and Sentry will wire itself in.
//
// All three runtimes (node, edge, browser) share the same DSN; we
// branch on `runtime` so server-only and client-only modules don't end
// up in the wrong bundle. See Sentry's Next.js docs for the runtime
// register pattern.

export async function register() {
  const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn,
      environment: process.env.VERCEL_ENV ?? "development",
      tracesSampleRate: 0.1,
      // Avoid double-reporting Next.js framework noise we already see in
      // Vercel logs (build-time warnings, dev HMR notices).
      ignoreErrors: ["NEXT_REDIRECT", "NEXT_NOT_FOUND"],
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn,
      environment: process.env.VERCEL_ENV ?? "development",
      tracesSampleRate: 0.1,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
