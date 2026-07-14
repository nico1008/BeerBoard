import { ArrowLeftRight } from "lucide-react";
import Link from "next/link";

type BeerOption = { id: number; name: string; slug: string; brewery_name: string; country_name: string; style_name: string };

export function ComparisonSelectors({ options, left, right }: { options: BeerOption[]; left: string; right: string }) {
  const swapHref = left && right ? `/compare?a=${encodeURIComponent(right)}&b=${encodeURIComponent(left)}` : "/compare";
  return (
    <form className="compare-selectors" action="/compare" method="get">
      <div className="field">
        <label htmlFor="subject-a">Subject A</label>
        <input className="input" id="subject-a" name="a" list="beer-options-a" defaultValue={left} required placeholder="Search by beer name" autoComplete="off" />
        <datalist id="beer-options-a">
          {options.map((beer) => <option key={beer.id} value={beer.slug}>{beer.name} · {beer.brewery_name}</option>)}
        </datalist>
      </div>
      <Link className="button-ghost" href={swapHref} aria-label="Swap subjects"><ArrowLeftRight size={17} />Swap</Link>
      <div className="field">
        <label htmlFor="subject-b">Subject B</label>
        <input className="input" id="subject-b" name="b" list="beer-options-b" defaultValue={right} required placeholder="Search by beer name" autoComplete="off" />
        <datalist id="beer-options-b">
          {options.map((beer) => <option key={beer.id} value={beer.slug}>{beer.name} · {beer.brewery_name}</option>)}
        </datalist>
      </div>
      <div className="filter-actions">
        <Link className="button-ghost" href="/compare">Clear</Link>
        <button className="button-secondary" type="submit">Compare selections</button>
      </div>
    </form>
  );
}
