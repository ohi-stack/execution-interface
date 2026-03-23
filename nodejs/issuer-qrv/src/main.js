import { renderApp } from './app.js';
import { getCurrentUser } from './services/auth.js';
import { createRecord, revokeRecord, verifyRecord } from './services/issuer.js';
import { getRecords } from './services/records.js';
import { getAnalytics } from './services/analytics.js';
import { getApiKeys } from './services/apiKeys.js';
import { validateIssuePayload } from './utils/validators.js';

const root = document.getElementById('app');

const state = {
  activePage: 'dashboard',
  user: getCurrentUser(),
  records: [],
  analytics: { totals: { issued: 0, active: 0, revoked: 0, verifications: 0 }, trends: [] },
  apiKeys: [],
  latestRecord: null,
};

const render = () => {
  renderApp(root, state);
  bindNavigation();
  bindIssueForm();
  bindRevokeForm();
};

const refreshData = async () => {
  const [records, analytics, apiKeys] = await Promise.all([getRecords(), getAnalytics(), getApiKeys()]);
  state.records = records;
  state.analytics = analytics;
  state.apiKeys = apiKeys;
  state.latestRecord = records[0] || null;
};

const bindNavigation = () => {
  root.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activePage = button.dataset.nav;
      render();
    });
  });
};

const bindIssueForm = () => {
  const form = document.getElementById('issue-record-form');
  if (!form) return;

  const status = document.getElementById('issue-form-status');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const validationMessage = validateIssuePayload(payload);

    if (validationMessage) {
      status.textContent = validationMessage;
      status.className = 'message error';
      return;
    }

    status.textContent = 'Creating record…';
    status.className = 'message';

    try {
      const created = await createRecord(payload);
      const verified = await verifyRecord(created.qrvid);
      state.latestRecord = verified;
      await refreshData();
      state.activePage = 'issue';
      render();
      const refreshedStatus = document.getElementById('issue-form-status');
      if (refreshedStatus) {
        refreshedStatus.textContent = `Record ${created.qrvid} issued successfully.`;
        refreshedStatus.className = 'message success';
      }
    } catch (error) {
      status.textContent = error.message;
      status.className = 'message error';
    }
  });
};

const bindRevokeForm = () => {
  const form = document.getElementById('revoke-record-form');
  if (!form) return;

  const status = document.getElementById('revoke-form-status');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    status.textContent = 'Revoking record…';
    status.className = 'message';

    try {
      await revokeRecord(payload);
      await refreshData();
      render();
      const refreshedStatus = document.getElementById('revoke-form-status');
      if (refreshedStatus) {
        refreshedStatus.textContent = `Record ${payload.qrvid} revoked.`;
        refreshedStatus.className = 'message success';
      }
    } catch (error) {
      status.textContent = error.message;
      status.className = 'message error';
    }
  });
};

const init = async () => {
  try {
    await refreshData();
  } catch (error) {
    root.innerHTML = `<main class="load-error"><h1>Unable to load issuer-qrv</h1><p>${error.message}</p></main>`;
    return;
  }

  render();
};

init();
