import { PageHeader } from '../../components/Layout/PageHeader/index.js';
import { RevocationQueue } from '../../components/RevocationQueue/index.js';
import { RecordsTable } from '../../components/RecordsTable/index.js';

export const renderRevokePage = (state) => `
  ${PageHeader({
    title: 'Revoke records',
    description: 'Use lifecycle controls to invalidate records and publish revocation reasons.',
  })}
  <section class="content-grid">
    ${RevocationQueue({ records: state.records })}
    ${RecordsTable({ records: state.records.filter((record) => record.status === 'revoked').length ? state.records.filter((record) => record.status === 'revoked') : state.records.slice(0, 3) })}
  </section>
`;
