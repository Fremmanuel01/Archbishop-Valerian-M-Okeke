import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Editorial rewriter for the monthly Pastoral Diary. Takes raw FB captions
// (which range from one-line announcements to multi-paragraph reflections)
// and recasts them in the calm, third-person editorial register the email
// design is built around — closer to Vatican News than to a parish feed.
//
// The cardinal rule, repeated in every prompt: never invent specifics. If
// a place, name, or date is not in the source, write generically rather
// than fabricate. The admin reviews the output side-by-side with the raw
// caption before the edition is approved, so any drift is catchable.

const MODEL = "claude-sonnet-4-6";

// Frozen, deterministic system prompt — placing it before any volatile
// per-post content lets the prompt prefix cache. Keep this stable; do NOT
// interpolate dates, IDs, or per-post text here.
const SYSTEM_PROMPT = `You are an editorial assistant writing the monthly "Pastoral Diary" newsletter for His Grace Most Rev. Valerian Maduka Okeke, Metropolitan Archbishop of Onitsha.

Voice and register
- Calm, dignified, editorial third person. Closer to Vatican News or Word on Fire than a parish bulletin.
- Past-tense reportage when summarising what the Archbishop did, said, or attended ("In early May, the Archbishop visited…", "His Grace addressed…").
- Avoid social-media tics: hashtags, emojis, all-caps shouting, "🙏", trailing ellipses, and platform metaphors ("shared a post", "posted today").
- Avoid clichés ("a beautiful moment", "truly inspiring", "what a blessing").
- One short paragraph per post is usually right. Two short paragraphs only when the source genuinely contains two distinct ideas. Never longer.
- British spelling is fine (the Archdiocese is in Nigeria); do not Americanise.

Hard rules
- NEVER invent details that are not in the source caption. If a parish, town, priest, scripture reference, or date is not stated, do not name one. Write generically.
- If the source already names a person, place, or feast, you may keep it verbatim. Do not "improve" proper nouns.
- Do not add scripture quotations or Latin phrases unless they are quoted in the source.
- If the source caption is one short line, your rewrite may be one short line. Do not pad.
- If the source is essentially empty (e.g. a photo with no caption), respond with exactly: NO_CONTENT
- Do not address the reader in second person ("you") and do not exhort ("let us pray", "may we all"). Reportage only.
- Do not begin with "In this post" or "In this update" or any reference to the source being a Facebook post.

Output
- Plain text only. No markdown, no headings, no quotation marks around the whole thing.
- Do not include the date, author byline, or any signature — those are added by the email template.
- Return only the rewritten paragraph(s). No preamble like "Here is the rewrite:".`;

const LEAD_SYSTEM_PROMPT = `You are an editorial assistant writing the italic subhead for the monthly "Pastoral Diary" newsletter from His Grace Most Rev. Valerian Maduka Okeke, Metropolitan Archbishop of Onitsha.

Your task
- Write ONE short sentence (≤ 22 words) that previews the spiritual or pastoral arc of the month. Goes under the display heading in italic.
- Calm, editorial register. Past or present tense. Third-person.
- Examples of the right shape:
  - "A month marked by confirmations across the Archdiocese, a visit to Awkuzu, and reflections on Eucharistic devotion."
  - "Pastoral visits, ordinations, and a steady return to the theme of family in May's diary."
  - "From the Cathedral procession to a quiet retreat at home, the rhythm of an ordinary, fruitful month."

Hard rules
- NEVER invent specifics not in the source posts. If a place, person, or feast is not named in the posts you are given, do not name one in the lead. Prefer a thematic generalisation over a fabricated detail.
- One sentence. No semicolons stitching two sentences together.
- No hashtags, emojis, exclamation marks, or quoted scripture.
- Do NOT begin with "This month" — find a more particular opening.
- Plain text only. No quotation marks around the sentence. No preamble.
- If the posts are too sparse to characterise the month, respond with exactly: NO_CONTENT`;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

export function aiConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

function formatDateForPrompt(d: Date): string {
  return `${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function extractText(message: Anthropic.Message): string {
  for (const block of message.content) {
    if (block.type === "text") return block.text.trim();
  }
  return "";
}

export type RewriteInput = {
  source: string;
  createdTime: Date;
};

// Rewrites a single FB caption in the editorial register. Returns the
// rewritten paragraph, or null if the source was effectively empty (the
// caller should keep the message empty / hide that post).
export async function rewritePostEditorially(
  input: RewriteInput,
): Promise<string | null> {
  const client = getClient();
  if (!client) {
    throw new Error(
      "Anthropic SDK not configured — set ANTHROPIC_API_KEY in the environment.",
    );
  }
  const dateLabel = formatDateForPrompt(input.createdTime);
  const userPrompt = `Date of the post: ${dateLabel}

Raw source caption (from the Archbishop's Facebook page):
"""
${input.source.trim()}
"""

Rewrite this in the editorial voice described above. Return only the rewritten paragraph (or "NO_CONTENT" if the source has no usable content).`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = extractText(response);
  if (!text || text === "NO_CONTENT") return null;
  return text;
}

export type LeadInput = {
  posts: Array<{ message: string; createdTime: Date }>;
  editionDate: Date;
};

// Generates the italic lead sentence shown under the display heading.
// Uses the assembled posts (raw or already-edited — caller decides) as
// the source.
export async function generateMonthlyLead(
  input: LeadInput,
): Promise<string | null> {
  const client = getClient();
  if (!client) {
    throw new Error(
      "Anthropic SDK not configured — set ANTHROPIC_API_KEY in the environment.",
    );
  }
  if (input.posts.length === 0) return null;

  const monthLabel = `${MONTH_NAMES[input.editionDate.getUTCMonth()]} ${input.editionDate.getUTCFullYear()}`;
  const summarised = input.posts
    .map((p, i) => {
      const d = formatDateForPrompt(p.createdTime);
      const trimmed = (p.message || "").trim().slice(0, 600);
      return `[${i + 1}] ${d}\n${trimmed}`;
    })
    .join("\n\n---\n\n");

  const userPrompt = `Edition month: ${monthLabel}

Posts in this edition (chronological):

${summarised}

Write the italic lead sentence following the rules above.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 256,
    system: [
      {
        type: "text",
        text: LEAD_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = extractText(response);
  if (!text || text === "NO_CONTENT") return null;
  return text.replace(/^["']|["']$/g, "").trim();
}
