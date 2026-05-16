"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/**
 * Invisible component — mounts on the success page and clears the cart once.
 * Must be a client component because it accesses cart context.
 *
 * We clear localStorage directly in addition to dispatching CLEAR_CART because
 * CartClearer's effect runs before CartProvider's hydration effect (children
 * run first in React). Without the direct localStorage wipe, CartProvider
 * would re-hydrate from the stale localStorage and restore the old cart.
 */
export default function CartClearer() {
  const { clearCart } = useCart();

  useEffect(() => {
    localStorage.removeItem("wallens_cart_v1");
    clearCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
