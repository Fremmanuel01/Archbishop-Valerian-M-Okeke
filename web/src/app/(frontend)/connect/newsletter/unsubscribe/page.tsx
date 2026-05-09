import type { Metadata } from "next";
import Link from "next/link";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Latin } from "@/components/editorial";
import {
  ConfirmTokenUnsubscribeForm,
  UnsubscribeForm,
} from "@/components/unsubscribe-forms";
import { verifyNewsletterToken } from "@/lib/newsletter-token";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

// Email-security scanners (Outlook ATP, Mimecast, GSuite anti-phishing,
// link-warmers in general) prefetch every URL in inbound mail. If we
// performed the actual unsubscribe in this page's render path, those
// prefetches would silently remove legitimate readers from the list.
// Instead we VERIFY the token here (no side effects), then ask the
// visitor to click a button that submits a server action via POST.
// RFC 8058 one-click unsubscribe still works because POST on the
// `List-Unsubscribe-Post` header is a separate path.

type Outcome =
  | { kind: "token-valid"; token: string; email: string }
  | { kind: "token-invalid"; prefill?: string }
  | { kind: "manual"; prefill?: string };

function classifyToken(token: string | undefined, prefill?: string): Outcome {
  if (!token) return { kind: "manual", prefill };
  const verified = verifyNewsletterToken(token, "unsubscribe");
  if (!verified) return { kind: "token-invalid", prefill };
  return { kind: "token-valid", token, email: verified.email };
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;
  const outcome = classifyToken(token, email);

  return (
    <PageShell
      eyebrow={<Latin>Newsletter · Unsubscribe</Latin>}
      title="Unsubscribe from the"
      titleAccent="Newsletter"
      lead="Confirm below to remove your address from the Pastoral Diary list. We will not send you any further messages."
    >
      <PageSection>
        <div className="mx-auto max-w-[600px] border border-[color:var(--rule)] bg-bone-deep p-10 max-md:p-6">
          {outcome.kind === "token-valid" ? (
            <ConfirmTokenUnsubscribeForm
              token={outcome.token}
              email={outcome.email}
            />
          ) : outcome.kind === "token-invalid" ? (
            <>
              <p className="mb-6 font-[family-name:var(--font-body)] text-[16px] leading-[1.7] text-ink">
                That unsubscribe link is invalid or has expired. Please type
                the email address you wish to remove and we will take care of
                it from here.
              </p>
              <UnsubscribeForm defaultEmail={outcome.prefill} />
            </>
          ) : (
            <>
              <p className="font-[family-name:var(--font-body)] text-[16px] leading-[1.7] text-ink-soft">
                If you have a personal unsubscribe link from one of our
                emails, that is the simplest path. Otherwise, type your email
                below and we will remove you.
              </p>
              <UnsubscribeForm defaultEmail={outcome.prefill} />
            </>
          )}

          <div className="mt-10 flex flex-wrap gap-4 border-t border-[color:var(--rule)] pt-6">
            <Link
              href="/"
              className="link-underline font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[1.5px] text-ink"
            >
              Return home
            </Link>
            <Link
              href="/connect/newsletter"
              className="link-underline font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[1.5px] text-ink-soft"
            >
              Back to the newsletter page
            </Link>
          </div>
        </div>
      </PageSection>
    </PageShell>
  );
}
