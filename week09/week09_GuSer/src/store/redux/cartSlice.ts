import { createSlice } from '@reduxjs/toolkit';

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

const initialState: CartState = {
  cartItems: [],
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setInitialItems: (state, action: { payload: CartItem[] }) => {
      state.cartItems = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },
    increase: (state, action: { payload: string }) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount += 1;
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    decrease: (state, action: { payload: string }) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        if (item.amount > 1) {
          item.amount -= 1;
        } else {
          state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
        }
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    removeItem: (state, action: { payload: string }) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    calculateTotals: (state) => {
      state.amount = state.cartItems.reduce((total, item) => total + item.amount, 0);
      state.total = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * item.amount,
        0
      );
    },
  },
});

export const { setInitialItems, increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;
export default cartSlice.reducer;

