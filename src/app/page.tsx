import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-16">
      <section className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/20 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Phase 0
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Next.js Routing Laboratory
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
          A small App Router project for exploring nested layouts, static routes,
          and dynamic URL segments.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Open dashboard
        </Link>
      </section>
    </main>
  );
}
