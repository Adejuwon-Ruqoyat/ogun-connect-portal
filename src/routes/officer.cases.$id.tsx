import { createFileRoute } from "@tanstack/react-router";
import { OfficerCasePage } from "@/features/case-detail";
export const Route = createFileRoute("/officer/cases/$id")({
  head: () => ({ meta: [{ title: "Case Review — Ogun State Bureau" }, { name: "description", content: "Review an assigned Bureau case and its workflow." }, { property: "og:title", content: "Bureau Case Review" }, { property: "og:description", content: "Officer case detail and workflow." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: OfficerCasePage,
});
