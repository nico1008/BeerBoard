export default function Loading() {
  return (
    <div className="container page" aria-label="Loading content" aria-busy="true">
      <div className="skeleton" style={{ width: "45%", height: "4rem" }} />
      <div className="skeleton" style={{ width: "70%", marginTop: "1rem" }} />
      <div className="skeleton" style={{ height: "18rem", marginTop: "3rem" }} />
    </div>
  );
}
