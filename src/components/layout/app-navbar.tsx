import type { ReactNode } from "react";

const contextItems = [
  { label: "Region", value: "Global" },
  { label: "Language", value: "EN" },
  { label: "Theme", value: "System" },
  { label: "Notifications", value: "None" },
  { label: "Profile", value: "Demo User" },
] as const;

type AppNavbarProps = Readonly<{
  breadcrumbs: ReactNode;
}>;

export function AppNavbar({ breadcrumbs }: AppNavbarProps) {
  return (
    <header
      data-app-navbar="true"
      className="border-b border-slate-800 bg-slate-950/95"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">{breadcrumbs}</div>
        <ul
          aria-label="Application context"
          className="flex max-w-full flex-wrap items-center gap-2 text-xs md:justify-end"
        >
          {contextItems.map((item) => (
            <li
              key={item.label}
              className="flex min-w-0 items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5"
            >
              <span className="text-slate-500">{item.label}</span>
              <span className="truncate font-medium text-slate-300">
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
