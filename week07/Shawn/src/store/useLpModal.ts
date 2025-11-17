import { create } from 'zustand'

interface LpModalState {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

const useLpModal = create<LpModalState>() (set => ({
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set({ isOpen })
}))

export default useLpModal