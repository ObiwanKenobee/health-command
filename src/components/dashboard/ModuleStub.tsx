import { Construction } from "lucide-react";

export function ModuleStub({
  title,
  description,
  bullets,
}: {
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="panel p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded bg-primary/15 text-primary flex items-center justify-center">
            <Construction className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Module</div>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-5">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {bullets.map((b) => (
            <div key={b} className="panel-elevated p-3 text-sm flex items-start gap-2">
              <span className="text-primary text-mono text-xs mt-0.5">▸</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 text-[11px] text-muted-foreground text-mono">
          Phase 1 (Kibera Pilot) ships: Surveillance · Waste-Health · CHW · Vaccination · Risk Alerts · Emergency Feed.
        </div>
      </div>
    </div>
  );
}
