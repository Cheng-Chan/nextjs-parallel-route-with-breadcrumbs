import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVendingMachineByCode } from "@/lib/vending-machines";

export const metadata: Metadata = { title: "Edit vending unit" };

type EditVendingMachinePageProps = {
  params: Promise<{ code: string }>;
};

export default async function EditVendingMachinePage({
  params,
}: EditVendingMachinePageProps) {
  const { code } = await params;
  const machine = await getVendingMachineByCode(code);

  if (!machine) {
    notFound();
  }

  return (
    <section className="rounded-3xl border border-indigo-400/30 bg-indigo-400/10 p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">
        /dashboard/water-vending/[code]/edit
      </p>
      <h1 className="mt-3 text-3xl font-bold">Edit vending unit</h1>
      <p className="mt-3 text-slate-300">
        Editing unit{" "}
        <strong className="text-indigo-300">{machine.displayCode}</strong>
      </p>
    </section>
  );
}
