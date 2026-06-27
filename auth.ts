import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ADMIN_EMAILS = ["idobloch@gmail.com", "tirasc@gmail.com"];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    signIn({ profile }) {
      const email = profile?.email ?? "";
      return ADMIN_EMAILS.includes(email);
    },
    session({ session, token }) {
      return session;
    },
    jwt({ token }) {
      return token;
    },
  },
});

export function isAdmin(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email);
}
