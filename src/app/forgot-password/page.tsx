import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";
import { AuthMessage } from "@/components/auth-message";

export const metadata: Metadata = { title: "Reset password" };
export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  return (
    <div className="auth-shell"><section className="auth-panel"><h1>Reset your password</h1><p>Enter your account email. We will send a secure reset link if the account exists.</p><AuthMessage error={first(params.error)} success={first(params.success)} /><form className="form-stack" action={requestPasswordReset}><div className="field"><label htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" required autoComplete="email" /></div><button className="button-secondary" type="submit">Send reset link</button></form><p><Link href="/login">Return to login</Link></p></section></div>
  );
}
