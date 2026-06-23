const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://unblockedgameszone.com';
const dateNow = new Date().toISOString().split('T')[0];

const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(publicDir, 'data');

// Static Pages
const staticPages = [
  '',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer'
];

async function generate() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 1. Add static pages
  staticPages.forEach(page => {
    xml += `  <url>\n    <loc>${BASE_URL}${page}</loc>\n    <lastmod>${dateNow}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  // 2. Add category pages
  const categoriesRaw = fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf8');
  const categories = JSON.parse(categoriesRaw);
  categories.forEach(cat => {
    xml += `  <url>\n    <loc>${BASE_URL}/category/${cat.slug}</loc>\n    <lastmod>${dateNow}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  // 3. Add game pages
  const slugMapRaw = fs.readFileSync(path.join(dataDir, 'slug-map.json'), 'utf8');
  const slugMap = JSON.parse(slugMapRaw);
  Object.keys(slugMap).forEach(slug => {
    xml += `  <url>\n    <loc>${BASE_URL}/game/${slug}</loc>\n    <lastmod>${dateNow}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  });

  xml += '</urlset>';

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log('Sitemap generated successfully in public/sitemap.xml');
}

generate().catch(err => {
  console.error('Error generating sitemap:', err);
  process.exit(1);
});
