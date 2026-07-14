import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <div className="container page"><header className="page-header"><div><h1>Contact</h1><p>Questions about the catalog, accessibility, or methodology are welcome.</p></div></header><section className="section panel" style={{ maxWidth: "44rem" }}><h2>Email BeerBoard</h2><p>This demonstration does not collect contact form submissions. Use your email client so the message stays under your control.</p><a className="button-secondary" href="mailto:hello@beerboard.app?subject=BeerBoard%20question"><Mail size={17} />hello@beerboard.app</a></section></div>;
}
