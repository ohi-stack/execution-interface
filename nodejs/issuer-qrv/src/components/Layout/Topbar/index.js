export const Topbar = ({ user }) => `
  <header class="topbar">
    <div>
      <p class="eyebrow">Issuer portal</p>
      <h2>QR-V records, revocation, analytics, and API access in one workspace</h2>
    </div>
    <div class="topbar-meta">
      <span class="status-pill success">${user.status}</span>
      <div>
        <strong>${user.name}</strong>
        <p>${user.role}</p>
      </div>
    </div>
  </header>
`;
