/**
 * Design note — Catalytic Workshop: asymmetric catalogue layout, warm editorial
 * surfaces, graphite text and a single vermilion action accent define this page.
 */
import { AppLogo } from "@/components/AppLogo";
import { ToolCard } from "@/components/ToolCard";
import { ToolDialog } from "@/components/ToolDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { loadTools, saveTools } from "@/lib/toolStorage";
import { CATEGORIES, CATEGORY_META, type ToolCategory, type ToolEntry } from "../../../shared/const";
import { nanoid } from "nanoid";
import {
  Archive,
  Command,
  LaptopMinimal,
  Moon,
  Plus,
  Search,
  Sparkles,
  SunMedium,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ToolDraft = Omit<ToolEntry, "id" | "createdAt">;
type CategoryFilter = "Все" | ToolCategory;

const categoryCountLabel: Record<CategoryFilter, string> = {
  Все: "Все записи",
  "Генерация кода": "Генерация кода",
  Текст: "Работа с текстом",
  Изображения: "Генерация изображений",
  "API-провайдеры": "API-провайдеры",
  Продуктивность: "Продуктивность",
};

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [tools, setTools] = useState<ToolEntry[]>(() => loadTools());
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Все");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ToolEntry | null>(null);

  useEffect(() => {
    saveTools(tools);
  }, [tools]);

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tools
      .filter((tool) => activeCategory === "Все" || tool.category === activeCategory)
      .filter((tool) => {
        if (!normalizedQuery) return true;
        return [tool.name, tool.description, tool.category, ...tool.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [activeCategory, query, tools]);

  const toolsWithApi = tools.filter((tool) => Boolean(tool.apiUrl)).length;
  const categoryCount = (category: CategoryFilter) => category === "Все" ? tools.length : tools.filter((tool) => tool.category === category).length;

  const openCreate = () => {
    setEditingTool(null);
    setDialogOpen(true);
  };

  const handleSave = (draft: ToolDraft) => {
    if (editingTool) {
      setTools((current) => current.map((tool) => tool.id === editingTool.id ? { ...tool, ...draft } : tool));
      toast.success("Запись обновлена");
    } else {
      setTools((current) => [{ ...draft, id: nanoid(), createdAt: new Date().toISOString() }, ...current]);
      toast.success("Инструмент добавлен в картотеку");
    }
    setDialogOpen(false);
    setEditingTool(null);
  };

  const handleDelete = (tool: ToolEntry) => {
    if (!window.confirm(`Удалить «${tool.name}» из каталога?`)) return;
    setTools((current) => current.filter((item) => item.id !== tool.id));
    toast.success("Запись удалена");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="min-h-screen md:flex">
        <aside className="catalog-spine relative z-20 flex border-b border-border/80 bg-sidebar px-4 py-4 md:sticky md:top-0 md:h-screen md:w-[260px] md:flex-col md:border-b-0 md:border-r md:px-5 md:py-7">
          <AppLogo />
          <div className="ml-auto flex items-center gap-1 md:hidden">
            <Button onClick={toggleTheme} variant="ghost" size="icon" className="rounded-lg" aria-label="Переключить тему">
              {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button onClick={openCreate} size="icon" className="rounded-lg bg-[#E9532D] text-white hover:bg-[#C64221]" aria-label="Добавить инструмент"><Plus className="h-4 w-4" /></Button>
          </div>

          <nav className="hidden md:mt-12 md:block" aria-label="Категории каталога">
            <div className="mb-4 flex items-center gap-2 px-3">
              <span className="font-mono text-[0.6rem] font-semibold tracking-[0.12em] text-[#C64221] dark:text-[#FF9B7D]">IDX/01</span>
              <span className="h-px flex-1 bg-border" />
              <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Картотека</span>
            </div>
            <div className="space-y-1">
              {(["Все", ...CATEGORIES] as CategoryFilter[]).map((category, index) => {
                const active = activeCategory === category;
                const meta = category === "Все" ? null : CATEGORY_META[category];
                return (
                  <button
                    type="button"
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${active ? "bg-[#E9532D] text-white shadow-[0_7px_20px_rgba(233,83,45,0.18)] dark:bg-[#FF8D6C] dark:text-[#3A150C]" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                  >
                    <span className={`w-5 font-mono text-[0.6rem] font-medium tracking-[-0.04em] ${active ? "text-white/65 dark:text-[#3A150C]/65" : "text-muted-foreground/70"}`}>{String(index + 1).padStart(2, "0")}</span>
                    {category === "Все" ? <Archive className="h-3.5 w-3.5" /> : <span className={`h-2 w-2 rounded-full ${meta?.dot}`} />}
                    <span className="flex-1 truncate">{category === "Все" ? "Все инструменты" : category}</span>
                    <span className={`font-mono text-[0.66rem] ${active ? "opacity-70" : "opacity-60"}`}>{categoryCount(category)}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="mt-auto hidden md:block">
            <div className="mb-4 rounded-xl border border-border/80 bg-card p-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground"><LaptopMinimal className="h-3.5 w-3.5 text-[#E9532D]" /> Локальное хранилище</div>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">Данные сохранены только в вашем браузере.</p>
            </div>
            <button type="button" onClick={toggleTheme} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="relative isolate overflow-hidden border-b border-border/70 px-5 py-6 sm:px-8 lg:px-12 lg:py-9">
            <img src="/manus-storage/catalyst-orbit-light_cb8eb3d5.png" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover object-right opacity-50 dark:hidden" />
            <img src="/manus-storage/catalyst-orbit-dark_9187ac30.png" alt="" className="absolute inset-0 -z-10 hidden h-full w-full object-cover object-right opacity-65 dark:block" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/95 to-background/45 dark:via-background/92" />
            <div className="orbital-map pointer-events-none absolute -right-12 top-1/2 hidden h-64 w-[480px] -translate-y-1/2 opacity-80 lg:block" aria-hidden="true">
              <span className="orbital-ring orbital-ring-one" /><span className="orbital-ring orbital-ring-two" /><span className="orbital-ring orbital-ring-three" />
              <span className="orbital-node orbital-node-core" /><span className="orbital-node orbital-node-one" /><span className="orbital-node orbital-node-two" /><span className="orbital-node orbital-node-three" />
              <span className="orbital-link orbital-link-one" /><span className="orbital-link orbital-link-two" />
            </div>
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-3 py-1.5 font-mono text-[0.63rem] font-medium uppercase tracking-[0.13em] text-muted-foreground backdrop-blur-sm"><span className="h-2 w-2 rounded-full bg-[#E9532D] shadow-[0_0_0_3px_rgba(233,83,45,0.12)]" /><Sparkles className="h-3.5 w-3.5" /> Личная система инструментов</p>
              <h1 className="font-display text-3xl font-extrabold tracking-[-0.065em] text-foreground sm:text-4xl">Инструменты, к которым<br className="hidden sm:block" /> вы возвращаетесь.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-[0.94rem]">Соберите нужные сервисы, ссылки и API endpoints в одну рабочую картотеку — без лишнего контекста.</p>
            </div>
            <Button onClick={openCreate} className="mt-5 hidden bg-[#E9532D] px-4 text-white shadow-[0_10px_24px_rgba(233,83,45,0.22)] hover:bg-[#C64221] sm:inline-flex dark:bg-[#FF8D6C] dark:text-[#3A150C] dark:hover:bg-[#FFAA91]">
              <Plus className="mr-2 h-4 w-4" /> Добавить инструмент
            </Button>
          </header>

          <section className="px-5 py-7 sm:px-8 lg:px-12 lg:py-9">
            <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="font-mono text-[0.66rem] font-medium uppercase tracking-[0.16em] text-[#C64221] dark:text-[#FF9B7D]">{categoryCountLabel[activeCategory]}</p>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <h2 className="font-display text-2xl font-bold tracking-[-0.05em]">Каталог</h2>
                  <span className="font-mono text-xs text-muted-foreground">{filteredTools.length.toString().padStart(2, "0")}</span>
                </div>
              </div>
              <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto">
                <div className="relative w-full sm:w-[285px]">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти по названию или тегу" className="h-10 rounded-lg bg-card pl-10 pr-9 shadow-sm" />
                  {query && <button type="button" onClick={() => setQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Очистить поиск"><X className="h-3.5 w-3.5" /></button>}
                </div>
                <div className="flex gap-2 md:hidden">
                  <Select value={activeCategory} onValueChange={(value) => setActiveCategory(value as CategoryFilter)}>
                    <SelectTrigger className="h-10 flex-1 rounded-lg bg-card"><SelectValue placeholder="Категория" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Все">Все категории</SelectItem>
                      {CATEGORIES.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button onClick={openCreate} className="h-10 rounded-lg bg-[#E9532D] text-white hover:bg-[#C64221]"><Plus className="mr-2 h-4 w-4" /> Добавить</Button>
                </div>
              </div>
            </div>

            <div className="mb-7 grid gap-3 sm:grid-cols-3">
              <div className="catalog-stat"><span><b>01</b> Всего в каталоге</span><strong>{tools.length.toString().padStart(2, "0")}</strong></div>
              <div className="catalog-stat"><span><b>02</b> С API endpoint</span><strong>{toolsWithApi.toString().padStart(2, "0")}</strong></div>
              <div className="catalog-stat"><span><b>03</b> Активный раздел</span><strong className="!text-base !tracking-[-0.03em]">{activeCategory === "Все" ? "Все" : activeCategory}</strong></div>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} onEdit={(item) => { setEditingTool(item); setDialogOpen(true); }} onDelete={handleDelete} />)}
              </div>
            ) : (
              <div className="empty-catalog relative overflow-hidden p-7 sm:p-10">
                <img src="/manus-storage/catalyst-empty-state_89ebdad0.png" alt="" className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 object-contain opacity-70 dark:opacity-35 sm:right-4 sm:top-0" />
                <div className="relative max-w-md">
                  <p className="mb-3 font-mono text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#C64221] dark:text-[#FF9B7D]"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#E9532D]" /> Новая вкладка</p>
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9532D]/10 text-[#C64221] dark:text-[#FF9B7D]"><Command className="h-4 w-4" /></div>
                  <h3 className="font-display text-2xl font-bold tracking-[-0.05em]">{query || activeCategory !== "Все" ? "Ничего не найдено" : "Пока здесь тихо"}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{query || activeCategory !== "Все" ? "Измените запрос или переключите категорию, чтобы увидеть другие записи." : "Добавьте первый сервис — его ссылки и параметры останутся под рукой в этой картотеке."}</p>
                  {query || activeCategory !== "Все" ? <Button variant="outline" className="mt-5 rounded-lg" onClick={() => { setQuery(""); setActiveCategory("Все"); }}>Сбросить фильтры</Button> : <Button className="mt-5 rounded-lg bg-[#E9532D] text-white hover:bg-[#C64221]" onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Добавить первый инструмент</Button>}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      <ToolDialog open={dialogOpen} onOpenChange={setDialogOpen} initialTool={editingTool} onSave={handleSave} />
    </div>
  );
}
