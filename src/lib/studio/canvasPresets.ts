export const canvasPresets = {
  instagramPortrait: {
    label: "Instagram Portrait",
    width: 1080,
    height: 1350,
  },
  instagramSquare: {
    label: "Instagram Square",
    width: 1080,
    height: 1080,
  },
  instagramStory: {
    label: "Instagram Story / Reel",
    width: 1080,
    height: 1920,
  },
  youtubeThumbnail: {
    label: "YouTube Thumbnail",
    width: 1280,
    height: 720,
  },
  linkedinPortrait: {
    label: "LinkedIn Portrait",
    width: 1080,
    height: 1350,
  },
} as const;

export type CanvasPreset = keyof typeof canvasPresets;
