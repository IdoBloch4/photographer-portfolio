// AUTH_DISABLED: when re-enabling auth, uncomment these imports and restore session logic
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import { signOut } from "@/auth";
import Link from "next/link";

export const metadata = { title: "Admin — Sarit Carmon" };

// AUTH_DISABLED: flip to false and restore session checks once Google OAuth is configured
const AUTH_DISABLED = true;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // AUTH_DISABLED: restore these when re-enabling auth:
  // const session = await auth();
  // if (!session) redirect("/admin/login");

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
            <Link
              href="/admin/series"
              className="text-stone hover:text-cocoa transition-colors"
            >
              Series
            </Link>
            <Link
              href="/admin/content"
              className="text-stone hover:text-cocoa transition-colors"
            >
              Content
            </Link>
            <Link
              href="/"
              className="text-stone hover:text-cocoa transition-colors"
              target="_blank"
            >
              View Site
            </Link>
          </div>
        </div>
        {AUTH_DISABLED && (
          <span className="text-mono-cap text-stone hidden sm:block">
            Auth disabled (dev mode)
          </span>
        )}
      </nav>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
