import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { dashboardBreadcrumbLink } from "../breadcrumb-items";

export default function UsersBreadcrumbs() {
  return (
    <Breadcrumbs
      items={[dashboardBreadcrumbLink, { label: "Users", current: true }]}
    />
  );
}
