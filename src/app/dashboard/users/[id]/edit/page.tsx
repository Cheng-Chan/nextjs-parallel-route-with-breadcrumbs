import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/users";

export const metadata: Metadata = { title: "Edit user" };

type EditUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({
  params,
}: EditUserPageProps) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <section className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-rose-300">
        /dashboard/users/[id]/edit
      </p>
      <h1 className="mt-3 text-3xl font-bold">Edit user</h1>
      <p className="mt-3 text-slate-300">
        Editing <strong className="text-rose-300">{user.name}</strong>
      </p>
    </section>
  );
}
