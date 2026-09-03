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
export type ContentStatus = "published" | "pending" | "rejected" | "hidden";
export type ContentSeverity = "low" | "medium" | "high";

export interface ContentReport {
  id: string;
  reason: string;
  reporter: string;
  createdAt: string;
}

export interface AdminContentItem {
  id: string;
  title: string;
  kind: ContentKind;
  business: string;
  status: ContentStatus;
  reports: number;
  createdAt: string;
  description?: string;
  author?: string;
  severity?: ContentSeverity;
  reportDetails?: ContentReport[];
  moderationNote?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ModerationLogEntry {
  id: string;
  contentId: string;
  contentTitle: string;
  action: string;
  reason?: string;
  admin: string;
  at: string;
}

export const rejectionReasons = [
  "Contenu inapproprié ou offensant",
  "Produit interdit ou réglementé",
  "Informations trompeuses / fausses promotions",
  "Photos de mauvaise qualité ou volées",
  "Prix ou description incohérents",
  "Avis frauduleux / spam",
  "Autre (préciser)",
] as const;

export const severityLabels: Record<ContentSeverity, string> = {
  low: "Faible",
  medium: "Moyenne",
  high: "Élevée",
};


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
  {
    id: "cnt-1",
    title: "Sac à dos Urban Pro",
    kind: "product",
    business: "Urban Style Shop",
    status: "published",
    reports: 0,
    createdAt: "2026-06-01",
    author: "Sophie Laurent",
    severity: "low",
    description: "Sac à dos 30L en toile renforcée, compartiment ordinateur 15\".",
    reportDetails: [],
  },
  {
    id: "cnt-2",
    title: "-30% sur les sneakers",
    kind: "promotion",
    business: "Urban Style Shop",
    status: "pending",
    reports: 1,
    createdAt: "2026-07-15",
    author: "Sophie Laurent",
    severity: "medium",
    description: "Promotion -30% valable 7 jours sur toute la gamme sneakers.",
    reportDetails: [
      { id: "rep-1", reason: "Informations trompeuses / fausses promotions", reporter: "Jean Martin", createdAt: "2026-07-18" },
    ],
  },
  {
    id: "cnt-3",
    title: "Avis: livraison très lente",
    kind: "review",
    business: "Chez Mama Nadia",
    status: "pending",
    reports: 3,
    createdAt: "2026-08-02",
    author: "Pierre Moreau",
    severity: "high",
    description: "Commande reçue après 9 jours, aucun suivi et service client injoignable.",
    reportDetails: [
      { id: "rep-2", reason: "Avis frauduleux / spam", reporter: "Marie Dupont", createdAt: "2026-08-03" },
      { id: "rep-3", reason: "Contenu inapproprié ou offensant", reporter: "Sophie Laurent", createdAt: "2026-08-04" },
      { id: "rep-4", reason: "Avis frauduleux / spam", reporter: "Jean Martin", createdAt: "2026-08-05" },
    ],
  },
  {
    id: "cnt-4",
    title: "Casque Bluetooth X2",
    kind: "product",
    business: "TechRelay",
    status: "rejected",
    reports: 2,
    createdAt: "2026-08-10",
    author: "Pierre Moreau",
    severity: "medium",
    description: "Casque sans fil, autonomie annoncée 40h.",
    rejectionReason: "Photos de mauvaise qualité ou volées",
    reviewedBy: "Claire Moderation",
    reviewedAt: "2026-08-12",
    reportDetails: [
      { id: "rep-5", reason: "Photos de mauvaise qualité ou volées", reporter: "Sophie Laurent", createdAt: "2026-08-11" },
      { id: "rep-6", reason: "Prix ou description incohérents", reporter: "Marie Dupont", createdAt: "2026-08-11" },
    ],
  },
];

export const seedModerationLog: ModerationLogEntry[] = [
  {
    id: "mlog-1",
    contentId: "cnt-4",
    contentTitle: "Casque Bluetooth X2",
    action: "Rejeté",
    reason: "Photos de mauvaise qualité ou volées",
    admin: "Claire Moderation",
    at: "2026-08-12 10:24",
  },
];


export const contentKindLabels: Record<ContentKind, string> = {
  product: "Produit",
  promotion: "Promotion",
  review: "Avis",
};

// ---------- Codes promos ----------

export type PromoCodeType = "percentage" | "amount" | "shipping";
export type PromoCodeStatus = "active" | "scheduled" | "expired" | "disabled";

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  type: PromoCodeType;
  value: number;
  minOrder: number;
  usageLimit: number;
  usageCount: number;
  scope: string;
  startAt: string;
  endAt: string;
  status: PromoCodeStatus;
  createdAt: string;
}

export const promoTypeLabels: Record<PromoCodeType, string> = {
  percentage: "Pourcentage",
  amount: "Montant fixe",
  shipping: "Livraison offerte",
};

export const promoStatusLabels: Record<PromoCodeStatus, string> = {
  active: "Actif",
  scheduled: "Programmé",
  expired: "Expiré",
  disabled: "Désactivé",
};

export const seedPromoCodes: PromoCode[] = [
  {
    id: "prm-1",
    code: "BIENVENUE10",
    description: "10% sur la première commande",
    type: "percentage",
    value: 10,
    minOrder: 5000,
    usageLimit: 500,
    usageCount: 128,
    scope: "Toute la plateforme",
    startAt: "2026-01-01",
    endAt: "2026-12-31",
    status: "active",
    createdAt: "2026-01-01",
  },
  {
    id: "prm-2",
    code: "URBAN2000",
    description: "2 000 XAF de remise chez Urban Style Shop",
    type: "amount",
    value: 2000,
    minOrder: 15000,
    usageLimit: 100,
    usageCount: 41,
    scope: "Urban Style Shop",
    startAt: "2026-06-01",
    endAt: "2026-09-30",
    status: "active",
    createdAt: "2026-05-28",
  },
  {
    id: "prm-3",
    code: "LIVRAISONFREE",
    description: "Livraison offerte dès 20 000 XAF",
    type: "shipping",
    value: 0,
    minOrder: 20000,
    usageLimit: 300,
    usageCount: 300,
    scope: "Toute la plateforme",
    startAt: "2026-03-01",
    endAt: "2026-06-30",
    status: "expired",
    createdAt: "2026-02-25",
  },
  {
    id: "prm-4",
    code: "RENTREE15",
    description: "15% pour la rentrée",
    type: "percentage",
    value: 15,
    minOrder: 10000,
    usageLimit: 200,
    usageCount: 0,
    scope: "Toute la plateforme",
    startAt: "2026-09-15",
    endAt: "2026-10-15",
    status: "scheduled",
    createdAt: "2026-08-20",
  },
];
