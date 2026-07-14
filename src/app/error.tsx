"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container page">
      <div className="error-state">
        <h2>BeerBoard could not load this data</h2>
        <p>The database may be temporarily unavailable. Your filters and saved data have not been changed.</p>
        <button className="button-secondary" type="button" onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
