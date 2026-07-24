import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots { return { rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/dashboard', '/api/auth'] }], host: 'https://OMOS.OneGodian.com', sitemap: 'https://OMOS.OneGodian.com/sitemap.xml' }; }
