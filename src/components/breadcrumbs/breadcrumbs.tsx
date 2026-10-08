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
    >
      <ol className="flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {items.map((item, index) => (
          <Fragment key={`${item.href ?? "text"}:${item.label}:${index}`}>
            {index > 0 ? (
              <li
                aria-hidden="true"
                role="presentation"
                className="shrink-0 text-slate-600"
              >
                /
              </li>
            ) : null}
            <li className="min-w-0 max-w-full break-words">
              {item.current ? (
                <span aria-current="page" className="font-medium text-slate-200">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-cyan-400 transition hover:text-cyan-300"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={pending ? "animate-pulse text-slate-400" : undefined}>
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
