import Link from "next/link";
import { Fragment } from "react";

type BreadcrumbLinkItem = Readonly<{
  label: string;
  href: string;
  current?: false;
}>;

type BreadcrumbCurrentItem = Readonly<{
  label: string;
  current: true;
  href?: never;
}>;

type BreadcrumbTextItem = Readonly<{
  label: string;
  href?: undefined;
  current?: false;
}>;

export type BreadcrumbItem =
  | BreadcrumbLinkItem
  | BreadcrumbCurrentItem
  | BreadcrumbTextItem;

type BreadcrumbsProps = Readonly<{
  items: readonly BreadcrumbItem[];
  pending?: boolean;
}>;

export function Breadcrumbs({ items, pending = false }: BreadcrumbsProps) {
  const trail = items.map((item) => item.label).join(" > ");

  return (
    <nav
      aria-label="Breadcrumb"
      aria-busy={pending || undefined}
      data-breadcrumb-loading={pending ? "true" : undefined}
      data-breadcrumb-trail={pending ? undefined : trail}
      className="rounded-lg bg-white px-4 py-3 text-slate-900 shadow-sm ring-1 ring-slate-200"
    >
      <ol className="flex min-h-6 max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {items.map((item, index) => (
          <Fragment key={`${item.href ?? "text"}:${item.label}:${index}`}>
            {index > 0 ? (
              <li
                aria-hidden="true"
                role="presentation"
                className="shrink-0 text-slate-400"
              >
                &gt;
              </li>
            ) : null}
            <li className="min-w-0 max-w-full break-words">
              {item.current ? (
                <span aria-current="page" className="font-semibold text-slate-900">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-slate-500 transition hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={pending ? "animate-pulse text-slate-500" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
