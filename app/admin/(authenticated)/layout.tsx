import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export const metadata = { title: "Admin — Sarit Carmon" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      <nav className="border-b border-sand bg-cream-light px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/admin"
            className="font-display italic text-cocoa text-lg hover:text-terracotta transition-colors"
          >
            Admin
          </Link>
          <div className="flex gap-6 text-mono-cap">
            <Link href="/admin/home" className="text-stone hover:text-cocoa transition-colors">
              Home
            </Link>
            <Link href="/admin/series" className="text-stone hover:text-cocoa transition-colors">
              Series
            </Link>
            <Link href="/admin/content" className="text-stone hover:text-cocoa transition-colors">
              Content
            </Link>
            <Link href="/" className="text-stone hover:text-cocoa transition-colors" target="_blank">
              View Site
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-mono-cap text-stone hidden sm:block">
            {session.user?.email}
          </span>
          <SignOutButton />
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
