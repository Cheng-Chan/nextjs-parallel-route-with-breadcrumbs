import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getUserById } from "@/lib/users";

export const metadata: Metadata = { title: "User details" };

type UserDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailsPage({
  params,
}: UserDetailsPageProps) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <section className="rounded-3xl border border-fuchsia-400/30 bg-fuchsia-400/10 p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-fuchsia-300">
        /dashboard/users/[id]
      </p>
      <h1 className="mt-3 text-3xl font-bold">User details</h1>
      <p className="mt-3 text-slate-300">
        Profile for <strong className="text-fuchsia-300">{user.name}</strong>
      </p>
      <Link
        href={`/dashboard/users/${id}/edit`}
        prefetch={false}
        className="mt-6 inline-block font-semibold text-fuchsia-300 underline underline-offset-4"
      >
        Edit this user
      </Link>
    </section>
  );
}
