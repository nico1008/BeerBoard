import type { Metadata } from "next";
import { updatePassword } from "@/app/auth/actions";
import { AuthMessage } from "@/components/auth-message";

export const metadata: Metadata = { title: "Choose new password" };
export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  return (
    <div className="auth-shell"><section className="auth-panel"><h1>Choose a new password</h1><p>Use at least 8 characters and do not reuse a password from another service.</p><AuthMessage error={first(params.error)} success={first(params.success)} /><form className="form-stack" action={updatePassword}><div className="field"><label htmlFor="password">New password</label><input className="input" id="password" name="password" type="password" minLength={8} required autoComplete="new-password" /></div><div className="field"><label htmlFor="confirmation">Confirm password</label><input className="input" id="confirmation" name="confirmation" type="password" minLength={8} required autoComplete="new-password" /></div><button className="button-secondary" type="submit">Update password</button></form></section></div>
  );
}
