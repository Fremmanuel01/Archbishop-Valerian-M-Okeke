import type { Metadata } from "next";
import Link from "next/link";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Latin } from "@/components/editorial";
import { verifyNewsletterToken } from "@/lib/newsletter-token";
import { finaliseNewsletterSubscription } from "@/app/(frontend)/connect/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confirm subscription",
  robots: { index: false, follow: false },
};

type Outcome =
  | { kind: "ok"; email: string }
  | { kind: "invalid" }
  | { kind: "expired" }
  | { kind: "failed"; reason: string };

async function process(token: string | undefined): Promise<Outcome> {
  if (!token) return { kind: "invalid" };
  const verified = verifyNewsletterToken(token, "confirm");
  if (!verified) {
    return { kind: "invalid" };
  }
  const result = await finaliseNewsletterSubscription({
    email: verified.email,
    name: verified.name,
  });
  if (result.ok) return { kind: "ok", email: verified.email };
  return { kind: "failed", reason: result.message };
}

export default async function ConfirmNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const outcome = await process(token);

  return (
    <PageShell
      eyebrow={<Latin>Newsletter · Confirmation</Latin>}
      title={outcome.kind === "ok" ? "Welcome to the" : "Confirmation"}
      titleAccent={outcome.kind === "ok" ? "Diary" : "Required"}
      lead={
        outcome.kind === "ok"
          ? "Your subscription is confirmed. A welcome message is on its way."
          : "We could not complete your subscription from this link."
      }
    >
      <PageSection>
        <div className="mx-auto max-w-[600px] border border-[color:var(--rule)] bg-bone-deep p-10 max-md:p-6">
          {outcome.kind === "ok" ? (
            <>
              <p className="font-[family-name:var(--font-body)] text-[17px] leading-[1.7] text-ink">
                Thank you, <span className="font-medium">{outcome.email}</span>.
                You are now on the list to receive pastoral letters,
                reflections, and seasonal messages from the Office of His
                Grace.
              </p>
              <p className="mt-4 font-[family-name:var(--font-body)] text-[16px] italic leading-[1.7] text-ink-soft">
                Letters arrive a few times a month, never more. An unsubscribe
                link is included in every message.
              </p>
            </>
          ) : outcome.kind === "invalid" ? (
            <p className="font-[family-name:var(--font-body)] text-[16px] leading-[1.7] text-ink">
              This confirmation link is not valid. It may have been mistyped,
              already used, or it may have expired. Please subscribe again to
              receive a new link.
            </p>
          ) : outcome.kind === "expired" ? (
            <p className="font-[family-name:var(--font-body)] text-[16px] leading-[1.7] text-ink">
              This confirmation link has expired. Please subscribe again to
              receive a fresh one.
            </p>
          ) : (
            <p className="font-[family-name:var(--font-body)] text-[16px] leading-[1.7] text-ink">
              We were unable to complete your subscription:{" "}
              <span className="italic">{outcome.reason}</span>. Please try
              subscribing again, or write to the Chancery if the problem
              persists.
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-4 border-t border-[color:var(--rule)] pt-6">
            {outcome.kind === "ok" ? (
              <Link
                href="/"
                className="link-underline font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[1.5px] text-ink"
              >
                Return home
              </Link>
            ) : (
              <Link
                href="/connect/newsletter"
                className="link-underline font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[1.5px] text-ink"
              >
                Subscribe again
              </Link>
            )}
            <Link
              href="/connect"
              className="link-underline font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[1.5px] text-ink-soft"
            >
              Connect with the Office
            </Link>
          </div>
        </div>
      </PageSection>
    </PageShell>
  );
}
