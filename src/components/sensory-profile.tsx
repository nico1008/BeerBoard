const labels = ["Aroma", "Bitterness", "Sweetness", "Body", "Brightness", "Finish"] as const;

export type SensoryValues = Record<(typeof labels)[number], number>;

function point(angle: number, radius: number) {
  const radians = (angle - 90) * (Math.PI / 180);
  return `${100 + Math.cos(radians) * radius},${100 + Math.sin(radians) * radius}`;
}

export function SensoryProfile({ values, title = "Sensory profile" }: { values: SensoryValues; title?: string }) {
  const angles = labels.map((_, index) => index * 60);
  const polygon = labels.map((label, index) => point(angles[index], values[label] * 7)).join(" ");
  const grid = [2.5, 5, 7.5, 10].map((level) => labels.map((_, index) => point(angles[index], level * 7)).join(" "));

  return (
    <div className="sensory-layout">
      <svg className="radar" viewBox="0 0 200 200" role="img" aria-labelledby="sensory-title sensory-desc">
        <title id="sensory-title">{title}</title>
        <desc id="sensory-desc">Radar chart of aroma, bitterness, sweetness, body, brightness, and finish. Exact values follow the chart.</desc>
        {grid.map((points) => <polygon className="radar-grid" points={points} key={points} />)}
        {angles.map((angle) => <line className="radar-axis" x1="100" y1="100" x2={point(angle, 70).split(",")[0]} y2={point(angle, 70).split(",")[1]} key={angle} />)}
        <polygon className="radar-shape" points={polygon} />
        {labels.map((label, index) => {
          const [x, y] = point(angles[index], 86).split(",");
          return <text className="radar-label" x={x} y={Number(y) + 3} key={label}>{label}</text>;
        })}
      </svg>
      <dl className="sensory-list" aria-label="Sensory profile values">
        {labels.map((label) => (
          <div className="sensory-row" key={label}>
            <dt>{label}</dt>
            <dd className="meter" aria-hidden="true"><span style={{ width: `${values[label] * 10}%` }} /></dd>
            <dd>{values[label].toFixed(1)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
