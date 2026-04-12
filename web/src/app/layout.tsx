import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, EB_Garamond, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://archbishop-valerian-m-okeke.vercel.app"),
  title: {
    default: "His Grace Most Rev. Valerian M. Okeke — Archbishop of Onitsha",
    template: "%s — Archbishop of Onitsha",
  },
  description:
    "The personal website of His Grace Most Rev. Valerian Maduka Okeke, Metropolitan Archbishop of Onitsha. Pastoral letters, homilies, reflections, and the ministry of His Grace.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "His Grace Most Rev. Valerian M. Okeke",
    title: "His Grace Most Rev. Valerian M. Okeke — Archbishop of Onitsha",
    description:
      "Pastoral letters, homilies, reflections, and the ministry of His Grace the Metropolitan Archbishop of Onitsha.",
  },
  twitter: {
    card: "summary_large_image",
    title: "His Grace Most Rev. Valerian M. Okeke — Archbishop of Onitsha",
    description:
      "Pastoral letters, homilies, reflections, and the ministry of His Grace.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1b33",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${ebGaramond.variable} ${inter.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <SmoothScroll />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
