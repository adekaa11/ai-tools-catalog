/**
 * Design note — Catalytic Workshop: the logo is a clear, large catalog mark,
 * using the distinctive vermilion core rather than generic software iconography.
 */
type AppLogoProps = {
  compact?: boolean;
};

export function AppLogo({ compact = false }: AppLogoProps) {
  return (
    <div className="flex items-center gap-3" aria-label="Catalyst">
      <img
        src="/manus-storage/catalyst-mark_add8c3fe.png"
        alt="Логотип Catalyst"
        className="h-10 w-10 shrink-0 object-contain"
      />
      {!compact && (
        <div className="leading-none">
          <p className="font-display text-[1.1rem] font-extrabold tracking-[-0.065em] text-foreground">
            catalyst
          </p>
          <p className="mt-1 font-mono text-[0.58rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            AI catalog
          </p>
        </div>
      )}
    </div>
  );
}
