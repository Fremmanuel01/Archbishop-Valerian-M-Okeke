const RESEND_API = "https://api.resend.com";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  text: string;
  /** Optional branded HTML body. The plain `text` field stays as the
   *  fallback for clients that don't render HTML, and is also what spam
   *  filters score against — so it's required even when html is provided. */
  html?: string;
  replyTo?: string;
};

function getEnv(key: string): string | undefined {
  const value = process.env[key];
  return value && value.length > 0 ? value : undefined;
}

export function resendConfigured(): boolean {
  return Boolean(getEnv("RESEND_API_KEY"));
}

export async function sendEmail({ to, subject, text, html, replyTo }: SendEmailInput) {
  const apiKey = getEnv("RESEND_API_KEY");
  const from = getEnv("RESEND_FROM") ?? "Archbishop's Office <onboarding@resend.dev>";
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  const res = await fetch(`${RESEND_API}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      ...(html ? { html } : {}),
      reply_to: replyTo,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend email failed (${res.status}): ${body.slice(0, 200)}`);
  }
  return (await res.json()) as { id: string };
}

/** Count of active (non-unsubscribed) contacts in a Resend audience. Used at
 *  send-time to record the audience size onto the edition record. */
export async function getActiveAudienceCount(audienceId: string): Promise<number> {
  const apiKey = getEnv("RESEND_API_KEY");
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const res = await fetch(`${RESEND_API}/audiences/${audienceId}/contacts`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend audience read failed (${res.status}): ${body.slice(0, 200)}`);
  }
  const json = (await res.json()) as { data?: { unsubscribed?: boolean }[] };
  return (json.data ?? []).filter((c) => !c.unsubscribed).length;
}

/** Create a Resend Broadcast targeting an audience. Returns the broadcast id;
 *  the broadcast is NOT sent yet — call sendBroadcast() to actually fire it. */
export async function createBroadcast(input: {
  audienceId: string;
  from: string;
  subject: string;
  html: string;
  /** Internal admin name; visible only in Resend dashboard. */
  name?: string;
  replyTo?: string;
}): Promise<{ id: string }> {
  const apiKey = getEnv("RESEND_API_KEY");
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const res = await fetch(`${RESEND_API}/broadcasts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audience_id: input.audienceId,
      from: input.from,
      subject: input.subject,
      html: input.html,
      name: input.name,
      reply_to: input.replyTo,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend broadcast create failed (${res.status}): ${body.slice(0, 200)}`);
  }
  return (await res.json()) as { id: string };
}

/** Trigger an existing broadcast. Resend processes it asynchronously. */
export async function sendBroadcast(broadcastId: string): Promise<void> {
  const apiKey = getEnv("RESEND_API_KEY");
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const res = await fetch(`${RESEND_API}/broadcasts/${broadcastId}/send`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend broadcast send failed (${res.status}): ${body.slice(0, 200)}`);
  }
}

export async function addAudienceContact(input: {
  email: string;
  firstName?: string;
  lastName?: string;
}) {
  const apiKey = getEnv("RESEND_API_KEY");
  const audienceId = getEnv("RESEND_AUDIENCE_ID");
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  if (!audienceId) throw new Error("RESEND_AUDIENCE_ID is not set");
  const res = await fetch(
    `${RESEND_API}/audiences/${audienceId}/contacts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        first_name: input.firstName,
        last_name: input.lastName,
        unsubscribed: false,
      }),
    },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend audience add failed (${res.status}): ${body.slice(0, 200)}`);
  }
  return (await res.json()) as { id: string };
}
