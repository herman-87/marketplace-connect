import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter 
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, Store, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface CartSheetProps {
  trigger?: React.ReactNode;
}

export function CartSheet({ trigger }: CartSheetProps) {
  const { 
    subCarts, 
    totalItems, 
    totalPrice, 
    updateQuantity, 
    removeFromCart,
    clearSubCart 
  } = useCart();

  const defaultTrigger = (
    <Button variant="outline" size="icon" className="relative">
      <ShoppingCart className="w-5 h-5" />
      {totalItems > 0 && (
        <Badge 
          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Mon Panier
            {totalItems > 0 && (
              <Badge variant="secondary">{totalItems} articles</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {subCarts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Panier vide</h3>
            <p className="text-sm text-muted-foreground">
              Ajoutez des produits pour commencer vos achats
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-6 py-4">
                {subCarts.map((subCart, index) => (
                  <div key={subCart.businessId}>
                    {/* Sub-cart header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Store className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{subCart.businessName}</h4>
                          <p className="text-xs text-muted-foreground">
                            {subCart.items.length} article{subCart.items.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => clearSubCart(subCart.businessId)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Vider
                      </Button>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      {subCart.items.map((item) => (
                        <div 
                          key={`${item.businessId}-${item.id}`}
                          className="flex gap-3 p-2 rounded-lg bg-muted/30"
                        >
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm truncate">{item.name}</h5>
                            <p className="text-primary font-semibold text-sm mt-1">
                              {item.price.toFixed(2)} €
                            </p>
                            
                            {/* Quantity controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.businessId, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium w-6 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.businessId, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 ml-auto text-muted-foreground hover:text-destructive"
                                onClick={() => removeFromCart(item.id, item.businessId)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sub-cart total and pay button */}
                    <div className="mt-4 p-3 rounded-lg bg-card border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">
                          Sous-total {subCart.businessName}
                        </span>
                        <span className="font-bold text-foreground">
                          {subCart.total.toFixed(2)} €
                        </span>
                      </div>
                      <Button className="w-full gap-2" size="sm">
                        <CreditCard className="w-4 h-4" />
                        Payer {subCart.total.toFixed(2)} €
                      </Button>
                    </div>

                    {index < subCarts.length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {subCarts.length > 1 && (
              <SheetFooter className="border-t pt-4">
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total général</span>
                    <span className="text-xl font-bold text-foreground">
                      {totalPrice.toFixed(2)} €
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Vous devez payer séparément pour chaque boutique
                  </p>
                </div>
              </SheetFooter>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
