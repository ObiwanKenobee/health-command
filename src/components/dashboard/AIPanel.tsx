import { Sparkles, ArrowRight, Lightbulb, RefreshCw } from "lucide-react";
import { forecast } from "@/lib/mock-data";
import { useHeartgrid } from "@/lib/store";

export function AIPanel() {
  const { region, metrics } = useHeartgrid();
  const w = 280, h = 90, pad = 8;
  const all = forecast.map((d) => d.predicted);
  const max = Math.max(...all), min = Math.min(...all);
  const step = (w - pad * 2) / (forecast.length - 1);
  const pt = (v: number, i: number) =>
    [pad + i * step, h - pad - ((v - min) / (max - min)) * (h - pad * 2)] as const;
  const predPath = forecast.map((d, i) => {
    const [x, y] = pt(d.predicted, i);
    return (i === 0 ? "M" : "L") + x + "," + y;
  }).join(" ");
  const actualPts = forecast.filter((d) => d.actual !== null);
  const actualPath = actualPts.map((d, i) => {
    const [x, y] = pt(d.actual as number, i);
    return (i === 0 ? "M" : "L") + x + "," + y;
  }).join(" ");

  // Top "why" drivers from current critical/moderate metrics
  const drivers = metrics
    .filter((m) => m.status !== "low")
    .sort((a, b) => (a.status === "critical" ? -1 : 1) - (b.status === "critical" ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="panel flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 h-11 border-b border-border bg-surface-elevated/40">
        <div className="h-6 w-6 rounded bg-gradient-to-br from-accent to-primary flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">HEARTGRID Intelligence</div>
          <div className="text-sm font-medium">Briefing · {region.name.split("—").pop()?.trim()}</div>
        </div>
        <button className="h-6 w-6 flex items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground" aria-label="Refresh">
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>

      <div className="p-3 space-y-3 overflow-y-auto">
        {/* Forecast viz */}
        <div className="panel-elevated p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">7-Day Outbreak Forecast</div>
            <div className="text-mono text-[10px] text-status-critical">+28% projected</div>
          </div>
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
            <defs>
              <linearGradient id="predGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--status-critical)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--status-critical)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${predPath} L${w - pad},${h} L${pad},${h} Z`} fill="url(#predGrad)" />
            <path d={predPath} fill="none" stroke="var(--status-critical)" strokeWidth="1.4" strokeDasharray="3 3" />
            <path d={actualPath} fill="none" stroke="var(--primary)" strokeWidth="1.6" />
          </svg>
          <div className="flex items-center justify-between text-mono text-[9px] text-muted-foreground">
            {forecast.map((d) => <span key={d.d}>{d.d}</span>)}
          </div>
          <div className="flex items-center gap-3 mt-2 text-[10px]">
            <span className="flex items-center gap-1"><span className="h-0.5 w-3 bg-primary" />Observed</span>
            <span className="flex items-center gap-1"><span className="h-0.5 w-3 bg-status-critical" />Predicted</span>
          </div>
        </div>

        {/* Why risk changed */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Why risk changed (forecast drivers)
          </div>
          <div className="space-y-1.5">
            {forecast.slice(1, 6).map((d) => {
              const delta = d.predicted - (forecast[forecast.indexOf(d) - 1]?.predicted ?? d.predicted);
              return (
                <div key={d.d} className="flex items-start gap-2 text-[11px]">
                  <span className="text-mono text-[10px] text-muted-foreground w-8 mt-0.5">{d.d}</span>
                  <span className={`text-mono text-[10px] w-10 ${delta >= 0 ? "text-status-critical" : "text-status-low"}`}>
                    {delta >= 0 ? "+" : ""}{delta}
                  </span>
                  <span className="flex-1 text-foreground/85">{d.why}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations driven by current metrics */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Recommended Actions</div>
          <div className="space-y-2">
            {drivers.map((m) => (
              <button key={m.id} className="w-full text-left panel-elevated p-2.5 hover:border-primary/40 transition-colors group">
                <div className="flex items-start gap-2">
                  <span className={`text-mono text-[9px] px-1.5 py-0.5 rounded ${m.status === "critical" ? "bg-status-critical/20 text-status-critical" : "bg-status-moderate/20 text-status-moderate"}`}>
                    {m.status === "critical" ? "P1" : "P2"}
                  </span>
                  <div className="flex-1">
                    <div className="text-xs text-foreground">Address {m.label.toLowerCase()} in {region.name.split("—").pop()?.trim()}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Lightbulb className="h-2.5 w-2.5" /> {m.why}
                    </div>
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
                </div>
              </button>
            ))}
            {drivers.length === 0 && (
              <div className="text-[11px] text-muted-foreground panel-elevated p-3">
                All indicators within normal range.
              </div>
            )}
          </div>
        </div>

        <div className="panel-elevated p-2 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent shrink-0" />
          <input
            placeholder="Ask: which zones are highest risk this week?"
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground/70"
          />
          <button className="text-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-primary/15 text-primary hover:bg-primary/25">
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
