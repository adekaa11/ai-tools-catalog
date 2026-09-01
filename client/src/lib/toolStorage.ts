import type { ToolEntry } from "@shared/const";

const STORAGE_KEY = "catalyst-ai-tools-v1";

export function loadTools(): ToolEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ToolEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveTools(tools: ToolEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
}
