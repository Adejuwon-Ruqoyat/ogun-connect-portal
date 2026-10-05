import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/services/establishment-request")({
  beforeLoad: () => { throw redirect({ to: "/mda/requests/new/establishment" }); },
});
