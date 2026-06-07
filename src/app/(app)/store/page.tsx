import Link from 'next/link';

const storeCategories = [
  { title: 'Digital Downloads', href: 'https://onegodian.com/product-category/digital-downloads', description: 'Downloadable OneGodian resources, documents, templates, and digital tools.' },
  { title: 'Books & Guides', href: 'https://onegodian.com/product-category/books-guides', description: 'Books, study guides, explanatory material, and framework references.' },
  { title: 'Membership Resources', href: 'https://onegodian.com/product-category/membership-resources', description: 'Commercial member resources and access products fulfilled through Onegodian.com.' },
  { title: 'Certificates', href: 'https://onegodian.com/product-category/certificates', description: 'Certificate products and record-related commercial offerings.' },
  { title: 'Apparel & Goods', href: 'https://onegodian.com/product-category/apparel-goods', description: 'Branded goods, apparel, and physical product categories.' },
  { title: 'Services', href: 'https://onegodian.com/product-category/services', description: 'Service offerings, business products, and commercial access points.' }
];

export default function StorePage() {
  return (
    <main className="space-y-6">
      <section className="glass-panel p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Onegodian.com Store Bridge</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white">Store</h1>
        <p className="mt-3 max-w-4xl text-base leading-7 text-slate-300">
          Onegodian.com is the commercial store for OneGodian products, services, digital downloads, educational materials, branded goods, member resources, and business offerings. This app routes users to store categories while purchases and fulfillment remain on Onegodian.com.
        </p>
        <Link href="https://onegodian.com" className="premium-button mt-6">Open Storefront</Link>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {storeCategories.map((category) => (
          <Link key={category.href} href={category.href} className="mobile-card block">
            <h2 className="text-xl font-black text-white">{category.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{category.description}</p>
            <span className="mt-5 inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-100">Open →</span>
          </Link>
        ))}
      </section>

      <p className="rounded-2xl border border-gold-300/25 bg-gold-300/10 p-4 text-sm leading-6 text-gold-100">
        Simple separation: Onegodian.org explains the framework. Onegodian.com powers the store, products, services, and commercial access. app.OneGodian.com connects users to tools, dashboards, and platform infrastructure.
      </p>
    </main>
  );
}
