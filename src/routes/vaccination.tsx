import { createFileRoute } from "@tanstack/react-router";
import { ModuleStub } from "@/components/dashboard/ModuleStub";

export const Route = createFileRoute("/vaccination")({
  head: () => ({
    meta: [
      { title: "Vaccination Intelligence — HEARTGRID" },
      { name: "description", content: "Predictive immunization vulnerability." },
    ],
  }),
  component: () => (
    <ModuleStub
      title="Vaccination Intelligence"
      description="Predictive immunization vulnerability."
      bullets={["Neighborhood-level coverage map","AI detection of probable missed households","Cold chain integrity monitoring","CHW outreach planner","Outbreak probability from coverage decline",]}
    />
  ),
});
