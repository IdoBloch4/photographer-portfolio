// AUTH_DISABLED: this page is bypassed while auth is disabled.
// Restore signIn/auth imports and the form action once Google OAuth is configured.
import { redirect } from "next/navigation";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  // AUTH_DISABLED: go straight to admin while auth is off
  redirect("/admin");
}
