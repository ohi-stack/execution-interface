import { DashboardShell } from './components/DashboardShell/index.js';
import { NAV_ITEMS } from './utils/constants.js';
import { renderDashboardPage } from './pages/dashboard/index.js';
import { renderIssuePage } from './pages/issue/index.js';
import { renderRecordsPage } from './pages/records/index.js';
import { renderRevokePage } from './pages/revoke/index.js';
import { renderAnalyticsPage } from './pages/analytics/index.js';
import { renderApiKeysPage } from './pages/api-keys/index.js';
import { renderSettingsPage } from './pages/settings/index.js';

const renderers = {
  dashboard: renderDashboardPage,
  issue: renderIssuePage,
  records: renderRecordsPage,
  revoke: renderRevokePage,
  analytics: renderAnalyticsPage,
  'api-keys': renderApiKeysPage,
  settings: renderSettingsPage,
};

export const renderApp = (root, state) => {
  const renderer = renderers[state.activePage] || renderDashboardPage;

  root.innerHTML = DashboardShell({
    navItems: NAV_ITEMS,
    activePage: state.activePage,
    user: state.user,
    content: renderer(state),
  });
};
