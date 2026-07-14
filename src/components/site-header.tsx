"use client";

import { Menu, Search, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AccountMenu } from "@/components/account-menu";

const navigation = [
  { href: "/beers", label: "Beers" },
  { href: "/countries", label: "Countries" },
  { href: "/compare", label: "Compare" },
  { href: "/styles", label: "Styles" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="wordmark" href="/beers" aria-label="BeerBoard beer ranking">BeerBoard</Link>
        <nav className="primary-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link className="nav-link" data-active={isActive(item.href)} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="icon-link" href="/search" aria-label="Search BeerBoard"><Search size={18} /></Link>
          <Link className="icon-link" href="/settings" aria-label="Open settings"><Settings size={18} /></Link>
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
          <Link
            className="nav-link"
            data-active={isActive(item.href)}
            href={item.href}
            key={item.href}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link className="nav-link" href="/search" onClick={() => setMobileOpen(false)}>Search</Link>
        <Link className="nav-link" href="/settings" onClick={() => setMobileOpen(false)}>Settings</Link>
      </nav>
    </header>
  );
}
