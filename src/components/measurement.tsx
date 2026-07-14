export function Measurement({ label, value, suffix }: { label: string; value: string | number | null; suffix?: string }) {
  const reported = value !== null && value !== "";
  return (
    <div className="measurement">
      <dt>{label}</dt>
      <dd>{reported ? `${value}${suffix ?? ""}` : "Not reported"}</dd>
    </div>
  );
}
