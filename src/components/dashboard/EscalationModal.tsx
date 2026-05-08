import { useEffect, useState } from "react";
import { Siren, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useHeartgrid } from "@/lib/store";
import { regions, type RiskLevel } from "@/lib/mock-data";

const incidentKinds = [
  { id: "OUTBREAK", label: "Disease Outbreak" },
  { id: "WATER",    label: "Water Contamination" },
  { id: "WASTE",    label: "Waste / Sanitation" },
  { id: "MATERNAL", label: "Maternal Emergency" },
  { id: "SENSOR",   label: "Environmental Hazard" },
  { id: "CHW",      label: "Field Incident" },
];

export function EscalationModal() {
  const { escalateOpen, setEscalateOpen, addEvent, region } = useHeartgrid();
  const [kind, setKind] = useState("OUTBREAK");
  const [level, setLevel] = useState<RiskLevel>("critical");
  const [regionId, setRegionId] = useState(region.id);
  const [msg, setMsg] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (escalateOpen) {
      setKind("OUTBREAK");
      setLevel("critical");
      setRegionId(region.id);
      setMsg("");
      setConfirmed(false);
    }
  }, [escalateOpen, region.id]);

  if (!escalateOpen) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = regions.find((x) => x.id === regionId) ?? region;
    const text = msg.trim() || `${incidentKinds.find((k) => k.id === kind)?.label} reported`;
    addEvent({
      kind,
      level,
      region: r.name.split("—").pop()?.trim() ?? r.name,
      msg: `[ESCALATED] ${text}`,
    });
    setConfirmed(true);
    setTimeout(() => setEscalateOpen(false), 1100);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={() => setEscalateOpen(false)}
      />
      <div className="relative panel-elevated w-full max-w-lg overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-status-critical via-accent to-status-critical" />
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <div className="h-8 w-8 rounded bg-status-critical/15 text-status-critical flex items-center justify-center">
            <Siren className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-status-critical">Emergency Escalation</div>
            <div className="text-sm font-semibold">File a new incident to HEARTGRID Command</div>
          </div>
          <button
            onClick={() => setEscalateOpen(false)}
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-surface text-muted-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {confirmed ? (
          <div className="p-8 flex flex-col items-center text-center gap-3 animate-scale-in">
            <CheckCircle2 className="h-12 w-12 text-status-low" />
            <div className="text-base font-medium">Incident logged</div>
            <div className="text-xs text-muted-foreground">Event broadcast to live stream and on-call coordinators.</div>
          </div>
        ) : (
          <form onSubmit={submit} className="p-4 space-y-4">
            <Field label="Incident type">
              <div className="grid grid-cols-3 gap-1.5">
                {incidentKinds.map((k) => (
                  <button
                    type="button"
                    key={k.id}
                    onClick={() => setKind(k.id)}
                    className={`text-[11px] px-2 py-1.5 rounded border transition-colors ${
                      kind === k.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-surface"
                    }`}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Severity">
              <div className="flex gap-1.5">
                {(["low", "moderate", "critical"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded border text-[11px] uppercase tracking-wider transition-colors ${
                      level === l
                        ? l === "critical" ? "border-status-critical bg-status-critical/10 text-status-critical"
                        : l === "moderate" ? "border-status-moderate bg-status-moderate/10 text-status-moderate"
                        : "border-status-low bg-status-low/10 text-status-low"
                        : "border-border text-muted-foreground hover:bg-surface"
                    }`}
                  >
                    <span>●</span>{l}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Region">
              <select
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="w-full bg-surface border border-border rounded px-2 py-1.5 text-xs outline-none focus:border-primary"
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Description">
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={3}
                placeholder="What is happening on the ground? Be specific (location, count, symptoms)."
                className="w-full bg-surface border border-border rounded px-2 py-1.5 text-xs outline-none focus:border-primary resize-none"
              />
            </Field>

            <div className="flex items-start gap-2 panel p-2 text-[11px] text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5 text-status-moderate mt-0.5 shrink-0" />
              <span>Critical escalations notify on-call coordinators in &lt; 60s and trigger the incident command panel.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEscalateOpen(false)}
                className="px-3 py-1.5 rounded text-xs border border-border hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded text-xs font-medium bg-status-critical text-destructive-foreground hover:opacity-90 inline-flex items-center gap-1.5"
              >
                <Siren className="h-3.5 w-3.5" />
                Escalate now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}
