export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const urls = ['/', '/reader', '/community', '/blog', '/chat', '/profile', '/plans', '/updates', '/search'];
  const items = urls.map((u) => `<url><loc>${base}${u}</loc></url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}

