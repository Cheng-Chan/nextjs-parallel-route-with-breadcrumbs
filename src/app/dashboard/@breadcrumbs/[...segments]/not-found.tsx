import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { dashboardBreadcrumbLink } from "../breadcrumb-items";

export default function CatchAllBreadcrumbsNotFound() {
  return (
    <div data-breadcrumb-source="catch-all-not-found">
      <Breadcrumbs
        items={[
          dashboardBreadcrumbLink,
          { label: "Breadcrumb unavailable", current: true },
        ]}
      />
    </div>
  );
}
