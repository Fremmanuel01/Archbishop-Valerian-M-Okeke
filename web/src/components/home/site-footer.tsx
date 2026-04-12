import Image from "next/image";
import Link from "next/link";
import { Latin, Roman } from "@/components/editorial";

const LIBRARY = [
  { label: "Pastoral Letters", href: "/pastoral-letters" },
  { label: "Reflections & Homilies", href: "/reflections" },
  { label: "Other Teachings", href: "/other-teachings" },
  { label: "Pastoral Visits", href: "/pastoral-visits" },
];
const HIS_GRACE = [
  { label: "Biography", href: "/biography" },
  { label: "His Episcopacy", href: "/his-episcopacy" },
  { label: "Coat of Arms", href: "/coat-of-arms" },
  { label: "Pastoral Diary", href: "/diary" },
];
const CONNECT = [
  { label: "Prayer Requests", href: "/connect/prayer-requests" },
  { label: "Contact", href: "/connect/contact" },
  { label: "Newsletter", href: "/connect/newsletter" },
];

export function SiteFooter() {
  return (
    <footer
      id="connect"
      className="relative overflow-hidden border-t border-[color:var(--rule)] bg-tan px-14 pb-10 pt-24 text-ink max-lg:px-8 max-md:px-6 max-md:pt-20"
    >
      <Image
        src="/coat-of-arms.png"
        alt=""
        width={720}
        height={720}
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 h-[720px] w-[720px] opacity-10 max-md:-bottom-24 max-md:-right-24 max-md:h-[420px] max-md:w-[420px]"
      />

      <div className="relative mx-auto max-w-[1240px]">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-14 max-lg:grid-cols-2 max-lg:gap-10 max-md:grid-cols-1">
          <div className="max-lg:col-span-2 max-md:col-span-1">
            <p className="mb-3.5 font-[family-name:var(--font-display)] text-4xl font-medium leading-[1.15] text-ink">
              Valerian M. Okeke
              <span className="mt-1 block text-[22px] italic text-gold">
                Archbishop of Onitsha
              </span>
            </p>
            <p className="mt-6 max-w-[320px] border-l border-gold pl-4 font-[family-name:var(--font-display)] text-base italic leading-[1.5] text-ink-soft opacity-85">
              &ldquo;<Latin>Ut Vitam Habeant</Latin> — that they may have life,
              and have it more abundantly.&rdquo; · John{" "}
              <abbr title="10">X</abbr>:10
            </p>
          </div>

          <FooterColumn title="Library" links={LIBRARY} />
          <FooterColumn title="His Grace" links={HIS_GRACE} />
          <FooterColumn title="Connect" links={CONNECT} />
        </div>

        <div className="mt-20 flex justify-between border-t border-stone pt-8 font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[1.6px] text-ink-soft opacity-70 max-md:mt-14 max-md:flex-col max-md:items-center max-md:gap-2.5 max-md:text-center">
          <span>
            © <Roman year={2026} /> · The Office of His Grace
          </span>
          <span>
            <Latin>Domus Episcopalis</Latin> · Onitsha · Anambra · Nigeria
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <nav aria-label={title}>
      <h5 className="mb-5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold">
        {title}
      </h5>
      <ul className="list-none">
        {links.map((link) => (
          <li
            key={link.label}
            className="mb-3 font-[family-name:var(--font-body)] text-[15px] text-ink-soft opacity-85"
          >
            <Link href={link.href} className="link-underline hover:text-gold">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
