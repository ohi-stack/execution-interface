export const renderNav = () => `
<nav>
  <a href="/onegodian">Home</a>
  <a href="/products">Products</a>
  <a href="/docs/algorithm">Algorithm</a>
  <a href="/docs/system-prompt">System Prompt</a>
  <a href="/docs/positioning">Positioning</a>
</nav>`;

export const renderHero = ({ title, subtitle, ctaHref, ctaLabel }) => `
<section>
  <h1>${title}</h1>
  <p>${subtitle}</p>
  <a href="${ctaHref}">${ctaLabel}</a>
</section>`;

export const renderCards = (items) => `
<section>
  ${items.map((item) => `<article><h3>${item.title}</h3><p>${item.description}</p><a href="${item.href}">Read more</a></article>`).join('')}
</section>`;

export const renderFaq = (items) => `
<section>
  <h2>FAQ</h2>
  ${items.map((item) => `<details><summary>${item.q}</summary><p>${item.a}</p></details>`).join('')}
</section>`;

export const renderCta = ({ text, href, label }) => `<section><p>${text}</p><a href="${href}">${label}</a></section>`;

export const renderDocSection = ({ title, summary, points }) => `
<section>
  <h1>${title}</h1>
  <p>${summary}</p>
  <ul>${points.map((point) => `<li>${point}</li>`).join('')}</ul>
</section>`;
