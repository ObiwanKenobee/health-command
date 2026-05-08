import { createFileRoute } from "@tanstack/react-router";
import { ModuleStub } from "@/components/dashboard/ModuleStub";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency Response — HEARTGRID" },
      { name: "description", content: "Crisis-mode coordination across agencies." },
    ],
  }),
  component: () => (
    <ModuleStub
      title="Emergency Response"
      description="Crisis-mode coordination across agencies."
      bullets={["Incident command panel","Resource deployment tracker","Cross-agency communications layer","Localized public alert broadcasts",]}
    />
  ),
});
