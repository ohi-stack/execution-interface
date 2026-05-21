import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/agents', '/tasks', '/workflows', '/ocp', '/oeg', '/adapters', '/approvals', '/audit', '/logs']
    }
  };
}
