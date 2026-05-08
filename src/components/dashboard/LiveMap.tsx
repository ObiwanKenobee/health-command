import { hotspots } from "@/lib/mock-data";
import { Layers, Maximize2, Play, Crosshair } from "lucide-react";

const colorByLevel: Record<string, string> = {
  critical: "var(--status-critical)",
  moderate: "var(--status-moderate)",
  low: "var(--status-low)",
};

export function LiveMap() {
  return (
    <div className="panel relative overflow-hidden h-full flex flex-col">
      {/* Header */}
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

      {/* Map canvas */}
      <div className="relative flex-1 grid-bg overflow-hidden">
        {/* gradient sky */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        {/* faux landmasses */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-[0.18]">
          <path d="M5,55 Q20,40 35,48 T65,42 T95,55 L95,80 Q70,75 50,82 T10,78 Z" fill="oklch(0.4 0.04 200)" />
          <path d="M10,20 Q30,12 50,18 T90,22 L90,40 Q70,32 50,38 T15,36 Z" fill="oklch(0.32 0.04 220)" />
        </svg>
        {/* faux road grid */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-30">
          <g stroke="oklch(0.55 0.05 200)" strokeWidth="0.15" fill="none">
            <path d="M0,30 Q40,28 60,40 T100,45" />
            <path d="M0,55 Q30,60 55,55 T100,62" />
            <path d="M20,0 Q22,30 30,55 T35,100" />
            <path d="M65,0 Q60,25 70,50 T75,100" />
          </g>
        </svg>

        {/* radar sweep over center */}
        <div className="absolute" style={{ left: "28%", top: "42%", width: "40%", height: "60%", transformOrigin: "0 0" }}>
          <div className="w-full h-full rounded-full radar-sweep opacity-50 pointer-events-none" />
        </div>

        {/* hotspots */}
        {hotspots.map((h) => (
          <div
            key={h.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            <div
              className="rounded-full"
              style={{
                width: h.r * 2,
                height: h.r * 2,
                background: `radial-gradient(circle, ${colorByLevel[h.level]} 0%, transparent 65%)`,
                opacity: 0.55,
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full"
              style={{ background: colorByLevel[h.level], boxShadow: `0 0 12px ${colorByLevel[h.level]}` }}
            />
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] text-mono whitespace-nowrap px-1.5 py-0.5 rounded bg-background/70 border border-border"
              style={{ color: colorByLevel[h.level] }}
            >
              {h.label}
            </div>
          </div>
        ))}

        {/* corner crosshair markers */}
        {[
          ["top-2 left-2", "border-t border-l"],
          ["top-2 right-2", "border-t border-r"],
          ["bottom-2 left-2", "border-b border-l"],
          ["bottom-2 right-2", "border-b border-r"],
        ].map(([pos, b]) => (
          <div key={pos} className={`absolute ${pos} h-4 w-4 ${b} border-primary/60`} />
        ))}

        {/* coordinates HUD */}
        <div className="absolute bottom-2 left-2 text-mono text-[10px] text-muted-foreground bg-background/60 backdrop-blur px-2 py-1 rounded border border-border">
          1°17′S 36°49′E · zoom 13.4 · WGS84
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
