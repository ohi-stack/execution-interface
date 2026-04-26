import { escapeHtml } from './layout.js';

const kpis = [
  { label: 'Active Agents', value: '12', delta: '+2 today' },
  { label: 'Tasks Completed (24h)', value: '438', delta: '+8.4%' },
  { label: 'Mean Response Time', value: '182ms', delta: '-14ms' },
  { label: 'System Uptime', value: '99.98%', delta: '30 day rolling' },
];

const healthWidgets = [
  { name: 'API Gateway', status: 'Healthy', detail: 'Latency 43ms', tone: 'ok' },
  { name: 'Queue Workers', status: 'Healthy', detail: '8 workers online', tone: 'ok' },
  { name: 'Policy Engine', status: 'Degraded', detail: '1 delayed shard', tone: 'warn' },
  { name: 'Audit Stream', status: 'Healthy', detail: 'No dropped events', tone: 'ok' },
];

const agents = [
  { id: 'AG-1001', name: 'Atlas', role: 'Coordinator', zone: 'us-east-1', health: 'Healthy', tasks: 118 },
  { id: 'AG-1002', name: 'Nova', role: 'Classifier', zone: 'us-west-2', health: 'Healthy', tasks: 94 },
  { id: 'AG-1003', name: 'Helix', role: 'Verifier', zone: 'eu-central-1', health: 'Degraded', tasks: 71 },
  { id: 'AG-1004', name: 'Orion', role: 'Policy Guard', zone: 'us-east-2', health: 'Healthy', tasks: 87 },
  { id: 'AG-1005', name: 'Vega', role: 'Router', zone: 'ap-south-1', health: 'Healthy', tasks: 68 },
];

const initialFeed = [
  'Atlas completed workflow WF-3029.',
  'Policy update POL-88 propagated to all workers.',
  'Helix retried verification batch B-901.',
  'Nova classified 14 new records.',
];

export const renderDashboardView = ({ pageTitle = 'ACC Dashboard v1' } = {}) => {
  const kpiCards = kpis.map((item) => `
    <article class="kpi-card">
      <p class="kpi-label">${escapeHtml(item.label)}</p>
      <p class="kpi-value">${escapeHtml(item.value)}</p>
      <p class="kpi-delta">${escapeHtml(item.delta)}</p>
    </article>
  `).join('');

  const healthCards = healthWidgets.map((widget) => `
    <article class="health-card health-${escapeHtml(widget.tone)}">
      <div>
        <p class="health-name">${escapeHtml(widget.name)}</p>
        <p class="health-detail">${escapeHtml(widget.detail)}</p>
      </div>
      <span class="pill">${escapeHtml(widget.status)}</span>
    </article>
  `).join('');

  const feedItems = initialFeed.map((item) => `<li>${escapeHtml(item)}</li>`).join('');

  const rows = agents.map((agent) => `
    <tr>
      <td>${escapeHtml(agent.id)}</td>
      <td>${escapeHtml(agent.name)}</td>
      <td>${escapeHtml(agent.role)}</td>
      <td>${escapeHtml(agent.zone)}</td>
      <td><span class="pill ${agent.health === 'Healthy' ? 'pill-ok' : 'pill-warn'}">${escapeHtml(agent.health)}</span></td>
      <td>${escapeHtml(agent.tasks)}</td>
    </tr>
  `).join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(pageTitle)}</title>
    <link rel="stylesheet" href="/css/styles.css" />
  </head>
  <body class="dashboard-body">
    <div class="dashboard-layout">
      <aside class="dashboard-sidebar">
        <h1>ACC</h1>
        <nav aria-label="Dashboard">
          <a href="/dashboard" class="active">Overview</a>
          <a href="/health">Health API</a>
          <a href="/readyz">Readiness</a>
          <a href="/metrics">Metrics</a>
          <a href="/">Verification Portal</a>
        </nav>
      </aside>
      <div class="dashboard-main">
        <header class="dashboard-topnav">
          <strong>ACC Dashboard v1</strong>
          <div class="topnav-actions">
            <span class="pill pill-ok">Production</span>
            <span class="dash-time" id="dash-time"></span>
          </div>
        </header>
        <main class="dashboard-content">
          <section class="kpi-grid">${kpiCards}</section>
          <section class="panel">
            <h2>Health Status</h2>
            <div class="health-grid">${healthCards}</div>
          </section>
          <section class="two-col">
            <article class="panel">
              <h2>Live Activity Feed</h2>
              <ul class="activity-feed" id="activity-feed">${feedItems}</ul>
            </article>
            <article class="panel">
              <h2>Agent Fleet</h2>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Role</th><th>Zone</th><th>Health</th><th>Tasks</th></tr>
                  </thead>
                  <tbody>${rows}</tbody>
                </table>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
    <script>
      const feedEl = document.getElementById('activity-feed');
      const timeEl = document.getElementById('dash-time');
      const events = [
        'Orion accepted routing batch RB-449.',
        'Vega acknowledged failover drill.',
        'Atlas synced policy cache.',
        'Audit stream flushed event window.'
      ];
      let index = 0;
      const tick = () => {
        timeEl.textContent = new Date().toLocaleString();
        if (feedEl && index < events.length) {
          const li = document.createElement('li');
          li.textContent = events[index++];
          feedEl.prepend(li);
          if (feedEl.children.length > 8) feedEl.removeChild(feedEl.lastElementChild);
        }
      };
      tick();
      setInterval(tick, 7000);
    </script>
  </body>
</html>`;
};
