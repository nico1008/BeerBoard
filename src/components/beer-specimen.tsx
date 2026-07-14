export function BeerSpecimen({ name, style, country }: { name: string; style: string; country: string }) {
  const mark = name.split(/\s+/).map((word) => word[0]).join("").slice(0, 3);
  return (
    <figure className="specimen">
      <div className="specimen-mark">
        <strong aria-hidden="true">{mark}</strong>
        <span>{name}</span>
        <span>{style} · {country}</span>
      </div>
      <figcaption className="sr-only">Typographic specimen treatment for the fictional demonstration beer {name}.</figcaption>
    </figure>
  );
}
