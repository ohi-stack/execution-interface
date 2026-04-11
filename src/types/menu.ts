export type MenuRole =
  | "guest"
  | "user"
  | "investor"
  | "agent"
  | "admin"
  | "super_admin";

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  description?: string;
  permission?: MenuRole[];
  external?: boolean;
  children?: MenuItem[];
  badge?: string;
}

export interface MenuSection {
  id: string;
  title: string;
  permission?: MenuRole[];
  items: MenuItem[];
}

export interface MenuResponse {
  service: string;
  role: MenuRole;
  generatedAt: string;
  sections: MenuSection[];
}
