export default function CatchAllProbePage() {
  return (
    <section
      data-catch-all-probe="true"
      className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-8"
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">
        Experimental route
      </p>
      <h1 className="mt-3 text-3xl font-bold">Catch-all fallback probe</h1>
      <p className="mt-3 text-slate-300">
        This route intentionally has no breadcrumb mapping.
      </p>
    </section>
  );
}
