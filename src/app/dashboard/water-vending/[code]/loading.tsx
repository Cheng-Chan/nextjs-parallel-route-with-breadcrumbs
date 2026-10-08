export default function VendingMachineLoading() {
  return (
    <section
      data-vending-loading="true"
      aria-busy="true"
      className="animate-pulse rounded-3xl border border-blue-400/30 bg-blue-400/10 p-8"
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
        Loading vending unit
      </p>
      <div className="mt-4 h-9 w-56 rounded bg-slate-700" />
      <div className="mt-4 h-5 w-72 max-w-full rounded bg-slate-800" />
    </section>
  );
}
