import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, FileText, Pencil, Plus, Trash2, UploadCloud } from "lucide-react";
import { DashboardLayout, DashboardHeading } from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/page-state";
import { addCase } from "@/data/request-store";
import { ASSIGNED_OFFICER, CURRENT_MDA } from "@/data/mock-data";
import type { Position } from "@/types";

const steps = ["Request Information", "MDA Information", "Establishment Details", "Supporting Documents", "Review & Submit"];
const requestTypes = ["New Establishment", "Restructuring", "Modification of Existing Establishment"];
const requiredDocs = ["Organogram", "Justification memo", "Budget provision/evidence"];
type FormData = { requestTitle: string; requestType: string; requestingMda: string; responsibleDept: string; justification: string; mda: string; department: string; contactName: string; email: string; phone: string };
type Key = keyof FormData;
type LocalFile = { name: string; type: string; size: string };
const initial: FormData = { requestTitle: "", requestType: "", requestingMda: CURRENT_MDA, responsibleDept: "", justification: "", mda: CURRENT_MDA, department: "", contactName: "", email: "", phone: "" };
const emptyPos = { title: "", grade: "", existing: "", requested: "", unit: "", justification: "" };
type PosDraft = typeof emptyPos;

const fmtSize = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const fileType = (n: string) => (n.split(".").pop() ?? "FILE").toUpperCase();

export function EstablishmentRequestPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial);
  const [positions, setPositions] = useState<Position[]>([]);
  const [pos, setPos] = useState<PosDraft>(emptyPos);
  const [posErrors, setPosErrors] = useState<Partial<Record<keyof PosDraft, string>>>({});
  const [files, setFiles] = useState<Record<string, LocalFile | undefined>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [declared, setDeclared] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const update = (k: Key, v: string) => { setData((x) => ({ ...x, [k]: v })); setErrors((e) => { const n = { ...e }; delete n[k]; return n; }); };

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    const req: Key[][] = [["requestTitle", "requestType", "requestingMda", "responsibleDept", "justification"], ["mda", "department", "contactName", "email", "phone"]];
    (req[s] ?? []).forEach((k) => { if (!data[k].trim()) e[k] = "This field is required."; });
    if (s === 0 && data.justification.trim() && data.justification.trim().length < 20) e["justification"] = "Please provide at least 20 characters.";
    if (s === 1 && data.email && !/^\S+@\S+\.\S+$/.test(data.email)) e["email"] = "Enter a valid email address, e.g. name@ogunstate.gov.ng";
    if (s === 1 && data.phone && !/^[0-9+\s]{10,15}$/.test(data.phone)) e["phone"] = "Enter a valid phone number, e.g. 0803 456 7812";
    if (s === 2 && positions.length === 0) e["positions"] = "Add at least one requested position.";
    if (s === 3) requiredDocs.forEach((d) => { if (!files[d]) e[d] = `${d} is required.`; });
    if (s === 4 && !declared) e["declared"] = "You must confirm the declaration before submitting.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const next = () => { if (validate(step)) { setStep((x) => Math.min(4, x + 1)); window.scrollTo({ top: 0 }); } };

  const addPosition = () => {
    const e: Partial<Record<keyof PosDraft, string>> = {};
    (Object.keys(emptyPos) as (keyof PosDraft)[]).forEach((k) => { if (!pos[k].trim()) e[k] = "Required"; });
    if (pos.requested && Number(pos.requested) < 1) e.requested = "Must be at least 1";
    setPosErrors(e);
    if (Object.keys(e).length) return;
    setPositions((p) => [...p, { title: pos.title, grade: pos.grade, existing: Number(pos.existing), requested: Number(pos.requested), unit: pos.unit, justification: pos.justification }]);
    setPos(emptyPos);
    setErrors((x) => { const n = { ...x }; delete n["positions"]; return n; });
  };

  const submit = () => {
    if (!validate(4)) return;
    const ref = addCase({
      service: "Establishment Request", title: data.requestTitle, requestType: data.requestType, mda: data.mda, department: data.department,
      requester: data.contactName, email: data.email, phone: data.phone, justification: data.justification,
      submitted: "29 Sep 2026", updated: "29 Sep 2026", status: "Submitted", priority: "High", assignedTo: ASSIGNED_OFFICER, ageDays: 0,
      positions, checklist: [false, false, false, false, false], comments: [],
      documents: requiredDocs.map((d) => ({ label: d, name: files[d]?.name ?? "", type: files[d]?.type ?? "", size: files[d]?.size ?? "", status: "Pending review" as const })),
      timeline: [{ date: "29 Sep 2026", text: "Request submitted" }, { date: "29 Sep 2026", text: "Assigned to Establishment Officer" }],
    });
    setSubmitted(ref);
    window.scrollTo({ top: 0 });
  };

  if (submitted) return (
    <DashboardLayout role="MDA" title="Request submitted">
      <Card className="mx-auto max-w-3xl"><CardContent className="p-6 text-center sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/10 text-success"><CheckCircle2 className="size-9" /></span>
        <h1 className="mt-6 font-display text-2xl font-bold sm:text-3xl" role="status">Request submitted successfully</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">Keep your reference number for all correspondence with the Bureau.</p>
        <div className="mt-8 grid border text-left sm:grid-cols-2">
          <Info label="Reference Number" value={submitted} mono /><Info label="Status" value="Submitted" />
          <Info label="Submitted" value="29 September 2026" /><Info label="Next Step" value="A Bureau officer will review the submission." />
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild><Link to="/mda/requests/$id" params={{ id: submitted }}>View Request</Link></Button>
          <Button variant="outline" asChild><Link to="/mda/dashboard">Return to Dashboard</Link></Button>
        </div>
      </CardContent></Card>
    </DashboardLayout>
  );

  const err = (k: string) => errors[k];
  return (
    <DashboardLayout role="MDA" title="New Establishment Request">
      <DashboardHeading eyebrow="Digital service" title="Establishment Request" text="Request new posts, restructuring, or changes to an approved establishment." />
      <ol className="mb-8 grid grid-cols-5 gap-1" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s} className="text-center" aria-current={i === step ? "step" : undefined}>
            <div className={`mx-auto grid size-9 place-items-center rounded-full text-sm font-bold ${i < step ? "bg-success text-primary-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i < step ? <Check className="size-4" /> : i + 1}</div>
            <p className={`mt-2 hidden text-xs font-semibold md:block ${i === step ? "text-primary" : "text-muted-foreground"}`}>{s}</p>
          </li>
        ))}
      </ol>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Card className="min-w-0"><CardContent className="p-5 md:p-8">
          <p className="text-sm font-semibold text-primary">Step {step + 1} of 5</p>
          <h2 className="mt-1 font-display text-2xl font-bold">{steps[step]}</h2>
          {Object.keys(errors).length > 0 && <div role="alert" className="mt-5 border-l-4 border-destructive bg-destructive/5 p-3 text-sm text-destructive">Please correct the highlighted fields before continuing.</div>}
          <div className="mt-6">
            {step === 0 && <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field label="Request title" name="requestTitle" value={data.requestTitle} update={update} error={err("requestTitle")} /></div>
              <div className="sm:col-span-2"><Label htmlFor="requestType">Request type</Label>
                <Select value={data.requestType} onValueChange={(v) => update("requestType", v)}>
                  <SelectTrigger id="requestType" className="mt-2 w-full" aria-invalid={!!err("requestType")}><SelectValue placeholder="Select a request type" /></SelectTrigger>
                  <SelectContent>{requestTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>{err("requestType") && <ErrorText text={err("requestType")} />}</div>
              <Field label="Requesting MDA" name="requestingMda" value={data.requestingMda} update={update} error={err("requestingMda")} />
              <Field label="Responsible department" name="responsibleDept" value={data.responsibleDept} update={update} error={err("responsibleDept")} />
              <div className="sm:col-span-2"><Area label="Brief justification" name="justification" value={data.justification} update={update} error={err("justification")} /></div>
            </div>}
            {step === 1 && <div className="grid gap-5 sm:grid-cols-2">
              <Field label="MDA name" name="mda" value={data.mda} update={update} error={err("mda")} />
              <Field label="Department" name="department" value={data.department} update={update} error={err("department")} />
              <Field label="Contact officer" name="contactName" value={data.contactName} update={update} error={err("contactName")} />
              <Field label="Official email" name="email" type="email" value={data.email} update={update} error={err("email")} />
              <Field label="Phone number" name="phone" type="tel" value={data.phone} update={update} error={err("phone")} />
            </div>}
            {step === 2 && <div className="grid gap-6">
              <div className="border bg-muted/20 p-4">
                <h3 className="font-display font-bold">Add a requested position</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {([["title", "Position title", "text"], ["grade", "Grade level (e.g. GL 08)", "text"], ["existing", "Number of existing positions", "number"], ["requested", "Number requested", "number"], ["unit", "Proposed location/unit", "text"]] as const).map(([k, l, t]) => (
                    <div key={k}><Label htmlFor={`pos-${k}`}>{l}</Label><Input id={`pos-${k}`} type={t} min={0} value={pos[k]} onChange={(e) => setPos({ ...pos, [k]: e.target.value })} className="mt-2" aria-invalid={!!posErrors[k]} />{posErrors[k] && <ErrorText text={posErrors[k]} />}</div>
                  ))}
                  <div className="sm:col-span-2"><Label htmlFor="pos-justification">Justification</Label><Textarea id="pos-justification" value={pos.justification} onChange={(e) => setPos({ ...pos, justification: e.target.value })} className="mt-2" aria-invalid={!!posErrors.justification} />{posErrors.justification && <ErrorText text={posErrors.justification} />}</div>
                </div>
                <Button type="button" variant="outline" className="mt-4" onClick={addPosition}><Plus />Add Position</Button>
              </div>
              <div>
                <h3 className="mb-3 font-display font-bold">Requested positions ({positions.length})</h3>
                {positions.length ? <PositionsTable positions={positions} onRemove={(i) => setPositions(positions.filter((_, j) => j !== i))} /> : <EmptyState title="No positions added yet" text="Use the form above to add each position requested." />}
                {err("positions") && <ErrorText text={err("positions")} />}
              </div>
            </div>}
            {step === 3 && <div className="grid gap-4">
              {requiredDocs.map((d) => { const f = files[d]; return (
                <div key={d} className={`border p-4 ${err(d) ? "border-destructive" : ""}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{d} <span className="text-xs font-normal text-destructive">Required</span></p>{f && <span className="text-xs font-semibold text-success">Selected</span>}</div>
                  {f ? (
                    <div className="mt-3 flex items-center gap-3 bg-muted p-3 text-sm">
                      <FileText className="size-5 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1"><p className="truncate font-medium">{f.name}</p><p className="text-xs text-muted-foreground">{f.type} • {f.size}</p></div>
                      <Button variant="ghost" size="sm" onClick={() => setFiles({ ...files, [d]: undefined })} aria-label={`Remove ${f.name}`}><Trash2 />Remove</Button>
                    </div>
                  ) : (
                    <label className="mt-3 flex cursor-pointer flex-col items-center gap-2 border-2 border-dashed bg-muted/20 p-5 text-center text-sm focus-within:ring-2 focus-within:ring-ring">
                      <input type="file" className="sr-only" aria-label={`Upload ${d}`} accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(e) => { const x = e.target.files?.[0]; if (x) { setFiles({ ...files, [d]: { name: x.name, type: fileType(x.name), size: fmtSize(x.size) } }); setErrors((er) => { const n = { ...er }; delete n[d]; return n; }); } }} />
                      <UploadCloud className="size-7 text-primary" /><span className="font-semibold">Choose file</span><span className="text-xs text-muted-foreground">PDF, DOCX or XLSX up to 10 MB. Files stay on this device.</span>
                    </label>
                  )}
                  {err(d) && <ErrorText text={err(d)} />}
                </div>
              ); })}
            </div>}
            {step === 4 && <div className="grid gap-6">
              <Review title="Request information" onEdit={() => setStep(0)} rows={[["Title", data.requestTitle], ["Type", data.requestType], ["Requesting MDA", data.requestingMda], ["Responsible department", data.responsibleDept], ["Justification", data.justification]]} />
              <Review title="MDA information" onEdit={() => setStep(1)} rows={[["MDA", data.mda], ["Department", data.department], ["Contact officer", data.contactName], ["Email", data.email], ["Phone", data.phone]]} />
              <div><ReviewHead title="Establishment details" onEdit={() => setStep(2)} /><PositionsTable positions={positions} /></div>
              <Review title="Supporting documents" onEdit={() => setStep(3)} rows={requiredDocs.map((d) => [d, files[d] ? `${files[d]?.name} (${files[d]?.type}, ${files[d]?.size})` : ""])} />
              <label className={`flex cursor-pointer items-start gap-3 border p-4 text-sm ${err("declared") ? "border-destructive" : ""}`}>
                <Checkbox checked={declared} onCheckedChange={(v) => { setDeclared(v === true); setErrors({}); }} className="mt-0.5" />
                <span>I confirm that the information provided is accurate and that this request has been authorised by the Accounting Officer of the MDA.</span>
              </label>
              {err("declared") && <ErrorText text={err("declared")} />}
            </div>}
          </div>
          <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
            {step ? <Button variant="outline" onClick={() => { setErrors({}); setStep(step - 1); }}><ChevronLeft />Back</Button> : <Button variant="outline" asChild><Link to="/mda/dashboard"><ChevronLeft />Cancel</Link></Button>}
            {step < 4 ? <Button onClick={next}>Continue<ChevronRight /></Button> : <Button onClick={submit}>Submit Establishment Request<Check /></Button>}
          </div>
        </CardContent></Card>
        <aside><div className="border bg-background p-5 lg:sticky lg:top-28">
          <h3 className="font-display font-bold">Before you submit</h3>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground"><li>• Use your official MDA contact details.</li><li>• Ensure figures match the approved nominal roll.</li><li>• Attach the organogram, signed memo and budget evidence.</li></ul>
          <div className="mt-5 border-t pt-5"><p className="text-xs font-bold uppercase text-muted-foreground">Expected timeline</p><p className="mt-1 font-semibold">10–15 working days</p></div>
        </div></aside>
      </div>
    </DashboardLayout>
  );
}

export function PositionsTable({ positions, onRemove }: { positions: Position[]; onRemove?: ((i: number) => void) | undefined }) {
  return (
    <div className="border"><Table>
      <TableHeader><TableRow><TableHead>Position</TableHead><TableHead>Grade</TableHead><TableHead className="text-right">Existing</TableHead><TableHead className="text-right">Requested</TableHead><TableHead>Location/unit</TableHead><TableHead>Justification</TableHead>{onRemove && <TableHead />}</TableRow></TableHeader>
      <TableBody>
        {positions.map((p, i) => (
          <TableRow key={`${p.title}-${i}`}>
            <TableCell className="font-medium">{p.title}</TableCell><TableCell>{p.grade}</TableCell><TableCell className="text-right">{p.existing}</TableCell><TableCell className="text-right font-semibold">{p.requested}</TableCell><TableCell>{p.unit}</TableCell><TableCell className="min-w-48 whitespace-normal text-muted-foreground">{p.justification}</TableCell>
            {onRemove && <TableCell><Button variant="ghost" size="icon" onClick={() => onRemove(i)} aria-label={`Remove ${p.title}`}><Trash2 /></Button></TableCell>}
          </TableRow>
        ))}
        {positions.length > 0 && <TableRow className="bg-muted/40"><TableCell colSpan={3} className="font-semibold">Total requested</TableCell><TableCell className="text-right font-bold">{positions.reduce((a, p) => a + p.requested, 0)}</TableCell><TableCell colSpan={onRemove ? 3 : 2} /></TableRow>}
      </TableBody>
    </Table></div>
  );
}
function ErrorText({ text }: { text: string | undefined }) { return <p className="mt-1 text-xs text-destructive">{text}</p>; }
function Field({ label, name, value, update, error, type = "text" }: { label: string; name: Key; value: string; update: (k: Key, v: string) => void; error: string | undefined; type?: string }) {
  return <div><Label htmlFor={name}>{label}</Label><Input id={name} type={type} value={value} onChange={(e) => update(name, e.target.value)} className="mt-2" aria-invalid={!!error} aria-describedby={error ? `${name}-err` : undefined} />{error && <p id={`${name}-err`} className="mt-1 text-xs text-destructive">{error}</p>}</div>;
}
function Area({ label, name, value, update, error }: { label: string; name: Key; value: string; update: (k: Key, v: string) => void; error: string | undefined }) {
  return <div><Label htmlFor={name}>{label}</Label><Textarea id={name} value={value} onChange={(e) => update(name, e.target.value)} className="mt-2 min-h-28" aria-invalid={!!error} />{error && <ErrorText text={error} />}</div>;
}
function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) { return <div className="border-b p-5 sm:border-r"><p className="text-xs text-muted-foreground">{label}</p><p className={`mt-1 font-semibold ${mono ? "font-mono text-lg text-primary" : ""}`}>{value}</p></div>; }
function ReviewHead({ title, onEdit }: { title: string; onEdit: () => void }) { return <div className="mb-2 flex items-center justify-between"><h3 className="font-display font-bold">{title}</h3><Button variant="ghost" size="sm" onClick={onEdit}><Pencil />Edit</Button></div>; }
function Review({ title, rows, onEdit }: { title: string; rows: string[][]; onEdit: () => void }) {
  return <div><ReviewHead title={title} onEdit={onEdit} /><dl className="divide-y border">{rows.map(([k, v]) => <div key={k} className="grid gap-1 p-3 text-sm sm:grid-cols-[180px_1fr]"><dt className="text-muted-foreground">{k}</dt><dd className="break-words font-medium">{v || "—"}</dd></div>)}</dl></div>;
}
