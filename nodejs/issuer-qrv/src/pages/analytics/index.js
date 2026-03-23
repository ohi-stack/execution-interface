import { PageHeader } from '../../components/Layout/PageHeader/index.js';
import { KpiCards } from '../../components/KpiCards/index.js';
import { AnalyticsPanel } from '../../components/AnalyticsPanel/index.js';

export const renderAnalyticsPage = (state) => `
  ${PageHeader({
    title: 'Verification analytics',
    description: 'Monitor aggregate verification activity and observe issuer-side performance indicators.',
  })}
  ${KpiCards({ analytics: state.analytics })}
  <section class="content-grid">
    ${AnalyticsPanel({ analytics: state.analytics })}
  </section>
`;
