export const CATEGORIES = [
  "Генерация кода",
  "Текст",
  "Изображения",
  "API-провайдеры",
  "Продуктивность",
] as const;

export type ToolCategory = (typeof CATEGORIES)[number];

export interface ToolEntry {
  id: string;
  name: string;
  description: string;
  url: string;
  category: ToolCategory;
  tags: string[];
  apiUrl?: string;
  apiDocsUrl?: string;
  createdAt: string;
}

export const CATEGORY_META: Record<
  ToolCategory,
  { label: string; dot: string }
> = {
  "Генерация кода": {
    label: "Генерация кода",
    dot: "bg-blue-500",
  },
  Текст: {
    label: "Текст",
    dot: "bg-orange-500",
  },
  Изображения: {
    label: "Изображения",
    dot: "bg-emerald-500",
  },
  "API-провайдеры": {
    label: "API-провайдеры",
    dot: "bg-purple-500",
  },
  Продуктивность: {
    label: "Продуктивность",
    dot: "bg-amber-500",
  },
};
