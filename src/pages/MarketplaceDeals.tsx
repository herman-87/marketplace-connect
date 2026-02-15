import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Search, Sparkles, Tag, Truck, Gift, CreditCard, LayoutGrid, List, Copy, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PaginationControls } from "@/components/marketplace/PaginationControls";
import { toast } from "sonner";

const allDeals = [
  { id: "1", title: "Livraison offerte", description: "Sur votre première commande", code: "BIENVENUE", icon: Truck, validUntil: "31 Jan", category: "Livraison" },
  { id: "2", title: "-15% sur la mode", description: "Toute la catégorie Mode", code: "MODE15", icon: Tag, validUntil: "15 Fév", category: "Mode" },
  { id: "3", title: "2 achetés = 1 offert", description: "Sur les accessoires", code: "ACC3FOR2", icon: Gift, validUntil: "28 Jan", category: "Accessoires" },
  { id: "4", title: "Cashback 10%", description: "Sur les achats High-Tech", code: "TECHBACK", icon: CreditCard, validUntil: "10 Fév", category: "High-Tech" },
  { id: "5", title: "-20% premier achat", description: "Sur tout le catalogue", code: "WELCOME20", icon: Tag, validUntil: "28 Fév", category: "Général" },
  { id: "6", title: "Livraison express offerte", description: "Dès 30€ d'achat", code: "EXPRESS30", icon: Truck, validUntil: "20 Fév", category: "Livraison" },
  { id: "7", title: "3 pour le prix de 2", description: "Sur les t-shirts", code: "TSHIRT3", icon: Gift, validUntil: "14 Fév", category: "Mode" },
  { id: "8", title: "-25% High-Tech", description: "Accessoires et gadgets", code: "TECH25", icon: Tag, validUntil: "5 Mar", category: "High-Tech" },
  { id: "9", title: "Cashback 15%", description: "Sur la mode femme", code: "FEMME15", icon: CreditCard, validUntil: "8 Mar", category: "Mode" },
  { id: "10", title: "Livraison 1€", description: "Sur toutes les commandes", code: "LIVR1", icon: Truck, validUntil: "1 Mar", category: "Livraison" },
  { id: "11", title: "-10% sport", description: "Équipements et vêtements", code: "SPORT10", icon: Tag, validUntil: "15 Mar", category: "Accessoires" },
  { id: "12", title: "Parrainage 5€", description: "Pour vous et votre filleul", code: "PARRAIN5", icon: Gift, validUntil: "31 Mar", category: "Général" },
  { id: "13", title: "-30% soldes mode", description: "Dernière démarque", code: "SOLDES30", icon: Tag, validUntil: "10 Fév", category: "Mode" },
];

const categories = ["Tous", "Livraison", "Mode", "Accessoires", "High-Tech", "Général"];
const ITEMS_PER_PAGE = 12;

export default function MarketplaceDeals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filtered = allDeals.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "Tous" || d.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code ${code} copié !`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Link to="/marketplace"><Button variant="ghost" size="icon" className="shrink-0"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10"><Sparkles className="w-5 h-5 text-primary" /></div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Bons Plans</h1>
              <p className="text-sm text-muted-foreground">{filtered.length} code{filtered.length > 1 ? "s" : ""} promo disponible{filtered.length > 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un bon plan..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-10" />
          </div>
          <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>{categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {paginated.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">Aucun bon plan trouvé</h3>
            <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {paginated.map((deal) => {
              const Icon = deal.icon;
              return (
                <Card key={deal.id} className="group p-4 bg-card border border-border hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10"><Icon className="w-5 h-5 text-primary" /></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{deal.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{deal.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Code promo</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge variant="outline" className="font-mono text-xs bg-muted border-dashed">{deal.code}</Badge>
                        <button onClick={() => copyCode(deal.code)} className="text-muted-foreground hover:text-primary transition-colors">
                          {copiedCode === deal.code ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">Valide jusqu'au</p>
                      <p className="text-xs font-medium text-foreground">{deal.validUntil}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </MarketplaceLayout>
  );
}
