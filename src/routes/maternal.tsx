import { createFileRoute } from "@tanstack/react-router";
import { ModuleStub } from "@/components/dashboard/ModuleStub";

export const Route = createFileRoute("/maternal")({
  head: () => ({
    meta: [
      { title: "Maternal & Child Health — HEARTGRID" },
      { name: "description", content: "Protect the highest-risk populations first." },
    ],
  }),
  component: () => (
    <ModuleStub
      title="Maternal & Child Health"
      description="Protect the highest-risk populations first."
      bullets={["High-risk pregnancy tracker with priority scoring","Neonatal monitoring & vulnerability mapping","Clinic capacity: beds, staff, medicine, readiness","Care access analytics & travel barriers","Emergency escalation alerts",]}
    />
  ),
});
