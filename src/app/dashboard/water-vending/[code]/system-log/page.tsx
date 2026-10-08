import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVendingMachineByCode } from "@/lib/vending-machines";

export const metadata: Metadata = { title: "Vending unit system log" };

type VendingMachineSystemLogPageProps = {
  params: Promise<{ code: string }>;
};

export default async function VendingMachineSystemLogPage({
  params,
}: VendingMachineSystemLogPageProps) {
  const { code } = await params;
  const machine = await getVendingMachineByCode(code);

  if (!machine) {
    notFound();
  }

  return (
    <section className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">
        /dashboard/water-vending/[code]/system-log
      </p>
      <h1 className="mt-3 text-3xl font-bold">System Log</h1>
      <p className="mt-3 text-slate-300">
        Recent simulated events for vending unit{" "}
        <strong className="text-amber-300">{machine.displayCode}</strong>.
      </p>
      <ul className="mt-6 space-y-2 text-sm text-slate-300">
        <li>09:30 — Health check completed</li>
        <li>09:15 — Water level synchronized</li>
        <li>09:00 — Unit reported online</li>
      </ul>
    </section>
  );
}
