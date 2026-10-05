import { createFileRoute } from "@tanstack/react-router";
import { ManagementCasePage } from "@/features/case-detail";
export const Route = createFileRoute("/management/cases/$id")({
  head: () => ({ meta: [{ title: "Case Overview — Bureau Management" }, { name: "description", content: "Read-only management view of a Bureau case." }, { property: "og:title", content: "Management Case Overview" }, { property: "og:description", content: "Read-only case view for Bureau management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ManagementCasePage,
});
