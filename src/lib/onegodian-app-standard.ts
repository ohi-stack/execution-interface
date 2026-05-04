export type StandardSection = {
  title: string;
  items: string[];
};

export const onegodianAppStandardSections: StandardSection[] = [
  {
    title: '1. Public App Layer',
    items: ['Homepage / module landing page', 'About / purpose page', 'Feature overview', 'Public documentation', 'Pricing or access level, if applicable', 'Contact / support CTA']
  },
  {
    title: '2. Dashboard Layer',
    items: ['Main dashboard', 'System status cards', 'Quick actions', 'Recent activity', 'User/member profile', 'Notifications', 'Module navigation']
  },
  {
    title: '3. Admin Layer',
    items: ['Admin dashboard', 'Settings panel', 'API/app bridge settings', 'Key generation / rotation', 'User/member management', 'Submission management', 'Production checklist', 'Logs and audit trail']
  },
  {
    title: '4. API / Bridge Layer',
    items: ['Health endpoint', 'Manifest endpoint', 'Tool list endpoint', 'Stats endpoint', 'Secure REST endpoints', 'X-OMOS-App-Key support', 'Environment variable panel', 'Webhook support where needed']
  },
  {
    title: '5. Data Layer',
    items: ['Database schema', 'Submissions table', 'Users/members table', 'Settings table', 'Logs table', 'Certificates/records table, if applicable', 'Export/import support']
  },
  {
    title: '6. Security Layer',
    items: ['App key authentication', 'Role-based permissions', 'Nonce / CSRF protection', 'Input validation', 'Rate limiting', 'Audit logging', 'Secure Stripe/payment fallback where applicable']
  },
  {
    title: '7. UI / UX Layer',
    items: ['Consistent OneGodian branding', 'Admin cards and status badges', 'Sidebar navigation', 'Mobile-responsive layout', 'Icons for every module', 'Empty states', 'Success/error notices', 'Production readiness indicators']
  },
  {
    title: '8. Documentation Layer',
    items: ['README', 'Installation guide', 'Environment variable guide', 'API endpoint documentation', 'Admin usage guide', 'Production checklist', 'Changelog', 'Version history']
  },
  {
    title: '9. Compliance Layer',
    items: ['Terms notice', 'Privacy notice', 'Contributor/user disclaimer', 'Financial disclaimer if money is involved', 'Membership terms if users join', 'Intellectual property notice', 'Legal-safe public language']
  },
  {
    title: '10. Deployment Layer',
    items: ['.env.example', 'Build/test scripts', 'Syntax/lint checks', 'Version number', 'GitHub-ready structure', 'Hostinger/Vercel/WordPress deployment notes', 'Rollback instructions']
  }
];

export const requiredCorePages = ['/dashboard', '/ecosystem', '/registry', '/tools', '/members', '/certificates', '/products', '/media', '/settings', '/admin', '/api/health', '/api/manifest', '/api/tools', '/api/stats'];

export const requiredPluginAdminScreens = ['App Bridge', 'Dashboard', 'Settings', 'API Keys', 'Submissions', 'Tools', 'Status', 'Production Checklist', 'Documentation'];

export const threeUseRule = ['Public-facing page', 'Logged-in dashboard', 'Admin/control panel'];
