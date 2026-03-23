import { PageHeader } from '../../components/Layout/PageHeader/index.js';
import { ApiKeysPanel } from '../../components/ApiKeysPanel/index.js';

export const renderApiKeysPage = (state) => `
  ${PageHeader({
    title: 'API access',
    description: 'Review integration credentials used by issuer systems and monitor their active status.',
  })}
  <section class="content-grid">
    ${ApiKeysPanel({ keys: state.apiKeys })}
  </section>
`;
