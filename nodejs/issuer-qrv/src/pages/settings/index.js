import { PageHeader } from '../../components/Layout/PageHeader/index.js';
import { SETTINGS_ITEMS } from '../../utils/constants.js';

export const renderSettingsPage = () => `
  ${PageHeader({
    title: 'Issuer settings',
    description: 'Control environment, operational defaults, and portal-level administration settings.',
  })}
  <section class="content-grid">
    <section class="card span-2">
      <h4>Environment settings</h4>
      <dl class="detail-list">
        ${SETTINGS_ITEMS.map((item) => `<div><dt>${item.label}</dt><dd>${item.value}</dd></div>`).join('')}
      </dl>
    </section>
  </section>
`;
