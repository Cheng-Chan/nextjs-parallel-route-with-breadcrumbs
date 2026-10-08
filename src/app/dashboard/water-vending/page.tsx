import type { Metadata } from "next";
import Link from "next/link";
import { listVendingMachines } from "@/lib/vending-machines";

export const metadata: Metadata = { title: "Water Vending" };

export default function WaterVendingPage() {
  const vendingMachines = listVendingMachines();

  return (
    <section className="rounded-3xl border border-sky-400/30 bg-sky-400/10 p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-sky-300">
        /dashboard/water-vending
      </p>
      <h1 className="mt-3 text-3xl font-bold">Water Vending</h1>
      <p className="mt-3 text-slate-300">
        A pilot feature for validating reusable parallel-route breadcrumbs.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href="/dashboard/water-vending/create"
          className="font-semibold text-sky-300 underline underline-offset-4"
        >
          Create vending unit
        </Link>
        {vendingMachines.map((machine) => (
          <Link
            key={machine.code}
            href={`/dashboard/water-vending/${machine.code}`}
            prefetch={false}
            className="font-semibold text-sky-300 underline underline-offset-4"
          >
            View vending unit {machine.displayCode}
          </Link>
        ))}
      </div>
    </section>
  );
}
