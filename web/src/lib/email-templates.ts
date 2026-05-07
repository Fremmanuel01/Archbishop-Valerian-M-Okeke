import "server-only";

// Server-only HTML email renderer for confirmation emails sent back to form
// submitters. Editorial brand applied: bone-warm background, serif body
// (Cormorant / EB Garamond fall back to Georgia in email clients), small-cap
// uppercase eyebrow, 1px gold hairline rule, and the diocesan motto in the
// footer. No images — this is paper, not marketing.
//
// Email-client constraints honoured:
//   • Table-based layout for legacy Outlook
//   • Inline styles only (no <style> block — Gmail strips it)
//   • Web-safe font fallbacks (Georgia / Helvetica) since custom fonts
//     don't load reliably in email clients
//   • light-only — meta color-scheme prevents Gmail/Outlook from auto-
//     inverting the bone palette to dark mode

const COLORS = {
  bone: "#F7F4EE",
  ink: "#0A1B33",
  inkSoft: "#1F3354",
  gold: "#B08840",
  goldText: "#8A6A2E",
} as const;

const MOTTO = "Ut Vitam Habeant — that they may have life.";

const FOOTER_ADDRESS = "Domus Episcopalis · Onitsha · Anambra · Nigeria";

const EYEBROWS: Record<"en" | "ig", string> = {
  en: "From the Office of His Grace",
  ig: "Site n'Ụlọ Ọrụ Ọdaa",
};

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Split body text on blank lines into paragraphs; preserve intra-paragraph
// line breaks (sign-off block: "Pax tecum,\nThe Office...").
function bodyToParagraphs(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 1.1em 0;">${escapeHtml(p).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

export function renderConfirmationHtml(input: {
  subject: string;
  body: string;
  lang: "en" | "ig";
}): string {
  const eyebrow = EYEBROWS[input.lang] ?? EYEBROWS.en;
  const paragraphs = bodyToParagraphs(input.body);

  return `<!DOCTYPE html>
<html lang="${input.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(input.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bone};font-family:Georgia,'EB Garamond',serif;color:${COLORS.ink};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.bone};">
<tr>
<td align="center" style="padding:56px 20px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
<tr>
<td style="padding-bottom:32px;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:${COLORS.goldText};">
${escapeHtml(eyebrow)}
</td>
</tr>
<tr>
<td style="font-family:Georgia,'EB Garamond',serif;font-size:17px;line-height:1.7;color:${COLORS.ink};">
${paragraphs}
</td>
</tr>
<tr>
<td style="padding:36px 0 28px 0;line-height:1px;font-size:1px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
<tr><td width="60" height="1" style="background:${COLORS.gold};line-height:1px;font-size:1px;border:none;">&nbsp;</td></tr>
</table>
</td>
</tr>
<tr>
<td style="font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:${COLORS.inkSoft};line-height:1.5;">
${escapeHtml(FOOTER_ADDRESS)}
</td>
</tr>
<tr>
<td style="padding-top:6px;font-family:Georgia,serif;font-style:italic;font-size:13px;color:${COLORS.goldText};line-height:1.5;">
${escapeHtml(MOTTO)}
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}
