import { useState } from "react";
import { ArrowLeft, Check, Download, FileText, Send } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { DashboardLayout, DashboardHeading } from "@/layouts/dashboard-layout";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/page-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PositionsTable } from "@/features/establishment-request-form";
import { checklistItems, ASSIGNED_OFFICER } from "@/data/mock-data";
import { nowLabel, updateCase, useCase } from "@/data/request-store";
import type { Status } from "@/types";

type Mode = "officer" | "management" | "mda";
const roleOf = { officer: "Officer", management: "Management", mda: "MDA" } as const;
const back = { officer: ["/officer/dashboard", "Back to work queue"], management: ["/management/dashboard", "Back to management dashboard"], mda: ["/mda/dashboard", "Back to dashboard"] } as const;
const actions: { label: string; to: Status; from: Status[]; event: string; variant?: "outline" }[] = [
  { label: "Start Review", to: "Under Review", from: ["Submitted", "Clarification Required"], event: "Under review" },
  { label: "Request Clarification", to: "Clarification Required", from: ["Submitted", "Under Review"], event: "Clarification requested from MDA", variant: "outline" },
  { label: "Recommend Approval", to: "Recommended", from: ["Under Review"], event: "Recommended for approval", variant: "outline" },
  { label: "Reject", to: "Rejected", from: ["Submitted", "Under Review", "Clarification Required"], event: "Request rejected", variant: "outline" },
  { label: "Close Case", to: "Closed", from: ["Approved", "Rejected", "Recommended"], event: "Case closed", variant: "outline" },
];

export function CaseDetailPage({ id, mode }: { id: string; mode: Mode }) {
  const c = useCase(id);
  const [comment, setComment] = useState("");
  const [notice, setNotice] = useState("");
  const [b, backLabel] = back[mode];
  const role = roleOf[mode];
  if (!c) return <DashboardLayout role={role} title="Case not found"><Link to={b} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="size-4" />{backLabel}</Link><EmptyState title={`No case found for ${id}`} text="Check the reference number and try again." /></DashboardLayout>;
  const officer = mode === "officer";
  const act = (a: (typeof actions)[number]) => {
    updateCase(c.ref, (x) => ({ ...x, status: a.to, updated: "Today", timeline: [...x.timeline, { date: nowLabel(), text: `${a.event} by ${ASSIGNED_OFFICER}` }] }));
    setNotice(`Status updated to “${a.to}”. The MDA has been notified.`);
  };
  const addComment = () => {
    const text = comment.trim(); if (!text) return;
    updateCase(c.ref, (x) => ({ ...x, comments: [...x.comments, { author: ASSIGNED_OFFICER, date: nowLabel(), text }], timeline: [...x.timeline, { date: nowLabel(), text: "Internal note added" }] }));
    setComment(""); setNotice("Comment added to the case record.");
  };
  return (
    <DashboardLayout role={role} title={mode === "management" ? "Case overview (read-only)" : mode === "mda" ? "Request status" : "Case Detail"}>
      <Link to={b} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="size-4" />{backLabel}</Link>
      <DashboardHeading eyebrow={c.service} title={c.ref} text={c.title} action={<div className="flex flex-wrap gap-2"><PriorityBadge priority={c.priority} /><StatusBadge status={c.status} /></div>} />
      {notice && <div role="status" className="mb-6 flex items-center gap-2 border-l-4 border-success bg-success/10 p-3 text-sm font-medium"><Check className="size-4 text-success" />{notice}</div>}
      {mode !== "officer" && <div className="mb-6 border bg-muted/40 p-3 text-sm text-muted-foreground">Read-only view. Workflow actions are performed by the assigned Bureau officer.</div>}
      <div className="grid gap-6 xl:grid-cols-[1.45fr_.65fr]">
        <div className="grid min-w-0 content-start gap-6">
          <Card><CardContent className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
            <Datum label="MDA" value={c.mda} /><Datum label="Requesting officer" value={c.requester} /><Datum label="Submission date" value={c.submitted} />
            <div><p className="text-xs font-bold uppercase text-muted-foreground">Current status</p><div className="mt-1"><StatusBadge status={c.status} /></div></div>
            <div><p className="text-xs font-bold uppercase text-muted-foreground">Priority</p><div className="mt-1"><PriorityBadge priority={c.priority} /></div></div>
            <Datum label="Assigned officer" value={c.assignedTo} />
          </CardContent></Card>
          <Panel title="A. Request summary"><div className="grid gap-5 sm:grid-cols-2"><Datum label="Request title" value={c.title} /><Datum label="Request type" value={c.requestType} /><Datum label="Department" value={c.department} /><Datum label="Contact" value={`${c.email} • ${c.phone}`} /></div><div className="mt-5 border-t pt-5"><p className="text-xs font-bold uppercase text-muted-foreground">Justification</p><p className="mt-2 text-sm leading-6">{c.justification}</p></div></Panel>
          <Panel title="B. Establishment details">{c.positions.length ? <PositionsTable positions={c.positions} /> : <EmptyState title="No positions on this request" text="This service does not include establishment positions." />}</Panel>
          <Panel title="C. Supporting documents"><div className="border"><Table><TableHeader><TableRow><TableHead>Document</TableHead><TableHead>File</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader><TableBody>{c.documents.map((d) => <TableRow key={d.label}><TableCell className="font-medium">{d.label}</TableCell><TableCell><span className="flex items-center gap-2"><FileText className="size-4 shrink-0 text-primary" /><span><span className="block">{d.name}</span><span className="text-xs text-muted-foreground">{d.type} • {d.size}</span></span></span></TableCell><TableCell><Badge variant="outline" className={d.status === "Verified" ? "border-success/20 bg-success/10 text-success" : "border-warning/30 bg-warning/10 text-warning-foreground"}>{d.status}</Badge></TableCell><TableCell><Button variant="ghost" size="icon" aria-label={`Download ${d.name}`} onClick={() => setNotice(`Mock download of ${d.name} started.`)}><Download /></Button></TableCell></TableRow>)}</TableBody></Table></div></Panel>
          <Panel title="D. Review checklist"><div className="grid gap-2">{checklistItems.map((x, i) => { const done = c.checklist[i] ?? false; return (
            <label key={x} className={`flex items-center gap-3 border p-3 text-sm ${officer ? "cursor-pointer" : ""}`}>
              <Checkbox checked={done} disabled={!officer} onCheckedChange={() => updateCase(c.ref, (y) => ({ ...y, checklist: checklistItems.map((_, j) => (j === i ? !(y.checklist[j] ?? false) : (y.checklist[j] ?? false))) }))} />
              <span className="flex-1 font-medium">{x}</span><span className={`text-xs font-semibold ${done ? "text-success" : "text-muted-foreground"}`}>{done ? "Complete" : "Pending"}</span>
            </label>); })}</div><p className="mt-3 text-xs text-muted-foreground">{c.checklist.filter(Boolean).length} of {checklistItems.length} checks complete</p></Panel>
          <Panel title="E. Comments & internal notes"><div className="grid gap-3">{c.comments.length ? c.comments.map((n, i) => <div key={i} className="border-l-2 border-primary bg-muted/40 p-3 text-sm"><p>{n.text}</p><p className="mt-1 text-xs text-muted-foreground">{n.author} • {n.date}</p></div>) : <p className="text-sm text-muted-foreground">No comments yet.</p>}</div>
            {officer && <div className="mt-4 flex gap-2"><Textarea aria-label="Add an internal note" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add an internal review note…" /><Button className="h-auto" disabled={!comment.trim()} onClick={addComment} aria-label="Add comment"><Send />Add</Button></div>}</Panel>
        </div>
        <aside className="grid content-start gap-6">
          {officer && <Panel title="G. Workflow actions"><div className="grid gap-2">{actions.map((a) => <Button key={a.label} variant={a.variant ?? "default"} className={a.to === "Rejected" ? "text-destructive" : ""} disabled={!a.from.includes(c.status)} onClick={() => act(a)}>{a.label}</Button>)}</div><p className="mt-3 text-xs text-muted-foreground">Only actions valid for the current status are enabled.</p></Panel>}
          <Panel title="F. Case timeline"><ol className="border-l pl-5">{[...c.timeline].reverse().map((t, i) => <li key={i} className="relative pb-5 last:pb-0"><span className="absolute -left-[25px] top-1.5 size-2 rounded-full bg-primary" /><p className="text-sm font-semibold">{t.text}</p><p className="text-xs text-muted-foreground">{t.date}</p></li>)}</ol></Panel>
        </aside>
      </div>
    </DashboardLayout>
  );
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <Card className="min-w-0"><CardHeader><CardTitle className="font-display text-lg">{title}</CardTitle></CardHeader><CardContent>{children}</CardContent></Card>; }
function Datum({ label, value }: { label: string; value: string }) { return <div className="min-w-0"><p className="text-xs font-bold uppercase text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm font-semibold">{value}</p></div>; }
