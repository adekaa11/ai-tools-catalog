/**
 * Design note — Catalytic Workshop: the form is a focused index-card editor;
 * intentional labels and restrained dividers make technical inputs easy to scan.
 */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, type ToolCategory, type ToolEntry } from "@/types/tool";
import { Plus, Tags, X } from "lucide-react";
import { useEffect, useState } from "react";

type ToolDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTool: ToolEntry | null;
  onSave: (tool: Omit<ToolEntry, "id" | "createdAt">) => void;
};

type FormState = Omit<ToolEntry, "id" | "createdAt"> & { tagInput: string };

const blankForm: FormState = {
  name: "",
  description: "",
  websiteUrl: "",
  referralUrl: "",
  apiUrl: "",
  category: "Генерация кода",
  tags: [],
  tagInput: "",
};

export function ToolDialog({ open, onOpenChange, initialTool, onSave }: ToolDialogProps) {
  const [form, setForm] = useState<FormState>(blankForm);

  useEffect(() => {
    if (!open) return;
    if (initialTool) {
      setForm({ ...initialTool, tagInput: "" });
      return;
    }
    setForm(blankForm);
  }, [initialTool, open]);

  const addPendingTags = () => {
    const incoming = form.tagInput
      .split(",")
      .map((tag) => tag.trim().replace(/^#/, ""))
      .filter(Boolean);

    if (incoming.length === 0) return;

    setForm((current) => ({
      ...current,
      tags: Array.from(new Set([...current.tags, ...incoming])).slice(0, 10),
      tagInput: "",
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const pending = form.tagInput
      .split(",")
      .map((tag) => tag.trim().replace(/^#/, ""))
      .filter(Boolean);

    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      websiteUrl: form.websiteUrl.trim(),
      referralUrl: form.referralUrl.trim(),
      apiUrl: form.apiUrl.trim(),
      category: form.category,
      tags: Array.from(new Set([...form.tags, ...pending])).slice(0, 10),
    });
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto rounded-2xl border-border bg-popover p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border px-6 pb-5 pt-6 sm:px-8">
          <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9532D]/10 text-[#C64221] dark:text-[#FF9B7D]">
            <Plus className="h-4 w-4" />
          </div>
          <DialogTitle className="font-display text-2xl font-bold tracking-[-0.05em]">
            {initialTool ? "Обновить запись" : "Добавить в картотеку"}
          </DialogTitle>
          <DialogDescription className="max-w-lg text-sm leading-6">
            Сохраните главный адрес, API endpoint и реферальную ссылку в одной аккуратной записи.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6 px-6 py-6 sm:px-8" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-2">
              <Label htmlFor="tool-name">Название сервиса <span className="text-[#E9532D]">*</span></Label>
              <Input id="tool-name" required maxLength={80} value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Например, OpenAI" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tool-category">Категория <span className="text-[#E9532D]">*</span></Label>
              <Select value={form.category} onValueChange={(value) => update("category", value as ToolCategory)}>
                <SelectTrigger id="tool-category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tool-description">Краткое описание <span className="text-[#E9532D]">*</span></Label>
            <Textarea id="tool-description" required maxLength={320} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Чем этот сервис полезен именно вам?" className="min-h-24 resize-y" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tool-website">Основная ссылка <span className="text-[#E9532D]">*</span></Label>
            <Input id="tool-website" required type="url" value={form.websiteUrl} onChange={(event) => update("websiteUrl", event.target.value)} placeholder="https://example.com" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tool-referral">Реферальная ссылка</Label>
              <Input id="tool-referral" type="url" value={form.referralUrl} onChange={(event) => update("referralUrl", event.target.value)} placeholder="https://…?ref=…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tool-api">Базовый API URL</Label>
              <Input id="tool-api" type="url" value={form.apiUrl} onChange={(event) => update("apiUrl", event.target.value)} placeholder="https://api.example.com/v1" className="font-mono text-xs" />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="tool-tags" className="flex items-center gap-1.5"><Tags className="h-3.5 w-3.5" /> Теги</Label>
            <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring">
              {form.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  #{tag}
                  <button type="button" onClick={() => update("tags", form.tags.filter((item) => item !== tag))} aria-label={`Удалить тег ${tag}`} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                </span>
              ))}
              <input
                id="tool-tags"
                value={form.tagInput}
                onChange={(event) => update("tagInput", event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addPendingTags();
                  }
                  if (event.key === "Backspace" && !form.tagInput && form.tags.length) update("tags", form.tags.slice(0, -1));
                }}
                onBlur={addPendingTags}
                placeholder={form.tags.length ? "ещё тег…" : "api, команда, избранное"}
                className="min-w-[155px] flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </div>
            <p className="text-xs text-muted-foreground">Нажмите Enter или запятую, чтобы добавить тег.</p>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
            <Button type="submit" className="bg-[#E9532D] text-white hover:bg-[#C64221] dark:bg-[#FF8D6C] dark:text-[#37140B] dark:hover:bg-[#FFAA91]">
              {initialTool ? "Сохранить изменения" : "Добавить инструмент"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
