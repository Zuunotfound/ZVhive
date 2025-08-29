"use client";
import Link from "next/link";
import { AuthButton } from "./AuthButton";
import { useAccount } from "../hooks/useAccount";

export function Navbar() {
  const { account } = useAccount();
  const badge = account?.role === 'verified' ? (
    <span className="ml-1 inline-flex items-center px-2 py-0.5 text-[10px] rounded bg-foreground text-background">Verified</span>
  ) : null;
  return (
    <header className="w-full border-b border-black/10 dark:border-white/10 sticky top-0 backdrop-blur bg-background/70 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">ZVHive{badge}</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/reader">Reader</Link>
          <Link href="/community">Community</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/chat">Chat</Link>
          <Link href="/updates">Updates</Link>
          <Link href="/plans">Plans</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/admin">Admin</Link>
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}

