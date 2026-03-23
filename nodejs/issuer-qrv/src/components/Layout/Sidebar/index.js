export const Sidebar = ({ navItems, activePage }) => `
  <aside class="sidebar">
    <div>
      <p class="eyebrow">issuer-qrv</p>
      <h1>Issuer Control Plane</h1>
      <p class="sidebar-copy">Portal modules aligned to the QR-V issuer workflow.</p>
    </div>
    <nav aria-label="Primary">
      <ul class="nav-list">
        ${navItems
          .map(
            (item) => `
              <li>
                <button class="nav-link ${item.id === activePage ? 'active' : ''}" data-nav="${item.id}">${item.label}</button>
              </li>`,
          )
          .join('')}
      </ul>
    </nav>
  </aside>
`;
