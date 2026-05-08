import { Layers, Maximize2, Play, Crosshair, X } from "lucide-react";
import { useHeartgrid } from "@/lib/store";
import { regions, type Region, type RiskLevel } from "@/lib/mock-data";

const colorByLevel: Record<RiskLevel, string> = {
  critical: "var(--status-critical)",
  moderate: "var(--status-moderate)",
  low: "var(--status-low)",
};

export function LiveMap() {
  const { region, setRegion } = useHeartgrid();

  return (
    <div className="panel relative overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-4 h-11 border-b border-border bg-surface-elevated/40">
        <div className="flex items-center gap-3">
          <Crosshair className="h-4 w-4 text-primary" />
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Mission Map</div>
            <div className="text-sm font-medium">Nairobi Metro · Live Risk Composite</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {["Disease", "Air", "Water", "Waste", "Vax", "Maternal"].map((t, i) => (
            <button
              key={t}
              className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border transition-colors ${
                i < 3
                  ? "border-primary/50 text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:bg-surface-elevated"
              }`}
            >
              {t}
            </button>
          ))}
          <div className="h-5 w-px bg-border mx-1" />
          <IconButton icon={Layers} />
          <IconButton icon={Play} />
          <IconButton icon={Maximize2} />
        </div>
      </div>

      <div className="relative flex-1 grid-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-[0.18]">
          <path d="M5,55 Q20,40 35,48 T65,42 T95,55 L95,80 Q70,75 50,82 T10,78 Z" fill="oklch(0.4 0.04 200)" />
          <path d="M10,20 Q30,12 50,18 T90,22 L90,40 Q70,32 50,38 T15,36 Z" fill="oklch(0.32 0.04 220)" />
        </svg>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-30">
          <g stroke="oklch(0.55 0.05 200)" strokeWidth="0.15" fill="none">
            <path d="M0,30 Q40,28 60,40 T100,45" />
            <path d="M0,55 Q30,60 55,55 T100,62" />
            <path d="M20,0 Q22,30 30,55 T35,100" />
            <path d="M65,0 Q60,25 70,50 T75,100" />
          </g>
        </svg>

        {/* radar sweep over selected region */}
        <div
          className="absolute pointer-events-none transition-all duration-500"
          style={{
            left: `calc(${region.hotspot.x}% - 80px)`,
            top: `calc(${region.hotspot.y}% - 80px)`,
            width: 160,
            height: 160,
          }}
        >
          <div className="w-full h-full rounded-full radar-sweep opacity-50" />
        </div>

        {/* hotspots — all regions clickable */}
        {regions.map((r) => {
          const selected = r.id === region.id;
          return (
            <button
              key={r.id}
              onClick={() => setRegion(r)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
              style={{ left: `${r.hotspot.x}%`, top: `${r.hotspot.y}%` }}
              aria-label={`Drill into ${r.name}`}
            >
              <div
                className="rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{
                  width: r.hotspot.r * 2,
                  height: r.hotspot.r * 2,
                  background: `radial-gradient(circle, ${colorByLevel[r.hotspot.level]} 0%, transparent 65%)`,
                  opacity: selected ? 0.85 : 0.55,
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all"
                style={{
                  width: selected ? 12 : 8,
                  height: selected ? 12 : 8,
                  background: colorByLevel[r.hotspot.level],
                  boxShadow: `0 0 ${selected ? 24 : 12}px ${colorByLevel[r.hotspot.level]}`,
                  border: selected ? "2px solid var(--foreground)" : "none",
                }}
              />
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] text-mono whitespace-nowrap px-1.5 py-0.5 rounded border transition-colors ${
                  selected
                    ? "bg-background/90 border-primary text-primary"
                    : "bg-background/70 border-border opacity-80 group-hover:opacity-100"
                }`}
                style={!selected ? { color: colorByLevel[r.hotspot.level] } : undefined}
              >
                {r.name.split("—").pop()?.trim()}
              </div>
            </button>
          );
        })}

        {[
          ["top-2 left-2", "border-t border-l"],
          ["top-2 right-2", "border-t border-r"],
          ["bottom-2 left-2", "border-b border-l"],
          ["bottom-2 right-2", "border-b border-r"],
        ].map(([pos, b]) => (
          <div key={pos} className={`absolute ${pos} h-4 w-4 ${b} border-primary/60`} />
        ))}

        {/* selected region drill-down badge */}
        <div className="absolute top-3 left-3 panel-elevated p-2 pr-3 flex items-center gap-2 max-w-xs animate-fade-in" key={region.id}>
          <span className="h-2 w-2 rounded-full pulse-dot" style={{ background: colorByLevel[region.hotspot.level], color: colorByLevel[region.hotspot.level] }} />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Drill-down</div>
            <div className="text-xs font-medium">{region.name}</div>
            <div className="text-mono text-[10px] text-muted-foreground">{region.coords} · risk × {region.multiplier.toFixed(2)}</div>
          </div>
          {region.id !== regions[0].id && (
            <button
              onClick={() => setRegion(regions[0])}
              className="ml-1 h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-surface"
              aria-label="Reset region"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="absolute bottom-2 left-2 text-mono text-[10px] text-muted-foreground bg-background/60 backdrop-blur px-2 py-1 rounded border border-border">
          {region.coords} · zoom 13.4 · WGS84
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-background/60 backdrop-blur px-2 py-1 rounded border border-border">
          {(["low", "moderate", "critical"] as const).map((l) => (
            <span key={l} className="flex items-center gap-1 text-[10px] uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full" style={{ background: colorByLevel[l] }} />
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function IconButton({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <button className="h-7 w-7 flex items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground hover:bg-surface-elevated">
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

// satisfy unused-import complaint
export type { Region };
