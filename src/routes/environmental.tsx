import { createFileRoute } from "@tanstack/react-router";
import { ModuleStub } from "@/components/dashboard/ModuleStub";

export const Route = createFileRoute("/environmental")({
  head: () => ({
    meta: [
      { title: "Environmental Health — HEARTGRID" },
      { name: "description", content: "Connecting air, water and waste signals to disease risk." },
    ],
  }),
  component: () => (
    <ModuleStub
      title="Environmental Health"
      description="Connecting air, water and waste signals to disease risk."
      bullets={["PM2.5, smoke, industrial & indoor air analytics","Water contamination & sewer overflow alerts","Waste → mosquito breeding → disease correlation","Flood & drainage risk forecasting",]}
    />
  ),
});
