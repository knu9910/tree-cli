import { Image } from '@tiptap/extension-image';
import ResizeImage from 'tiptap-extension-resize-image';

export const CustomImage = Image.extend({
  addExtensions() {
    return [ResizeImage];
  },

  addAttributes() {
    return {
      ...this.parent?.(),
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      { class: 'relative inline-block' }, // 이미지 감싸는 div, relative position
      [
        'img',
        {
          ...HTMLAttributes,
          src: node.attrs.src,
        },
      ],
    ];
  },
});
