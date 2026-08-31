/**
 * Design note — Catalytic Workshop: cards behave as tactile catalogue fiches:
 * compact metadata, an indexed category tab, and contextual actions only.
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ToolEntry } from "@/types/tool";
import { CATEGORY_META } from "@/types/tool";
import {
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  Waypoints,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ToolCardProps = {
  tool: ToolEntry;
  onEdit: (tool: ToolEntry) => void;
  onDelete: (tool: ToolEntry) => void;
};

function CopyRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;

  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} скопирован`, { duration: 1800 });
    } catch {
      toast.error("Не удалось скопировать значение");
    }
  };

  return (
    <div className="group/copy flex items-center gap-2 rounded-lg bg-[#F3F1EC] px-2.5 py-2 dark:bg-white/[0.055]">
      <span className="min-w-0 flex-1 truncate font-mono text-[0.66rem] leading-4 text-muted-foreground" title={value}>
        {value}
      </span>
      <button
        type="button"
        onClick={copyValue}
        className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Скопировать: ${label}`}
      >
        <Copy className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToolCard({ tool, onEdit, onDelete }: ToolCardProps) {
  const category = CATEGORY_META[tool.category];

  return (
    <article className="catalog-card group relative flex min-h-[340px] flex-col overflow-hidden p-5">
      <div className={`absolute inset-y-0 left-0 w-1 ${category.dot}`} aria-hidden="true" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="catalog-card-stamp">CAT/{tool.createdAt.slice(0, 4)}</span>
          <Badge className={`catalog-tab rounded-md border-0 px-2.5 py-1 text-[0.67rem] font-semibold ${category.tone}`}>
          {category.label}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={`Действия для ${tool.name}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Управление</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onEdit(tool)}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => onDelete(tool)}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center gap-2"><span className="h-px w-5 bg-[#E9532D]" /><span className="font-mono text-[0.58rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">Карточка инструмента</span></div>
        <h2 className="font-display text-xl font-bold tracking-[-0.045em] text-foreground">{tool.name}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{tool.description}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tool.tags.length > 0 ? (
          tool.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-md bg-muted px-2 py-1 text-[0.68rem] font-medium text-muted-foreground">
              #{tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground/70">Без тегов</span>
        )}
      </div>

      <div className="mt-auto space-y-2.5 border-t border-border/80 pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <Waypoints className="h-3.5 w-3.5 text-[#2563C7]" />
            API URL
          </span>
          {tool.apiUrl ? <CopyRow label="API URL" value={tool.apiUrl} /> : <span className="text-xs text-muted-foreground/60">не указан</span>}
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Реферал</span>
          {tool.referralUrl ? <CopyRow label="Реферальная ссылка" value={tool.referralUrl} /> : <span className="text-xs text-muted-foreground/60">не указан</span>}
        </div>
      </div>

      <a
        href={tool.websiteUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center justify-between border-t border-border/80 pt-3.5 text-sm font-semibold text-foreground transition-colors hover:text-[#C64221] dark:hover:text-[#FF9B7D]"
      >
        Перейти к сервису
        <ExternalLink className="h-4 w-4" />
      </a>
    </article>
  );
}
