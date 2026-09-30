import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, FileText, Loader2, Pencil, Plus, Save, Trash2, UploadCloud } from "lucide-react";
import { DashboardLayout, DashboardHeading } from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { CURRENT_MDA, submitCase } from "@/data/case-store";
import type { CaseDocument, CaseRecord, Position } from "@/types";

const steps = ["Request Information", "MDA Information", "Establishment Details", "Supporting Documents", "Review & Submit"];
const requestTypes = ["New Establishment", "Restructuring", "Modification of Existing Establishment"];
const docCategories = ["Organogram", "Justification memo", "Budget provision/evidence"];

type Info = { title: string; requestType: string; requestingMda: string; responsibleDept: string; justification: string; mdaName: string; department: string; contactOfficer: string; email: string; phone: string };
type Key = keyof Info;
const initial: Info = { title: "", requestType: "", requestingMda: CURRENT_MDA, responsibleDept: "", justification: "", mdaName: CURRENT_MDA, department: "", contactOfficer: "", email: "", phone: "" };
const emptyPos = { title: "", grade: "", existing: "", requested: "", unit: "", justification: "" };
type PosDraft = typeof emptyPos;
const stepFields: Key[][] = [["title", "requestType", "requestingMda", "responsibleDept", "justification"], ["mdaName", "department", "contactOfficer", "email", "phone"], [], [], []];

const fmtSize = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export function EstablishmentRequestPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial);
  const [positions, setPositions] = useState<Position[]>([]);
  const [pos, setPos] = useState<PosDraft>(emptyPos);
  const [posErrors, setPosErrors] = useState<Partial<Record<keyof PosDraft, string>>>({});
  const [docs, setDocs] = useState<CaseDocument[]>([]);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [declared, setDeclared] = useState(false);
  const [draftMsg, setDraftMsg] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<CaseRecord | null>(null);
  const update = (k: Key, v: string) => { setData((x) => ({ ...x, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    (stepFields[s] ?? []).forEach((k) => { if (!data[k].trim()) e[k] = "This field is required."; });
    if (s === 1) {
      if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) e["email"] = "Enter a valid email address, e.g. name@ogunstate.gov.ng";
      if (data.phone && !/^[0-9+ ]{10,15}$/.test(data.phone)) e["phone"] = "Enter a valid phone number (10–15 digits).";
    }
    if (s === 2 && positions.length === 0) e["positions"] = "Add at least one requested position.";
    if (s === 3) docCategories.forEach((c) => { if (!docs.some((d) => d.category === c)) e[`doc-${c}`] = `${c} is required.`; });
    if (s === 4 && !declared) e["declared"] = "You must confirm the declaration before submitting.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const next = () => { if (validate(step)) { setStep((x) => Math.min(4, x + 1)); window.scrollTo({ top: 0 }); } };

  const addPosition = () => {
    const e: Partial<Record<keyof PosDraft, string>> = {};
    (Object.keys(emptyPos) as (keyof PosDraft)[]).forEach((k) => { if (!pos[k].trim()) e[k] = "Required"; });
    if (pos.existing && Number(pos.existing) < 0) e.existing = "Must be 0 or more";
    if (pos.requested && Number(pos.requested) < 1) e.requested = "Must be at least 1";
    setPosErrors(e);
    if (Object.keys(e).length) return;
    setPositions((p) => [...p, { ...pos, existing: Number(pos.existing), requested: Number(pos.requested) }]);
    setPos(emptyPos);
    setErrors((x) => ({ ...x, positions: undefined }));
  };

  const pickFile = (category: string, list: FileList | null) => {
    const f = list?.[0];
    if (!f) return;
    setDocs((d) => [...d.filter((x) => x.category !== category), { category, name: f.name, type: (f.name.split(".").pop() ?? "file").toUpperCase(), size: fmtSize(f.size), status: "Pending verification" }]);
    setErrors((x) => ({ ...x, [`doc-${category}`]: undefined }));
  };

  const submit = () => {
    if (!validate(4)) return;
    setSubmitting(true);
    setTimeout(() => {
      const rec = submitCase({ title: data.title, requestType: data.requestType, mda: data.mdaName, department: data.department || data.responsibleDept, requester: data.contactOfficer, email: data.email, phone: data.phone, justification: data.justification, positions, documents: docs });
      setSubmitting(false);
      setDone(rec);
      window.scrollTo({ top: 0 });
    }, 700);
  };

  if (done) return (
    <DashboardLayout role="MDA" title="Request submitted">
      <div className="mx-auto max-w-3xl">
        <Card><CardContent className="p-6 text-center sm:p-10">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/10 text-success"><CheckCircle2 className="size-9" /></span>
          <h2 className="mt-6 font-display text-2xl font-bold sm:text-3xl" role="status">Request submitted successfully</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">Keep your reference number for all correspondence about this request.</p>
          <dl className="mt-8 grid border text-left sm:grid-cols-2">
            <Tile label="Reference Number" value={<span className="font-mono">{done.id}</span>} />
            <Tile label="Status" value={<StatusBadge status={done.status} />} />
            <Tile label="Submitted" value={done.submitted} />
            <Tile label="Next Step" value="A Bureau officer will review the submission." />
          </dl>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild><Link to="/mda/requests/$id" params={{ id: done.id }}>View Request</Link></Button>
            <Button variant="outline" asChild><Link to="/mda/dashboard">Return to Dashboard</Link></Button>
          </div>
        </CardContent></Card>
      </div>
    </DashboardLayout>
  );

  const edit = (s: number) => <Button variant="ghost" size="sm" onClick={() => setStep(s)}><Pencil />Edit</Button>;
  return (
    <DashboardLayout role="MDA" title="New Establishment Request">
      <DashboardHeading eyebrow="Digital service" title="Establishment Request" text="Request new posts, restructuring or changes to your approved establishment." action={<Button variant="outline" asChild><Link to="/mda/dashboard"><ChevronLeft />Back to dashboard</Link></Button>} />
      <ol className="mb-8 grid grid-cols-5 gap-1" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s} className="text-center" aria-current={i === step ? "step" : undefined}>
            <div className={`mx-auto grid size-8 place-items-center rounded-full text-sm font-bold sm:size-9 ${i < step ? "bg-success text-primary-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i < step ? <Check className="size-4" /> : i + 1}</div>
            <p className={`mt-2 hidden text-xs font-semibold md:block ${i === step ? "text-primary" : "text-muted-foreground"}`}>{s}</p>
          </li>
        ))}
      </ol>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="min-w-0"><CardContent className="p-5 md:p-8">
          <p className="text-sm font-semibold text-primary">Step {step + 1} of 5</p>
          <h2 className="mt-1 font-display text-2xl font-bold">{steps[step]}</h2>
          <div className="mt-7">
            {step === 0 && <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field label="Request title" k="title" data={data} update={update} error={errors["title"]} /></div>
              <div><Label>Request type</Label>
                <Select value={data.requestType} onValueChange={(v) => update("requestType", v)}>
                  <SelectTrigger className="mt-2" aria-invalid={!!errors["requestType"]}><SelectValue placeholder="Select a request type" /></SelectTrigger>
                  <SelectContent>{requestTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select><Err msg={errors["requestType"]} /></div>
              <Field label="Requesting MDA" k="requestingMda" data={data} update={update} error={errors["requestingMda"]} />
              <div className="sm:col-span-2"><Field label="Responsible department" k="responsibleDept" data={data} update={update} error={errors["responsibleDept"]} /></div>
              <div className="sm:col-span-2"><Field area label="Brief justification" k="justification" data={data} update={update} error={errors["justification"]} /></div>
            </div>}
            {step === 1 && <div className="grid gap-5 sm:grid-cols-2">
              <Field label="MDA name" k="mdaName" data={data} update={update} error={errors["mdaName"]} />
              <Field label="Department" k="department" data={data} update={update} error={errors["department"]} />
              <Field label="Contact officer" k="contactOfficer" data={data} update={update} error={errors["contactOfficer"]} />
              <Field label="Official email" k="email" type="email" data={data} update={update} error={errors["email"]} />
              <Field label="Phone number" k="phone" type="tel" data={data} update={update} error={errors["phone"]} />
            </div>}
            {step === 2 && <div>
              <div className="grid gap-4 border bg-surface p-4 sm:grid-cols-2">
                <PField label="Position title" k="title" pos={pos} setPos={setPos} error={posErrors.title} />
                <PField label="Grade level" k="grade" placeholder="e.g. GL 10" pos={pos} setPos={setPos} error={posErrors.grade} />
                <PField label="Number of existing positions" k="existing" type="number" pos={pos} setPos={setPos} error={posErrors.existing} />
                <PField label="Number requested" k="requested" type="number" pos={pos} setPos={setPos} error={posErrors.requested} />
                <div className="sm:col-span-2"><PField label="Proposed location/unit" k="unit" pos={pos} setPos={setPos} error={posErrors.unit} /></div>
                <div className="sm:col-span-2"><PField label="Justification" k="justification" pos={pos} setPos={setPos} error={posErrors.justification} /></div>
                <div className="sm:col-span-2"><Button variant="outline" onClick={addPosition}><Plus />Add Position</Button></div>
              </div>
              <div className="mt-6">
                {positions.length ? <PositionsTable rows={positions} onRemove={(i) => setPositions((p) => p.filter((_, x) => x !== i))} /> :
                  <p className="border border-dashed p-6 text-center text-sm text-muted-foreground">No positions added yet. Complete the fields above and select “Add Position”.</p>}
                <Err msg={errors["positions"]} />
              </div>
            </div>}
            {step === 3 && <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">Files stay on this device for the prototype and are not uploaded. Accepted: PDF, DOCX, XLSX up to 10 MB.</p>
              {docCategories.map((c) => { const d = docs.find((x) => x.category === c); const err = errors[`doc-${c}`]; return (
                <div key={c} className={`border p-4 ${err ? "border-destructive" : ""}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><p className="font-semibold">{c} <span className="text-destructive">*</span></p><p className="text-xs text-muted-foreground">Required</p></div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-muted focus-within:ring-2 focus-within:ring-ring">
                      <UploadCloud className="size-4 text-primary" />{d ? "Replace file" : "Choose file"}
                      <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" className="sr-only" aria-label={`Upload ${c}`} onChange={(e) => pickFile(c, e.target.files)} />
                    </label>
                  </div>
                  {d && <div className="mt-3 flex flex-wrap items-center gap-3 bg-muted p-3 text-sm"><FileText className="size-4 text-primary" /><span className="min-w-0 flex-1 break-all font-medium">{d.name}</span><span className="text-xs text-muted-foreground">{d.type} · {d.size}</span><Button variant="ghost" size="sm" onClick={() => setDocs((x) => x.filter((y) => y.category !== c))}><Trash2 />Remove</Button></div>}
                  <Err msg={err} />
                </div>); })}
            </div>}
            {step === 4 && <div className="grid gap-6">
              <Review title="Request information" action={edit(0)} rows={[["Title", data.title], ["Type", data.requestType], ["Requesting MDA", data.requestingMda], ["Responsible department", data.responsibleDept], ["Justification", data.justification]]} />
              <Review title="MDA information" action={edit(1)} rows={[["MDA", data.mdaName], ["Department", data.department], ["Contact officer", data.contactOfficer], ["Email", data.email], ["Phone", data.phone]]} />
              <div><div className="flex items-center justify-between"><h3 className="font-display font-bold">Establishment details</h3>{edit(2)}</div><div className="mt-2"><PositionsTable rows={positions} /></div></div>
              <Review title="Supporting documents" action={edit(3)} rows={docs.map((d) => [d.category, `${d.name} (${d.type}, ${d.size})`])} />
              <div className="flex items-start gap-3 border bg-surface p-4">
                <Checkbox id="declare" checked={declared} onCheckedChange={(v) => { setDeclared(v === true); setErrors((e) => ({ ...e, declared: undefined })); }} aria-invalid={!!errors["declared"]} />
                <Label htmlFor="declare" className="text-sm font-normal leading-6">I confirm that the information provided is accurate and has been approved by the Accounting Officer of the MDA.</Label>
              </div>
              <Err msg={errors["declared"]} />
            </div>}
          </div>
          <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t pt-6 sm:flex-row">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}><ChevronLeft />Back</Button>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="ghost" onClick={() => { setDraftMsg(true); setTimeout(() => setDraftMsg(false), 3000); }}><Save />Save draft</Button>
              {step < 4 ? <Button onClick={next}>Continue<ChevronRight /></Button> :
                <Button onClick={submit} disabled={submitting}>{submitting ? <Loader2 className="animate-spin" /> : <Check />}Submit Establishment Request</Button>}
            </div>
          </div>
          {draftMsg && <p className="mt-3 text-right text-sm text-success" role="status">Draft saved for this session.</p>}
          {Object.values(errors).some(Boolean) && <p className="mt-3 text-sm text-destructive" role="alert">Please correct the highlighted fields to continue.</p>}
        </CardContent></Card>
        <aside><div className="border bg-background p-5 lg:sticky lg:top-28">
          <h3 className="font-display font-bold">Before you submit</h3>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground"><li>• Use your official MDA contact details.</li><li>• Ensure figures match the approved nominal roll.</li><li>• Attach the signed justification memo.</li></ul>
          <div className="mt-5 border-t pt-5"><p className="text-xs font-bold uppercase text-muted-foreground">Expected timeline</p><p className="mt-1 font-semibold">10–15 working days</p></div>
        </div></aside>
      </div>
    </DashboardLayout>
  );
}

export function PositionsTable({ rows, onRemove }: { rows: Position[]; onRemove?: ((i: number) => void) | undefined }) {
  return <Table><TableHeader><TableRow><TableHead>Position</TableHead><TableHead>Grade</TableHead><TableHead className="text-right">Existing</TableHead><TableHead className="text-right">Requested</TableHead><TableHead>Location/unit</TableHead><TableHead>Justification</TableHead>{onRemove && <TableHead />}</TableRow></TableHeader>
    <TableBody>{rows.map((p, i) => <TableRow key={`${p.title}-${i}`}><TableCell className="font-medium">{p.title}</TableCell><TableCell>{p.grade}</TableCell><TableCell className="text-right">{p.existing}</TableCell><TableCell className="text-right font-semibold">{p.requested}</TableCell><TableCell>{p.unit}</TableCell><TableCell className="min-w-48 text-muted-foreground">{p.justification}</TableCell>{onRemove && <TableCell><Button variant="ghost" size="icon" aria-label={`Remove ${p.title}`} onClick={() => onRemove(i)}><Trash2 /></Button></TableCell>}</TableRow>)}
      <TableRow><TableCell colSpan={3} className="font-semibold">Total requested</TableCell><TableCell className="text-right font-bold">{rows.reduce((a, p) => a + p.requested, 0)}</TableCell><TableCell colSpan={onRemove ? 3 : 2} /></TableRow>
    </TableBody></Table>;
}

function Err({ msg }: { msg: string | undefined }) { return msg ? <p className="mt-1 text-xs text-destructive">{msg}</p> : null; }
function Field({ label, k, data, update, error, type = "text", area = false }: { label: string; k: Key; data: Info; update: (k: Key, v: string) => void; error: string | undefined; type?: string; area?: boolean }) {
  return <div><Label htmlFor={k}>{label}</Label>{area ? <Textarea id={k} value={data[k]} onChange={(e) => update(k, e.target.value)} className="mt-2 min-h-28" aria-invalid={!!error} /> : <Input id={k} type={type} value={data[k]} onChange={(e) => update(k, e.target.value)} className="mt-2" aria-invalid={!!error} />}<Err msg={error} /></div>;
}
function PField({ label, k, pos, setPos, error, type = "text", placeholder }: { label: string; k: keyof PosDraft; pos: PosDraft; setPos: (fn: (p: PosDraft) => PosDraft) => void; error: string | undefined; type?: string; placeholder?: string }) {
  return <div><Label htmlFor={`pos-${k}`}>{label}</Label><Input id={`pos-${k}`} type={type} min={0} placeholder={placeholder} value={pos[k]} onChange={(e) => setPos((p) => ({ ...p, [k]: e.target.value }))} className="mt-2 bg-background" aria-invalid={!!error} /><Err msg={error} /></div>;
}
function Tile({ label, value }: { label: string; value: React.ReactNode }) { return <div className="border-b p-5 sm:border-r"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>; }
function Review({ title, rows, action }: { title: string; rows: string[][]; action: React.ReactNode }) {
  return <div><div className="flex items-center justify-between"><h3 className="font-display font-bold">{title}</h3>{action}</div><dl className="mt-2 divide-y border">{rows.map(([k, v]) => <div key={k} className="grid gap-1 p-3 text-sm sm:grid-cols-[180px_1fr]"><dt className="text-muted-foreground">{k}</dt><dd className="break-words font-medium">{v || "—"}</dd></div>)}</dl></div>;
}
