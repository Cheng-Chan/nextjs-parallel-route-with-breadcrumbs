import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { dashboardBreadcrumbLink } from "../breadcrumb-items";

export default function CatchAllBreadcrumbsLoading() {
  return (
    <div data-breadcrumb-source="catch-all-loading">
      <Breadcrumbs
        items={[
          dashboardBreadcrumbLink,
          { label: "Resolving route…" },
        ]}
        pending
      />
    </div>
  );
}
