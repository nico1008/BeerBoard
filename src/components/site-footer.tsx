import { Beer } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link className="wordmark" href="/beers"><Beer aria-hidden="true" size={22} />BeerBoard</Link>
          <p>A welcoming field guide to remarkable beer, made for curious drinkers everywhere.</p>
        </div>
        <nav className="footer-links" aria-label="Supporting links">
          <Link href="/methodology">Methodology</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/data-counters">Data counters</Link>
        </nav>
        <p className="footer-note">© 2026 BeerBoard. Current rankings use demonstration data, not verified claims about real breweries or beers.</p>
      </div>
    </footer>
  );
}
