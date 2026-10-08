import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import {
  dashboardBreadcrumbLink,
  usersBreadcrumbLink,
} from "../../breadcrumb-items";

export default function UserBreadcrumbsLoading() {
  return (
    <Breadcrumbs
      pending
      items={[
        dashboardBreadcrumbLink,
        usersBreadcrumbLink,
        { label: "Resolving user…" },
      ]}
    />
  );
}
