import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <section className="rounded-3xl border border-indigo-400/30 bg-indigo-400/10 p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">
        /dashboard
      </p>
      <h1 className="mt-3 text-3xl font-bold">Dashboard overview</h1>
      <p className="mt-3 text-slate-300">This is the dashboard index route.</p>
    </section>
  );
}
