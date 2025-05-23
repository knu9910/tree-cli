import { create } from 'zustand';

type TiptapContentStore = {
  contents: { [key: string]: string };
  tempContents: { [key: string]: string };
  setContent: (key: string, content: string) => void;
  getContent: (key: string) => string;
  saveTempContent: (key: string, content: string) => void;
  getLocalContent: (key: string) => void;
  removeContent: (key: string) => void;
};

export const useContentStore = create<TiptapContentStore>((set, get) => ({
  contents: {},
  tempContents: {},
  setContent: (key, content) =>
    set((state) => ({
      contents: { ...state.contents, [key]: content },
    })),
  getContent: (key) => get().contents[key] || '',
  saveTempContent: (key, content) => {
    set((state) => ({
      tempContents: { ...state.tempContents, [key]: content },
    }));
    localStorage.setItem(`${key}content`, content);
    alert('임시 저장되었습니다.');
  },
  getLocalContent: (key) => {
    const localTempContent = localStorage.getItem(`${key}content`);
    if (localTempContent) {
      set((state) => ({
        tempContents: { ...state.tempContents, [key]: localTempContent },
      }));
    }
  },
  removeContent: (key) =>
    set((state) => {
      const newContents = { ...state.contents };
      delete newContents[key];
      const newTempContents = { ...state.tempContents };
      delete newTempContents[key];
      return { contents: newContents, tempContents: newTempContents };
    }),
}));
