import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://robocodes.net';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // 🔒 Protect secret game admin URLs from search engine indexing
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
