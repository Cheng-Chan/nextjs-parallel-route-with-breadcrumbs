import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVendingMachineByCode } from "@/lib/vending-machines";

export const metadata: Metadata = { title: "Vending unit details" };

type VendingMachinePageProps = {
  params: Promise<{ code: string }>;
};

export default async function VendingMachinePage({
  params,
}: VendingMachinePageProps) {
  const { code } = await params;
  const machine = await getVendingMachineByCode(code);

  if (!machine) {
    notFound();
  }

  return (
    <section className="rounded-3xl border border-blue-400/30 bg-blue-400/10 p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
        /dashboard/water-vending/[code]
      </p>
      <h1 className="mt-3 text-3xl font-bold">Vending unit details</h1>
      <dl className="mt-5 grid gap-3 text-slate-300 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-slate-400">Display code</dt>
          <dd className="font-semibold text-blue-300">{machine.displayCode}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-400">Location</dt>
          <dd>{machine.location}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-400">Status</dt>
          <dd>{machine.status}</dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={`/dashboard/water-vending/${encodeURIComponent(machine.code)}/edit`}
          prefetch={false}
          className="font-semibold text-blue-300 underline underline-offset-4"
        >
          Edit vending unit
        </Link>
        <Link
          href={`/dashboard/water-vending/${encodeURIComponent(machine.code)}/system-log`}
          prefetch={false}
          className="font-semibold text-blue-300 underline underline-offset-4"
        >
          View system log
        </Link>
      </div>
    </section>
  );
}
