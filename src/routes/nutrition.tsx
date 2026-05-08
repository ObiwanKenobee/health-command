import { createFileRoute } from "@tanstack/react-router";
import { ModuleStub } from "@/components/dashboard/ModuleStub";

export const Route = createFileRoute("/nutrition")({
  head: () => ({
    meta: [
      { title: "Nutrition Vulnerability — HEARTGRID" },
      { name: "description", content: "Food insecurity and malnutrition analytics." },
    ],
  }),
  component: () => (
    <ModuleStub
      title="Nutrition Vulnerability"
      description="Food insecurity and malnutrition analytics."
      bullets={["Household food-security index","Acute malnutrition early warning","Market price & supply-shock signals","Maternal & under-5 nutrition risk overlays",]}
    />
  ),
});
