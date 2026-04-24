import { renderLayout } from './layout.js';

export const renderSystemArchitectureView = ({ pageTitle }) => renderLayout({
  pageTitle,
  body: `<main class="content-wrap">
  <section class="card">
    <p class="section-label">OneGodian Platform Blueprint</p>
    <h2>System Architecture</h2>
    <p class="supporting-copy">
      The verification platform combines a deterministic control plane, governance APIs, and a
      registry-backed verification data path for production-grade trust decisions.
    </p>

    <div class="architecture-stack">
      <article>
        <h3>1) Auth + System</h3>
        <p>Health checks, security headers, and request lifecycle handling for stable operations.</p>
      </article>
      <article>
        <h3>2) API + Core</h3>
        <p>V1 record verification endpoints and OMOS governance APIs for identity, alignment, and decisioning.</p>
      </article>
      <article>
        <h3>3) Pages + UI</h3>
        <p>Homepage, verification result views, and architecture documentation for operators and partners.</p>
      </article>
      <article>
        <h3>4) Fallback + Recovery</h3>
        <p>Deterministic unavailable states, safe defaults, and structured error handling to prevent silent failures.</p>
      </article>
    </div>
  </section>
</main>`,
});
