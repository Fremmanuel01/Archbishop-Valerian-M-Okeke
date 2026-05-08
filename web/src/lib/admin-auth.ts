import "server-only";
import { headers as nextHeaders } from "next/headers";
import { getPayloadClient } from "@/lib/payload";
import type { UserRole } from "@/payload/collections/Users";

export type AdminUser = {
  id: string | number;
  email?: string;
  name?: string;
  role: UserRole;
};

// Resolve the current Payload session and confirm the user holds at least
// one of the allowed roles. Returns the user when authorised; otherwise
// returns a structured failure the caller can convert to its own state.
//
// Server actions and admin-tools page handlers MUST call this — Payload's
// own `payload.auth({ headers })` only confirms a session exists, not that
// the session belongs to a user with permission to mutate sensitive data
// such as a newsletter broadcast.
export async function requireRole(
  allowedRoles: readonly UserRole[],
): Promise<
  | { ok: true; user: AdminUser }
  | { ok: false; reason: "unauthenticated" | "forbidden" }
> {
  const headersList = await nextHeaders();
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: headersList });
  if (!user) return { ok: false, reason: "unauthenticated" };

  const role = (user as { role?: string }).role;
  if (!role || !allowedRoles.includes(role as UserRole)) {
    return { ok: false, reason: "forbidden" };
  }
  return {
    ok: true,
    user: {
      id: (user as { id: string | number }).id,
      email: (user as { email?: string }).email,
      name: (user as { name?: string }).name,
      role: role as UserRole,
    },
  };
}

// Convenience for admin-tools pages — redirects unauthenticated users to
// /admin and returns null for forbidden users so the page can render its
// own "you do not have access" UI without leaking what the page is.
export async function getAdminUserOr403(
  allowedRoles: readonly UserRole[],
): Promise<{ user: AdminUser } | { user: null; reason: "unauthenticated" | "forbidden" }> {
  const result = await requireRole(allowedRoles);
  if (result.ok) return { user: result.user };
  return { user: null, reason: result.reason };
}

export const NEWSLETTER_ROLES = ["admin", "newsletter_editor"] as const;
export const ADMIN_ONLY = ["admin"] as const;
