import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  quantity: number;
  preparation?: string;
}

export interface User {
  name: string;
  email: string;
  points: number;
}

export interface OrderItem {
  name: string;
  qty: number;
  unit: string;
  price: number;
  prep?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  pointsEarned: number;
  pickup: string;
  items: OrderItem[];
  status: "pending" | "ready" | "handed_over" | "completed" | "cancelled";
  createdAt: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  group: "meat" | "grocery";
  subcategory: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  stock: number;
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

  adminAuthed: boolean;
  adminSignIn: (email: string, password: string) => boolean;
  adminSignOut: () => void;

  orders: Order[];
  addOrder: (o: Order) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;

  adminProducts: AdminProduct[];
  addProduct: (p: AdminProduct) => void;
  updateProduct: (id: string, patch: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;

  activeDelivery: ActiveDelivery | null;
  setActiveDelivery: (d: ActiveDelivery | null) => void;
}

export interface ActiveDelivery {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  fee: number;
  total: number;
  address: string;
  customerName: string;
  createdAt: number;
}

const keyOf = (id: string, prep?: string) => `${id}__${prep ?? ""}`;

export const ADMIN_EMAIL = "admin@pahalal.com";
export const ADMIN_PASSWORD = "admin123";

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

      adminAuthed: false,
      adminSignIn: (email, password) => {
        if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({ adminAuthed: true });
          return true;
        }
        return false;
      },
      adminSignOut: () => set({ adminAuthed: false }),

      orders: [],
      addOrder: (o) => set({ orders: [o, ...get().orders] }),
      updateOrderStatus: (id, status) =>
        set({ orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)) }),

      adminProducts: [],
      addProduct: (p) => set({ adminProducts: [p, ...get().adminProducts] }),
      updateProduct: (id, patch) =>
        set({
          adminProducts: get().adminProducts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }),
      deleteProduct: (id) =>
        set({ adminProducts: get().adminProducts.filter((p) => p.id !== id) }),

      activeDelivery: null,
      setActiveDelivery: (d) => set({ activeDelivery: d }),
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
