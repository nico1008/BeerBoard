export function AuthMessage({ error, success, reason }: { error?: string; success?: string; reason?: string }) {
  const message = error ?? success ?? (reason === "ledger" ? "Log in or create an account to save this beer to your Ledger." : undefined);
  if (!message) return null;
  return <p className="form-message" data-kind={error ? "error" : "success"} role={error ? "alert" : "status"}>{message}</p>;
}
