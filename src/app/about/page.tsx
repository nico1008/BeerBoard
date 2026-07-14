import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <div className="container page"><header className="page-header"><div><h1>About BearBoard</h1><p>A clearer way for beer lovers around the world to discover, understand, and remember remarkable profiles.</p></div></header><article className="prose section"><h2>Built for curious drinkers</h2><p>BearBoard connects global rankings, regional context, style education, technical measurements, and sensory language. It is designed for people who want useful evidence without needing professional tasting vocabulary.</p><h2>Precision without pretense</h2><p>Measurements are only useful when their limits are visible. BearBoard explains its score, preserves missing values, and distinguishes demonstration data from verified claims.</p><h2>A global catalog</h2><p>Country and style routes are first-class discovery tools rather than decorative metadata. They help visitors move from a beer to its broader context and back again.</p></article></div>;
}
