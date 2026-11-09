import { absolute } from '../config/site';
import { PAKETS } from '../lib/paket';

const paths = [
  '/',
  '/paket/',
  ...PAKETS.map((p) => `/paket/${p.slug}/`),
  '/kisi-kisi/',
  '/tentang/',
  '/kontak/',
  '/privasi/',
  '/disclaimer/',
];

export function GET() {
  const urls = paths
    .map((p) => `  <url><loc>${absolute(p)}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
