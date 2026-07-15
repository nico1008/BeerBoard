import type { Metadata } from "next";
import { BeerDiscovery } from "@/components/beer-discovery";
import { listStyles } from "@/lib/catalog";

export const metadata: Metadata = { title: "A global guide for curious beer drinkers" };
export const revalidate = 3600;

export default async function HomePage() {
  const styles = await listStyles();

  return <BeerDiscovery styles={styles.filter((style) => style.beer_count > 0).map(({ name, slug }) => ({ name, slug }))} />;
}
