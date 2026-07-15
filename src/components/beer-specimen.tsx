export function BeerSpecimen({ name, style, country, colorSrm = null }: { name: string; style: string; country: string; colorSrm?: number | null }) {
  const tone = colorSrm === null ? 4 : colorSrm < 5 ? 1 : colorSrm < 10 ? 2 : colorSrm < 18 ? 3 : colorSrm < 28 ? 4 : colorSrm < 38 ? 5 : 6;

  return (
    <figure className="specimen">
      <div className="specimen-glass" data-tone={tone} aria-hidden="true"><span className="specimen-foam" /><span className="specimen-beer"><i /><i /><i /></span></div>
      <figcaption><strong>{name}</strong><span>{style} · {country}</span></figcaption>
    </figure>
  );
}
