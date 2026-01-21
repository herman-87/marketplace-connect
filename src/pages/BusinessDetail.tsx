import { AppLayout } from "@/components/layout/AppLayout";
import { BusinessHeader } from "@/components/business/BusinessHeader";
import { CollaboratorsList } from "@/components/business/CollaboratorsList";
import { ProductsFeed } from "@/components/business/ProductsFeed";
import { ClientsList } from "@/components/business/ClientsList";
import { BusinessOrders } from "@/components/business/BusinessOrders";
import { EngagementPanel } from "@/components/business/EngagementPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingCart, Users, Heart } from "lucide-react";

// Mock data
const mockBusiness = {
  id: "1",
  name: "Saveurs d'Afrique",
  description: "Restaurant spécialisé dans la cuisine africaine authentique. Plats préparés avec des ingrédients frais et des recettes traditionnelles transmises de génération en génération.",
  category: "repas" as const,
  isOwner: true,
  stats: {
    products: 24,
    sales: 156,
    followers: 89,
    rating: 4.8,
  },
};

const mockCollaborators = [
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

const mockProducts = [
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

const mockClients = [
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

const mockOrders = [
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

const mockEngagement = {
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

export default function BusinessDetail() {
  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Business Header */}
        <BusinessHeader business={mockBusiness} />

        {/* Main Content with Tabs */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="w-full max-w-full sm:max-w-lg border border-border h-auto flex-wrap p-1 gap-1">
            <TabsTrigger value="products" className="flex-1 gap-1.5 text-xs sm:text-sm px-2 sm:px-3 h-8">
              <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Produits</span>
              <span className="sm:hidden">Prod.</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex-1 gap-1.5 text-xs sm:text-sm px-2 sm:px-3 h-8">
              <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Commandes</span>
              <span className="sm:hidden">Cmd.</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex-1 gap-1.5 text-xs sm:text-sm px-2 sm:px-3 h-8">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Équipe</span>
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex-1 gap-1.5 text-xs sm:text-sm px-2 sm:px-3 h-8">
              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Engagement</span>
              <span className="sm:hidden">Eng.</span>
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-4 md:mt-6">
            <ProductsFeed products={mockProducts} isOwner={mockBusiness.isOwner} />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-4 md:mt-6">
            <BusinessOrders orders={mockOrders} />
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="mt-4 md:mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <CollaboratorsList 
                collaborators={mockCollaborators} 
                isOwner={mockBusiness.isOwner} 
              />
              <ClientsList clients={mockClients} />
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="mt-4 md:mt-6">
            <div className="max-w-2xl">
              <EngagementPanel stats={mockEngagement} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
