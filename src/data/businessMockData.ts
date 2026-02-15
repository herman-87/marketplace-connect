export const mockBusiness = {
  id: "1",
  name: "Urban Style Shop",
  description: "Boutique spécialisée dans les articles tendance et accessoires de mode. Nous proposons une sélection soignée de vêtements, accessoires et gadgets pour un style urbain unique. Des marques exclusives et des produits de qualité pour tous les goûts.",
  category: "articles" as const,
  isOwner: true,
  address: "123 Rue de l'Innovation, 75011 Paris",
  email: "contact@urbanstyleshop.com",
  phone: "+33 1 23 45 67 89",
  stats: {
    products: 24,
    sales: 156,
    followers: 89,
    rating: 4.8,
  },
};

export const mockCollaborators = [
  {
    id: "1",
    name: "Vous (Propriétaire)",
    role: "owner" as const,
    activityScore: 95,
    productsCreated: 18,
    ordersManaged: 89,
    joinedAt: "Depuis le début",
  },
  {
    id: "2",
    name: "Marie Dupont",
    role: "collaborator" as const,
    activityScore: 78,
    productsCreated: 6,
    ordersManaged: 45,
    joinedAt: "Il y a 3 mois",
  },
  {
    id: "3",
    name: "Jean Martin",
    role: "collaborator" as const,
    activityScore: 42,
    productsCreated: 0,
    ordersManaged: 22,
    joinedAt: "Il y a 1 mois",
  },
];

export const mockProducts = [
  {
    id: "1",
    name: "Sac à dos Urban Pro",
    description: "Sac à dos imperméable avec compartiment laptop 15 pouces",
    price: 59.99,
    status: "published" as const,
    category: "articles" as const,
    likes: 45,
    views: 234,
    sales: 67,
    createdAt: "Il y a 2 jours",
    createdBy: "Vous",
  },
  {
    id: "2",
    name: "Montre Connectée Sport",
    description: "Suivi santé, GPS intégré, 7 jours d'autonomie",
    price: 149.99,
    status: "published" as const,
    category: "articles" as const,
    likes: 38,
    views: 189,
    sales: 52,
    createdAt: "Il y a 1 semaine",
    createdBy: "Marie Dupont",
  },
  {
    id: "3",
    name: "Casque Audio Premium",
    description: "Réduction de bruit active, son Hi-Fi",
    price: 199.99,
    status: "draft" as const,
    category: "articles" as const,
    likes: 0,
    views: 12,
    sales: 0,
    createdAt: "Aujourd'hui",
    createdBy: "Vous",
  },
  {
    id: "4",
    name: "Sneakers Urban Limited",
    description: "Édition limitée, design exclusif",
    price: 89.99,
    status: "removed" as const,
    category: "articles" as const,
    likes: 22,
    views: 156,
    sales: 28,
    createdAt: "Il y a 2 semaines",
    createdBy: "Marie Dupont",
  },
];

export const mockClients = [
  {
    id: "1",
    name: "Sophie Laurent",
    totalOrders: 12,
    totalSpent: 178.50,
    favoriteProducts: 5,
    lastOrderAt: "Hier",
    rating: 5,
  },
  {
    id: "2",
    name: "Pierre Moreau",
    totalOrders: 8,
    totalSpent: 124.00,
    favoriteProducts: 3,
    lastOrderAt: "Il y a 3 jours",
    rating: 4.5,
  },
  {
    id: "3",
    name: "Claire Bernard",
    totalOrders: 5,
    totalSpent: 89.50,
    favoriteProducts: 2,
    lastOrderAt: "Cette semaine",
  },
];

export const mockOrders = [
  {
    id: "ord-001",
    customer: { name: "Sophie Laurent" },
    products: [
      { name: "Sac à dos Urban Pro", quantity: 2, price: 119.98 },
      { name: "Montre Connectée Sport", quantity: 1, price: 149.99 },
    ],
    total: 269.97,
    status: "pending" as const,
    createdAt: "Il y a 15 min",
  },
  {
    id: "ord-002",
    customer: { name: "Pierre Moreau" },
    products: [
      { name: "Casque Audio Premium", quantity: 1, price: 199.99 },
    ],
    total: 199.99,
    status: "pending" as const,
    createdAt: "Il y a 30 min",
  },
  {
    id: "ord-003",
    customer: { name: "Claire Bernard" },
    products: [
      { name: "Sneakers Urban Limited", quantity: 1, price: 89.99 },
    ],
    total: 89.99,
    status: "accepted" as const,
    createdAt: "Il y a 1 heure",
  },
  {
    id: "ord-004",
    customer: { name: "Marc Petit" },
    products: [
      { name: "Sac à dos Urban Pro", quantity: 1, price: 59.99 },
    ],
    total: 59.99,
    status: "delivered" as const,
    createdAt: "Hier",
  },
];

export const mockPendingInvitations = [
  {
    id: "inv-1",
    name: "Fatou Diallo",
    email: "fatou.diallo@email.com",
    roles: ["Produits", "Commandes"],
    invitedAt: "Il y a 2 heures",
    invitedBy: "Vous",
  },
  {
    id: "inv-2",
    name: "Ousmane Traoré",
    email: "ousmane.t@email.com",
    roles: ["Commandes"],
    invitedAt: "Hier",
    invitedBy: "Vous",
  },
  {
    id: "inv-3",
    name: "Aïssatou Bah",
    email: "aissatou.b@email.com",
    roles: ["Produits", "Sondages"],
    invitedAt: "Il y a 3 jours",
    invitedBy: "Marie Dupont",
  },
];

export const mockEngagement = {
  totalLikes: 105,
  totalViews: 591,
  totalFollowers: 89,
  likesThisWeek: 23,
  viewsThisWeek: 156,
  newFollowers: 12,
  topLikedProducts: [
    { id: "1", name: "Sac à dos Urban Pro", likes: 45 },
    { id: "2", name: "Montre Connectée Sport", likes: 38 },
    { id: "4", name: "Sneakers Urban Limited", likes: 22 },
  ],
};
