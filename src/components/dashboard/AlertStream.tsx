import { events } from "@/lib/mock-data";

const levelStyles: Record<string, string> = {
  low: "text-status-low border-status-low/40",
  moderate: "text-status-moderate border-status-moderate/40",
  critical: "text-status-critical border-status-critical/50",
};

export function AlertStream() {
  return (
    <div className="h-44 shrink-0 border-t border-border bg-surface/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 h-9 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="pulse-dot text-status-critical">●</span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Live Event Stream
          </span>
          <span className="text-mono text-[11px] text-muted-foreground/70">/ ws://heartgrid.live</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="text-mono">{events.length} events · last 30 min</span>
          <button className="px-2 py-0.5 rounded border border-border hover:bg-surface-elevated">All</button>
          <button className="px-2 py-0.5 rounded border border-border hover:bg-surface-elevated">Critical</button>
          <button className="px-2 py-0.5 rounded border border-border hover:bg-surface-elevated">Sensors</button>
          <button className="px-2 py-0.5 rounded border border-border hover:bg-surface-elevated">CHW</button>
        </div>
      </div>
      <div className="h-[calc(100%-2.25rem)] overflow-y-auto divide-y divide-border/60">
        {events.map((e, i) => (
          <div
            key={i}
            className="ticker-item flex items-center gap-4 px-4 py-2 text-xs hover:bg-surface-elevated/60 transition-colors"
          >
            <span className="text-mono text-[10px] text-muted-foreground w-20">{e.t}</span>
            <span className={`text-mono text-[10px] px-1.5 py-0.5 rounded border ${levelStyles[e.level]}`}>
              {e.kind}
            </span>
            <span className="text-foreground/80 w-56 truncate">{e.region}</span>
            <span className="flex-1 text-foreground/95 truncate">{e.msg}</span>
            <button className="text-[10px] uppercase tracking-wider text-primary hover:underline">
              Inspect →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
