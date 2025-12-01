import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
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

// 초기 상태에서 amount와 total 계산
const calculateCartTotals = (items: CartItem[]) => {
  const amount = items.reduce((sum, item) => sum + item.amount, 0);
  const total = items.reduce(
    (sum, item) => sum + item.amount * parseInt(item.price),
    0
  );
  return { amount, total };
};

const initialState: CartState = {
  cartItems,
  ...calculateCartTotals(cartItems),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 수량 증가
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount += 1;
      }
      const { amount, total } = calculateCartTotals(state.cartItems);
      state.amount = amount;
      state.total = total;
    },
    // 수량 감소
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount -= 1;
        // 수량이 0 이하가 되면 아이템 제거
        if (item.amount <= 0) {
          state.cartItems = state.cartItems.filter(
            (item) => item.id !== action.payload
          );
        }
      }
      const { amount, total } = calculateCartTotals(state.cartItems);
      state.amount = amount;
      state.total = total;
    },
    // 아이템 제거
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      const { amount, total } = calculateCartTotals(state.cartItems);
      state.amount = amount;
      state.total = total;
    },
    // 전체 삭제
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    // 전체 합계 계산
    calculateTotals: (state) => {
      const { amount, total } = calculateCartTotals(state.cartItems);
      state.amount = amount;
      state.total = total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;
export default cartSlice.reducer;

