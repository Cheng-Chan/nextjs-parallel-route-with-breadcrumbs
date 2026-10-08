import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import {
  dashboardBreadcrumbLink,
  waterVendingBreadcrumbLink,
} from "../../breadcrumb-items";

export default function VendingMachineBreadcrumbsLoading() {
  return (
    <Breadcrumbs
      items={[
        dashboardBreadcrumbLink,
        waterVendingBreadcrumbLink,
        { label: "Resolving vending unit…" },
      ]}
      pending
    />
  );
}
