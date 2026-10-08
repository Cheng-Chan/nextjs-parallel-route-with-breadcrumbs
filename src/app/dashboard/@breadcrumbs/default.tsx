import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { dashboardBreadcrumbLink } from "./breadcrumb-items";

export default function BreadcrumbsDefault() {
  return <Breadcrumbs items={[dashboardBreadcrumbLink]} />;
}
