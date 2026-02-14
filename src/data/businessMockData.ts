export const mockBusiness = {
  id: "1",
  name: "Saveurs d'Afrique",
  description: "Restaurant spécialisé dans la cuisine africaine authentique. Plats préparés avec des ingrédients frais et des recettes traditionnelles transmises de génération en génération. Notre chef propose une carte variée de plats sénégalais, ivoiriens et maliens, préparés avec amour et savoir-faire. Venez découvrir les saveurs uniques de l'Afrique de l'Ouest dans une ambiance chaleureuse et conviviale.",
  category: "repas" as const,
  isOwner: true,
  address: "123 Rue de l'Innovation, 75011 Paris",
  email: "contact@saveursdafrique.com",
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
    name: "Poulet Yassa",
    description: "Poulet mariné aux oignons et citron, accompagné de riz basmati",
    price: 14.50,
    status: "published" as const,
    category: "repas" as const,
    likes: 45,
    views: 234,
    sales: 67,
    createdAt: "Il y a 2 jours",
    createdBy: "Vous",
  },
  {
    id: "2",
    name: "Thieboudienne",
    description: "Riz au poisson sénégalais avec légumes et sauce tomate",
    price: 16.00,
    status: "published" as const,
    category: "repas" as const,
    likes: 38,
    views: 189,
    sales: 52,
    createdAt: "Il y a 1 semaine",
    createdBy: "Marie Dupont",
  },
  {
    id: "3",
    name: "Mafé",
    description: "Ragoût de bœuf à la sauce d'arachide",
    price: 15.00,
    status: "draft" as const,
    category: "repas" as const,
    likes: 0,
    views: 12,
    sales: 0,
    createdAt: "Aujourd'hui",
    createdBy: "Vous",
  },
  {
    id: "4",
    name: "Attiéké Poisson",
    description: "Semoule de manioc avec poisson braisé",
    price: 13.50,
    status: "removed" as const,
    category: "repas" as const,
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
      { name: "Poulet Yassa", quantity: 2, price: 29.00 },
      { name: "Thieboudienne", quantity: 1, price: 16.00 },
    ],
    total: 45.00,
    status: "pending" as const,
    createdAt: "Il y a 15 min",
  },
  {
    id: "ord-002",
    customer: { name: "Pierre Moreau" },
    products: [
      { name: "Mafé", quantity: 1, price: 15.00 },
    ],
    total: 15.00,
    status: "pending" as const,
    createdAt: "Il y a 30 min",
  },
  {
    id: "ord-003",
    customer: { name: "Claire Bernard" },
    products: [
      { name: "Thieboudienne", quantity: 2, price: 32.00 },
    ],
    total: 32.00,
    status: "accepted" as const,
    createdAt: "Il y a 1 heure",
  },
  {
    id: "ord-004",
    customer: { name: "Marc Petit" },
    products: [
      { name: "Poulet Yassa", quantity: 1, price: 14.50 },
    ],
    total: 14.50,
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
    { id: "1", name: "Poulet Yassa", likes: 45 },
    { id: "2", name: "Thieboudienne", likes: 38 },
    { id: "4", name: "Attiéké Poisson", likes: 22 },
  ],
};
