import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { dashboardBreadcrumbLink } from "../breadcrumb-items";

export default function SettingsBreadcrumbs() {
  return (
    <Breadcrumbs
      items={[dashboardBreadcrumbLink, { label: "Settings", current: true }]}
    />
  );
}
