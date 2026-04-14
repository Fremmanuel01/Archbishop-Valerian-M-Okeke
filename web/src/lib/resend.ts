const RESEND_API = "https://api.resend.com";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
};

function getEnv(key: string): string | undefined {
  const value = process.env[key];
  return value && value.length > 0 ? value : undefined;
}

export function resendConfigured(): boolean {
  return Boolean(getEnv("RESEND_API_KEY"));
}

export async function sendEmail({ to, subject, text, replyTo }: SendEmailInput) {
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
      reply_to: replyTo,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend email failed (${res.status}): ${body.slice(0, 200)}`);
  }
  return (await res.json()) as { id: string };
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
