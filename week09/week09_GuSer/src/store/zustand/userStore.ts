import { create } from 'zustand';
import type { User } from '../../apis/auth';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (user: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (updatedUser) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUser } : null,
    })),
}));

