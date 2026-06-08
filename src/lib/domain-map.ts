export const domainMap = {
  app: {
    domain: 'app.onegodian.com',
    title: 'OneGodian App',
    role: 'Public and member-facing application',
    description:
      'The OneGodian App provides dashboard access for members, certificates, campaigns, media, tools, ecosystem links, and personal participation.',
    primaryAudience: [
      'Members',
      'Supporters',
      'Students',
      'Creators',
      'Customers',
      'Public users',
      'OneGodian Allies'
    ]
  },

  console: {
    domain: 'console.onegodian.com',
    title: 'OneGodian Console',
    role: 'Administrative command console and operational governance',
    description:
      'The OneGodian Console manages internal operations, app deployment status, plugin management, system health, APIs, registries, admin workflows, and developer tools.',
    primaryAudience: [
      'Founder',
      'Admins',
      'Developers',
      'Operators',
      'System managers',
      'Authorized internal users'
    ]
  }
} as const;
