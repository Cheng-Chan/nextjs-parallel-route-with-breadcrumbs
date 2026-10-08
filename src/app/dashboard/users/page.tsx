import type { Metadata } from "next";
import Link from "next/link";
import { listUsers } from "@/lib/users";

export const metadata: Metadata = { title: "Users" };

export default function UsersPage() {
  const users = listUsers();

  return (
    <section className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
        /dashboard/users
      </p>
      <h1 className="mt-3 text-3xl font-bold">Users</h1>
      <p className="mt-3 text-slate-300">Choose a sample user to test a dynamic route.</p>
      <ul className="mt-6 space-y-3">
        {users.map((user) => (
          <li key={user.id}>
            <Link
              href={`/dashboard/users/${user.id}`}
              prefetch={false}
              className="font-semibold text-emerald-300 underline underline-offset-4"
            >
              View {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
