import { createFileRoute } from "@tanstack/react-router";
import { ModuleStub } from "@/components/dashboard/ModuleStub";

export const Route = createFileRoute("/data")({
  head: () => ({
    meta: [
      { title: "Data & Verification — HEARTGRID" },
      { name: "description", content: "Sensor validation and source-confidence scoring." },
    ],
  }),
  component: () => (
    <ModuleStub
      title="Data & Verification"
      description="Sensor validation and source-confidence scoring."
      bullets={["Sensor health & calibration status","Source confidence & provenance trails","Anomaly detection on data streams","Data steward review queue",]}
    />
  ),
});
