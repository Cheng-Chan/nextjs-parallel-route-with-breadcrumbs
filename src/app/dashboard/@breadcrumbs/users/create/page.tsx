import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import {
  dashboardBreadcrumbLink,
  usersBreadcrumbLink,
} from "../../breadcrumb-items";

export default function CreateUserBreadcrumbs() {
  return (
    <Breadcrumbs
      items={[
        dashboardBreadcrumbLink,
        usersBreadcrumbLink,
        { label: "Create", current: true },
      ]}
    />
  );
}
