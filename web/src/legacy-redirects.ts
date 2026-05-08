import type { Redirect } from "next/dist/lib/load-custom-routes";

/**
 * Redirect map from legacy WordPress URLs (from the previous archbishopvalokeke.org
 * site, archived in scraped/inventory.json) to the equivalent location on the
 * new Next.js site.
 *
 * Strategy:
 *   - Known pastoral letters → /pastoral-letters (archive page; visitors find the
 *     specific letter from the cover grid).
 *   - Sunday / feast-day homilies, episcopal events, single reflections →
 *     /reflections.
 *   - Christmas / Easter / synod messages → /messages.
 *   - Lectures, addresses, interviews → /other-teachings.
 *   - Pastoral visits, dedications, installations → /pastoral-visits.
 *   - Static legacy pages (about, photos, contact, appointment) → their new
 *     editorial counterparts.
 *
 * All redirects are 308 (permanent) — search engines should follow and update
 * their indexes. Inbound links from old articles, social shares, or printed
 * material continue to land on the right page.
 */
export const LEGACY_REDIRECTS: Redirect[] = [
  // ── Static & navigation ───────────────────────────────────────────
  { source: "/home", destination: "/", permanent: true },
  { source: "/welcome-to-archbishop-valerian-okeke-online", destination: "/", permanent: true },
  { source: "/about-me", destination: "/biography", permanent: true },
  { source: "/behold-his-grace", destination: "/biography", permanent: true },
  { source: "/coat-of-arm", destination: "/coat-of-arms", permanent: true },
  { source: "/pastoral-diary", destination: "/diary", permanent: true },
  { source: "/events-2", destination: "/diary", permanent: true },
  { source: "/contact", destination: "/connect/contact", permanent: true },
  { source: "/contact-me", destination: "/connect/contact", permanent: true },
  { source: "/blog", destination: "/reflections", permanent: true },
  { source: "/relections", destination: "/reflections", permanent: true }, // legacy typo
  { source: "/my-pastoral-letters", destination: "/pastoral-letters", permanent: true },
  { source: "/facebook", destination: "https://www.facebook.com/Archbishopval", permanent: true },

  // ── Appointments ───────────────────────────────────────────────────
  { source: "/appointment", destination: "/connect/appointment-laity", permanent: true },
  { source: "/appointment-2", destination: "/connect/appointment-clergy", permanent: true },

  // ── Pastoral letters (each old slug → archive page) ────────────────
  { source: "/and-the-two-become-onetowards-a-christian-marriage", destination: "/pastoral-letters", permanent: true },
  { source: "/blessed-are-the-merciful", destination: "/pastoral-letters", permanent: true },
  { source: "/blessed-are-the-peacemakers", destination: "/pastoral-letters", permanent: true },
  { source: "/catholic-education-and-national", destination: "/pastoral-letters", permanent: true },
  { source: "/democracy-and-christian-values", destination: "/pastoral-letters", permanent: true },
  { source: "/gratitude", destination: "/pastoral-letters", permanent: true },
  { source: "/living-hope", destination: "/pastoral-letters", permanent: true },
  { source: "/mary-our-mother", destination: "/pastoral-letters", permanent: true },
  { source: "/our-glorious-heritage", destination: "/pastoral-letters", permanent: true },
  { source: "/our-greatest-legacy", destination: "/pastoral-letters", permanent: true },
  { source: "/pastoral-letter-2020", destination: "/pastoral-letters", permanent: true },
  { source: "/that-they-may-have-life", destination: "/pastoral-letters", permanent: true },
  { source: "/the-dignity-of-labour", destination: "/pastoral-letters", permanent: true },
  { source: "/the-family-and-human-life", destination: "/pastoral-letters", permanent: true },
  { source: "/the-holy-eucharist-our-strength", destination: "/pastoral-letters", permanent: true },
  { source: "/the-holy-spirit-mans-helper-and-friend", destination: "/pastoral-letters", permanent: true },
  { source: "/the-holy-spiritmans-helper-and-friend", destination: "/pastoral-letters", permanent: true },
  { source: "/the-hour-of-glory", destination: "/pastoral-letters", permanent: true },
  { source: "/the-measure-of-love", destination: "/pastoral-letters", permanent: true },
  { source: "/the-priesthood-gift-and-sacrifice", destination: "/pastoral-letters", permanent: true },
  { source: "/the-sacrament-our-tresure", destination: "/pastoral-letters", permanent: true },
  { source: "/you-and-the-common-good", destination: "/pastoral-letters", permanent: true },

  // ── Christmas / Easter / synod messages ───────────────────────────
  { source: "/2018-christmas-message-of-his-grace-most-rev-valerian-m-okeke", destination: "/messages", permanent: true },
  { source: "/2019-christmas-message-of-his-grace-most-rev-valerian-m-okeke", destination: "/messages", permanent: true },
  { source: "/2021-christmas-message-of-his-grace-most-rev-valerian-m-okeke", destination: "/messages", permanent: true },
  { source: "/christmas-message-of-his-grace-most-rev-valerian-m-okeke", destination: "/messages", permanent: true },
  { source: "/2020-easter-message", destination: "/messages", permanent: true },
  { source: "/2020-easter-message-of-his-grace-most-rev-valerian-m-okeke", destination: "/messages", permanent: true },
  { source: "/easter-message-of-his-grace-most-rev-valerian-m-okeke", destination: "/messages", permanent: true },
  { source: "/easter-message-2023-in-faith-and-prayers-we-move", destination: "/messages", permanent: true },

  // ── Sunday / feast-day homilies ───────────────────────────────────
  { source: "/100-years-of-our-ladys-apparition-at-fatima", destination: "/reflections", permanent: true },
  { source: "/11th-sunday-of-the-year-a", destination: "/reflections", permanent: true },
  { source: "/16th-sunday-of-the-year-a", destination: "/reflections", permanent: true },
  { source: "/2020-divine-mercy-sunday", destination: "/reflections", permanent: true },
  { source: "/2020-divine-mercy-sunday-2", destination: "/reflections", permanent: true },
  { source: "/2020-palm-sunday-homily", destination: "/reflections", permanent: true },
  { source: "/5th-sunday-of-easter-year-a", destination: "/reflections", permanent: true },
  { source: "/baptism-of-the-lord-year-a", destination: "/reflections", permanent: true },
  { source: "/corpus-christi", destination: "/reflections", permanent: true },
  { source: "/epiphany-of-the-lord-2008-year-a", destination: "/reflections", permanent: true },
  { source: "/feast-of-ss-peter-and-paul", destination: "/reflections", permanent: true },
  { source: "/feast-of-the-most-holy-trinity-year-a", destination: "/reflections", permanent: true },
  { source: "/good-shepherd-sunday", destination: "/reflections", permanent: true },
  { source: "/ninth-sunday-of-the-year-a", destination: "/reflections", permanent: true },
  { source: "/pentecost-sunday-2020", destination: "/reflections", permanent: true },
  { source: "/second-sunday-of-advent-year-a", destination: "/reflections", permanent: true },
  { source: "/solemnity-of-the-most-holy-body-and-blood-of-christ-2020", destination: "/reflections", permanent: true },
  { source: "/tenth-sunday-of-the-year-a", destination: "/reflections", permanent: true },

  // ── Reflections — episcopal events, anecdotes, single homilies ────
  { source: "/50th-priestly-ordination-anniversary-of-most-rev-emmanuel-otteh", destination: "/reflections", permanent: true },
  { source: "/between-grace-and-gratitude", destination: "/reflections", permanent: true },
  { source: "/dedication-of-chapel-of-divine-mercy-pope-john-paul-ii-major-seminary-awka", destination: "/reflections", permanent: true },
  { source: "/final-profession-of-i-h-m-sisters", destination: "/reflections", permanent: true },
  { source: "/funeral-of-bishop-e-otteh", destination: "/reflections", permanent: true },
  { source: "/god-is-coming-to-save-his-own", destination: "/reflections", permanent: true },
  { source: "/homily-at-our-ladys-secondary-school-nnobi-pastoral-visit", destination: "/reflections", permanent: true },
  { source: "/homily-at-st-kizito-girls-secondary-school-umudioka-pastoral-visit", destination: "/reflections", permanent: true },
  { source: "/homily-at-stella-maris-college-umueri-pastoral-visit", destination: "/reflections", permanent: true },
  { source: "/homily-at-the-40th-priestly-anniversary-of-most-rev-jude-thaddeus-okolo", destination: "/reflections", permanent: true },
  { source: "/homily-at-the-dedication-of-the-chapel-of-blessed-iwene-tansi-major-seminary-onitsha", destination: "/reflections", permanent: true },
  { source: "/homily-at-the-installations-of-bishop-of-ekwulobia-diocese", destination: "/reflections", permanent: true },
  { source: "/impossibility-is-not-a-place-to-stop", destination: "/reflections", permanent: true },
  { source: "/in-the-house-of-god-there-are-no-outsiders", destination: "/reflections", permanent: true },
  { source: "/inauguration-of-the-basilica-status", destination: "/reflections", permanent: true },
  { source: "/installation-of-archbishop-ignatius-ayau-kaigama", destination: "/reflections", permanent: true },
  { source: "/installation-of-most-rev-peter-okpaleke", destination: "/reflections", permanent: true },
  { source: "/it-is-no-longer-i-who-live-gal-2-20ff", destination: "/reflections", permanent: true },
  { source: "/ordination-of-most-rev-godfrey-onah-of-nsukka", destination: "/reflections", permanent: true },
  { source: "/prayer-is-the-key-2", destination: "/reflections", permanent: true },
  { source: "/reasons-for-the-love-of-mary", destination: "/reflections", permanent: true },
  { source: "/second-onitsha-archdiocesan-synod", destination: "/reflections", permanent: true },
  { source: "/tribute-to-very-rev-fr-nicholas-tagbo", destination: "/reflections", permanent: true },
  { source: "/true-worship-of-god", destination: "/reflections", permanent: true },

  // ── Lectures, addresses, interviews → /other-teachings ────────────
  { source: "/a-keynote-address-by-the-archbishop-at-the-6th-convocation-ceremony-of-blessed-iwene-tansi-seminary-onitsha", destination: "/other-teachings", permanent: true },
  { source: "/an-address-of-welcome-by-archbishop-valerian-m-okeke-at-onitshaowerri-provincial-bishops-meeting-in-enugu-2", destination: "/other-teachings", permanent: true },
  { source: "/an-address-to-catholic-principals-onitsha-archdiocese-by-his-grace-most-rev-valerian-maduka-okeke-archbishop-of-onitsha-the-archdiocesan-secretariat-hall-onitsha-november-26-2010", destination: "/other-teachings", permanent: true },
  { source: "/archbishop-interview-mind-opener", destination: "/other-teachings", permanent: true },
  { source: "/christians-interrogate-the-caste-systems-in-the-nigerian-society-and-constitution", destination: "/other-teachings", permanent: true },
  { source: "/interview-for-the-ambassador", destination: "/other-teachings", permanent: true },
  { source: "/interview-for-treasure-magazine", destination: "/other-teachings", permanent: true },
  { source: "/interview-with-his-grace", destination: "/other-teachings", permanent: true },
  { source: "/interview-with-the-guardian", destination: "/other-teachings", permanent: true },
  { source: "/lecture-for-enugu-diocesan-synod", destination: "/other-teachings", permanent: true },
  { source: "/nfcs-unizik-address", destination: "/other-teachings", permanent: true },
  { source: "/onitsha-stakeholders-forum-phase-ii", destination: "/other-teachings", permanent: true },
  { source: "/pro-life-anti-aids-campaign-movementseminarians-for-life", destination: "/other-teachings", permanent: true },
  { source: "/the-beauty-splendor-of-consecrated-life", destination: "/other-teachings", permanent: true },

  // ── Pastoral visits ───────────────────────────────────────────────
  { source: "/archbishop-says-farewell-to-fr-charles-okeke-odogwu", destination: "/pastoral-visits", permanent: true },
  { source: "/archbishop-visit-basilica-of-the-most-holy-trinity", destination: "/pastoral-visits", permanent: true },
  { source: "/archbishops-cathedraticum-at-onitsha-region", destination: "/pastoral-visits", permanent: true },

  // ── WordPress drafts and lorem-ipsum scaffolding → home ───────────
  { source: "/elementor-481", destination: "/pastoral-letters", permanent: true },
  { source: "/pretium-lectus-quam-lidleo-unvitae-turpis", destination: "/", permanent: true },
  { source: "/sitamet-risus-nullam-egetcras-ornare-arcu-dui-vivamus-arcu-felis-bibendum-ut", destination: "/", permanent: true },

  // ── WordPress feed & API endpoints (the legacy site exposed these
  // ── because of the WordPress install; redirect them gracefully) ───
  { source: "/feed", destination: "/", permanent: false },
  { source: "/feed/:path*", destination: "/", permanent: false },
  { source: "/comments/feed", destination: "/", permanent: false },
  { source: "/wp-admin/:path*", destination: "/admin", permanent: true },
  { source: "/wp-login.php", destination: "/admin", permanent: true },
];
