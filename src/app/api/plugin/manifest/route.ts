import { NextResponse } from 'next/server';
import manifest from '@/data/manifest.json';

export async function GET() {
  return NextResponse.json(
    {
      site_name: 'OMOS — OneGodian Metaphysical Operating System',
      version: manifest.version,
      canonical_domain: manifest.canonical_domain,
      allowed_wordpress_hosts: manifest.wordpress_hosts,
      public_routes: manifest.routes.filter((route) => !route.startsWith('/api')),
      api_routes: manifest.routes.filter((route) => route.startsWith('/api')),
      embed_routes: ['/digital-sanctuary', '/tools', '/artifacts', '/protocol', '/algorithm'],
      product_links: {
        store: 'https://onegodian.com/product-category/omos/',
        downloads: 'https://onegodian.com/product-category/digital-downloads/'
      },
      docs_links: {
        docs: 'https://omos.onegodian.com/docs',
        protocol: 'https://omos.onegodian.com/protocol',
        algorithm: 'https://omos.onegodian.com/algorithm',
        manifest: 'https://omos.onegodian.com/api/manifest'
      },
      compliance_notice:
        'OMOS is a protocol, documentation, runtime, and developer-facing integration layer. Commerce and checkout remain on OneGodian.com. Civil/legal records remain governed by applicable law and Gregorian/UTC timestamps where required.',
      generated_at: new Date().toISOString()
    },
    {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=300'
      }
    }
  );
}
