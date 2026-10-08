import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create vending unit" };

export default function CreateVendingMachinePage() {
  return (
    <section className="rounded-3xl border border-teal-400/30 bg-teal-400/10 p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal-300">
        /dashboard/water-vending/create
      </p>
      <h1 className="mt-3 text-3xl font-bold">Create vending unit</h1>
      <p className="mt-3 text-slate-300">
        This static form placeholder verifies the feature&apos;s create route.
      </p>
    </section>
  );
}
