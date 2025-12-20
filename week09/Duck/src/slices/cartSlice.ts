import cartItems from "../constants/cartItems";
import type { CartItems } from "./../types/cart";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
}

const initialState: CartState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
};

// cartSlice 생성
// createSlice -> reduxTollkit

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // TODO : 증가
    increase: (state, action: PayloadAction<{ id: string }>): void => {
      const itemId = action.payload.id;
      const item = state.cartItems.find((cartItem) => cartItem.id === itemId);

      if (item) {
        item.amount += 1;
      }
    },

    // TODO : 감소
    decrease: (state, action: PayloadAction<{ id: string }>): void => {
      const itemId = action.payload.id;
      const item = state.cartItems.find((cartItem) => cartItem.id === itemId);

      if (item) {
        item.amount -= 1;
      }
    },

    // TODO : removeItem 아이템 제거
    removeItem: (state, action: PayloadAction<{ id: string }>): void => {
      const itemId = action.payload.id;
      state.cartItems = state.cartItems.filter(
        (cartItem): boolean => cartItem.id !== itemId
      );
    },

    // TODO : cleearCart 장바구니 비우기
    clearCart: (state): void => {
      state.cartItems = [];
    },

    // TODO : 총액 계산
    calculateTotals: (state): void => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item): void => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;

// duck pattern reducer는 export default로 내보내야함
const cartReducer = cartSlice.reducer;

export default cartReducer;
