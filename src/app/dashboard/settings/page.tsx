import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <section className="rounded-3xl border border-sky-400/30 bg-sky-400/10 p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-sky-300">
        /dashboard/settings
      </p>
      <h1 className="mt-3 text-3xl font-bold">Settings</h1>
      <p className="mt-3 text-slate-300">Dashboard settings live at this static route.</p>
    </section>
  );
}
