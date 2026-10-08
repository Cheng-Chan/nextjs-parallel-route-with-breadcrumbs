import Link from "next/link";

const navigation = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/users/create", label: "Create user" },
  { href: "/dashboard/water-vending", label: "Water vending" },
  { href: "/dashboard/settings", label: "Settings" },
] as const;

export function AppSidebar() {
  return (
    <aside
      data-app-sidebar="true"
      className="border-b border-slate-800 bg-slate-900/50 lg:min-h-screen lg:border-r lg:border-b-0"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:sticky lg:top-0 lg:max-w-none lg:px-6 lg:py-8">
        <Link href="/" className="text-xl font-bold text-cyan-400">
          Next Routing Lab
        </Link>
        <nav
          aria-label="Dashboard navigation"
          className="flex flex-wrap gap-2 lg:flex-col"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
