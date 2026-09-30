import { createFileRoute } from "@tanstack/react-router";
import { EstablishmentRequestPage } from "@/features/establishment-request-form";

export const Route = createFileRoute("/mda/requests/new/establishment")({
  head: () => ({
    meta: [
      { title: "New Establishment Request — Ogun State Bureau" },
      { name: "description", content: "Complete the five-step establishment request for your MDA." },
      { property: "og:title", content: "New Establishment Request" },
      { property: "og:description", content: "Guided establishment request for Ogun State MDAs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EstablishmentRequestPage,
});
