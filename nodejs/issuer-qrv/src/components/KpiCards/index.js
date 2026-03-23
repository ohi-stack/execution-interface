import { formatCompactNumber } from '../../utils/formatters.js';

export const KpiCards = ({ analytics }) => {
  const cards = [
    { label: 'Issued records', value: analytics.totals.issued },
    { label: 'Active records', value: analytics.totals.active },
    { label: 'Revoked records', value: analytics.totals.revoked },
    { label: 'Verifications', value: analytics.totals.verifications },
  ];

  return `
    <section class="kpi-grid">
      ${cards
        .map(
          (card) => `
            <article class="card kpi-card">
              <p>${card.label}</p>
              <strong>${formatCompactNumber(card.value)}</strong>
            </article>`,
        )
        .join('')}
    </section>
  `;
};
