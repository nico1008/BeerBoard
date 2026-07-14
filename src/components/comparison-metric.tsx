import { ArrowDown, ArrowUp, Equal, Minus } from "lucide-react";
import { compareNumbers, type ComparisonState } from "@/lib/comparison";

function StateValue({ state, value, suffix = "" }: { state: ComparisonState; value: number | null; suffix?: string }) {
  const Icon = state === "higher" ? ArrowUp : state === "lower" ? ArrowDown : state === "equal" ? Equal : Minus;
  const label = state === "unavailable" ? "Not reported" : `${value?.toFixed(1)}${suffix}`;
  return <span className="comparison-state" data-state={state}><Icon size={15} aria-hidden="true" /><span>{label}</span><span className="sr-only">, {state}</span></span>;
}

export function ComparisonMetric({ label, left, right, suffix, tolerance }: { label: string; left: number | null; right: number | null; suffix?: string; tolerance?: number }) {
  const states = compareNumbers(left, right, tolerance);
  return (
    <div className="comparison-row">
      <dt>{label}</dt>
      <dd><StateValue state={states.left} value={left} suffix={suffix} /></dd>
      <dd><StateValue state={states.right} value={right} suffix={suffix} /></dd>
    </div>
  );
}
