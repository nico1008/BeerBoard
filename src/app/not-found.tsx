import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container page">
      <div className="empty-state">
        <h2>That page is not in the catalog</h2>
        <p>The beer, country, style, or route may have changed. Return to the current demonstration ranking to continue exploring.</p>
        <Link className="button-secondary" href="/beers">Browse all beers</Link>
      </div>
    </div>
  );
}
