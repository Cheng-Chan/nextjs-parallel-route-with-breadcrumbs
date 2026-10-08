import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create user" };

export default function CreateUserPage() {
  return (
    <section className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">
        /dashboard/users/create
      </p>
      <h1 className="mt-3 text-3xl font-bold">Create user</h1>
      <p className="mt-3 text-slate-300">A placeholder for the future user form.</p>
    </section>
  );
}
