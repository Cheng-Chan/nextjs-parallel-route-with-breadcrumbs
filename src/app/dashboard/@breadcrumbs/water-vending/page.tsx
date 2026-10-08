import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { dashboardBreadcrumbLink } from "../breadcrumb-items";

export default function WaterVendingBreadcrumbs() {
  return (
    <Breadcrumbs
      items={[
        dashboardBreadcrumbLink,
        { label: "Water Vending", current: true },
      ]}
    />
  );
}
