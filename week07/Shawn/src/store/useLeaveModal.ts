import { create } from 'zustand'

interface LeaveModalState {
    isLeaveModalOpen: boolean
    setIsLeaveModalOpen: (isLeaveModalOpen: boolean) => void
}

export const useLeaveModal = create<LeaveModalState>() (set => ({
    isLeaveModalOpen: false,
    setIsLeaveModalOpen: (isLeaveModalOpen: boolean) => set({ isLeaveModalOpen })
}))