import { create } from 'zustand';

type TiptapVideo = {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
};

export const useVideoStore = create<TiptapVideo>((set) => ({
  videoUrl: '',
  setVideoUrl: (url: string) => set({ videoUrl: url }),
}));
