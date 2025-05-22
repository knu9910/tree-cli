import { create } from 'zustand';

// 상태 및 액션의 타입 정의
type TiptapPreview = {
  isPreviewOpen: boolean; // 미리보기 상태 추가

  openPreview: () => void; // 미리보기 열기 액션
  closePreview: () => void; // 미리보기 닫기 액션
};

// zustand 스토어 생성
export const usePreviewStore = create<TiptapPreview>((set) => ({
  isPreviewOpen: false, // 초기값은 false로 설정
  // 미리보기 열기/닫기 액션
  openPreview: () => set({ isPreviewOpen: true }),
  closePreview: () => set({ isPreviewOpen: false }),
}));
