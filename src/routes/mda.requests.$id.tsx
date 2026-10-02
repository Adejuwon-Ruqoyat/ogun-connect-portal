import { createFileRoute } from "@tanstack/react-router";
import { CaseDetailPage } from "@/features/case-detail";
function Page() { const { id } = Route.useParams(); return <CaseDetailPage id={id} mode="mda" />; }
export const Route = createFileRoute("/mda/requests/$id")({
  head: () => ({ meta: [{ title: "Request Status — Ogun State Bureau" }, { name: "description", content: "Request Status in the Bureau digital service." }, { property: "og:title", content: "Request Status" }, { property: "og:description", content: "Request Status in the Bureau digital service." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Page,
});
