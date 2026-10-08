import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import {
  dashboardBreadcrumbLink,
  usersBreadcrumbLink,
} from "../../breadcrumb-items";

export default function UserBreadcrumbsNotFound() {
  return (
    <Breadcrumbs
      items={[
        dashboardBreadcrumbLink,
        usersBreadcrumbLink,
        { label: "User not found", current: true },
      ]}
    />
  );
}
