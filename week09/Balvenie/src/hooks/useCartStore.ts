import type { CartItems } from "../types/cart";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import cartItems from "../constants/cartItems";

interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>()(
  immer((set) => ({
    cartItems: cartItems,
    amount: 0,
    total: 0,
    increase: (id: string): void => {
      set((state) => {
        const cartItem = state.cartItems.find((item) => item.id === id);
        if (cartItem) {
          cartItem.amount += 1;
        }
      });
    },
    decrease: (id: string): void => {
      set((state) => {
        const cartItem = state.cartItems.find((item) => item.id === id);
        if (cartItem && cartItem.amount > 0) {
          cartItem.amount -= 1;
        }
      });
    },
    removeItem: (id: string): void => {
      set((state) => {
        state.cartItems = state.cartItems.filter(
          (item): boolean => item.id !== id
        );
      });
    },
    clearCart: (): void => {
      set((state) => {
        state.cartItems = [];
      });
    },
    calculateTotals: (): void => {
      set((state) => {
        state.amount = state.cartItems.reduce(
          (acc, item) => acc + item.amount,
          0
        );
        state.total = state.cartItems.reduce(
          (acc, item) => acc + item.amount * item.price,
          0
        );
      });
    },
  }))
);

interface CartInfo {
  cartItems: CartItems;
  amount: number;
  total: number;
}

interface CartActions {
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const useCartInfo = (): CartInfo =>
  useCartStore(
    useShallow((state) => ({
      cartItems: state.cartItems,
      amount: state.amount,
      total: state.total,
    }))
  );

export const useCartActions = (): CartActions =>
  useCartStore(
    useShallow((state) => ({
      increase: state.increase,
      decrease: state.decrease,
      removeItem: state.removeItem,
      clearCart: state.clearCart,
      calculateTotals: state.calculateTotals,
    }))
  );