import type { BreadcrumbItem } from "@/components/breadcrumbs/breadcrumbs";

export const dashboardBreadcrumbLink = {
  label: "Dashboard",
  href: "/dashboard",
} as const satisfies BreadcrumbItem;

export const usersBreadcrumbLink = {
  label: "Users",
  href: "/dashboard/users",
} as const satisfies BreadcrumbItem;

export const waterVendingBreadcrumbLink = {
  label: "Water Vending",
  href: "/dashboard/water-vending",
} as const satisfies BreadcrumbItem;
