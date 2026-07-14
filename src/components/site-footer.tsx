import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link className="wordmark" href="/beers">BeerBoard</Link>
          <p>Clear, comparative beer intelligence for curious drinkers. All current rankings use a fictional demonstration dataset.</p>
        </div>
        <nav className="footer-links" aria-label="Supporting links">
          <Link href="/methodology">Methodology</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/data-counters">Data counters</Link>
        </nav>
        <p className="footer-note">© 2026 BeerBoard. Demonstration data—not verified claims about real breweries or beers.</p>
      </div>
    </footer>
  );
}
