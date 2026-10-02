import { createFileRoute } from "@tanstack/react-router";
import { CaseDetailPage } from "@/features/case-detail";
function Page() { const { id } = Route.useParams(); return <CaseDetailPage id={id} mode="management" />; }
export const Route = createFileRoute("/management/cases/$id")({
  head: () => ({ meta: [{ title: "Management Case View — Ogun State Bureau" }, { name: "description", content: "Management Case View in the Bureau digital service." }, { property: "og:title", content: "Management Case View" }, { property: "og:description", content: "Management Case View in the Bureau digital service." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Page,
});
