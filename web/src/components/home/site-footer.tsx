import Image from "next/image";
import Link from "next/link";
import { Latin, Roman } from "@/components/editorial";

const LIBRARY = [
  { label: "Pastoral Letters", href: "/pastoral-letters" },
  { label: "Reflections & Homilies", href: "/reflections" },
  { label: "Easter & Christmas Messages", href: "/messages" },
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
const SOCIAL = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/Archbishopval",
    path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/archbishopvalerianokeke/",
    path: "M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.5.01-4.74.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.27.82-.38.39-.62.76-.82 1.27-.15.39-.33.97-.38 2.04C2.69 9.72 2.68 10.07 2.68 13s.01 3.28.07 4.52c.05 1.07.23 1.65.38 2.04.2.51.44.88.82 1.27.39.38.76.62 1.27.82.39.15.97.33 2.04.38 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.07-.05 1.65-.23 2.04-.38.51-.2.88-.44 1.27-.82.38-.39.62-.76.82-1.27.15-.39.33-.97.38-2.04.06-1.24.07-1.59.07-4.52s-.01-3.28-.07-4.52c-.05-1.07-.23-1.65-.38-2.04a3.4 3.4 0 0 0-.82-1.27 3.4 3.4 0 0 0-1.27-.82c-.39-.15-.97-.33-2.04-.38C15.5 4.01 15.15 4 12 4Zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9Zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3Zm5.2-1.98a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@onitsha-archdiocese",
    path: "M23.5 7.1a3 3 0 0 0-2.1-2.12C19.55 4.5 12 4.5 12 4.5s-7.55 0-9.4.48A3 3 0 0 0 .5 7.1C0 8.95 0 12 0 12s0 3.05.5 4.9a3 3 0 0 0 2.1 2.12C4.45 19.5 12 19.5 12 19.5s7.55 0 9.4-.48a3 3 0 0 0 2.1-2.12C24 15.05 24 12 24 12s0-3.05-.5-4.9ZM9.6 15.57V8.43L15.82 12 9.6 15.57Z",
  },
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

            <ul className="mt-8 flex items-center gap-3" aria-label="Social media">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="group flex h-11 w-11 items-center justify-center border border-[color:var(--rule)] text-ink-soft transition-colors hover:border-gold hover:text-gold"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                      className="h-[18px] w-[18px]"
                    >
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
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
