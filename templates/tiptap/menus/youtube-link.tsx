import { cn } from '@/lib/utils';
import { useVideoStore } from '../plugin';
import { Input } from '@/components/custom-ui/input/input';
import { Button } from '@/components/custom-ui/button/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/custom-ui/popover/popover';
import { Editor } from '@tiptap/react';
import { Video, Trash2 } from 'lucide-react';
import { IconButton } from './common/icon-button';
import { IconButtonWrapper } from './common/icon-button-wrapper';
import { useState } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & {
  editor: Editor;
};

export const YoutubeLink = ({ className, editor }: Readonly<Props>) => {
  const { videoUrl, setVideoUrl } = useVideoStore();
  const [width, setWidth] = useState('560');
  const [height, setHeight] = useState('315');

  if (!editor) return null;

  const addYouTubeVideo = () => {
    if (editor && videoUrl) {
      editor.chain().setYouTubeVideo(videoUrl, width, height).run();
      setVideoUrl(''); // URL 입력 필드 초기화
    }
  };

  const deleteYouTubeVideo = () => {
    if (editor) {
      // 현재 선택된 노드가 유튜브 동영상인지 확인
      const { state } = editor;
      const { from, to } = state.selection;

      // 선택된 범위에서 유튜브 동영상 노드 찾기
      let foundYouTubeVideo = false;
      state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.name === 'youtubeVideo') {
          foundYouTubeVideo = true;
          // 해당 노드 삭제
          editor.chain().setNodeSelection(pos).deleteSelection().run();
          return false; // 더 이상 탐색하지 않음
        }
      });

      // 선택된 범위에서 찾지 못했다면 전체 문서에서 유튜브 동영상 찾기
      if (!foundYouTubeVideo) {
        state.doc.descendants((node, pos) => {
          if (node.type.name === 'youtubeVideo') {
            editor.chain().setNodeSelection(pos).deleteSelection().run();
            return false;
          }
        });
      }
    }
  };

  // 현재 선택된 노드가 유튜브 동영상인지 확인
  const isYouTubeVideoSelected = () => {
    if (!editor) return false;
    const { state } = editor;
    const { from, to } = state.selection;

    let found = false;
    state.doc.nodesBetween(from, to, (node) => {
      if (node.type.name === 'youtubeVideo') {
        found = true;
        return false;
      }
    });
    return found;
  };

  return (
    <div className={cn('', className)}>
      <Popover>
        <PopoverTrigger className="cursor-pointer">
          <IconButtonWrapper>
            <IconButton>
              <Video />
            </IconButton>
          </IconButtonWrapper>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-6 space-y-4 bg-white rounded-2xl shadow-2xl border border-gray-100">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900">유튜브 동영상 추가</h3>
            <p className="text-xs text-gray-500">유튜브 URL을 입력하고 크기를 설정하세요.</p>
          </div>

          {/* 유튜브 URL 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">유튜브 URL</label>
            <Input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full"
            />
          </div>

          {/* 크기 설정 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">동영상 크기</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500">너비 (px)</label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full"
                  min="100"
                  max="1200"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500">높이 (px)</label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full"
                  min="100"
                  max="800"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={addYouTubeVideo} className="flex-1" disabled={!videoUrl}>
              동영상 추가
            </Button>
            {isYouTubeVideoSelected() && (
              <Button onClick={deleteYouTubeVideo} variant="destructive" size="sm" className="px-3">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
