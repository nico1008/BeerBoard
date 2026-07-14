import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { updateProfile } from "@/app/actions/profile";
import { AuthMessage } from "@/components/auth-message";
import { ThemeControl } from "@/components/theme-control";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings");
  const { data: profile, error } = await supabase.from("profiles").select("display_name,theme").eq("id", user.id).single();
  if (error) throw new Error("Your settings could not be loaded.");
  const params = await searchParams;
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const theme = profile.theme === "light" || profile.theme === "dark" ? profile.theme : "system";

  return (
    <div className="container page">
      <header className="page-header"><div><h1>Settings</h1><p>Manage how your name and theme appear across BearBoard.</p></div></header>
      <section className="section panel" style={{ maxWidth: "42rem" }}>
        <h2>Profile</h2>
        <AuthMessage error={first(params.error)} success={first(params.success)} />
        <form className="form-stack" action={updateProfile}>
          <div className="field"><label htmlFor="displayName">Display name</label><input className="input" id="displayName" name="displayName" type="text" minLength={1} maxLength={60} required defaultValue={profile.display_name} /></div>
          <div className="field"><label htmlFor="theme">Theme</label><ThemeControl initialTheme={theme} /></div>
          <div className="field"><label>Email</label><input className="input" type="email" value={user.email ?? ""} readOnly aria-describedby="email-note" /><span id="email-note">Email changes are managed through Supabase Auth and are not available in this demonstration.</span></div>
          <button className="button-secondary" type="submit">Save settings</button>
        </form>
      </section>
    </div>
  );
}
