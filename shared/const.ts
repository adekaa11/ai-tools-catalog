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
  text: { label: "Текст" },
  image: { label: "Изображения" },
  code: { label: "Генерация кода" },
  audio: { label: "Аудио" },
  video: { label: "Видео" },
  "3d": { label: "3D и Графика" },
  business: { label: "Продуктивность" },
  other: { label: "API-провайдеры" },
};
