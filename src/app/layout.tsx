import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "BeerBoard", template: "%s · BeerBoard" },
  description: "A global demonstration catalog for discovering, comparing, and saving remarkable beer profiles.",
  openGraph: {
    title: "BeerBoard",
    description: "Objective craft intelligence for beer lovers around the world.",
    type: "website",
    url: siteUrl,
  },
};

const themeScript = `(() => { try { const stored = localStorage.getItem('beerboard-theme'); if (stored === 'light' || stored === 'dark') document.documentElement.dataset.theme = stored; } catch {} })();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="site-shell">
          <SiteHeader />
          <main className="main-content" id="main-content">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
