import { create } from 'zustand';
import cartItems from '../constants/cartItems';

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
}

interface ModalState {
  isOpen: boolean;
}

interface StoreState extends CartState, ModalState {
  // Cart Actions
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  // Modal Actions
  openModal: () => void;
  closeModal: () => void;
}

// 초기 상태에서 amount와 total 계산
const calculateCartTotals = (items: CartItem[]) => {
  const amount = items.reduce((sum, item) => sum + item.amount, 0);
  const total = items.reduce(
    (sum, item) => sum + item.amount * parseInt(item.price),
    0
  );
  return { amount, total };
};

export const useStore = create<StoreState>((set) => {
  const initialTotals = calculateCartTotals(cartItems);

  return {
    // 초기 상태
    cartItems,
    amount: initialTotals.amount,
    total: initialTotals.total,
    isOpen: false,

    // Cart Actions
    increase: (id: string) =>
      set((state) => {
        const updatedItems = state.cartItems.map((item) =>
          item.id === id ? { ...item, amount: item.amount + 1 } : item
        );
        const { amount, total } = calculateCartTotals(updatedItems);
        return {
          cartItems: updatedItems,
          amount,
          total,
        };
      }),

    decrease: (id: string) =>
      set((state) => {
        const updatedItems = state.cartItems
          .map((item) =>
            item.id === id ? { ...item, amount: item.amount - 1 } : item
          )
          .filter((item) => item.amount > 0);
        const { amount, total } = calculateCartTotals(updatedItems);
        return {
          cartItems: updatedItems,
          amount,
          total,
        };
      }),

    removeItem: (id: string) =>
      set((state) => {
        const updatedItems = state.cartItems.filter((item) => item.id !== id);
        const { amount, total } = calculateCartTotals(updatedItems);
        return {
          cartItems: updatedItems,
          amount,
          total,
        };
      }),

    clearCart: () =>
      set({
        cartItems: [],
        amount: 0,
        total: 0,
      }),

    calculateTotals: () =>
      set((state) => {
        const { amount, total } = calculateCartTotals(state.cartItems);
        return { amount, total };
      }),

    // Modal Actions
    openModal: () => set({ isOpen: true }),

    closeModal: () => set({ isOpen: false }),
  };
});

