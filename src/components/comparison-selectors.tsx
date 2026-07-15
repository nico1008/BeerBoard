import { ArrowLeftRight, RotateCcw } from "lucide-react";
import Link from "next/link";

type BeerOption = { id: number; name: string; slug: string; brewery_name: string; country_name: string; style_name: string };

export function ComparisonSelectors({ options, left, right }: { options: BeerOption[]; left: string; right: string }) {
  const swapHref = left && right ? `/compare?a=${encodeURIComponent(right)}&b=${encodeURIComponent(left)}` : "/compare";
  return (
    <form className="compare-selectors" action="/compare" method="get">
      <div className="field">
        <label htmlFor="subject-a">First beer</label>
        <select className="select" id="subject-a" name="a" defaultValue={left} required>
          <option value="" disabled>Choose a beer</option>
          {options.map((beer) => <option key={beer.id} value={beer.slug}>{beer.name} — {beer.brewery_name} · {beer.country_name}</option>)}
        </select>
      </div>
      <Link className="swap-button" href={swapHref} aria-label="Swap selected beers"><ArrowLeftRight aria-hidden="true" size={18} /><span>Swap</span></Link>
      <div className="field">
        <label htmlFor="subject-b">Second beer</label>
        <select className="select" id="subject-b" name="b" defaultValue={right} required>
          <option value="" disabled>Choose another beer</option>
          {options.map((beer) => <option key={beer.id} value={beer.slug}>{beer.name} — {beer.brewery_name} · {beer.country_name}</option>)}
        </select>
      </div>
      <div className="filter-actions"><Link className="button-ghost" href="/compare"><RotateCcw aria-hidden="true" size={17} />Clear</Link><button className="button-secondary" type="submit">Compare beers</button></div>
    </form>
  );
}
