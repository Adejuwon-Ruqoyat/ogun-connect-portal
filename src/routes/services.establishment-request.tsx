import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy public URL: the working application now lives in the MDA workspace.
export const Route = createFileRoute("/services/establishment-request")({
  beforeLoad: () => {
    throw redirect({ to: "/mda/requests/new/establishment" });
  },
});
