import "server-only";
import { toRoman } from "@/components/editorial";
import { SITE_URL } from "@/lib/site";

// Server-only HTML email renderer for the monthly Pastoral Diary.
// This email IS the substance, not chrome — so it carries more weight than
// the confirmation emails: full-bleed lead photo, chronological card stack,
// gold hairlines between sections, generous spacing.
//
// Email-client constraints honoured:
//   • Table-based layout for legacy Outlook
//   • Inline styles only
//   • Web-safe font fallbacks (Georgia / Helvetica)
//   • Light-only color-scheme to prevent Gmail/Outlook auto-inversion
//   • All images use absolute https URLs (must be hosted, not data: URIs)

const COLORS = {
  bone: "#F7F4EE",
  boneDeep: "#EFEAE0",
  ink: "#0A1B33",
  inkSoft: "#1F3354",
  gold: "#B08840",
  goldText: "#8A6A2E",
  rule: "rgba(176,136,64,0.35)",
} as const;

const MOTTO = "Ut Vitam Habeant — that they may have life.";
const FOOTER_ADDRESS = "Domus Episcopalis · Onitsha · Anambra · Nigeria";

const MONTH_NAMES_UPPER = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

export type NewsletterPost = {
  message: string;
  imageUrl?: string | null;
  permalinkUrl?: string | null;
  createdTime: Date;
};

export type NewsletterRenderInput = {
  /** First day of the month being covered. Drives eyebrow + heading. */
  editionDate: Date;
  subjectLine: string;
  /** Optional override for the eyebrow. If absent, derived from editionDate. */
  eyebrow?: string;
  /** Optional italic subhead under the heading. */
  lead?: string;
  /** Posts ordered chronologically (oldest → newest). The first post is
   *  the lead — gets the full-bleed photo treatment. */
  posts: NewsletterPost[];
  /** Display name shown next to "Read on Facebook" links. */
  pageName?: string;
  /** Unsubscribe link rendered in the footer.
   *  - Broadcasts: pass `"{{{RESEND_UNSUBSCRIBE_URL}}}"` so Resend
   *    interpolates a per-recipient link with the right `List-Unsubscribe`
   *    semantics.
   *  - Test sends: pass an absolute /connect/newsletter/unsubscribe URL
   *    (the merge tag is not expanded outside broadcasts).
   *  Defaults to the manual page URL. */
  unsubscribeUrl?: string;
};

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function paragraphs(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 1em 0;">${escapeHtml(p).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

function romanDateLabel(d: Date): string {
  // Format: "III MAY · MMXXVI" — Roman day, English uppercase month, Roman year.
  const day = toRoman(d.getUTCDate());
  const month = MONTH_NAMES_UPPER[d.getUTCMonth()];
  const year = toRoman(d.getUTCFullYear());
  return `${day} ${month} · ${year}`;
}

function deriveEyebrow(editionDate: Date): string {
  return `PASTORAL DIARY · ${MONTH_NAMES_UPPER[editionDate.getUTCMonth()]} · ${toRoman(editionDate.getUTCFullYear())}`;
}

function deriveHeading(editionDate: Date): string {
  // Cormorant display: "From the Page of His Grace"
  return "From the Page of His Grace";
}

function renderLeadPost(post: NewsletterPost): string {
  const dateLabel = romanDateLabel(post.createdTime);
  const image = post.imageUrl
    ? `<tr><td style="padding-bottom:24px;">
         <img src="${escapeHtml(post.imageUrl)}" alt="" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;">
       </td></tr>`
    : "";
  const link = post.permalinkUrl
    ? `<tr><td style="padding-top:14px;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">
         <a href="${escapeHtml(post.permalinkUrl)}" style="color:${COLORS.goldText};text-decoration:none;border-bottom:1px solid ${COLORS.gold};padding-bottom:2px;">Read on Facebook →</a>
       </td></tr>`
    : "";
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  ${image}
  <tr>
    <td style="font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:${COLORS.goldText};padding-bottom:14px;">
      ${escapeHtml(dateLabel)}
    </td>
  </tr>
  <tr>
    <td style="font-family:Georgia,'EB Garamond',serif;font-size:18px;line-height:1.65;color:${COLORS.ink};">
      ${paragraphs(post.message || "")}
    </td>
  </tr>
  ${link}
</table>`;
}

function renderFollowingPost(post: NewsletterPost): string {
  const dateLabel = romanDateLabel(post.createdTime);
  const image = post.imageUrl
    ? `<tr><td style="padding-bottom:20px;">
         <img src="${escapeHtml(post.imageUrl)}" alt="" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;">
       </td></tr>`
    : "";
  const link = post.permalinkUrl
    ? `<tr><td style="padding-top:12px;font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">
         <a href="${escapeHtml(post.permalinkUrl)}" style="color:${COLORS.goldText};text-decoration:none;border-bottom:1px solid ${COLORS.gold};padding-bottom:2px;">Read on Facebook →</a>
       </td></tr>`
    : "";
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  ${image}
  <tr>
    <td style="font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:${COLORS.goldText};padding-bottom:10px;">
      ${escapeHtml(dateLabel)}
    </td>
  </tr>
  <tr>
    <td style="font-family:Georgia,'EB Garamond',serif;font-size:16px;line-height:1.65;color:${COLORS.ink};">
      ${paragraphs(post.message || "")}
    </td>
  </tr>
  ${link}
</table>`;
}

function hairline(width: number = 60): string {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:collapse;margin:36px auto;">
  <tr><td width="${width}" height="1" style="background:${COLORS.gold};line-height:1px;font-size:1px;border:none;">&nbsp;</td></tr>
</table>`;
}

function renderHeader(eyebrow: string, heading: string, lead: string | undefined): string {
  const leadHtml = lead
    ? `<tr><td style="padding-top:18px;font-family:Georgia,'Cormorant Garamond',serif;font-style:italic;font-size:18px;line-height:1.5;color:${COLORS.inkSoft};">
         ${escapeHtml(lead)}
       </td></tr>`
    : "";
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr>
    <td style="padding-bottom:18px;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:2.8px;text-transform:uppercase;color:${COLORS.goldText};">
      ${escapeHtml(eyebrow)}
    </td>
  </tr>
  <tr>
    <td style="font-family:Georgia,'Cormorant Garamond',serif;font-weight:500;font-size:36px;line-height:1.15;letter-spacing:-0.01em;color:${COLORS.ink};">
      ${escapeHtml(heading)}
    </td>
  </tr>
  ${leadHtml}
</table>`;
}

function renderFooter(unsubscribeUrl: string): string {
  // Resend's broadcast pipeline replaces `{{{RESEND_UNSUBSCRIBE_URL}}}` with
  // a per-recipient one-click unsubscribe link. For test sends and other
  // non-broadcast paths the placeholder won't be expanded — so we always
  // also include a plain link to /connect/newsletter/unsubscribe as a
  // manual fallback.
  const manualUrl = `${SITE_URL}/connect/newsletter/unsubscribe`;
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr>
    <td style="font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:${COLORS.inkSoft};line-height:1.6;">
      ${escapeHtml(FOOTER_ADDRESS)}
    </td>
  </tr>
  <tr>
    <td style="padding-top:6px;font-family:Georgia,serif;font-style:italic;font-size:13px;color:${COLORS.goldText};line-height:1.6;">
      ${escapeHtml(MOTTO)}
    </td>
  </tr>
  <tr>
    <td style="padding-top:24px;font-family:Helvetica,Arial,sans-serif;font-size:10px;color:${COLORS.inkSoft};line-height:1.6;">
      You are receiving this because you subscribed to the Archbishop's diary.
      The Office keeps your address in confidence and does not share it.
      <br><br>
      <a href="${unsubscribeUrl}" style="color:${COLORS.goldText};text-decoration:underline;">Unsubscribe instantly</a>
      &nbsp;·&nbsp;
      <a href="${escapeHtml(manualUrl)}" style="color:${COLORS.goldText};text-decoration:underline;">Manage subscription</a>
    </td>
  </tr>
</table>`;
}

export function renderNewsletterHtml(input: NewsletterRenderInput): string {
  const eyebrow = input.eyebrow ?? deriveEyebrow(input.editionDate);
  const heading = deriveHeading(input.editionDate);
  const [lead, ...rest] = input.posts;
  const leadHtml = lead ? renderLeadPost(lead) : "";
  const restHtml = rest
    .map((p) => `${hairline()}${renderFollowingPost(p)}`)
    .join("");
  const unsubscribeUrl =
    input.unsubscribeUrl ?? `${SITE_URL}/connect/newsletter/unsubscribe`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(input.subjectLine)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bone};font-family:Georgia,'EB Garamond',serif;color:${COLORS.ink};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.bone};">
<tr>
<td align="center" style="padding:56px 20px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
<tr><td>${renderHeader(eyebrow, heading, input.lead)}</td></tr>
<tr><td>${hairline()}</td></tr>
<tr><td>${leadHtml}</td></tr>
${restHtml ? `<tr><td>${restHtml}</td></tr>` : ""}
<tr><td>${hairline()}</td></tr>
<tr><td>${renderFooter(unsubscribeUrl)}</td></tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}
