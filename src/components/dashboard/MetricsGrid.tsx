import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { useHeartgrid } from "@/lib/store";
import type { RiskLevel } from "@/lib/mock-data";
import type { MetricSnapshot } from "@/lib/store";

const statusColor: Record<RiskLevel, string> = {
  low: "text-status-low",
  moderate: "text-status-moderate",
  critical: "text-status-critical",
};
const statusBorder: Record<RiskLevel, string> = {
  low: "border-l-status-low",
  moderate: "border-l-status-moderate",
  critical: "border-l-status-critical",
};

export function MetricsGrid() {
  const { metrics, region } = useHeartgrid();
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Critical Health Metrics · {region.name}
        </div>
        <div className="text-mono text-[10px] text-status-low flex items-center gap-1">
          <span className="pulse-dot">●</span> Live · refreshes every 3s
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.map((m) => <MetricCard key={m.id} m={m} />)}
      </div>
    </div>
  );
}

function MetricCard({ m }: { m: MetricSnapshot }) {
  return (
    <div
      className={`panel p-3 border-l-2 ${statusBorder[m.status]} relative overflow-hidden hover:bg-surface-elevated/40 transition-all duration-300`}
    >
      {m.status === "critical" && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-critical)" }} />
      )}
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{m.label}</div>
          <span className={`pulse-dot text-[10px] ${statusColor[m.status]}`}>●</span>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <div key={m.display} className={`text-mono text-3xl font-semibold animate-fade-in ${statusColor[m.status]}`}>
            {m.display}
          </div>
          <div className="text-xs text-muted-foreground">{m.unit}</div>
          <div className={`ml-auto flex items-center gap-1 text-[11px] ${statusColor[m.status]}`}>
            {m.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span className="text-mono">{m.delta}</span>
          </div>
        </div>
        <Sparkline data={m.history} status={m.status} />
        <div className="text-[11px] text-muted-foreground mt-1.5 truncate">{m.detail}</div>
        <div className="mt-1 text-[10px] text-muted-foreground/80 flex items-start gap-1">
          <Info className="h-2.5 w-2.5 mt-0.5 shrink-0" />
          <span className="line-clamp-1">{m.why}</span>
        </div>
      </div>
    </div>
  );
}

function Sparkline({ data, status }: { data: number[]; status: RiskLevel }) {
  const w = 200, h = 32, pad = 2;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => [pad + i * step, h - pad - ((v - min) / range) * (h - pad * 2)] as const);
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const area = `${d} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`;
  const stroke =
    status === "critical" ? "var(--status-critical)" :
    status === "moderate" ? "var(--status-moderate)" : "var(--status-low)";
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8 mt-1.5" preserveAspectRatio="none">
      <path d={area} fill={stroke} opacity="0.15" />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.4" />
      <circle cx={last[0]} cy={last[1]} r="2" fill={stroke}>
        <animate attributeName="r" values="2;3.5;2" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
