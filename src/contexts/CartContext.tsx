import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  businessId: string;
  businessName: string;
}

export interface SubCart {
  businessId: string;
  businessName: string;
  items: CartItem[];
  total: number;
}

interface CartContextType {
  items: CartItem[];
  subCarts: SubCart[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (itemId: string, businessId: string) => void;
  updateQuantity: (itemId: string, businessId: string, quantity: number) => void;
  clearCart: () => void;
  clearSubCart: (businessId: string) => void;
  getSubCartTotal: (businessId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Group items by business
  const subCarts: SubCart[] = React.useMemo(() => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.businessId]) {
        acc[item.businessId] = {
          businessId: item.businessId,
          businessName: item.businessName,
          items: [],
          total: 0,
        };
      }
      acc[item.businessId].items.push(item);
      acc[item.businessId].total += item.price * item.quantity;
      return acc;
    }, {} as Record<string, SubCart>);
    
    return Object.values(grouped);
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === newItem.id && item.businessId === newItem.businessId
      );

      if (existingItem) {
        toast.success(`${newItem.name} - quantité augmentée`);
        return prevItems.map((item) =>
          item.id === newItem.id && item.businessId === newItem.businessId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      toast.success(`${newItem.name} ajouté au panier`);
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string, businessId: string) => {
    setItems((prevItems) => 
      prevItems.filter(
        (item) => !(item.id === itemId && item.businessId === businessId)
      )
    );
    toast.info("Produit retiré du panier");
  }, []);

  const updateQuantity = useCallback((itemId: string, businessId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, businessId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && item.businessId === businessId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.info("Panier vidé");
  }, []);

  const clearSubCart = useCallback((businessId: string) => {
    setItems((prevItems) => 
      prevItems.filter((item) => item.businessId !== businessId)
    );
    toast.info("Panier de la boutique vidé");
  }, []);

  const getSubCartTotal = useCallback((businessId: string) => {
    return items
      .filter((item) => item.businessId === businessId)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        subCarts,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearSubCart,
        getSubCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
