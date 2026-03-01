// context/CartContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

/**
 * CartItem — aligned with database types.
 * Uses string IDs (UUID), stores selected options as a record,
 * and keeps product slug for linking back to the detail page.
 */
export interface CartItem {
  /** Unique cart line ID (generated client-side, not the product ID) */
  cartLineId: string;
  /** Product UUID from Supabase */
  productId: string;
  /** Product slug for URL routing */
  productSlug: string;
  /** Product name (snapshot) */
  name: string;
  /** Unit price in ETB after option selection */
  unitPrice: number;
  /** Primary image URL */
  image: string;
  /** Category name */
  category: string;
  /** Quantity ordered */
  quantity: number;
  /** Selected option values: { size: "a4", lamination: "matte", ... } */
  selectedOptions: Record<string, string>;
  /** Design file URL (if uploaded) */
  designFileUrl?: string;
  /** Design file name */
  designFileName?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "cartLineId">) => void;
  removeFromCart: (cartLineId: string) => void;
  updateQuantity: (cartLineId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const STORAGE_KEY = "printonline-cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Generate a unique cart line ID.
 * Two items with the same product but different options get different line IDs.
 */
function generateCartLineId(
  productId: string,
  selectedOptions: Record<string, string> = {},
): string {
  const options = selectedOptions || {};
  const optionStr = Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
  return `${productId}__${optionStr}`;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error);
        }
      }
    }
    return [];
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  }, [cart]);

  const addToCart = useCallback((item: Omit<CartItem, "cartLineId">) => {
    setCart((prevCart) => {
      const cartLineId = generateCartLineId(
        item.productId,
        item.selectedOptions,
      );

      // Check if same product + same options already in cart
      const existingIndex = prevCart.findIndex(
        (cartItem) => cartItem.cartLineId === cartLineId,
      );

      if (existingIndex !== -1) {
        // Update quantity of existing line
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + item.quantity,
        };
        return updatedCart;
      } else {
        // Add new line
        return [...prevCart, { ...item, cartLineId }];
      }
    });
  }, []);

  const removeFromCart = useCallback((cartLineId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.cartLineId !== cartLineId),
    );
  }, []);

  const updateQuantity = useCallback((cartLineId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prevCart) =>
        prevCart.filter((item) => item.cartLineId !== cartLineId),
      );
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartLineId === cartLineId ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0,
    );
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
