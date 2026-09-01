import { Cpu } from "lucide-react";

export function AppLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9532D] text-white shadow-[0_4px_12px_rgba(233,83,45,0.25)] dark:bg-[#FF8D6C] dark:text-[#3A150C]">
        <Cpu className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="font-display text-base font-extrabold tracking-[-0.04em] text-foreground">
          catalyst
        </span>
        <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          AI CATALOG
        </span>
      </div>
    </div>
  );
}
