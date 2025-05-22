// src/extensions/YouTubeVideo.ts
import { Node, mergeAttributes } from '@tiptap/core';
import { IframeHTMLAttributes } from 'react';

export type YouTubeVideoOptions = {
  HTMLAttributes: IframeHTMLAttributes<HTMLIFrameElement>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtubeVideo: {
      setYouTubeVideo: (src: string) => ReturnType;
    };
  }
}

export const YouTubeVideo = Node.create<YouTubeVideoOptions>({
  name: 'youtubeVideo',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src*="youtube.com"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        width: '200',
        height: '100',
        frameborder: '0',
        allowfullscreen: 'true',
      }),
    ];
  },

  addCommands() {
    return {
      setYouTubeVideo:
        (src) =>
        ({ chain }) => {
          const videoId = src.split('v=')[1]?.split('&')[0];
          if (videoId) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            return chain()
              .insertContent({
                type: this.name,
                attrs: { src: embedUrl },
              })
              .run();
          }
          return false;
        },
    };
  },
});
