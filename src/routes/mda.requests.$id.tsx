import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout, DashboardHeading } from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/page-state";
import { PositionsTable } from "@/features/establishment-request-form";
import { useCase } from "@/data/case-store";

export const Route = createFileRoute("/mda/requests/$id")({
  head: () => ({
    meta: [
      { title: "Request Status — Ogun State Bureau" },
      { name: "description", content: "Track the status of your MDA request." },
      { property: "og:title", content: "Request Status" },
      { property: "og:description", content: "MDA request status and timeline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MdaRequestView,
});

function MdaRequestView() {
  const { id } = Route.useParams();
  const c = useCase(id);
  return (
    <DashboardLayout role="MDA" title="Request status">
      {!c ? <EmptyState title="Request not found" /> : <>
        <DashboardHeading eyebrow={c.service} title={c.id} text={c.title} action={<Button variant="outline" asChild><Link to="/mda/dashboard">Return to Dashboard</Link></Button>} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="min-w-0"><CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-3"><StatusBadge status={c.status} /><span className="text-sm text-muted-foreground">Submitted {c.submitted} · Updated {c.lastUpdated}</span></div>
            <h3 className="mt-6 font-display font-bold">Requested positions</h3>
            <div className="mt-2"><PositionsTable rows={c.positions} /></div>
          </CardContent></Card>
          <Card><CardContent className="p-5"><h3 className="font-display font-bold">Timeline</h3>
            <ol className="mt-4 grid gap-4 border-l pl-4 text-sm">{c.timeline.map((t, i) => <li key={i}><p className="font-semibold">{t.text}</p><p className="text-xs text-muted-foreground">{t.date} · {t.by}</p></li>)}</ol>
          </CardContent></Card>
        </div>
      </>}
    </DashboardLayout>
  );
}
