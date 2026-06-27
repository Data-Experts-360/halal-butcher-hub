import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;        // unit price
  unit: string;
  quantity: number;     // number of units (lbs / items)
  preparation?: string;
}

export interface User {
  name: string;
  email: string;
  points: number;
}

interface ShopState {
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  hydrated: boolean;
  setHydrated: () => void;

  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, preparation?: string) => void;
  updateQty: (productId: string, qty: number, preparation?: string) => void;
  clearCart: () => void;

  toggleWishlist: (productId: string) => void;

  signUp: (name: string, email: string) => void;
  signIn: (email: string) => void;
  signOut: () => void;
  addPoints: (n: number) => void;
}

const keyOf = (id: string, prep?: string) => `${id}__${prep ?? ""}`;

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      user: null,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      addToCart: (item) => {
        const cart = [...get().cart];
        const idx = cart.findIndex(
          (c) => keyOf(c.productId, c.preparation) === keyOf(item.productId, item.preparation),
        );
        if (idx >= 0) cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + item.quantity };
        else cart.push(item);
        set({ cart });
      },
      removeFromCart: (productId, preparation) =>
        set({
          cart: get().cart.filter(
            (c) => keyOf(c.productId, c.preparation) !== keyOf(productId, preparation),
          ),
        }),
      updateQty: (productId, qty, preparation) =>
        set({
          cart: get().cart.map((c) =>
            keyOf(c.productId, c.preparation) === keyOf(productId, preparation)
              ? { ...c, quantity: Math.max(0.25, qty) }
              : c,
          ),
        }),
      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) => {
        const w = get().wishlist;
        set({ wishlist: w.includes(productId) ? w.filter((x) => x !== productId) : [...w, productId] });
      },

      signUp: (name, email) => set({ user: { name, email, points: 50 } }),
      signIn: (email) => {
        const existing = get().user;
        set({ user: existing ?? { name: email.split("@")[0], email, points: 50 } });
      },
      signOut: () => set({ user: null }),
      addPoints: (n) => {
        const u = get().user;
        if (u) set({ user: { ...u, points: u.points + n } });
      },
    }),
    {
      name: "pa-halal-shop",
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export const cartTotal = (cart: CartItem[]) =>
  cart.reduce((s, c) => s + c.price * c.quantity, 0);
export const cartCount = (cart: CartItem[]) =>
  cart.reduce((s, c) => s + c.quantity, 0);
