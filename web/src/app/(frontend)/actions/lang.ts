"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LANG_COOKIE } from "@/lib/lang";
import type { Lang } from "@/lib/i18n";

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function setLang(lang: Lang, returnTo?: string): Promise<void> {
  const store = await cookies();
  store.set(LANG_COOKIE, lang === "ig" ? "ig" : "en", {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });
  // Revalidate the page the user is on so server-rendered chrome flips
  // immediately. Falls back to the homepage if no path was provided.
  revalidatePath(returnTo && returnTo.startsWith("/") ? returnTo : "/");
}
