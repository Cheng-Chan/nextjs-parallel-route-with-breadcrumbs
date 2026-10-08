import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";

export default function DashboardBreadcrumbs() {
  return <Breadcrumbs items={[{ label: "Dashboard", current: true }]} />;
}
