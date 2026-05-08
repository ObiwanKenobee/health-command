import { useState } from "react";
import { Bell, Siren, Sparkles, ChevronDown, Globe2, User, Check } from "lucide-react";
import { regions, type RiskLevel } from "@/lib/mock-data";
import { useHeartgrid } from "@/lib/store";

export function TopBar() {
  const { region, setRegion, setEscalateOpen, metrics } = useHeartgrid();
  const [regionOpen, setRegionOpen] = useState(false);

  const counts = metrics.reduce(
    (acc, m) => {
      acc[m.status]++;
      return acc;
    },
    { low: 0, moderate: 0, critical: 0 } as Record<RiskLevel, number>
  );

  return (
    <header className="h-14 shrink-0 border-b border-border bg-surface/80 backdrop-blur-md flex items-center px-4 gap-4 z-30 relative">
      <div className="flex items-center gap-3">
        <div className="relative h-8 w-8 rounded-md bg-gradient-to-br from-primary to-status-info flex items-center justify-center shadow-[var(--shadow-glow)]">
          <div className="absolute inset-0 rounded-md radar-sweep opacity-60" />
          <span className="text-mono text-[11px] font-bold text-primary-foreground relative">AS</span>
        </div>
        <div className="leading-tight">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Atlas Sanctum</div>
          <div className="text-sm font-semibold">HEARTGRID • Public Health</div>
        </div>
      </div>

      <div className="h-6 w-px bg-border mx-1" />

      <div className="flex items-center gap-2 text-mono text-xs">
        <span className="pulse-dot text-status-low">●</span>
        <span className="text-muted-foreground">HEARTGRID</span>
        <span className="text-foreground">OPERATIONAL</span>
        <span className="text-muted-foreground/60 hidden lg:inline">· 1,284 sensors · 99.2% uptime</span>
      </div>

      {/* Region selector */}
      <div className="relative ml-2">
        <button
          onClick={() => setRegionOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface hover:bg-surface-elevated text-xs"
        >
          <Globe2 className="h-3.5 w-3.5 text-primary" />
          <span className="max-w-[180px] truncate">{region.name}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
        {regionOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setRegionOpen(false)} />
            <div className="absolute top-full mt-1 left-0 w-72 panel-elevated z-50 py-1 animate-fade-in">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 py-1.5">Drill-down region</div>
              {regions.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { setRegion(r); setRegionOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-surface-elevated flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{
                    background: r.hotspot.level === "critical" ? "var(--status-critical)" :
                                r.hotspot.level === "moderate" ? "var(--status-moderate)" : "var(--status-low)"
                  }} />
                  <span className="flex-1">{r.name}</span>
                  <span className="text-mono text-[10px] text-muted-foreground">×{r.multiplier.toFixed(2)}</span>
                  {r.id === region.id && <Check className="h-3 w-3 text-primary" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center gap-2">
        <StatusPill level="low" count={counts.low} label="Low" />
        <StatusPill level="moderate" count={counts.moderate} label="Moderate" />
        <StatusPill level="critical" count={counts.critical} label="Critical" pulse={counts.critical > 0} />
      </div>

      <div className="flex items-center gap-1">
        <IconBtn icon={Sparkles} label="AI Assistant" accent />
        <IconBtn icon={Bell} label="Notifications" badge="9" />
        <button
          onClick={() => setEscalateOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-status-critical/15 border border-status-critical/40 text-status-critical text-xs font-medium hover:bg-status-critical/25 transition-colors"
        >
          <Siren className="h-3.5 w-3.5" />
          ESCALATE
        </button>
        <div className="h-6 w-px bg-border mx-1" />
        <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md hover:bg-surface-elevated">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
            <User className="h-3.5 w-3.5" />
          </div>
          <div className="text-left leading-tight hidden md:block">
            <div className="text-xs font-medium">Dr. A. Otieno</div>
            <div className="text-[10px] text-muted-foreground">Field Command</div>
          </div>
        </button>
      </div>
    </header>
  );
}

function StatusPill({ level, count, label, pulse }: { level: RiskLevel; count: number; label: string; pulse?: boolean }) {
  const color = level === "low" ? "text-status-low" : level === "moderate" ? "text-status-moderate" : "text-status-critical";
  const bg = level === "low" ? "bg-status-low/10" : level === "moderate" ? "bg-status-moderate/10" : "bg-status-critical/10";
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border border-border ${bg}`}>
      <span className={`${color} ${pulse ? "pulse-dot" : ""}`}>●</span>
      <span className="text-mono text-xs">{count}</span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

function IconBtn({ icon: Icon, label, badge, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; badge?: string; accent?: boolean }) {
  return (
    <button
      aria-label={label}
      className={`relative h-9 w-9 flex items-center justify-center rounded-md hover:bg-surface-elevated text-muted-foreground hover:text-foreground ${accent ? "text-accent hover:text-accent" : ""}`}
    >
      <Icon className="h-4 w-4" />
      {badge && (
        <span className="absolute top-1 right-1 text-mono text-[9px] bg-status-critical text-destructive-foreground rounded-full h-3.5 min-w-3.5 px-1 flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}
