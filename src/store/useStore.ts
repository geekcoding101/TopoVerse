import { create } from 'zustand';

export type ShapeType = 'fractal' | 'mobius' | 'penrose' | 'cardioid';

interface AppState {
    currentShape: ShapeType;
    nextShape: ShapeType | null; // For transition
    isAutoPlay: boolean;
    showUI: boolean;

    // Actions
    setShape: (shape: ShapeType) => void;
    toggleAutoPlay: () => void;
    toggleUI: () => void;
}

export const useStore = create<AppState>((set) => ({
    currentShape: 'fractal',
    nextShape: null,
    isAutoPlay: false,
    showUI: true,

    setShape: (shape) => set({ currentShape: shape }),
    toggleAutoPlay: () => set((state) => ({ isAutoPlay: !state.isAutoPlay })),
    toggleUI: () => set((state) => ({ showUI: !state.showUI })),
}));
