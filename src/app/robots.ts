import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    host: 'https://app.onegodian.com',
    sitemap: 'https://app.onegodian.com/sitemap.xml'
  };
}
