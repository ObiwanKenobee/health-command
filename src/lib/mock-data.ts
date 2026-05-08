export type RiskLevel = "low" | "moderate" | "critical";

export type Region = {
  id: string;
  name: string;
  multiplier: number; // base risk scaling
  coords: string;
  hotspot: { x: number; y: number; r: number; level: RiskLevel };
};

export const regions: Region[] = [
  { id: "kibera",    name: "Nairobi — Kibera",          multiplier: 1.00, coords: "1°18′S 36°47′E", hotspot: { x: 28, y: 42, r: 36, level: "critical" } },
  { id: "mathare",   name: "Nairobi — Mathare",         multiplier: 0.86, coords: "1°15′S 36°51′E", hotspot: { x: 52, y: 38, r: 28, level: "critical" } },
  { id: "mukuru",    name: "Nairobi — Mukuru",          multiplier: 0.78, coords: "1°19′S 36°53′E", hotspot: { x: 64, y: 58, r: 22, level: "moderate" } },
  { id: "kawang",    name: "Nairobi — Kawangware",      multiplier: 0.62, coords: "1°17′S 36°44′E", hotspot: { x: 38, y: 64, r: 18, level: "moderate" } },
  { id: "embakasi",  name: "Nairobi — Embakasi",        multiplier: 0.71, coords: "1°19′S 36°53′E", hotspot: { x: 80, y: 70, r: 20, level: "moderate" } },
  { id: "eastleigh", name: "Nairobi — Eastleigh",       multiplier: 0.48, coords: "1°16′S 36°51′E", hotspot: { x: 72, y: 28, r: 14, level: "low" } },
  { id: "kakuma",    name: "Kakuma Refugee Settlement", multiplier: 0.92, coords: "3°43′N 34°51′E", hotspot: { x: 18, y: 70, r: 22, level: "moderate" } },
  { id: "mombasa",   name: "Mombasa Coastal Belt",      multiplier: 0.55, coords: "4°03′S 39°40′E", hotspot: { x: 80, y: 18, r: 16, level: "low" } },
];

export type MetricSpec = {
  id: string;
  label: string;
  unit: string;
  base: number;            // base value at multiplier 1
  decimals?: number;
  worseDirection: "up" | "down"; // does going up = worse?
  detail: (region: Region, value: number) => string;
  thresholds: { moderate: number; critical: number }; // applied to value (after sign)
  why: string;
};

export const metricSpecs: MetricSpec[] = [
  {
    id: "disease",
    label: "Disease Risk Index",
    unit: "/100",
    base: 72,
    worseDirection: "up",
    thresholds: { moderate: 45, critical: 65 },
    detail: (r) => `Dengue + cholera composite — ${r.name.split("—").pop()?.trim()}`,
    why: "Rainfall + waste overflow correlation crossed 0.78 in last 72h.",
  },
  {
    id: "water",
    label: "Water Safety",
    unit: "zones",
    base: 12,
    worseDirection: "up",
    thresholds: { moderate: 5, critical: 9 },
    detail: () => "E. coli detected at multiple boreholes",
    why: "Sewer overflow event upstream raised contamination probability.",
  },
  {
    id: "air",
    label: "Respiratory Risk",
    unit: "PM2.5",
    base: 184,
    worseDirection: "up",
    thresholds: { moderate: 100, critical: 160 },
    detail: () => "Eastern industrial corridor elevated",
    why: "Wind shifted SE; industrial plume now intersects residential grid.",
  },
  {
    id: "vax",
    label: "Vaccination Coverage",
    unit: "%",
    base: 76,
    worseDirection: "down",
    thresholds: { moderate: 85, critical: 75 },
    detail: () => "Likely missed children flagged",
    why: "Outreach gap of 11 days; coverage decline precedes outbreak by 11d.",
  },
  {
    id: "maternal",
    label: "Maternal Health",
    unit: "urgent",
    base: 23,
    worseDirection: "up",
    thresholds: { moderate: 10, critical: 18 },
    detail: () => "High-risk pregnancies flagged",
    why: "Travel-time to clinic > 45 min for 38% of cases.",
  },
  {
    id: "waste",
    label: "Waste Overflow",
    unit: "sites",
    base: 8,
    worseDirection: "up",
    thresholds: { moderate: 4, critical: 7 },
    detail: () => "Mosquito breeding correlation +62%",
    why: "Drainage canal blockage detected after recent rainfall.",
  },
];

export const initialEvents = [
  { id: "e1", t: nowMinus(2),  region: "Kibera • Soweto West",  level: "critical" as RiskLevel, kind: "OUTBREAK", msg: "Cholera cluster confirmed — 14 cases in 6h" },
  { id: "e2", t: nowMinus(5),  region: "Mathare • 4B",          level: "moderate" as RiskLevel, kind: "SENSOR",   msg: "PM2.5 sustained > 150 µg/m³ for 90 min" },
  { id: "e3", t: nowMinus(8),  region: "Mukuru • Kwa Njenga",   level: "critical" as RiskLevel, kind: "WATER",    msg: "Borehole 17 — fecal coliform exceeded" },
  { id: "e4", t: nowMinus(11), region: "Kibera • Laini Saba",   level: "moderate" as RiskLevel, kind: "CHW",      msg: "Field report: 3 households w/ acute diarrhea" },
  { id: "e5", t: nowMinus(15), region: "Kakuma • Zone 3",       level: "low"      as RiskLevel, kind: "VAX",      msg: "Outreach completed — 184 children immunized" },
  { id: "e6", t: nowMinus(19), region: "Kibera • Gatwekera",    level: "critical" as RiskLevel, kind: "MATERNAL", msg: "Emergency escalation — pregnancy ID 0931" },
  { id: "e7", t: nowMinus(24), region: "Mukuru • Lunga Lunga",  level: "moderate" as RiskLevel, kind: "WASTE",    msg: "Overflow detected — drainage canal 7" },
  { id: "e8", t: nowMinus(29), region: "Mombasa • Likoni",      level: "low"      as RiskLevel, kind: "AI",       msg: "Forecast: dengue probability +12% next 7d" },
];

function nowMinus(min: number) {
  const d = new Date(Date.now() - min * 60_000);
  return d.toTimeString().slice(0, 8);
}

export function fmtNow() {
  return new Date().toTimeString().slice(0, 8);
}

// Simulated incoming events to drip into the stream
export const sampleIncoming = [
  { kind: "SENSOR",   level: "moderate" as RiskLevel, msg: "Air quality crossed PM2.5 = 165 µg/m³" },
  { kind: "WATER",    level: "critical" as RiskLevel, msg: "Turbidity spike — distribution node 4" },
  { kind: "CHW",      level: "low"      as RiskLevel, msg: "Household survey complete — 28 dwellings" },
  { kind: "OUTBREAK", level: "critical" as RiskLevel, msg: "Suspected typhoid — 2 new cases reported" },
  { kind: "VAX",      level: "moderate" as RiskLevel, msg: "Cold-chain alert — fridge B3 at +9°C" },
  { kind: "WASTE",    level: "moderate" as RiskLevel, msg: "Bin overflow — collection SLA breached" },
  { kind: "AI",       level: "low"      as RiskLevel, msg: "Model retrained — F1 0.87 → 0.91" },
  { kind: "MATERNAL", level: "critical" as RiskLevel, msg: "ANC missed visit — 3rd trimester case" },
];

export const forecast = [
  { d: "Mon", actual: 42, predicted: 44, why: "Baseline" },
  { d: "Tue", actual: 48, predicted: 50, why: "Rainfall +14mm raised vector index" },
  { d: "Wed", actual: 56, predicted: 58, why: "Waste collection skipped 2 routes" },
  { d: "Thu", actual: 64, predicted: 66, why: "Borehole contamination event" },
  { d: "Fri", actual: 72, predicted: 78, why: "Cluster confirmed — Soweto West" },
  { d: "Sat", actual: null, predicted: 86, why: "Projected: spread to adjacent grid" },
  { d: "Sun", actual: null, predicted: 92, why: "Projected: clinic capacity stress" },
];
