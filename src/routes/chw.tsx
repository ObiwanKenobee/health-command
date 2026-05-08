import { createFileRoute } from "@tanstack/react-router";
import { ModuleStub } from "@/components/dashboard/ModuleStub";

export const Route = createFileRoute("/chw")({
  head: () => ({
    meta: [
      { title: "CHW Operations — HEARTGRID" },
      { name: "description", content: "Field intelligence agents — mobile-first." },
    ],
  }),
  component: () => (
    <ModuleStub
      title="CHW Operations"
      description="Field intelligence agents — mobile-first."
      bullets={["Field reports: symptoms, water, waste, household needs","AI-assisted route optimization","Risk-tracked household registry","Daily task assignment board","Offline sync for low-connectivity zones",]}
    />
  ),
});
