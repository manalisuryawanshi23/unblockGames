import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const BASE_URL = process.env.SITE_URL || 'https://unblockedgameszone.com';

// ─── Blog Sitemap XML ──────────────────────────────────────
router.get('/sitemap-blog.xml', async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' }
    });

    const urls = posts.map(post => {
      const lastmod = (post.updatedAt || post.publishedAt || new Date()).toISOString().split('T')[0];
      return `  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
});

// ─── RSS Feed ──────────────────────────────────────────────
router.get('/rss.xml', async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        seoDescription: true,
        authorName: true,
        publishedAt: true,
        coverImage: true,
        category: { select: { name: true } }
      },
      orderBy: { publishedAt: 'desc' },
      take: 50
    });

    const items = posts.map(post => {
      const url = `${BASE_URL}/blog/${post.slug}`;
      const desc = (post.excerpt || post.seoDescription || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const title = post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString();

      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${desc}</description>
      <author>contact@unblockedgameszone.com (${post.authorName || 'UnblockedGamesZone'})</author>
      ${post.category ? `<category>${post.category.name}</category>` : ''}
      <pubDate>${pubDate}</pubDate>
      ${post.coverImage ? `<enclosure url="${post.coverImage}" type="image/jpeg" length="0" />` : ''}
    </item>`;
    }).join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>UnblockedGamesZone Blog — Gaming News &amp; Tips</title>
    <link>${BASE_URL}/blog</link>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Latest gaming news, tips, and strategies for unblocked games. Updated regularly.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${BASE_URL}/og-image.png</url>
      <title>UnblockedGamesZone</title>
      <link>${BASE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=UTF-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(rss);
  } catch (err) {
    console.error('RSS generation error:', err);
    res.status(500).send('<?xml version="1.0"?><rss version="2.0"><channel></channel></rss>');
  }
});

export default router;
