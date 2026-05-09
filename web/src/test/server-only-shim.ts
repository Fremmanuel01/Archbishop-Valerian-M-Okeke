// Resolves the `server-only` import path under Vitest so the module
// graph compiles. In real Next.js runtimes the upstream package is
// what's imported; this shim is only used in unit tests.
export {};
