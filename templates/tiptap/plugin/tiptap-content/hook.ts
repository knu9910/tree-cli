import { create } from 'zustand';
import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

type TiptapContentStore = {
  contents: { [key: string]: string };
  tempContents: { [key: string]: string };
  // 내부 액션들
  _setContent: (key: string, content: string) => void;
  _saveTempContent: (key: string, content: string) => void;
  _getLocalContent: (key: string) => void;
  _removeContent: (key: string) => void;
};

// 디바운스 유틸리티
const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 스토어 생성
const useContentStoreBase = create<TiptapContentStore>((set, get) => ({
  contents: {},
  tempContents: {},
  _setContent: (key, content) =>
    set((state) => ({
      contents: { ...state.contents, [key]: content },
    })),
  _saveTempContent: (key, content) => {
    set((state) => ({
      tempContents: { ...state.tempContents, [key]: content },
    }));
    localStorage.setItem(`${key}content`, content);
  },
  _getLocalContent: (key) => {
    const localTempContent = localStorage.getItem(`${key}content`);
    if (localTempContent) {
      set((state) => ({
        tempContents: { ...state.tempContents, [key]: localTempContent },
      }));
    }
  },
  _removeContent: (key) =>
    set((state) => {
      const newContents = { ...state.contents };
      delete newContents[key];
      const newTempContents = { ...state.tempContents };
      delete newTempContents[key];
      localStorage.removeItem(`${key}content`);
      return { contents: newContents, tempContents: newTempContents };
    }),
}));

// 디바운스된 액션들을 위한 Map
const debouncedActions = new Map<string, ReturnType<typeof debounce>>();

// 메인 훅
export const useContentStore = () => {
  // 디바운스된 setContent 생성
  const createDebouncedSetContent = useCallback((key: string) => {
    if (!debouncedActions.has(`setContent_${key}`)) {
      const debouncedFn = debounce((content: string) => {
        useContentStoreBase.getState()._setContent(key, content);
      }, 300); // 300ms 디바운스
      debouncedActions.set(`setContent_${key}`, debouncedFn);
    }
    return debouncedActions.get(`setContent_${key}`)!;
  }, []);

  // 디바운스된 saveTempContent 생성
  const createDebouncedSaveTempContent = useCallback((key: string) => {
    if (!debouncedActions.has(`saveTempContent_${key}`)) {
      const debouncedFn = debounce((content: string) => {
        useContentStoreBase.getState()._saveTempContent(key, content);
        alert('임시 저장되었습니다.');
      }, 1000); // 1초 디바운스
      debouncedActions.set(`saveTempContent_${key}`, debouncedFn);
    }
    return debouncedActions.get(`saveTempContent_${key}`)!;
  }, []);

  const actions = useMemo(
    () => ({
      setContent: (key: string, content: string) => {
        const debouncedFn = createDebouncedSetContent(key);
        debouncedFn(content);
      },
      getContent: (key: string) => useContentStoreBase.getState().contents[key] || '',
      saveTempContent: (key: string, content: string) => {
        const debouncedFn = createDebouncedSaveTempContent(key);
        debouncedFn(content);
      },
      getLocalContent: (key: string) => {
        useContentStoreBase.getState()._getLocalContent(key);
      },
      removeContent: (key: string) => {
        // 디바운스된 액션들도 정리
        debouncedActions.delete(`setContent_${key}`);
        debouncedActions.delete(`saveTempContent_${key}`);
        useContentStoreBase.getState()._removeContent(key);
      },
    }),
    [createDebouncedSetContent, createDebouncedSaveTempContent]
  );

  return actions;
};

// 특정 키의 컨텐츠만 구독하는 훅 (수동 최적화)
export const useContentStoreSelector = (key: string) => {
  const [content, setContent] = useState('');
  const [tempContent, setTempContent] = useState('');
  const previousContentRef = useRef<string>('');
  const previousTempContentRef = useRef<string>('');

  useEffect(() => {
    const unsubscribe = useContentStoreBase.subscribe((state) => {
      const currentContent = state.contents[key] || '';
      const currentTempContent = state.tempContents[key] || '';

      // 해당 키의 내용만 변경되었을 때만 업데이트
      if (currentContent !== previousContentRef.current) {
        setContent(currentContent);
        previousContentRef.current = currentContent;
      }

      if (currentTempContent !== previousTempContentRef.current) {
        setTempContent(currentTempContent);
        previousTempContentRef.current = currentTempContent;
      }
    });

    // 초기값 설정
    const initialState = useContentStoreBase.getState();
    const initialContent = initialState.contents[key] || '';
    const initialTempContent = initialState.tempContents[key] || '';

    setContent(initialContent);
    setTempContent(initialTempContent);
    previousContentRef.current = initialContent;
    previousTempContentRef.current = initialTempContent;

    return unsubscribe;
  }, [key]);

  return { content, tempContent };
};

// 전체 컨텐츠 목록이 필요한 경우
export const useAllContents = () => {
  return useContentStoreBase((state) => state.contents);
};
