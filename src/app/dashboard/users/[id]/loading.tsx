export default function UserPageLoading() {
  return (
    <section
      aria-busy="true"
      data-user-loading="true"
      className="animate-pulse rounded-3xl border border-slate-700 bg-slate-900 p-8"
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
        Resolving user
      </p>
      <div className="mt-4 h-9 w-48 rounded bg-slate-800" />
      <div className="mt-4 h-5 w-64 rounded bg-slate-800" />
    </section>
  );
}
