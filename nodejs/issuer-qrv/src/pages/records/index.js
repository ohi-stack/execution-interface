import { PageHeader } from '../../components/Layout/PageHeader/index.js';
import { RecordsTable } from '../../components/RecordsTable/index.js';

export const renderRecordsPage = (state) => `
  ${PageHeader({
    title: 'Manage issued records',
    description: 'Review every issued record, including current lifecycle state and issuance timestamps.',
    actionLabel: 'Revoke access',
    actionTarget: 'revoke',
  })}
  <section class="content-grid">
    ${RecordsTable({ records: state.records })}
  </section>
`;
