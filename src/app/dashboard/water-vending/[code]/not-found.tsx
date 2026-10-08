import Link from "next/link";

export default function VendingMachineNotFound() {
  return (
    <section
      data-vending-not-found="true"
      className="rounded-3xl border border-red-400/30 bg-red-400/10 p-8"
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-red-300">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold">Vending unit not found</h1>
      <p className="mt-3 text-slate-300">
        The requested vending unit does not exist in the mock repository.
      </p>
      <Link
        href="/dashboard/water-vending"
        className="mt-6 inline-block font-semibold text-red-300 underline underline-offset-4"
      >
        Return to Water Vending
      </Link>
    </section>
  );
}
