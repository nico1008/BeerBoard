export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  const base = configured || vercel || "http://localhost:3000";
  const withProtocol = base.startsWith("http") ? base : `https://${base}`;
  return withProtocol.replace(/\/$/, "");
}

export function safeReturnPath(value: FormDataEntryValue | string | null | undefined, fallback = "/beers") {
  const path = typeof value === "string" ? value : "";
  return path.startsWith("/") && !path.startsWith("//") ? path : fallback;
}
