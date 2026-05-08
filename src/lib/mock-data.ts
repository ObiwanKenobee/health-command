export type RiskLevel = "low" | "moderate" | "critical";

export const regions = [
  "Nairobi — Kibera",
  "Nairobi — Mathare",
  "Nairobi — Mukuru",
  "Kakuma Refugee Settlement",
  "Mombasa Coastal Belt",
];

export const metrics = [
  {
    id: "disease",
    label: "Disease Risk Index",
    value: "72",
    unit: "/100",
    delta: "+18%",
    trend: "up" as const,
    status: "critical" as RiskLevel,
    detail: "Dengue cluster — Sector C-7",
    sparkline: [12, 18, 22, 28, 24, 31, 38, 42, 48, 56, 64, 72],
  },
  {
    id: "water",
    label: "Water Safety",
    value: "12",
    unit: "zones",
    delta: "contaminated",
    trend: "up" as const,
    status: "critical" as RiskLevel,
    detail: "E. coli detected at 4 boreholes",
    sparkline: [3, 4, 5, 5, 7, 8, 9, 10, 11, 12, 12, 12],
  },
  {
    id: "air",
    label: "Respiratory Risk",
    value: "184",
    unit: "PM2.5",
    delta: "+34",
    trend: "up" as const,
    status: "moderate" as RiskLevel,
    detail: "Eastern industrial corridor elevated",
    sparkline: [80, 92, 110, 130, 142, 150, 158, 162, 170, 176, 180, 184],
  },
  {
    id: "vax",
    label: "Vaccination Coverage",
    value: "76",
    unit: "%",
    delta: "−4.2%",
    trend: "down" as const,
    status: "moderate" as RiskLevel,
    detail: "428 likely missed children",
    sparkline: [82, 81, 81, 80, 79, 79, 78, 78, 77, 77, 76, 76],
  },
  {
    id: "maternal",
    label: "Maternal Health",
    value: "23",
    unit: "urgent",
    delta: "high-risk",
    trend: "up" as const,
    status: "critical" as RiskLevel,
    detail: "Pregnancies flagged for escalation",
    sparkline: [10, 11, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23],
  },
  {
    id: "waste",
    label: "Waste Overflow",
    value: "8",
    unit: "sites",
    delta: "threshold breach",
    trend: "up" as const,
    status: "moderate" as RiskLevel,
    detail: "Mosquito breeding correlation +62%",
    sparkline: [2, 3, 3, 4, 4, 5, 5, 6, 7, 7, 8, 8],
  },
];

export const events = [
  { t: "14:32:08", region: "Kibera • Soweto West", level: "critical" as RiskLevel, kind: "OUTBREAK", msg: "Cholera cluster confirmed — 14 cases in 6h" },
  { t: "14:29:51", region: "Mathare • 4B", level: "moderate" as RiskLevel, kind: "SENSOR", msg: "PM2.5 sustained > 150 µg/m³ for 90 min" },
  { t: "14:27:14", region: "Mukuru • Kwa Njenga", level: "critical" as RiskLevel, kind: "WATER", msg: "Borehole 17 — fecal coliform exceeded" },
  { t: "14:24:02", region: "Kibera • Laini Saba", level: "moderate" as RiskLevel, kind: "CHW", msg: "Field report: 3 households w/ acute diarrhea" },
  { t: "14:21:44", region: "Kakuma • Zone 3", level: "low" as RiskLevel, kind: "VAX", msg: "Outreach completed — 184 children immunized" },
  { t: "14:18:22", region: "Kibera • Gatwekera", level: "critical" as RiskLevel, kind: "MATERNAL", msg: "Emergency escalation — pregnancy ID 0931" },
  { t: "14:15:09", region: "Mukuru • Lunga Lunga", level: "moderate" as RiskLevel, kind: "WASTE", msg: "Overflow detected — drainage canal 7" },
  { t: "14:12:55", region: "Mombasa • Likoni", level: "low" as RiskLevel, kind: "AI", msg: "Forecast: dengue probability +12% next 7d" },
];

export const hotspots = [
  { id: 1, x: 28, y: 42, r: 36, level: "critical" as RiskLevel, label: "Kibera C-7" },
  { id: 2, x: 52, y: 38, r: 28, level: "critical" as RiskLevel, label: "Mathare 4B" },
  { id: 3, x: 64, y: 58, r: 22, level: "moderate" as RiskLevel, label: "Mukuru" },
  { id: 4, x: 38, y: 64, r: 18, level: "moderate" as RiskLevel, label: "Kawangware" },
  { id: 5, x: 72, y: 28, r: 14, level: "low" as RiskLevel, label: "Eastleigh" },
  { id: 6, x: 18, y: 70, r: 12, level: "low" as RiskLevel, label: "Karen edge" },
  { id: 7, x: 80, y: 70, r: 20, level: "moderate" as RiskLevel, label: "Embakasi" },
];

export const forecast = [
  { d: "Mon", actual: 42, predicted: 44 },
  { d: "Tue", actual: 48, predicted: 50 },
  { d: "Wed", actual: 56, predicted: 58 },
  { d: "Thu", actual: 64, predicted: 66 },
  { d: "Fri", actual: 72, predicted: 78 },
  { d: "Sat", actual: null, predicted: 86 },
  { d: "Sun", actual: null, predicted: 92 },
];
