"use client";

import type { User } from "@supabase/supabase-js";
import { Bookmark, LogIn, LogOut, MessageSquareText, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AccountState = { status: "loading" } | { status: "signed-out" } | { status: "signed-in"; user: User };

export function AccountMenu() {
  const [account, setAccount] = useState<AccountState>({ status: "loading" });

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setAccount(data.user ? { status: "signed-in", user: data.user } : { status: "signed-out" });
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAccount(session?.user ? { status: "signed-in", user: session.user } : { status: "signed-out" });
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (account.status === "signed-out") {
    return <Link className="account-sign-in" href="/login"><LogIn aria-hidden="true" size={18} /><span>Sign in</span></Link>;
  }

  if (account.status === "loading") {
    return <span className="account-trigger" aria-label="Loading account"><UserRound size={19} /></span>;
  }

  const email = account.user.email ?? "Signed-in account";
  const initial = (account.user.user_metadata.display_name as string | undefined)?.at(0) ?? email.at(0) ?? "B";

  return (
    <details className="account-menu">
      <summary className="account-trigger" aria-label="Open account menu"><span className="avatar">{initial}</span></summary>
      <div className="popover">
        <div className="popover-meta">
          <strong>{account.user.user_metadata.display_name ?? "Beer lover"}</strong>
          <span>{email}</span>
        </div>
        <Link className="popover-link" href="/reviews"><MessageSquareText size={17} />My reviews</Link>
        <Link className="popover-link" href="/saved"><Bookmark size={17} />Saved beers</Link>
        <Link className="popover-link" href="/settings"><Settings size={17} />Settings</Link>
        <form action="/auth/signout" method="post">
          <button type="submit"><LogOut size={17} />Log out</button>
        </form>
      </div>
    </details>
  );
}
