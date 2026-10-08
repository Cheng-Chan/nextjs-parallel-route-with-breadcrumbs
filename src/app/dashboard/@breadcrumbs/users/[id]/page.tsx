import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { getUserById } from "@/lib/users";
import { notFound } from "next/navigation";
import {
  dashboardBreadcrumbLink,
  usersBreadcrumbLink,
} from "../../breadcrumb-items";

type UserBreadcrumbsProps = {
  params: Promise<{ id: string }>;
};

export default async function UserBreadcrumbs({
  params,
}: UserBreadcrumbsProps) {
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
        { label: user.name, current: true },
      ]}
    />
  );
}
