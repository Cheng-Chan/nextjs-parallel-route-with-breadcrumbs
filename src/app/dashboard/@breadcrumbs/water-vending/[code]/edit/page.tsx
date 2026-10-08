import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { getVendingMachineByCode } from "@/lib/vending-machines";
import { notFound } from "next/navigation";
import {
  dashboardBreadcrumbLink,
  waterVendingBreadcrumbLink,
} from "../../../breadcrumb-items";

type EditVendingMachineBreadcrumbsProps = {
  params: Promise<{ code: string }>;
};

export default async function EditVendingMachineBreadcrumbs({
  params,
}: EditVendingMachineBreadcrumbsProps) {
  const { code } = await params;
  const machine = await getVendingMachineByCode(code);

  if (!machine) {
    notFound();
  }

  return (
    <Breadcrumbs
      items={[
        dashboardBreadcrumbLink,
        waterVendingBreadcrumbLink,
        {
          label: machine.displayCode,
          href: `/dashboard/water-vending/${encodeURIComponent(machine.code)}`,
        },
        { label: "Edit", current: true },
      ]}
    />
  );
}
