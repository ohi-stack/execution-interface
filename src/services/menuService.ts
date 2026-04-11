import { MenuItem, MenuResponse, MenuRole, MenuSection } from "../types/menu";

function hasAccess(
  allowed: MenuRole[] | undefined,
  currentRole: MenuRole
): boolean {
  if (!allowed || allowed.length === 0) return true;
  return allowed.includes(currentRole);
}

function filterItems(items: MenuItem[], role: MenuRole): MenuItem[] {
  return items
    .filter((item) => hasAccess(item.permission, role))
    .map((item) => {
      const filteredChildren = item.children
        ? filterItems(item.children, role)
        : undefined;

      return {
        ...item,
        ...(filteredChildren ? { children: filteredChildren } : {})
      };
    })
    .filter((item) => !item.children || item.children.length > 0 || !item.children);
}

function filterSections(sections: MenuSection[], role: MenuRole): MenuSection[] {
  return sections
    .filter((section) => hasAccess(section.permission, role))
    .map((section) => ({
      ...section,
      items: filterItems(section.items, role)
    }))
    .filter((section) => section.items.length > 0);
}

const baseSections: MenuSection[] = [
  {
    id: "platform",
    title: "Platform",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        url: "/dashboard",
        description: "Overview of system activity and status",
        permission: ["user", "investor", "agent", "admin", "super_admin"]
      },
      {
        id: "verify",
        label: "Verify",
        url: "/verify",
        description: "Submit verification requests",
        permission: ["user", "investor", "agent", "admin", "super_admin"]
      },
      {
        id: "public-status",
        label: "System Status",
        url: "/status",
        description: "Public service status and uptime"
      }
    ]
  },
  {
    id: "agents",
    title: "Agents",
    permission: ["agent", "admin", "super_admin"],
    items: [
      {
        id: "agent-tasks",
        label: "Tasks",
        url: "/agents/tasks",
        description: "Assigned and active tasks",
        permission: ["agent", "admin", "super_admin"]
      },
      {
        id: "agent-jobs",
        label: "Jobs",
        url: "/jobs",
        description: "Job queue and execution status",
        permission: ["agent", "admin", "super_admin"]
      },
      {
        id: "agent-runner",
        label: "Runner",
        url: "/agents/runner",
        description: "Runtime and worker controls",
        permission: ["admin", "super_admin"]
      }
    ]
  },
  {
    id: "finance",
    title: "Finance",
    permission: ["investor", "admin", "super_admin"],
    items: [
      {
        id: "portfolio",
        label: "Portfolio",
        url: "/finance/portfolio",
        description: "Investor holdings and activity",
        permission: ["investor", "admin", "super_admin"]
      },
      {
        id: "reports",
        label: "Reports",
        url: "/finance/reports",
        description: "Yield summaries and statements",
        permission: ["investor", "admin", "super_admin"]
      },
      {
        id: "instruments",
        label: "Instruments",
        url: "/finance/instruments",
        description: "Financial instruments and offerings",
        permission: ["admin", "super_admin"]
      }
    ]
  },
  {
    id: "identity",
    title: "Identity",
    items: [
      {
        id: "profile",
        label: "Profile",
        url: "/identity/profile",
        description: "Identity and account details",
        permission: ["user", "investor", "agent", "admin", "super_admin"]
      },
      {
        id: "access",
        label: "Access",
        url: "/identity/access",
        description: "Roles, tokens, and permissions",
        permission: ["admin", "super_admin"]
      }
    ]
  },
  {
    id: "network",
    title: "Network",
    items: [
      {
        id: "issuer",
        label: "Issuer",
        url: "https://issuer.qrv.network",
        description: "Credential issuance services",
        external: true
      },
      {
        id: "verify-network",
        label: "Verify Network",
        url: "https://verify.qrv.network",
        description: "Verification portal",
        external: true
      },
      {
        id: "registry",
        label: "Registry",
        url: "/registry",
        description: "Records and lookup tools",
        permission: ["admin", "super_admin"]
      }
    ]
  },
  {
    id: "admin",
    title: "Administration",
    permission: ["admin", "super_admin"],
    items: [
      {
        id: "admin-console",
        label: "Admin Console",
        url: "/admin",
        description: "Administrative control center",
        permission: ["admin", "super_admin"]
      },
      {
        id: "audit-logs",
        label: "Audit Logs",
        url: "/admin/logs",
        description: "System and event logs",
        permission: ["admin", "super_admin"]
      },
      {
        id: "settings",
        label: "Settings",
        url: "/admin/settings",
        description: "Service and policy settings",
        permission: ["super_admin"]
      }
    ]
  }
];

export function resolveRole(input?: string): MenuRole {
  const validRoles: MenuRole[] = [
    "guest",
    "user",
    "investor",
    "agent",
    "admin",
    "super_admin"
  ];

  if (!input) return "guest";
  return validRoles.includes(input as MenuRole) ? (input as MenuRole) : "guest";
}

export function buildMenu(role: MenuRole): MenuResponse {
  return {
    service: "instryx.qrv.network",
    role,
    generatedAt: new Date().toISOString(),
    sections: filterSections(baseSections, role)
  };
}
