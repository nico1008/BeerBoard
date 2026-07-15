import type { Metadata } from "next";
import Link from "next/link";
import { signUp } from "@/app/auth/actions";
import { AuthMessage } from "@/components/auth-message";
import { safeReturnPath } from "@/lib/site-url";

export const metadata: Metadata = { title: "Create account" };
export const dynamic = "force-dynamic";

export default async function SignupPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const next = safeReturnPath(first(params.next));
  return (
    <div className="auth-shell">
      <section className="auth-panel">
        <h1>Create your account</h1>
        <p>Review beers you have tried, help other curious drinkers, and save the ones you liked.</p>
        <AuthMessage error={first(params.error)} success={first(params.success)} />
        <form className="form-stack" action={signUp}>
          <input type="hidden" name="next" value={next} />
          <div className="field"><label htmlFor="displayName">Display name</label><input className="input" id="displayName" name="displayName" type="text" minLength={1} maxLength={60} required autoComplete="nickname" /></div>
          <div className="field"><label htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" required autoComplete="email" /></div>
          <div className="field"><label htmlFor="password">Password</label><input className="input" id="password" name="password" type="password" minLength={8} required autoComplete="new-password" aria-describedby="password-help" /><span id="password-help">Use at least 8 characters.</span></div>
          <button className="button-secondary" type="submit">Create account</button>
        </form>
        <p>Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`}>Log in</Link>.</p>
      </section>
    </div>
  );
}
