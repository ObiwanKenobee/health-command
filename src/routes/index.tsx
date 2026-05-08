import { createFileRoute } from "@tanstack/react-router";
import { LiveMap } from "@/components/dashboard/LiveMap";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { AIPanel } from "@/components/dashboard/AIPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mission Control — HEARTGRID" },
      { name: "description", content: "Live preventive public health intelligence for Nairobi, Kibera and climate-vulnerable regions." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="h-full grid grid-cols-12 gap-3 p-3 overflow-hidden">
      {/* Left + center: Map + Metrics */}
      <section className="col-span-12 xl:col-span-9 flex flex-col gap-3 min-h-0">
        <div className="flex-1 min-h-[320px]">
          <LiveMap />
        </div>
        <div className="shrink-0">
          <MetricsGrid />
        </div>
      </section>

      {/* Right: AI assistant */}
      <aside className="col-span-12 xl:col-span-3 min-h-0">
        <AIPanel />
      </aside>
    </div>
  );
}
