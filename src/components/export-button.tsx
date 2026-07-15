"use client";

import { Download } from "lucide-react";
import { useState } from "react";

export function ExportButton({ href, label = "Export CSV" }: { href: string; label?: string }) {
  const [status, setStatus] = useState("");
  async function download() {
    setStatus("Preparing export…");
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error("Export request failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filenameFromHeader(response.headers.get("content-disposition")) ?? "beerboard-export.csv";
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setStatus("Export downloaded.");
    } catch { setStatus("Export failed. Please try again."); }
  }
  return <><button className="button-ghost" type="button" onClick={download}><Download aria-hidden="true" size={17} />{label}</button><span className="sr-only" aria-live="polite">{status}</span></>;
}

function filenameFromHeader(header: string | null) { if (!header) return null; return /filename="([^"]+)"/.exec(header)?.[1] ?? null; }
