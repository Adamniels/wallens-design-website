"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem, CartState, CartAction } from "@/lib/cartTypes";

// Versioned key so stale cart shapes from old code don't cause parse errors
const STORAGE_KEY = "wallens_cart_v1";

const initialState: CartState = {
  items: [],
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items };

    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.id === action.item.id
              ? { ...i, quantity: Math.min(i.quantity + 1, i.maxQuantity) }
              : i
          ),
        };
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { ...action.item, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.id),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id
            ? {
                ...i,
                quantity: Math.min(
                  Math.max(1, action.quantity),
                  i.maxQuantity
                ),
              }
            : i
        ),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "OPEN_DRAWER":
      return { ...state, isOpen: true };

    case "CLOSE_DRAWER":
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

export type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  /** Total number of individual units across all line items */
  itemCount: number;
  /** Sum of price * quantity for all items */
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage once on the first client render.
  // The initialState starts empty so there is no SSR/hydration mismatch.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: "HYDRATE", items: parsed });
        }
      }
    } catch {
      // Corrupted storage — silently discard and start fresh
    }
  }, []);

  // Persist cart items to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = state.isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state.isOpen]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">) =>
      dispatch({ type: "ADD_ITEM", item }),
    []
  );
  const removeItem = useCallback(
    (id: string) => dispatch({ type: "REMOVE_ITEM", id }),
    []
  );
  const updateQuantity = useCallback(
    (id: string, quantity: number) =>
      dispatch({ type: "UPDATE_QUANTITY", id, quantity }),
    []
  );
  const clearCart = useCallback(
    () => dispatch({ type: "CLEAR_CART" }),
    []
  );
  const openDrawer = useCallback(
    () => dispatch({ type: "OPEN_DRAWER" }),
    []
  );
  const closeDrawer = useCallback(
    () => dispatch({ type: "CLOSE_DRAWER" }),
    []
  );

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openDrawer,
        closeDrawer,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be called inside a <CartProvider>");
  }
  return ctx;
}
