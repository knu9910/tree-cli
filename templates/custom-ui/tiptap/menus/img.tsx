import { Popover, PopoverContent, PopoverTrigger } from '@/components/custom-ui/popover/popover';
import { cn } from '@/lib/utils';
import { ImagePlus, Loader2 } from 'lucide-react';
import { IconButton } from './common/icon-button';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { Editor } from '@tiptap/react';
import { useState } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & {
  editor: Editor;
  onImageUpload?: (file: File) => Promise<string>;
};

export const Img = ({ editor, onImageUpload, className }: Readonly<Props>) => {
  const [isUploading, setIsUploading] = useState(false);

  if (!editor) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onImageUpload) {
      // onImageUpload prop이 제공된 경우: 서버에 업로드
      setIsUploading(true);
      try {
        const imageUrl = await onImageUpload(file);
        // 현재 커서 위치에 새로운 이미지를 삽입하고 이미지 뒤에 빈 단락 추가
        // 이미지와 빈 단락을 함께 삽입
        editor
          .chain()
          .focus()
          .insertContent([
            {
              type: 'image',
              attrs: { src: imageUrl },
            },
            {
              type: 'paragraph',
            },
          ])
          .run();
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        // 사용자에게 에러 메시지 표시
      } finally {
        setIsUploading(false);
      }
    } else {
      // onImageUpload prop이 없는 경우: Base64로 삽입
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        // 현재 커서 위치에 새로운 이미지를 삽입하고 이미지 뒤에 빈 단락 추가
        // 이미지와 빈 단락을 함께 삽입
        editor
          .chain()
          .focus()
          .insertContent([
            {
              type: 'image',
              attrs: { src: base64Image },
            },
            {
              type: 'paragraph',
            },
          ])
          .run();
      };
      reader.readAsDataURL(file);
    }

    // 파일 입력 초기화 (같은 파일 다시 선택 가능하게)
    e.target.value = '';
  };

  return (
    <Popover>
      <PopoverTrigger className={cn('', className)}>
        <IconButtonWrapper>
          <div className="flex items-center gap-1.5 group cursor-pointer">
            <IconButton className="group-hover:text-gray-900">
              <ImagePlus />
            </IconButton>
            <span className="hidden lg:inline text-sm text-gray-500 group-hover:text-gray-900 transition-colors">
              Add
            </span>
          </div>
        </IconButtonWrapper>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-6 space-y-5 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900">이미지 추가</h3>
          <p className="text-xs text-gray-500">JPG, PNG, GIF 등 다양한 이미지를 업로드할 수 있습니다.</p>
        </div>

        {isUploading ? (
          <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="text-blue-600 text-sm font-medium">이미지 업로드 중...</span>
            </div>
          </div>
        ) : (
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload-input"
            />
            <span className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <span className="text-gray-400 text-sm">
                클릭하여 이미지를 선택하거나
                <br />
                여기로 드래그하세요
              </span>
            </span>
          </label>
        )}
      </PopoverContent>
    </Popover>
  );
};
