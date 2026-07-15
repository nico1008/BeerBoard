export function AuthMessage({ error, success, reason }: { error?: string; success?: string; reason?: string }) {
  const reasonMessage = reason === "review"
    ? "Log in or create an account to publish your review."
    : reason === "saved"
      ? "Log in or create an account to save this beer."
      : undefined;
  const message = error ?? success ?? reasonMessage;
  if (!message) return null;
  return <p className="form-message" data-kind={error ? "error" : "success"} role={error ? "alert" : "status"}>{message}</p>;
}
