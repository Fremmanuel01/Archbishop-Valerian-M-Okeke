import type { Metadata } from "next";
import Link from "next/link";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Latin } from "@/components/editorial";
import { UnsubscribeForm } from "@/components/unsubscribe-forms";
import { verifyNewsletterToken } from "@/lib/newsletter-token";
import { unsubscribeAudienceContact } from "@/lib/resend";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

type Outcome =
  | { kind: "auto-ok"; email: string }
  | { kind: "auto-failed"; email: string; reason: string }
  | { kind: "manual"; prefill?: string };

async function processToken(token: string | undefined): Promise<Outcome> {
  if (!token) return { kind: "manual" };
  const verified = verifyNewsletterToken(token, "unsubscribe");
  if (!verified) return { kind: "manual" };
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    return {
      kind: "auto-failed",
      email: verified.email,
      reason: "Newsletter service is not configured.",
    };
  }
  const result = await unsubscribeAudienceContact({
    audienceId,
    email: verified.email,
  });
  if (result.ok || result.status === 404) {
    return { kind: "auto-ok", email: verified.email };
  }
  return {
    kind: "auto-failed",
    email: verified.email,
    reason: `Resend returned ${result.status}.`,
  };
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;
  const outcome = await processToken(token);

  return (
    <PageShell
      eyebrow={<Latin>Newsletter · Unsubscribe</Latin>}
      title={
        outcome.kind === "auto-ok" ? "You have been" : "Unsubscribe from the"
      }
      titleAccent={outcome.kind === "auto-ok" ? "Removed" : "Newsletter"}
      lead={
        outcome.kind === "auto-ok"
          ? "Your address has been removed from the list. We will not send you any further messages."
          : "Enter the email address you wish to remove. We will not send you any further messages."
      }
    >
      <PageSection>
        <div className="mx-auto max-w-[600px] border border-[color:var(--rule)] bg-bone-deep p-10 max-md:p-6">
          {outcome.kind === "auto-ok" ? (
            <>
              <p className="font-[family-name:var(--font-body)] text-[17px] leading-[1.7] text-ink">
                <span className="font-medium">{outcome.email}</span> has been
                removed from the Pastoral Diary list. If this was a mistake,
                you may rejoin at any time from the newsletter page.
              </p>
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
                  Subscribe again
                </Link>
              </div>
            </>
          ) : outcome.kind === "auto-failed" ? (
            <>
              <p className="font-[family-name:var(--font-body)] text-[16px] leading-[1.7] text-ink">
                We could not remove <span className="font-medium">{outcome.email}</span>{" "}
                automatically: <span className="italic">{outcome.reason}</span>{" "}
                Please use the form below to try again, or write to the
                Chancery and we will remove the address by hand.
              </p>
              <UnsubscribeForm defaultEmail={outcome.email} />
            </>
          ) : (
            <>
              <p className="font-[family-name:var(--font-body)] text-[16px] leading-[1.7] text-ink-soft">
                If you have a personal unsubscribe link from one of our
                emails, that is the simplest path. Otherwise, type your email
                below and we will remove you.
              </p>
              <UnsubscribeForm defaultEmail={email} />
            </>
          )}
        </div>
      </PageSection>
    </PageShell>
  );
}
