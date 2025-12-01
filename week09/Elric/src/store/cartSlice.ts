import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import cartItems, { type CartItem } from '../constants/cartItems'

export type CartState = {
  cartItems: CartItem[]
  amount: number
  total: number
}

const initialState: CartState = {
  cartItems,
  amount: 0,
  total: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = []
      state.amount = 0
      state.total = 0
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload)
    },
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload)
      if (!item) return
      item.amount += 1
    },
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload)
      if (!item) return
      item.amount -= 1
      if (item.amount < 1) {
        state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== action.payload)
      }
    },
    calculateTotals: (state) => {
      const { total, amount } = state.cartItems.reduce(
        (acc, item) => {
          acc.amount += item.amount
          acc.total += item.amount * item.price
          return acc
        },
        { total: 0, amount: 0 },
      )

      state.amount = amount
      state.total = total
    },
  },
})

export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions
export default cartSlice.reducer
