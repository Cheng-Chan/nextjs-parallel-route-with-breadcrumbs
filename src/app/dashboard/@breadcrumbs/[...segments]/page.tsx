import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/breadcrumbs/breadcrumbs";
import { getVendingMachineByCode } from "@/lib/vending-machines";
import { notFound } from "next/navigation";
import {
  dashboardBreadcrumbLink,
  waterVendingBreadcrumbLink,
} from "../breadcrumb-items";

type CatchAllBreadcrumbsProps = {
  params: Promise<{ segments: string[] }>;
};

async function resolveBreadcrumbItems(
  segments: readonly string[],
): Promise<readonly BreadcrumbItem[] | null> {
  if (segments.length === 1 && segments[0] === "settings") {
    return [
      dashboardBreadcrumbLink,
      { label: "Settings", current: true },
    ];
  }

  if (segments[0] !== "water-vending") {
    return null;
  }

  if (segments.length === 1) {
    return [{ label: "Water Vending", current: true }];
  }

  if (segments.length === 2 && segments[1] === "create") {
    return [
      waterVendingBreadcrumbLink,
      { label: "Create", current: true },
    ];
  }

  const code = segments[1];

  if (!code || segments.length > 3) {
    return null;
  }

  const isDetail = segments.length === 2;
  const isEdit = segments.length === 3 && segments[2] === "edit";
  const isSystemLog = segments.length === 3 && segments[2] === "system-log";

  if (!isDetail && !isEdit && !isSystemLog) {
    return null;
  }

  const machine = await getVendingMachineByCode(code);

  if (!machine) {
    return [
      waterVendingBreadcrumbLink,
      { label: "Vending unit not found", current: true },
    ];
  }

  if (isDetail) {
    return [
      waterVendingBreadcrumbLink,
      { label: "Detail", current: true },
    ];
  }

  if (isSystemLog) {
    return [
      waterVendingBreadcrumbLink,
      { label: "System Log", current: true },
    ];
  }

  return [
    waterVendingBreadcrumbLink,
    { label: "Edit", current: true },
  ];
}

export default async function CatchAllBreadcrumbs({
  params,
}: CatchAllBreadcrumbsProps) {
  const { segments } = await params;
  const items = await resolveBreadcrumbItems(segments);

  if (!items) {
    notFound();
  }

  return (
    <div data-breadcrumb-source="catch-all">
      <Breadcrumbs items={items} />
    </div>
  );
}
