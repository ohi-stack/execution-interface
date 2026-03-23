import { Sidebar } from '../Layout/Sidebar/index.js';
import { Topbar } from '../Layout/Topbar/index.js';

export const DashboardShell = ({ navItems, activePage, user, content }) => `
  <div class="app-shell">
    ${Sidebar({ navItems, activePage })}
    <div class="main-shell">
      ${Topbar({ user })}
      <main class="content-area">${content}</main>
    </div>
  </div>
`;
