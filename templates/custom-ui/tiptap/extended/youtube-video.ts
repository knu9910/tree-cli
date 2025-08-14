// src/extensions/YouTubeVideo.ts
import { Node, mergeAttributes } from '@tiptap/core';
import { IframeHTMLAttributes } from 'react';

export type YouTubeVideoOptions = {
  HTMLAttributes: IframeHTMLAttributes<HTMLIFrameElement>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtubeVideo: {
      setYouTubeVideo: (src: string, width?: string, height?: string) => ReturnType;
      setYouTubeVideoSize: (width: string, height: string) => ReturnType;
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
      width: {
        default: '560',
      },
      height: {
        default: '315',
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
        frameborder: '0',
        allowfullscreen: 'true',
      }),
    ];
  },

  addCommands() {
    return {
      setYouTubeVideo:
        (src, width = '560', height = '315') =>
        ({ chain }) => {
          const videoId = src.split('v=')[1]?.split('&')[0];
          if (videoId) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            return chain()
              .insertContent({
                type: this.name,
                attrs: { src: embedUrl, width, height },
              })
              .run();
          }
          return false;
        },
      setYouTubeVideoSize:
        (width, height) =>
        ({ chain }) => {
          return chain().updateAttributes(this.name, { width, height }).run();
        },
    };
  },
});
