import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import MesBusiness from "./pages/MesBusiness";
import BusinessDetail from "./pages/BusinessDetail";
import Collaborations from "./pages/Collaborations";
import Marketplace from "./pages/Marketplace";
import Commandes from "./pages/Commandes";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mes-business" element={<MesBusiness />} />
            <Route path="/business/:id" element={<BusinessDetail />} />
            <Route path="/collaborations" element={<Collaborations />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/commandes" element={<Commandes />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
