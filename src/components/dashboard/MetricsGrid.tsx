import { metrics, type RiskLevel } from "@/lib/mock-data";
import { TrendingUp, TrendingDown } from "lucide-react";

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
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {metrics.map((m) => (
        <div
          key={m.id}
          className={`panel p-3 border-l-2 ${statusBorder[m.status]} relative overflow-hidden hover:bg-surface-elevated/40 transition-colors`}
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
              <div className={`text-mono text-3xl font-semibold ${statusColor[m.status]}`}>{m.value}</div>
              <div className="text-xs text-muted-foreground">{m.unit}</div>
              <div className={`ml-auto flex items-center gap-1 text-[11px] ${statusColor[m.status]}`}>
                {m.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span className="text-mono">{m.delta}</span>
              </div>
            </div>
            <Sparkline data={m.sparkline} status={m.status} />
            <div className="text-[11px] text-muted-foreground mt-1.5 truncate">{m.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Sparkline({ data, status }: { data: number[]; status: RiskLevel }) {
  const w = 200, h = 32, pad = 2;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => [pad + i * step, h - pad - ((v - min) / range) * (h - pad * 2)]);
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const area = `${d} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`;
  const stroke = status === "critical" ? "var(--status-critical)" : status === "moderate" ? "var(--status-moderate)" : "var(--status-low)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8 mt-1.5" preserveAspectRatio="none">
      <path d={area} fill={stroke} opacity="0.15" />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.4" />
    </svg>
  );
}
