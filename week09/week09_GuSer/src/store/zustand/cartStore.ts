import { create } from 'zustand';

export interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
  setInitialItems: (items: CartItem[]) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  amount: 0,
  total: 0,
  setInitialItems: (items) => {
    set({ cartItems: items });
    get().calculateTotals();
  },
  increase: (id) => {
    set((state) => {
      const updatedItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      );
      return { cartItems: updatedItems };
    });
    get().calculateTotals();
  },
  decrease: (id) => {
    set((state) => {
      const updatedItems = state.cartItems
        .map((item) => (item.id === id ? { ...item, amount: item.amount - 1 } : item))
        .filter((item) => item.amount > 0);
      return { cartItems: updatedItems };
    });
    get().calculateTotals();
  },
  removeItem: (id) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    }));
    get().calculateTotals();
  },
  clearCart: () => {
    set({ cartItems: [], amount: 0, total: 0 });
  },
  calculateTotals: () => {
    const state = get();
    const amount = state.cartItems.reduce((total, item) => total + item.amount, 0);
    const total = state.cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.amount,
      0
    );
    set({ amount, total });
  },
}));

