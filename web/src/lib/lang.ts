import { cookies } from "next/headers";
import type { Lang } from "./i18n";

export const LANG_COOKIE = "lang";

/** Server-side helper. Returns the visitor's chosen language, defaulting to
 *  English when no cookie has been set. */
export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return value === "ig" ? "ig" : "en";
}
