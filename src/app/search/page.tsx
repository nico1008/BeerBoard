import type { Metadata } from "next";
import { Search } from "lucide-react";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div className="container page">
      <header className="page-header">
        <div><h1>Search</h1><p>Search across beers, breweries, countries, and styles from one place.</p></div>
      </header>
      <section className="section">
        <form className="panel" action="/beers" method="get">
          <div className="field">
            <label htmlFor="global-search">Search the catalog</label>
            <input className="input" id="global-search" name="q" type="search" required maxLength={80} autoFocus placeholder="Try “saison”, “Belgium”, or a beer name" />
          </div>
          <button className="button-secondary" type="submit" style={{ marginTop: "1rem" }}><Search size={17} />Show results</button>
        </form>
      </section>
    </div>
  );
}
