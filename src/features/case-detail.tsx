import { useState } from "react";
import { ArrowLeft, Check, Download, FileText, Send } from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout, DashboardHeading } from "@/layouts/dashboard-layout";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/page-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PositionsTable } from "@/features/establishment-request-form";
import { TODAY, updateCase, useCase } from "@/data/case-store";
import type { CaseRecord, Status } from "@/types";

const checklistItems = ["Organisational justification reviewed", "Organogram attached", "Budget provision confirmed", "Proposed positions reviewed", "Establishment implications assessed"];
const actions: { label: string; to: Status; event: string; allowed: Status[]; variant?: "outline" }[] = [
  { label: "Start Review", to: "Under Review", event: "Under review", allowed: ["Submitted", "Clarification Required"] },
  { label: "Request Clarification", to: "Clarification Required", event: "Clarification requested from MDA", allowed: ["Submitted", "Under Review"], variant: "outline" },
  { label: "Recommend Approval", to: "Recommended", event: "Recommended for approval", allowed: ["Under Review"], variant: "outline" },
  { label: "Reject", to: "Rejected", event: "Request rejected", allowed: ["Submitted", "Under Review", "Clarification Required", "Recommended"], variant: "outline" },
  { label: "Close Case", to: "Closed", event: "Case closed", allowed: ["Approved", "Rejected", "Recommended"], variant: "outline" },
];

type Mode = "Officer" | "Management" | "MDA";
export function OfficerCasePage() { const { id } = useParams({ from: "/officer/cases/$id" }); return <CaseView id={id} mode="Officer" />; }
export function ManagementCasePage() { const { id } = useParams({ from: "/management/cases/$id" }); return <CaseView id={id} mode="Management" />; }
export function MdaRequestPage() { const { id } = useParams({ from: "/mda/requests/$id" }); return <CaseView id={id} mode="MDA" />; }
/** Back-compat export */
export const CaseDetailPage = OfficerCasePage;

const homes = { Officer: "/officer/dashboard", Management: "/management/dashboard", MDA: "/mda/dashboard" } as const;

function CaseView({ id, mode }: { id: string; mode: Mode }) {
  const c = useCase(id);
  const [comment, setComment] = useState("");
  const readOnly = mode !== "Officer";
  if (!c) return <DashboardLayout role={mode} title="Case not found"><EmptyState /><div className="mt-4 text-center"><Button asChild variant="outline"><Link to={homes[mode]}>Back to dashboard</Link></Button></div></DashboardLayout>;

  const act = (a: (typeof actions)[number]) => {
    updateCase(c.id, (x) => ({ ...x, status: a.to, updated: TODAY, timeline: [...x.timeline, { date: TODAY, text: a.event }] }));
    toast.success(`Status changed to ${a.to}`);
  };
  const addComment = () => {
    const text = comment.trim(); if (!text) return;
    updateCase(c.id, (x) => ({ ...x, updated: TODAY, comments: [...x.comments, { author: x.assignedOfficer, date: TODAY, text }], timeline: [...x.timeline, { date: TODAY, text: "Internal note added" }] }));
    setComment(""); toast.success("Comment added");
  };
  const toggle = (i: number) => updateCase(c.id, (x) => ({ ...x, checklist: x.checklist.map((v, j) => (i === j ? !v : v)) }));
  const totalReq = c.positions.reduce((n, p) => n + p.requested, 0);

  return (
    <DashboardLayout role={mode} title={mode === "MDA" ? "Request Status" : mode === "Management" ? "Case Overview (read-only)" : "Case Detail"}>
      <Link to={homes[mode]} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="size-4" />Back to dashboard</Link>
      <DashboardHeading eyebrow={c.service} title={c.id} text={c.title} action={<div className="flex flex-wrap gap-2"><PriorityBadge priority={c.priority} /><StatusBadge status={c.status} /></div>} />
      <div className="grid gap-6 xl:grid-cols-[1.45fr_.65fr]">
        <div className="grid min-w-0 gap-6">
          <Card><CardContent className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
            <Datum label="MDA" value={c.mda} /><Datum label="Requesting officer" value={c.requester} /><Datum label="Submission date" value={c.submitted} />
            <div><p className="text-xs font-bold uppercase text-muted-foreground">Current status</p><div className="mt-1"><StatusBadge status={c.status} /></div></div>
            <div><p className="text-xs font-bold uppercase text-muted-foreground">Priority</p><div className="mt-1"><PriorityBadge priority={c.priority} /></div></div>
            <Datum label="Assigned officer" value={c.assignedOfficer} />
          </CardContent></Card>
          <Panel title="A. Request summary"><div className="grid gap-5 sm:grid-cols-3"><Datum label="Request type" value={c.requestType} /><Datum label="Department" value={c.department} /><Datum label="Contact" value={`${c.email} • ${c.phone}`} /></div><p className="mt-5 border-t pt-5 text-sm leading-6">{c.summary}</p></Panel>
          <Panel title="B. Establishment details"><p className="mb-3 text-sm text-muted-foreground">{c.positions.length} position type(s), {totalReq} posts requested</p><PositionsTable positions={c.positions} /></Panel>
          <Panel title="C. Supporting documents"><div className="grid gap-2">{c.documents.length ? c.documents.map((f) => (
            <div key={f.name} className="flex flex-wrap items-center gap-3 border p-3"><FileText className="size-5 text-primary" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{f.name}</p><p className="text-xs text-muted-foreground">{f.category} • {f.type} • {f.size}</p></div>
              <Badge variant="outline" className={f.status === "Verified" ? "border-success/30 bg-success/10 text-success" : "border-gold/30 bg-gold/10 text-gold-foreground"}>{f.status}</Badge>
              {!readOnly && f.status !== "Verified" && <Button size="sm" variant="ghost" onClick={() => updateCase(c.id, (x) => ({ ...x, documents: x.documents.map((d) => (d.name === f.name ? { ...d, status: "Verified" } : d)) }))}>Mark verified</Button>}
              <Button variant="ghost" size="icon" aria-label={`Download ${f.name}`} onClick={() => toast.info("Mock download — files are not stored in this prototype")}><Download /></Button></div>
          )) : <p className="text-sm text-muted-foreground">No documents attached.</p>}</div></Panel>
          {mode !== "MDA" && <Panel title="D. Review checklist"><div className="grid gap-3">{checklistItems.map((x, i) => (
            <label key={x} className="flex items-center gap-3 border p-3 text-sm"><Checkbox disabled={readOnly} checked={c.checklist[i] ?? false} onCheckedChange={() => toggle(i)} /><span className="flex-1 font-medium">{x}</span><span className={`text-xs ${c.checklist[i] ? "text-success" : "text-muted-foreground"}`}>{c.checklist[i] ? "Complete" : "Pending"}</span></label>
          ))}</div></Panel>}
          {mode !== "MDA" && <Panel title="E. Comments & internal notes"><div className="grid gap-3">{c.comments.length ? c.comments.map((n, i) => <div key={i} className="border-l-2 border-primary bg-muted/40 p-3 text-sm"><p>{n.text}</p><p className="mt-1 text-xs text-muted-foreground">{n.author} • {n.date}</p></div>) : <p className="text-sm text-muted-foreground">No comments yet.</p>}</div>
            {!readOnly && <div className="mt-4 flex gap-2"><Textarea aria-label="New internal note" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add an internal review note…" /><Button size="icon" className="h-auto" disabled={!comment.trim()} onClick={addComment} aria-label="Add comment"><Send /></Button></div>}
          </Panel>}
        </div>
        <aside className="grid content-start gap-6">
          {mode === "Officer" && <Panel title="G. Workflow actions"><div className="grid gap-2">{actions.map((a) => <Button key={a.label} variant={a.variant ?? "default"} className={a.to === "Rejected" ? "text-destructive" : ""} disabled={!a.allowed.includes(c.status)} onClick={() => act(a)}>{a.label}</Button>)}</div><p className="mt-3 text-xs text-muted-foreground">Actions available depend on the current status.</p></Panel>}
          {mode === "Management" && c.status === "Recommended" && <Panel title="Management decision"><div className="grid gap-2"><Button onClick={() => { updateCase(c.id, (x) => ({ ...x, status: "Approved", updated: TODAY, timeline: [...x.timeline, { date: TODAY, text: "Approved by Management" }] })); toast.success("Request approved"); }}>Approve request</Button></div></Panel>}
          <Panel title="F. Case timeline"><div className="border-l pl-5">{[...c.timeline].reverse().map((t, i) => <div key={i} className="relative pb-5 last:pb-0"><span className="absolute -left-[25px] top-1 size-2 rounded-full bg-primary" /><p className="text-sm font-semibold">{t.text}</p><p className="text-xs text-muted-foreground">{t.date}</p></div>)}</div></Panel>
          {mode === "MDA" && c.status === "Clarification Required" && <Panel title="Action required"><p className="text-sm text-muted-foreground">The Bureau has requested clarification. Please contact the assigned officer, {c.assignedOfficer}.</p></Panel>}
        </aside>
      </div>
    </DashboardLayout>
  );
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <Card className="min-w-0"><CardHeader><CardTitle className="font-display text-lg">{title}</CardTitle></CardHeader><CardContent>{children}</CardContent></Card>; }
function Datum({ label, value }: { label: string; value: string }) { return <div className="min-w-0"><p className="text-xs font-bold uppercase text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm font-semibold">{value}</p></div>; }
export type { CaseRecord };
