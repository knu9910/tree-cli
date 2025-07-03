import { Popover, PopoverContent, PopoverTrigger } from '@/components/custom-ui/popover/popover';
import { cn } from '@/lib/utils';
import { ImagePlus } from 'lucide-react';
import { IconButton } from './common/icon-button';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { Editor } from '@tiptap/react';

type Props = React.HTMLAttributes<HTMLElement> & {
  editor: Editor;
  onImageUpload?: (file: File) => Promise<string>;
};

export const Img = ({ editor, onImageUpload, className }: Readonly<Props>) => {
  if (!editor) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onImageUpload) {
      // onImageUpload prop이 제공된 경우: 서버에 업로드
      try {
        const imageUrl = await onImageUpload(file);
        editor.chain().setImage({ src: imageUrl }).run();
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        // 사용자에게 에러 메시지 표시
      }
    } else {
      // onImageUpload prop이 없는 경우: Base64로 삽입
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        editor.chain().setImage({ src: base64Image }).run();
      };
      reader.readAsDataURL(file);
    }
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
        <label className="block">
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="image-upload-input" />
          <span className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <span className="text-gray-400 text-sm">
              클릭하여 이미지를 선택하거나
              <br />
              여기로 드래그하세요
            </span>
          </span>
        </label>
        {/* 미리보기 영역(선택 시) */}
        {/* <div className="w-full flex justify-center">
    <img src={previewUrl} alt="미리보기" className="max-h-32 rounded-md shadow" />
  </div> */}
      </PopoverContent>
    </Popover>
  );
};
