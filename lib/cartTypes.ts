export type CartItem = {
  /** Stripe Price ID (Phase 3+) or temporary product ID */
  id: string;
  name: string;
  /** Display price in the full currency unit — e.g. 2500 for "2 500 kr" */
  price: number;
  /** ISO currency code, e.g. "SEK" or "EUR" */
  currency: string;
  /** Absolute image URL */
  image: string;
  quantity: number;
  /** Maximum purchasable quantity, capped at stock count */
  maxQuantity: number;
  /** Product slug for linking back to the product page */
  slug: string;
};

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

export type CartAction =
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "UPDATE_QUANTITY"; id: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" };

/**
 * Format a display price into a localised currency string.
 * e.g. formatPrice(2500, "SEK") => "2 500 kr"
 */
export function formatPrice(
  price: number,
  currency: string,
  displayLocale = "sv-SE"
): string {
  return new Intl.NumberFormat(displayLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
