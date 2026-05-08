import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  fmtNow,
  initialEvents,
  metricSpecs,
  regions,
  sampleIncoming,
  type Region,
  type RiskLevel,
} from "./mock-data";

export type StreamEvent = {
  id: string;
  t: string;
  region: string;
  level: RiskLevel;
  kind: string;
  msg: string;
  isNew?: boolean;
};

export type MetricSnapshot = {
  id: string;
  label: string;
  unit: string;
  value: number;
  display: string;
  delta: string;
  trend: "up" | "down";
  status: RiskLevel;
  detail: string;
  why: string;
  history: number[]; // sparkline
};

type Ctx = {
  region: Region;
  setRegion: (r: Region) => void;
  metrics: MetricSnapshot[];
  events: StreamEvent[];
  filter: RiskLevel | "all";
  setFilter: (f: RiskLevel | "all") => void;
  addEvent: (ev: Omit<StreamEvent, "id" | "t" | "isNew">) => void;
  escalateOpen: boolean;
  setEscalateOpen: (b: boolean) => void;
};

const HeartgridCtx = createContext<Ctx | null>(null);

const HISTORY_LEN = 18;

function statusFor(spec: typeof metricSpecs[number], v: number): RiskLevel {
  const { worseDirection, thresholds } = spec;
  if (worseDirection === "up") {
    if (v >= thresholds.critical) return "critical";
    if (v >= thresholds.moderate) return "moderate";
    return "low";
  }
  if (v <= thresholds.critical) return "critical";
  if (v <= thresholds.moderate) return "moderate";
  return "low";
}

function buildInitialMetrics(region: Region): MetricSnapshot[] {
  return metricSpecs.map((s) => {
    const value = +(s.base * region.multiplier).toFixed(s.decimals ?? 0);
    const history = Array.from({ length: HISTORY_LEN }, (_, i) => {
      const k = (i + 1) / HISTORY_LEN;
      const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * 0.04;
      return +(value * (0.55 + 0.45 * k + noise)).toFixed(s.decimals ?? 0);
    });
    return snapshotFromHistory(s, history, region);
  });
}

function snapshotFromHistory(s: typeof metricSpecs[number], history: number[], region: Region): MetricSnapshot {
  const value = history[history.length - 1];
  const prev = history[history.length - 2] ?? value;
  const change = value - prev;
  const pct = prev === 0 ? 0 : (change / prev) * 100;
  const trend: "up" | "down" = change >= 0 ? "up" : "down";
  return {
    id: s.id,
    label: s.label,
    unit: s.unit,
    value,
    display: s.decimals ? value.toFixed(s.decimals) : `${Math.round(value)}`,
    delta: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
    trend,
    status: statusFor(s, value),
    detail: s.detail(region, value),
    why: s.why,
    history,
  };
}

export function HeartgridProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegion] = useState<Region>(regions[0]);
  const [metrics, setMetrics] = useState<MetricSnapshot[]>(() => buildInitialMetrics(regions[0]));
  const [events, setEvents] = useState<StreamEvent[]>(() =>
    initialEvents.map((e) => ({ ...e }))
  );
  const [filter, setFilter] = useState<RiskLevel | "all">("all");
  const [escalateOpen, setEscalateOpen] = useState(false);
  const idRef = useRef(1000);

  // Reset metrics when region changes
  useEffect(() => {
    setMetrics(buildInitialMetrics(region));
  }, [region]);

  // Tick metrics every 3s — random walk towards a region-scaled target
  useEffect(() => {
    const t = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m, idx) => {
          const spec = metricSpecs[idx];
          const target = spec.base * region.multiplier;
          const drift = (target - m.value) * 0.04;
          const noise = (Math.random() - 0.5) * target * 0.06;
          let next = m.value + drift + noise;
          next = Math.max(0, next);
          const decimals = spec.decimals ?? 0;
          next = +next.toFixed(decimals);
          const history = [...m.history.slice(1), next];
          return snapshotFromHistory(spec, history, region);
        })
      );
    }, 3000);
    return () => clearInterval(t);
  }, [region]);

  const addEvent = useCallback((ev: Omit<StreamEvent, "id" | "t" | "isNew">) => {
    const id = `e${++idRef.current}`;
    setEvents((prev) => [{ id, t: fmtNow(), isNew: true, ...ev }, ...prev].slice(0, 80));
    // remove "isNew" highlight after a moment
    setTimeout(() => {
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, isNew: false } : e)));
    }, 2500);
  }, []);

  // Auto-incoming events every 5–9s
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 5000 + Math.random() * 4000;
      timer = setTimeout(() => {
        const t = sampleIncoming[Math.floor(Math.random() * sampleIncoming.length)];
        const r = regions[Math.floor(Math.random() * regions.length)];
        addEvent({ region: r.name.split("—").pop()?.trim() ?? r.name, ...t });
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [addEvent]);

  const value = useMemo<Ctx>(
    () => ({ region, setRegion, metrics, events, filter, setFilter, addEvent, escalateOpen, setEscalateOpen }),
    [region, metrics, events, filter, addEvent, escalateOpen]
  );

  return <HeartgridCtx.Provider value={value}>{children}</HeartgridCtx.Provider>;
}

export function useHeartgrid() {
  const ctx = useContext(HeartgridCtx);
  if (!ctx) throw new Error("useHeartgrid must be used inside HeartgridProvider");
  return ctx;
}
