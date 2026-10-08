import { AppNavbar } from "@/components/layout/app-navbar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
  breadcrumbs,
}: Readonly<{ children: ReactNode; breadcrumbs: ReactNode }>) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <AppSidebar />
      <div className="min-w-0">
        <AppNavbar breadcrumbs={breadcrumbs} />
        <main
          data-dashboard-content="true"
          className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
