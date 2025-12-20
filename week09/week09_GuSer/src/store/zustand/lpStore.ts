import { create } from 'zustand';
import type { LP } from '../../apis/lp';

interface LPState {
  lps: LP[];
  setLPs: (lps: LP[]) => void;
  addLP: (lp: LP) => void;
  updateLP: (id: number, lp: Partial<LP>) => void;
  removeLP: (id: number) => void;
}

export const useLPStore = create<LPState>((set) => ({
  lps: [],
  setLPs: (lps) => set({ lps }),
  addLP: (lp) => set((state) => ({ lps: [...state.lps, lp] })),
  updateLP: (id, updatedLP) =>
    set((state) => ({
      lps: state.lps.map((lp) => (lp.id === id ? { ...lp, ...updatedLP } : lp)),
    })),
  removeLP: (id) => set((state) => ({ lps: state.lps.filter((lp) => lp.id !== id) })),
}));

