import { site } from "@/lib/site";
import GoogleSignInButton from "./GoogleSignInButton";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-mono-cap text-stone mb-2">Administrator</p>
        <h1 className="font-display text-h1 tracking-tight text-cocoa mb-10">{site.name}</h1>

        {error === "AccessDenied" && (
          <p className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
            That Google account is not authorised. Contact the site owner.
          </p>
        )}

        <GoogleSignInButton />
      </div>
    </div>
  );
}
