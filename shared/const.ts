export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

export const CATEGORIES = [
  "text",
  "image",
  "code",
  "audio",
  "video",
  "3d",
  "business",
  "other",
] as const;

export type ToolCategory = (typeof CATEGORIES)[number];

export const CATEGORY_META: Record<string, { label: string; icon?: string }> = {
  text: { label: "Text & Writing" },
  image: { label: "Image & Design" },
  code: { label: "Coding & Dev" },
  audio: { label: "Audio & Music" },
  video: { label: "Video & Motion" },
  "3d": { label: "3D & World" },
  business: { label: "Business & Productivity" },
  other: { label: "Other Tools" },
};
