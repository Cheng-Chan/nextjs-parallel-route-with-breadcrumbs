import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { getVendingMachineByCode } from "@/lib/vending-machines";
import { notFound } from "next/navigation";
import {
  dashboardBreadcrumbLink,
  waterVendingBreadcrumbLink,
} from "../../breadcrumb-items";

type VendingMachineBreadcrumbsProps = {
  params: Promise<{ code: string }>;
};

export default async function VendingMachineBreadcrumbs({
  params,
}: VendingMachineBreadcrumbsProps) {
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
        { label: machine.displayCode, current: true },
      ]}
    />
  );
}
