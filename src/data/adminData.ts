// Backoffice mock data (prototype persistence via localStorage)

export type AdminRole = "SUPER_ADMIN" | "MODERATOR" | "SUPPORT";

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
}

export type PlatformUserStatus = "active" | "suspended" | "pending";

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: PlatformUserStatus;
  isPro: boolean;
  createdAt: string;
}

export type BusinessStatus = "published" | "unpublished" | "pending" | "blocked";

export interface AdminBusiness {
  id: string;
  name: string;
  owner: string;
  category: string;
  status: BusinessStatus;
  products: number;
  orders: number;
  createdAt: string;
}

export type ContentKind = "product" | "promotion" | "review";
export type ContentStatus = "published" | "pending" | "rejected";

export interface AdminContentItem {
  id: string;
  title: string;
  kind: ContentKind;
  business: string;
  status: ContentStatus;
  reports: number;
  createdAt: string;
}

export const adminRoleLabels: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super admin",
  MODERATOR: "Modérateur",
  SUPPORT: "Support",
};

export const seedAdmins: AdminAccount[] = [
  {
    id: "adm-1",
    name: "Admin Principal",
    email: "admin@fastrelays.io",
    password: "admin123",
    role: "SUPER_ADMIN",
    active: true,
    createdAt: "2026-01-12",
  },
  {
    id: "adm-2",
    name: "Claire Moderation",
    email: "claire@fastrelays.io",
    password: "moderation123",
    role: "MODERATOR",
    active: true,
    createdAt: "2026-03-04",
  },
];

export const seedUsers: PlatformUser[] = [
  { id: "usr-1", name: "Sophie Laurent", email: "sophie@example.com", phone: "+237 690 11 22 33", status: "active", isPro: true, createdAt: "2026-02-18" },
  { id: "usr-2", name: "Pierre Moreau", email: "pierre@example.com", phone: "+237 691 44 55 66", status: "active", isPro: false, createdAt: "2026-03-02" },
  { id: "usr-3", name: "Marie Dupont", email: "marie@example.com", phone: "+237 692 77 88 99", status: "suspended", isPro: true, createdAt: "2026-04-11" },
  { id: "usr-4", name: "Jean Martin", email: "jean@example.com", phone: "+237 693 00 11 22", status: "pending", isPro: false, createdAt: "2026-06-27" },
];

export const seedBusinesses: AdminBusiness[] = [
  { id: "biz-1", name: "Urban Style Shop", owner: "Sophie Laurent", category: "Articles", status: "published", products: 24, orders: 156, createdAt: "2026-02-20" },
  { id: "biz-2", name: "Chez Mama Nadia", owner: "Marie Dupont", category: "Restauration", status: "pending", products: 12, orders: 43, createdAt: "2026-05-06" },
  { id: "biz-3", name: "TechRelay", owner: "Pierre Moreau", category: "Électronique", status: "unpublished", products: 8, orders: 12, createdAt: "2026-06-14" },
];

export const seedContent: AdminContentItem[] = [
  { id: "cnt-1", title: "Sac à dos Urban Pro", kind: "product", business: "Urban Style Shop", status: "published", reports: 0, createdAt: "2026-06-01" },
  { id: "cnt-2", title: "-30% sur les sneakers", kind: "promotion", business: "Urban Style Shop", status: "pending", reports: 1, createdAt: "2026-07-15" },
  { id: "cnt-3", title: "Avis: livraison très lente", kind: "review", business: "Chez Mama Nadia", status: "pending", reports: 3, createdAt: "2026-08-02" },
  { id: "cnt-4", title: "Casque Bluetooth X2", kind: "product", business: "TechRelay", status: "rejected", reports: 2, createdAt: "2026-08-10" },
];

export const contentKindLabels: Record<ContentKind, string> = {
  product: "Produit",
  promotion: "Promotion",
  review: "Avis",
};
