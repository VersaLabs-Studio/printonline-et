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
  /** Design file names */
  designFileNames?: string[];
  /** Rush production surcharge (per order, not per piece) */
  priorityPrice?: number;
  /** Design package tier ID ("starter" | "professional" | "premium") */
  designPackageId?: string;
  /** Design package human-readable name */
  designPackageName?: string;
  /** Design package price in ETB */
  designPackagePrice?: number;
  /** @deprecated — kept for backward compat with old localStorage carts */
  hireDesigner?: boolean;
  /** @deprecated — kept for backward compat with old localStorage carts */
  designerFee?: number;
}

export interface DeliveryInfo {
  subCity: string | null;
  deliveryMethod: 'home' | 'pickup';
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "cartLineId">, files?: File[]) => void;
  removeFromCart: (cartLineId: string) => void;
  updateQuantity: (cartLineId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  /** Access local File objects (not persisted) */
  localFiles: Record<string, File[]>;
  setLocalFiles: React.Dispatch<React.SetStateAction<Record<string, File[]>>>;
  /** Delivery information */
  deliveryInfo: DeliveryInfo;
  setDeliveryInfo: (info: DeliveryInfo) => void;
  /** Get delivery fee */
  getDeliveryFee: () => number;
  /** Get cart total with delivery */
  getCartTotalWithDelivery: () => number;
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

  // In-memory mapping of cart items to their local File objects
  // This does NOT persist to localStorage.
  const [localFiles, setLocalFiles] = useState<Record<string, File[]>>({});

  // Delivery information
  const [deliveryInfo, setDeliveryInfoState] = useState<DeliveryInfo>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("printonline-delivery");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return { subCity: null, deliveryMethod: 'home' };
        }
      }
    }
    return { subCity: null, deliveryMethod: 'home' };
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  }, [cart]);

  // Persist delivery info to localStorage
  useEffect(() => {
    localStorage.setItem("printonline-delivery", JSON.stringify(deliveryInfo));
  }, [deliveryInfo]);

  const addToCart = useCallback(
    (item: Omit<CartItem, "cartLineId">, files?: File[]) => {
      const cartLineId = generateCartLineId(item.productId, item.selectedOptions);

      if (files && files.length > 0) {
        setLocalFiles((prev) => ({
          ...prev,
          [cartLineId]: files,
        }));
      }

      setCart((prevCart) => {
        // Check if same product + same options already in cart
        const existingIndex = prevCart.findIndex(
          (cartItem) => cartItem.cartLineId === cartLineId,
        );

        if (existingIndex !== -1) {
          // Update quantity of existing line
          const updatedCart = [...prevCart];
          const existingItem = updatedCart[existingIndex];
          updatedCart[existingIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + item.quantity,
            // Merge file names if they exist
            designFileNames: Array.from(
              new Set([
                ...(existingItem.designFileNames || []),
                ...(item.designFileNames || []),
              ]),
            ).slice(0, 4),
          };
          return updatedCart;
        } else {
          // Add new line
          return [...prevCart, { ...item, cartLineId }];
        }
      });
    },
    [],
  );

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
      (total, item) =>
        total + item.unitPrice * item.quantity + (item.priorityPrice || 0) + (item.designPackagePrice || item.designerFee || 0),
      0,
    );
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const getDeliveryFee = useCallback(() => {
    // Import dynamically to avoid server/client issues
    if (typeof window === 'undefined') return 0;
    
    const { calculateDeliveryFee } = require('@/lib/delivery/calculator');
    const cartTotal = getCartTotal();
    const totalQuantity = getCartCount();
    
    const result = calculateDeliveryFee({
      subCity: deliveryInfo.subCity,
      cartTotal,
      totalQuantity,
      deliveryMethod: deliveryInfo.deliveryMethod,
    });
    
    return result.finalFee;
  }, [deliveryInfo, getCartTotal, getCartCount]);

  const getCartTotalWithDelivery = useCallback(() => {
    return getCartTotal() + getDeliveryFee();
  }, [getCartTotal, getDeliveryFee]);

  const setDeliveryInfo = useCallback((info: DeliveryInfo) => {
    setDeliveryInfoState(info);
  }, []);

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
        localFiles,
        setLocalFiles,
        deliveryInfo,
        setDeliveryInfo,
        getDeliveryFee,
        getCartTotalWithDelivery,
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
