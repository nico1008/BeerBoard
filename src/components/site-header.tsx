"use client";

import { Beer, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AccountMenu } from "@/components/account-menu";

const navigation = [
  { href: "/beers", label: "Discover" },
  { href: "/countries", label: "Countries" },
  { href: "/styles", label: "Styles" },
  { href: "/compare", label: "Compare" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="wordmark" href="/beers" aria-label="BeerBoard home"><Beer aria-hidden="true" size={22} />BeerBoard</Link>
        <nav className="primary-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link className="nav-link" data-active={isActive(item.href)} href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="search-link" href="/search"><Search aria-hidden="true" size={17} /><span>Search</span></Link>
          <AccountMenu />
          <button
            className="menu-button"
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <nav className="container mobile-nav" data-open={mobileOpen} id="mobile-navigation" aria-label="Mobile navigation">
        {navigation.map((item) => (
          <Link className="nav-link" data-active={isActive(item.href)} href={item.href} key={item.href} onClick={() => setMobileOpen(false)}>{item.label}</Link>
        ))}
        <Link className="nav-link" href="/search" onClick={() => setMobileOpen(false)}>Search</Link>
        <Link className="nav-link" href="/ledger" onClick={() => setMobileOpen(false)}>My ledger</Link>
      </nav>
    </header>
  );
}
