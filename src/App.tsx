import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import MesBusiness from "./pages/MesBusiness";
import BusinessDetail from "./pages/BusinessDetail";
import BusinessSettings from "./pages/BusinessSettings";
import Collaborations from "./pages/Collaborations";
import Marketplace from "./pages/Marketplace";
import Commandes from "./pages/Commandes";
import ProductDetail from "./pages/ProductDetail";
import MarketplacePromotions from "./pages/MarketplacePromotions";
import MarketplaceTrending from "./pages/MarketplaceTrending";
import MarketplaceShops from "./pages/MarketplaceShops";
import MarketplaceDeals from "./pages/MarketplaceDeals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Index />} />
                  <Route path="/mes-business" element={<MesBusiness />} />
                  <Route path="/business/:id" element={<BusinessDetail />} />
                  <Route path="/business/:id/settings" element={<BusinessSettings />} />
                  <Route path="/collaborations" element={<Collaborations />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/marketplace/promotions" element={<MarketplacePromotions />} />
                  <Route path="/marketplace/trending" element={<MarketplaceTrending />} />
                  <Route path="/marketplace/shops" element={<MarketplaceShops />} />
                  <Route path="/marketplace/deals" element={<MarketplaceDeals />} />
                  <Route path="/commandes" element={<Commandes />} />
                  <Route path="/product/:productId" element={<ProductDetail />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
