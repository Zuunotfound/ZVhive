export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  // Minimal static RSS; hook to blog API later
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0"><channel>
  <title>ZVHive Blog</title>
  <link>${base}</link>
  <description>Updates from ZVHive</description>
  </channel></rss>`;
  return new Response(rss, { headers: { 'Content-Type': 'application/rss+xml' } });
}

