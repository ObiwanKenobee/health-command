import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Activity,
  Wind,
  Baby,
  Syringe,
  Apple,
  Users,
  Brain,
  Siren,
  ShieldCheck,
} from "lucide-react";

const items = [
  { to: "/", label: "Mission Control", icon: LayoutDashboard, badge: null },
  { to: "/surveillance", label: "Disease Surveillance", icon: Activity, badge: "3" },
  { to: "/environmental", label: "Environmental Health", icon: Wind, badge: null },
  { to: "/maternal", label: "Maternal & Child", icon: Baby, badge: "23" },
  { to: "/vaccination", label: "Vaccination Intel", icon: Syringe, badge: null },
  { to: "/nutrition", label: "Nutrition Vulnerability", icon: Apple, badge: null },
  { to: "/chw", label: "CHW Operations", icon: Users, badge: "12" },
  { to: "/forecasting", label: "AI Forecasting", icon: Brain, badge: null },
  { to: "/emergency", label: "Emergency Response", icon: Siren, badge: "!" },
  { to: "/data", label: "Data & Verification", icon: ShieldCheck, badge: null },
] as const;

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="w-64 shrink-0 border-r border-border bg-surface/60 backdrop-blur-sm flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Modules</div>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {items.map((it) => {
          const Icon = it.icon;
          const active = path === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`group relative flex items-center gap-3 px-4 py-2.5 text-sm border-l-2 transition-colors ${
                active
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{it.label}</span>
              {it.badge && (
                <span
                  className={`text-mono text-[10px] px-1.5 py-0.5 rounded ${
                    it.badge === "!"
                      ? "bg-status-critical/20 text-status-critical"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {it.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="panel-elevated p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Active Pilot
          </div>
          <div className="text-sm font-medium">Kibera Phase 1</div>
          <div className="text-mono text-[10px] text-status-low mt-1">● 247 CHWs online</div>
        </div>
      </div>
    </aside>
  );
}
