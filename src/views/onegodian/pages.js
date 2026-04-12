import { renderCards, renderCta, renderDocSection, renderFaq, renderHero, renderNav } from './components.js';
import { renderOnegodianLayout } from './layout.js';

const products = [
  {
    slug: 'onegodian-algorithm-reference',
    title: 'Onegodian Algorithm Reference v1.0',
    description: 'Four-layer framework documentation and implementation patterns.',
  },
  {
    slug: 'onegodian-ai-system-prompt-v1',
    title: 'Onegodian AI System Prompt v1.0',
    description: 'Stage-aware model behaviors aligned to documented Onegodian references.',
  },
  {
    slug: 'onegodian-timekeeping-ots-v5',
    title: 'Onegodian Timekeeping System™ OTS-V5',
    description: 'Supplemental OT date helpers with Gregorian/UTC canonical handling.',
  },
];

const renderProductCards = () => renderCards(products.map((product) => ({
  title: product.title,
  description: product.description,
  href: `/products/${product.slug}`,
})));

export const renderOrgHomePage = () => renderOnegodianLayout({
  pageTitle: 'ONEGODIAN, LLC',
  body: `${renderNav()}${renderHero({
    title: 'ONEGODIAN, LLC',
    subtitle: 'Commercial and IP steward for Onegodian products and documented architecture.',
    ctaHref: '/products',
    ctaLabel: 'View Products',
  })}${renderProductCards()}${renderFaq([
    { q: 'Does this site represent Indigenous Nation of Onegodia™ governance?', a: 'No. Indigenous Nation governance is separate and not part of the commercial product stack.' },
    { q: 'What is canonical for dates/timestamps?', a: 'Gregorian UTC remains canonical. OT is supplemental and computed only when needed.' },
  ])}${renderCta({ text: 'Need technical reference documents?', href: '/docs/algorithm', label: 'Read Documentation' })}`,
});

export const renderProductsPage = () => renderOnegodianLayout({
  pageTitle: 'Onegodian Products',
  body: `${renderNav()}<h1>Products</h1>${renderProductCards()}`,
});

export const renderProductDetailPage = (slug) => {
  const product = products.find((entry) => entry.slug === slug);

  if (!product) {
    return renderOnegodianLayout({
      pageTitle: 'Product Not Found',
      body: `${renderNav()}<h1>Product Not Found</h1><p>The requested product is not currently published.</p>`,
    });
  }

  return renderOnegodianLayout({
    pageTitle: product.title,
    body: `${renderNav()}<h1>${product.title}</h1><p>${product.description}</p>${renderCta({
      text: 'Purchase and fulfillment are delivered through Onegodian API checkout flow.',
      href: '/checkout',
      label: 'Checkout API',
    })}`,
  });
};

export const renderAlgorithmDocPage = () => renderOnegodianLayout({
  pageTitle: 'Onegodian Algorithm',
  body: `${renderNav()}${renderDocSection({
    title: 'Onegodian Algorithm White Paper v1.0',
    summary: 'Production architecture follows a four-layer model.',
    points: ['Protocol Layer', 'Experience Layer', 'Community Layer', 'Orientation Layer'],
  })}`,
});

export const renderSystemPromptDocPage = () => renderOnegodianLayout({
  pageTitle: 'Onegodian AI System Prompt',
  body: `${renderNav()}${renderDocSection({
    title: 'Onegodian AI System Prompt v1.0',
    summary: 'LLM behavior is restricted to documented sources and stage-aware response flow.',
    points: ['Prompt versioning', 'Documented-source guardrails', 'No unsupported institutional or legal claims'],
  })}`,
});

export const renderPositioningDocPage = () => renderOnegodianLayout({
  pageTitle: 'Institutional Positioning',
  body: `${renderNav()}${renderDocSection({
    title: 'ONEGODIAN, LLC Institutional Positioning Statement',
    summary: 'ONEGODIAN, LLC is the commercial and IP entity.',
    points: [
      'Commercial stack and institutional positioning belong to ONEGODIAN, LLC.',
      'Indigenous Nation of Onegodia™ governance remains separate.',
      'Public documentation must avoid conflating these domains.',
    ],
  })}`,
});
