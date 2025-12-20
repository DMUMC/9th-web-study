import { create, type StateCreator } from 'zustand'
import cartItemsData, { type CartItem } from '../constants/cartItems'

type CartState = {
  cartItems: CartItem[]
  amount: number
  total: number
  isModalOpen: boolean
  clearCart: () => void
  removeItem: (id: string) => void
  increase: (id: string) => void
  decrease: (id: string) => void
  calculateTotals: () => void
  openModal: () => void
  closeModal: () => void
}

const creator: StateCreator<CartState> = (set, get) => ({
  cartItems: cartItemsData,
  amount: 0,
  total: 0,
  isModalOpen: false,
  clearCart: () => set({ cartItems: [], amount: 0, total: 0 }),
  removeItem: (id: string) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),
  increase: (id: string) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) => (item.id === id ? { ...item, amount: item.amount + 1 } : item)),
    })),
  decrease: (id: string) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((item) => (item.id === id ? { ...item, amount: item.amount - 1 } : item))
        .filter((item) => item.amount > 0),
    })),
  calculateTotals: () => {
    const { cartItems } = get()
    const { amount, total } = cartItems.reduce(
      (acc: { amount: number; total: number }, item: CartItem) => {
        acc.amount += item.amount
        acc.total += item.amount * item.price
        return acc
      },
      { amount: 0, total: 0 },
    )
    set({ amount, total })
  },
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
})

export const useCartStore = create<CartState>(creator)
