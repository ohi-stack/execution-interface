export const AnalyticsPanel = ({ analytics }) => `
  <section class="card span-2">
    <h4>Verification analytics</h4>
    <div class="analytics-grid">
      ${analytics.trends
        .map(
          (trend) => `
            <article class="analytics-item">
              <span>${trend.label}</span>
              <strong>${trend.value}</strong>
            </article>`,
        )
        .join('')}
    </div>
  </section>
`;
