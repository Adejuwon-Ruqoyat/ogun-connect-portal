import { createFileRoute } from "@tanstack/react-router";
import { MdaRequestPage } from "@/features/case-detail";
export const Route = createFileRoute("/mda/requests/$id")({
  head: () => ({ meta: [{ title: "Request Status — MDA Portal" }, { name: "description", content: "Track the status of an MDA request to the Bureau." }, { property: "og:title", content: "MDA Request Status" }, { property: "og:description", content: "Track your request with the Bureau." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: MdaRequestPage,
});
