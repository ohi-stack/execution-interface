import { PageHeader } from '../../components/Layout/PageHeader/index.js';
import { IssueRecordForm } from '../../components/IssueRecordForm/index.js';
import { QrCodePreview } from '../../components/QrCodePreview/index.js';
import { VerificationStatusCard } from '../../components/VerificationStatusCard/index.js';

export const renderIssuePage = (state) => `
  ${PageHeader({
    title: 'Issue QR-V record',
    description: 'Create new records and publish their QR-V payloads to the registry-backed issuer plane.',
  })}
  <section class="content-grid">
    ${IssueRecordForm()}
    ${QrCodePreview(state.latestRecord)}
    ${VerificationStatusCard(state.latestRecord)}
  </section>
`;
