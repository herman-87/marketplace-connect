import { AppLayout } from "@/components/layout/AppLayout";
import { BusinessCard } from "@/components/dashboard/BusinessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CreateBusinessSheet } from "@/components/business/CreateBusinessSheet";

const mockBusinesses = [
  {
    id: "1",
    name: "Urban Style Shop",
    description: "Boutique de vêtements et accessoires tendance. Articles de qualité pour un style urbain unique.",
    productsCount: 24,
    collaboratorsCount: 3,
    status: "active" as const,
    isOwner: true,
  },
  {
    id: "2",
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
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-9 w-full sm:w-64"
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <div className="flex items-center rounded-lg border border-border p-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 md:h-8 md:w-8",
                  viewMode === "grid" && "bg-muted"
                )}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 md:h-8 md:w-8",
                  viewMode === "list" && "bg-muted"
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </div>
            <CreateBusinessSheet
              trigger={
                <Button className="gradient-primary border-0 gap-1.5 text-xs md:text-sm h-8 md:h-9" disabled={remainingSlots === 0}>
                  <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Nouveau Business</span>
                  <span className="sm:hidden">Nouveau</span>
                </Button>
              }
            />
          </div>
        </div>

        {/* Slots Info */}
        <div className="bg-card rounded-xl border border-border p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="font-medium text-sm md:text-base text-foreground">
              {mockBusinesses.length}/3 business créés
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
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
                  "w-7 h-7 md:w-8 md:h-8 rounded-lg border-2 flex items-center justify-center",
                  slot <= mockBusinesses.length
                    ? "border-primary bg-primary/10"
                    : "border-dashed border-muted-foreground/30"
                )}
              >
                {slot <= mockBusinesses.length && (
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full gradient-primary" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Business Grid */}
        <div
          className={cn(
            "grid gap-3 md:gap-4",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {mockBusinesses.map((business) => (
            <BusinessCard key={business.id} {...business} />
          ))}

          {/* Add New Business Card */}
          {remainingSlots > 0 && (
            <CreateBusinessSheet
              trigger={
                <button className="group min-h-[180px] md:min-h-[200px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm md:text-base">Créer un nouveau business</p>
                    <p className="text-xs md:text-sm">{remainingSlots} emplacement{remainingSlots > 1 ? "s" : ""} disponible{remainingSlots > 1 ? "s" : ""}</p>
                  </div>
                </button>
              }
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
