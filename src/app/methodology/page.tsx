import type { Metadata } from "next";
import { DatasetNotice } from "@/components/dataset-notice";
import { getLatestRelease } from "@/lib/catalog";

export const metadata: Metadata = { title: "Methodology" };
export const revalidate = 3600;

export default async function MethodologyPage() {
  const release = await getLatestRelease();
  return (
    <div className="container page"><header className="page-header"><div><h1>Methodology</h1><p>What the BearBoard Index measures, how it is calculated, and where interpretation still matters.</p></div></header><DatasetNotice release={release} /><article className="prose section"><h2>One score, one owning layer</h2><p>The database generates every index score from four stored assessment inputs. The interface never recalculates or overrides that result.</p><h2>Component weights</h2><ul><li><strong>Quality — 35%:</strong> assessed clarity, integration, and absence of distracting faults.</li><li><strong>Balance — 25%:</strong> how effectively bitterness, sweetness, alcohol, acidity, and body work together for the style.</li><li><strong>Distinctiveness — 20%:</strong> the clarity and memorability of the beer’s sensory identity.</li><li><strong>Technical execution — 20%:</strong> fermentation, attenuation, carbonation, stability, and finish.</li></ul><h2>What the score does not prove</h2><p>A higher score does not mean every drinker will prefer that beer. Different styles solve different sensory problems. Comparison notes therefore describe measured tradeoffs and never declare an overall winner.</p><h2>Missing values</h2><p>Technical values remain null when they were not supplied. BearBoard renders them as “Not reported.” Missing data never becomes zero.</p><h2>Current dataset limitation</h2><p>The initial release is fictional demonstration data. It validates product behavior, database aggregation, accessibility, and ownership flows. It must not be cited as a verified ranking of real beer.</p></article></div>
  );
}
