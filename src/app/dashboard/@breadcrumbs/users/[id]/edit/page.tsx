import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { getUserById } from "@/lib/users";
import { notFound } from "next/navigation";
import {
  dashboardBreadcrumbLink,
  usersBreadcrumbLink,
} from "../../../breadcrumb-items";

type EditUserBreadcrumbsProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserBreadcrumbs({
  params,
}: EditUserBreadcrumbsProps) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <Breadcrumbs
      items={[
        dashboardBreadcrumbLink,
        usersBreadcrumbLink,
        {
          label: user.name,
          href: `/dashboard/users/${encodeURIComponent(id)}`,
        },
        { label: "Edit", current: true },
      ]}
    />
  );
}
