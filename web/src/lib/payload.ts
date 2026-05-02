import "server-only";
import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";

// Cached per-render Payload client. React `cache()` ensures all server
// components in a single request share one initialised instance instead
// of each opening its own DB connection.
export const getPayloadClient = cache(async () => {
  return getPayload({ config });
});
