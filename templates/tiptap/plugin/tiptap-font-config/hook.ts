import { create } from 'zustand';
import { Colors, Pxs } from './constants';

type FontConfig = {
  selectedColor: Colors;
  size: Pxs;
  setPx: (px: Pxs) => void;
  setSelectedColor: (color: Colors) => void;
};

export const useFontConfigStore = create<FontConfig>((set) => ({
  selectedColor: Colors.Black,
  size: Pxs.PX_12,
  setPx: (px: Pxs) => set({ size: px }),
  setSelectedColor: (color: Colors) => set({ selectedColor: color }),
}));
