"use client";

import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/admin" })}
      className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-cocoa text-cream-light font-mono text-sm tracking-widest uppercase hover:bg-terracotta transition-colors duration-200"
    >
      <GoogleIcon />
      Sign in with Google
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#ffffff" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" />
      <path fill="#ffffffcc" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.02c-.72.48-1.63.76-2.7.76-2.07 0-3.83-1.4-4.46-3.28H1.86v2.08A8 8 0 0 0 8.98 17z" />
      <path fill="#ffffffaa" d="M4.52 10.52A4.8 4.8 0 0 1 4.27 9c0-.53.09-1.04.25-1.52V5.4H1.86A8 8 0 0 0 .98 9c0 1.29.31 2.51.88 3.6l2.66-2.08z" />
      <path fill="#ffffff88" d="M8.98 4.2c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 8.98 1a8 8 0 0 0-7.12 4.4l2.66 2.08c.63-1.89 2.39-3.28 4.46-3.28z" />
    </svg>
  );
}
