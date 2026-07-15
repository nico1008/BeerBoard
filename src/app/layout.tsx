import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "BeerBoard", template: "%s · BeerBoard" },
  description: "A welcoming global guide for discovering, comparing, and saving remarkable beer profiles.",
  openGraph: {
    title: "BeerBoard",
    description: "A global beer guide for curious drinkers everywhere.",
    type: "website",
    url: siteUrl,
  },
};

const themeScript = `(() => { try { const stored = localStorage.getItem('beerboard-theme'); const theme = stored === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : stored; document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light'; } catch { document.documentElement.dataset.theme = 'light'; } })();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
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
