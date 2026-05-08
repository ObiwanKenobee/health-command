import { createFileRoute } from "@tanstack/react-router";
import { ModuleStub } from "@/components/dashboard/ModuleStub";

export const Route = createFileRoute("/surveillance")({
  head: () => ({
    meta: [
      { title: "Disease Surveillance — HEARTGRID" },
      { name: "description", content: "Early outbreak detection before hospitals overflow." },
    ],
  }),
  component: () => (
    <ModuleStub
      title="Disease Surveillance"
      description="Early outbreak detection before hospitals overflow."
      bullets={["Live outbreak map with color-coded spread","Real-time disease event feed","AI symptom-cluster anomaly graph","Risk timeline + outbreak progression","Heatmap layers: malaria, cholera, TB, respiratory, diarrheal",]}
    />
  ),
});
