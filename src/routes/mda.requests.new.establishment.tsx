import { createFileRoute } from "@tanstack/react-router";
import { EstablishmentRequestPage } from "@/features/establishment-request-form";
function Page() { return <EstablishmentRequestPage />; }
export const Route = createFileRoute("/mda/requests/new/establishment")({
  head: () => ({ meta: [{ title: "New Establishment Request — Ogun State Bureau" }, { name: "description", content: "New Establishment Request in the Bureau digital service." }, { property: "og:title", content: "New Establishment Request" }, { property: "og:description", content: "New Establishment Request in the Bureau digital service." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Page,
});
