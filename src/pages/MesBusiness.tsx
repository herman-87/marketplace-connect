import { AppLayout } from "@/components/layout/AppLayout";
import { BusinessCard } from "@/components/dashboard/BusinessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mockBusinesses = [
  {
    name: "RestauFast",
    description: "Restaurant rapide et livraison de plats préparés frais. Cuisine maison de qualité livrée rapidement.",
    productsCount: 24,
    collaboratorsCount: 3,
    status: "active" as const,
    isOwner: true,
  },
  {
    name: "TechStore",
    description: "Boutique d'accessoires tech et gadgets innovants. Les dernières tendances technologiques.",
    productsCount: 56,
    collaboratorsCount: 1,
    status: "active" as const,
    isOwner: true,
  },
];

export default function MesBusiness() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const remainingSlots = 3 - mockBusinesses.length;

  return (
    <AppLayout
      title="Mes Business"
      subtitle="Gérez vos boutiques et leurs produits"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un business..."
                className="pl-9 w-full sm:w-72"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-border p-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  viewMode === "grid" && "bg-muted"
                )}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  viewMode === "list" && "bg-muted"
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button className="gradient-primary border-0 gap-2" disabled={remainingSlots === 0}>
              <Plus className="h-4 w-4" />
              Nouveau Business
            </Button>
          </div>
        </div>

        {/* Slots Info */}
        <div className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">
              {mockBusinesses.length}/3 business créés
            </p>
            <p className="text-sm text-muted-foreground">
              {remainingSlots > 0
                ? `Vous pouvez encore créer ${remainingSlots} business`
                : "Vous avez atteint la limite de business"}
            </p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((slot) => (
              <div
                key={slot}
                className={cn(
                  "w-8 h-8 rounded-lg border-2 flex items-center justify-center",
                  slot <= mockBusinesses.length
                    ? "border-primary bg-primary/10"
                    : "border-dashed border-muted-foreground/30"
                )}
              >
                {slot <= mockBusinesses.length && (
                  <div className="w-3 h-3 rounded-full gradient-primary" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Business Grid */}
        <div
          className={cn(
            "grid gap-4",
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {mockBusinesses.map((business) => (
            <BusinessCard key={business.name} {...business} />
          ))}

          {/* Add New Business Card */}
          {remainingSlots > 0 && (
            <button className="group min-h-[200px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground">
              <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-medium">Créer un nouveau business</p>
                <p className="text-sm">{remainingSlots} emplacement{remainingSlots > 1 ? "s" : ""} disponible{remainingSlots > 1 ? "s" : ""}</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
