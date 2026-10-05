import { createFileRoute } from "@tanstack/react-router";
import { EstablishmentRequestPage } from "@/features/establishment-request-form";
export const Route = createFileRoute("/mda/requests/new/establishment")({
  head: () => ({ meta: [{ title: "New Establishment Request — MDA Portal" }, { name: "description", content: "Five-step establishment request for Ogun State MDAs." }, { property: "og:title", content: "New Establishment Request" }, { property: "og:description", content: "A guided establishment request service for Ogun State MDAs." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: EstablishmentRequestPage,
});
