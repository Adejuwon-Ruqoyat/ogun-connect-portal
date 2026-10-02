import { createFileRoute } from "@tanstack/react-router";
import { CaseDetailPage } from "@/features/case-detail";
function Page() { const { id } = Route.useParams(); return <CaseDetailPage id={id} mode="officer" />; }
export const Route = createFileRoute("/officer/cases/$id")({
  head: () => ({ meta: [{ title: "Case Review — Ogun State Bureau" }, { name: "description", content: "Case Review in the Bureau digital service." }, { property: "og:title", content: "Case Review" }, { property: "og:description", content: "Case Review in the Bureau digital service." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Page,
});
