import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import {
  dashboardBreadcrumbLink,
  waterVendingBreadcrumbLink,
} from "../../breadcrumb-items";

export default function CreateVendingMachineBreadcrumbs() {
  return (
    <Breadcrumbs
      items={[
        dashboardBreadcrumbLink,
        waterVendingBreadcrumbLink,
        { label: "Create", current: true },
      ]}
    />
  );
}
