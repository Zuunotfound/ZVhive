import '../styles/globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import UpdateModal from '@/components/UpdateModal';
import AuthProvider from '@/components/AuthProvider';
import AuthButtons from '@/components/AuthButtons';

export const metadata: Metadata = {
  title: 'ZVHive',
  description: 'Read, watch, and connect – all in one hive.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <header className="border-b border-white/10 sticky top-0 backdrop-blur bg-black/30 z-50">
            <nav className="container-elegant flex items-center gap-6 py-4">
              <Link className="text-xl font-semibold" href="/">ZVHive</Link>
              <div className="flex items-center gap-4 text-sm text-white/80">
                <Link href="/reader">Reader</Link>
                <Link href="/watch">Watch</Link>
                <Link href="/community">Community</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/chat">Chat</Link>
                <Link href="/updates">Updates</Link>
                <Link href="/plans">Plans</Link>
                <Link href="/profile">Profile</Link>
                <Link href="/admin">Admin</Link>
              </div>
              <div className="ml-auto"><AuthButtons /></div>
            </nav>
          </header>
          <main className="container-elegant py-8">{children}</main>
          <UpdateModal />
        </AuthProvider>
      </body>
    </html>
  );
}