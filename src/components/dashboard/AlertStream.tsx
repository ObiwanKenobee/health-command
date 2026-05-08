import { useHeartgrid } from "@/lib/store";
import type { RiskLevel } from "@/lib/mock-data";

const levelStyles: Record<RiskLevel, string> = {
  low: "text-status-low border-status-low/40",
  moderate: "text-status-moderate border-status-moderate/40",
  critical: "text-status-critical border-status-critical/50",
};

const filters: Array<{ id: RiskLevel | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "moderate", label: "Moderate" },
  { id: "low", label: "Low" },
];

export function AlertStream() {
  const { events, filter, setFilter } = useHeartgrid();
  const filtered = filter === "all" ? events : events.filter((e) => e.level === filter);

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
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="text-mono mr-2">{filtered.length} / {events.length} events</span>
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-2 py-0.5 rounded border transition-colors uppercase tracking-wider ${
                filter === f.id
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border hover:bg-surface-elevated"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[calc(100%-2.25rem)] overflow-y-auto divide-y divide-border/60">
        {filtered.length === 0 && (
          <div className="px-4 py-6 text-center text-xs text-muted-foreground">
            No events match this severity filter.
          </div>
        )}
        {filtered.map((e) => (
          <div
            key={e.id}
            className={`flex items-center gap-4 px-4 py-2 text-xs transition-colors ${
              e.isNew
                ? "bg-primary/10 animate-fade-in"
                : "hover:bg-surface-elevated/60"
            }`}
          >
            <span className="text-mono text-[10px] text-muted-foreground w-20">{e.t}</span>
            <span className={`text-mono text-[10px] px-1.5 py-0.5 rounded border ${levelStyles[e.level]}`}>
              {e.kind}
            </span>
            {e.isNew && (
              <span className="text-mono text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary uppercase">
                new
              </span>
            )}
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
