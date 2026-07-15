import type { Metadata } from "next";
import Link from "next/link";
import { AuthMessage } from "@/components/auth-message";
import { signIn } from "@/app/auth/actions";
import { safeReturnPath } from "@/lib/site-url";

export const metadata: Metadata = { title: "Log in" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const next = safeReturnPath(first(params.next));
  return (
    <div className="auth-shell">
      <section className="auth-panel">
        <h1>Welcome back</h1>
        <p>Log in to write reviews, update your tasting notes, and manage saved beers.</p>
        <AuthMessage error={first(params.error)} success={first(params.success)} reason={first(params.reason)} />
        <form className="form-stack" action={signIn}>
          <input type="hidden" name="next" value={next} />
          <div className="field"><label htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" required autoComplete="email" /></div>
          <div className="field"><label htmlFor="password">Password</label><input className="input" id="password" name="password" type="password" minLength={8} required autoComplete="current-password" /></div>
          <button className="button-secondary" type="submit">Log in</button>
        </form>
        <p><Link href="/forgot-password">Forgot your password?</Link></p>
        <p>New to BeerBoard? <Link href={`/signup?next=${encodeURIComponent(next)}`}>Create an account</Link>.</p>
      </section>
    </div>
  );
}
