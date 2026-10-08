import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import {
  dashboardBreadcrumbLink,
  waterVendingBreadcrumbLink,
} from "../../breadcrumb-items";

export default function VendingMachineBreadcrumbsNotFound() {
  return (
    <Breadcrumbs
      items={[
        dashboardBreadcrumbLink,
        waterVendingBreadcrumbLink,
        { label: "Vending unit not found", current: true },
      ]}
    />
  );
}
