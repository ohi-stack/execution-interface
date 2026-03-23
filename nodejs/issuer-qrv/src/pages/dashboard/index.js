import { PageHeader } from '../../components/Layout/PageHeader/index.js';
import { KpiCards } from '../../components/KpiCards/index.js';
import { AnalyticsPanel } from '../../components/AnalyticsPanel/index.js';
import { RecordsTable } from '../../components/RecordsTable/index.js';
import { VerificationStatusCard } from '../../components/VerificationStatusCard/index.js';

export const renderDashboardPage = (state) => `
  ${PageHeader({
    title: 'Issuer workflow overview',
    description: 'Track issuance, manage lifecycle controls, and monitor downstream verification activity.',
    actionLabel: 'Issue record',
    actionTarget: 'issue',
  })}
  ${KpiCards({ analytics: state.analytics })}
  <section class="content-grid">
    ${AnalyticsPanel({ analytics: state.analytics })}
    ${VerificationStatusCard(state.latestRecord)}
    ${RecordsTable({ records: state.records.slice(0, 4) })}
  </section>
`;
