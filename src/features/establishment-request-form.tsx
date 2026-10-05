import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, FileText, Pencil, Plus, Save, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout, DashboardHeading } from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addCase, MDA_NAME, nextReference, TODAY, TODAY_ISO } from "@/data/case-store";
import type { CaseDocument, Position } from "@/types";

const steps = ["Request Information", "MDA Information", "Establishment Details", "Supporting Documents", "Review & Submit"];
const requiredDocs = ["Organogram", "Justification memo", "Budget provision/evidence"];
type FormData = { title: string; requestType: string; requestingMda: string; responsibleDept: string; justification: string; mda: string; department: string; contactName: string; email: string; phone: string };
const initial: FormData = { title: "", requestType: "", requestingMda: MDA_NAME, responsibleDept: "", justification: "", mda: MDA_NAME, department: "", contactName: "", email: "", phone: "" };
const emptyPos = { title: "", grade: "", existing: "", requested: "", location: "", justification: "" };
type PosDraft = typeof emptyPos;
type Errors = Partial<Record<string, string>>;
const fmtSize = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export function EstablishmentRequestPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial);
  const [positions, setPositions] = useState<Position[]>([]);
  const [pd, setPd] = useState<PosDraft>(emptyPos);
  const [files, setFiles] = useState<CaseDocument[]>([]);
  const [declared, setDeclared] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<string | null>(null);
  const update = (k: keyof FormData, v: string) => { setData((x) => ({ ...x, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const validate = (s: number) => {
    const e: Errors = {};
    const req: (keyof FormData)[][] = [["title", "requestType", "requestingMda", "responsibleDept", "justification"], ["mda", "department", "contactName", "email", "phone"], [], [], []];
    (req[s] ?? []).forEach((k) => { if (!data[k].trim()) e[k] = "This field is required."; });
    if (s === 1 && data.email && !/^\S+@\S+\.\S+$/.test(data.email)) e["email"] = "Enter a valid email address.";
    if (s === 1 && data.phone && !/^[0-9+\s-]{7,}$/.test(data.phone)) e["phone"] = "Enter a valid phone number.";
    if (s === 2 && positions.length === 0) e["positions"] = "Add at least one requested position.";
    if (s === 3) requiredDocs.forEach((d) => { if (!files.some((f) => f.category === d)) e[`doc-${d}`] = "Required document not attached."; });
    if (s === 4 && !declared) e["declared"] = "Please confirm the declaration before submitting.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const next = () => { if (validate(step)) { setStep((x) => Math.min(4, x + 1)); window.scrollTo({ top: 0 }); } };

  const addPosition = () => {
    const e: Errors = {};
    (Object.keys(pd) as (keyof PosDraft)[]).forEach((k) => { if (!pd[k].trim()) e[`pos-${k}`] = "Required"; });
    if (pd.requested && Number(pd.requested) < 1) e["pos-requested"] = "Must be at least 1";
    setErrors(e);
    if (Object.keys(e).length) return;
    setPositions((p) => [...p, { ...pd, existing: Number(pd.existing), requested: Number(pd.requested) }]);
    setPd(emptyPos);
  };
  const attach = (category: string, list: FileList | null) => {
    const f = list?.[0];
    if (!f) return;
    setFiles((x) => [...x.filter((d) => d.category !== category || category === "Other"), { name: f.name, category, size: fmtSize(f.size), type: f.name.split(".").pop()?.toUpperCase() ?? "FILE", status: "Pending check" }]);
    setErrors((e) => ({ ...e, [`doc-${category}`]: undefined }));
  };
  const submit = () => {
    if (!validate(4)) return;
    const id = nextReference();
    addCase({
      id, service: "Establishment Request", title: data.title, requestType: data.requestType, mda: data.mda, department: data.department,
      requester: data.contactName, email: data.email, phone: data.phone, submitted: TODAY, submittedISO: TODAY_ISO, updated: TODAY,
      status: "Submitted", priority: positions.reduce((n, p) => n + p.requested, 0) >= 10 ? "High" : "Medium", assignedOfficer: "Mr. D. A. Akinola",
      summary: data.justification, positions, documents: files, comments: [], checklist: [false, false, false, false, false],
      timeline: [{ date: TODAY, text: "Request submitted" }, { date: TODAY, text: "Assigned to Establishment Officer" }],
    });
    setSubmitted(id);
    toast.success("Establishment request submitted");
  };

  if (submitted) return (
    <DashboardLayout role="MDA" title="Request submitted">
      <Card className="mx-auto max-w-3xl"><CardContent className="p-6 text-center sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/10 text-success"><CheckCircle2 className="size-9" /></span>
        <h2 className="mt-6 font-display text-2xl font-bold sm:text-3xl">Request submitted successfully</h2>
        <div className="mt-8 grid border text-left sm:grid-cols-2">
          <Info label="Reference Number" value={submitted} mono /><Info label="Status" value="Submitted" /><Info label="Submitted" value="29 September 2026" /><Info label="Next Step" value="A Bureau officer will review the submission." />
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild><Link to="/mda/requests/$id" params={{ id: submitted }}>View Request</Link></Button>
          <Button variant="outline" asChild><Link to="/mda/dashboard">Return to Dashboard</Link></Button>
        </div>
      </CardContent></Card>
    </DashboardLayout>
  );

  return (
    <DashboardLayout role="MDA" title="New Establishment Request">
      <DashboardHeading eyebrow="Digital service" title="Establishment Request" text="Request new posts, restructuring, or modification of an approved establishment." />
      <ol className="mb-8 grid grid-cols-5 gap-1" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s} className="text-center" aria-current={i === step ? "step" : undefined}>
            <div className={`mx-auto grid size-9 place-items-center rounded-full text-sm font-bold ${i < step ? "bg-success text-primary-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i < step ? <Check className="size-4" /> : i + 1}</div>
            <p className={`mt-2 hidden text-xs font-semibold md:block ${i === step ? "text-primary" : "text-muted-foreground"}`}>{s}</p>
          </li>
        ))}
      </ol>
      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <Card className="min-w-0"><CardContent className="p-5 md:p-8">
          <p className="text-sm font-semibold text-primary">Step {step + 1} of 5</p>
          <h2 className="mt-1 font-display text-2xl font-bold">{steps[step]}</h2>
          <div className="mt-7">
            {step === 0 && <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field label="Request title" id="title" value={data.title} onChange={(v) => update("title", v)} error={errors["title"]} /></div>
              <div><Label htmlFor="requestType">Request type</Label>
                <Select value={data.requestType} onValueChange={(v) => update("requestType", v)}>
                  <SelectTrigger id="requestType" className="mt-2 w-full" aria-invalid={!!errors["requestType"]}><SelectValue placeholder="Select a request type" /></SelectTrigger>
                  <SelectContent>{["New Establishment", "Restructuring", "Modification of Existing Establishment"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select><Err msg={errors["requestType"]} /></div>
              <Field label="Requesting MDA" id="requestingMda" value={data.requestingMda} onChange={(v) => update("requestingMda", v)} error={errors["requestingMda"]} />
              <Field label="Responsible department" id="responsibleDept" value={data.responsibleDept} onChange={(v) => update("responsibleDept", v)} error={errors["responsibleDept"]} />
              <div className="sm:col-span-2"><Field area label="Brief justification" id="justification" value={data.justification} onChange={(v) => update("justification", v)} error={errors["justification"]} /></div>
            </div>}
            {step === 1 && <div className="grid gap-5 sm:grid-cols-2">
              <Field label="MDA name" id="mda" value={data.mda} onChange={(v) => update("mda", v)} error={errors["mda"]} />
              <Field label="Department" id="department" value={data.department} onChange={(v) => update("department", v)} error={errors["department"]} />
              <Field label="Contact officer" id="contactName" value={data.contactName} onChange={(v) => update("contactName", v)} error={errors["contactName"]} />
              <Field label="Official email" id="email" type="email" value={data.email} onChange={(v) => update("email", v)} error={errors["email"]} />
              <Field label="Phone number" id="phone" type="tel" value={data.phone} onChange={(v) => update("phone", v)} error={errors["phone"]} />
            </div>}
            {step === 2 && <div>
              <div className="grid gap-4 border bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {([["title", "Position title", "text"], ["grade", "Grade level", "text"], ["location", "Proposed location/unit", "text"], ["existing", "Existing positions", "number"], ["requested", "Number requested", "number"]] as const).map(([k, l, t]) => (
                  <Field key={k} label={l} id={`pos-${k}`} type={t} value={pd[k]} onChange={(v) => setPd((x) => ({ ...x, [k]: v }))} error={errors[`pos-${k}`]} />
                ))}
                <div className="sm:col-span-2 lg:col-span-3"><Field area label="Justification" id="pos-justification" value={pd.justification} onChange={(v) => setPd((x) => ({ ...x, justification: v }))} error={errors["pos-justification"]} /></div>
                <div><Button type="button" variant="outline" onClick={addPosition}><Plus />Add Position</Button></div>
              </div>
              <Err msg={errors["positions"]} />
              <div className="mt-5"><PositionsTable positions={positions} onRemove={(i) => setPositions((p) => p.filter((_, j) => j !== i))} /></div>
            </div>}
            {step === 3 && <div className="grid gap-4">
              {[...requiredDocs, "Other"].map((cat) => {
                const list = files.filter((f) => f.category === cat);
                return <div key={cat} className={`border p-4 ${errors[`doc-${cat}`] ? "border-destructive" : ""}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="font-semibold">{cat}{cat !== "Other" && <span className="ml-2 text-xs font-normal text-destructive">Required</span>}</p><p className="text-xs text-muted-foreground">PDF, DOCX or XLSX up to 10 MB</p></div>
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted focus-within:ring-2 focus-within:ring-ring">
                      <UploadCloud className="size-4 text-primary" />{list.length && cat !== "Other" ? "Replace file" : "Choose file"}
                      <input type="file" className="sr-only" aria-label={`Upload ${cat}`} onChange={(e) => { attach(cat, e.target.files); e.target.value = ""; }} />
                    </label>
                  </div>
                  <Err msg={errors[`doc-${cat}`]} />
                  {list.map((f) => <div key={f.name} className="mt-3 flex items-center gap-3 bg-muted p-3 text-sm">
                    <FileText className="size-4 shrink-0 text-primary" /><span className="min-w-0 flex-1 truncate font-medium">{f.name}</span>
                    <span className="text-xs text-muted-foreground">{f.type} • {f.size}</span>
                    <Button variant="ghost" size="icon" aria-label={`Remove ${f.name}`} onClick={() => setFiles((x) => x.filter((d) => d !== f))}><Trash2 /></Button>
                  </div>)}
                </div>;
              })}
              <p className="text-xs text-muted-foreground">Files stay in this browser session only — nothing is uploaded in this prototype.</p>
            </div>}
            {step === 4 && <div className="grid gap-6">
              <Review title="Request information" onEdit={() => setStep(0)} rows={[["Title", data.title], ["Type", data.requestType], ["Requesting MDA", data.requestingMda], ["Responsible department", data.responsibleDept], ["Justification", data.justification]]} />
              <Review title="MDA information" onEdit={() => setStep(1)} rows={[["MDA", data.mda], ["Department", data.department], ["Contact officer", data.contactName], ["Email", data.email], ["Phone", data.phone]]} />
              <div><ReviewHead title="Establishment details" onEdit={() => setStep(2)} /><PositionsTable positions={positions} /></div>
              <Review title="Supporting documents" onEdit={() => setStep(3)} rows={files.map((f) => [f.category, `${f.name} (${f.size})`])} />
              <label className="flex items-start gap-3 border bg-muted/30 p-4 text-sm">
                <Checkbox checked={declared} onCheckedChange={(v) => { setDeclared(v === true); setErrors({}); }} className="mt-0.5" />
                <span>I confirm that the information provided is accurate and that this request has been authorised by the Accounting Officer of the MDA.</span>
              </label>
              <Err msg={errors["declared"]} />
            </div>}
          </div>
          <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
            {step ? <Button variant="outline" onClick={() => setStep(step - 1)}><ChevronLeft />Back</Button> : <Button variant="outline" asChild><Link to="/mda/dashboard"><ChevronLeft />Cancel</Link></Button>}
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="ghost" onClick={() => toast.success("Draft saved for this session")}><Save />Save draft</Button>
              {step < 4 ? <Button onClick={next}>Continue<ChevronRight /></Button> : <Button onClick={submit}>Submit Establishment Request<Check /></Button>}
            </div>
          </div>
        </CardContent></Card>
        <aside><div className="border bg-background p-5 xl:sticky xl:top-28">
          <h3 className="font-display font-bold">Before you submit</h3>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground"><li>• Use your official MDA contact details.</li><li>• Ensure figures match the approved nominal roll.</li><li>• Attach the signed justification memo.</li></ul>
          <div className="mt-5 border-t pt-5"><p className="text-xs font-bold uppercase text-muted-foreground">Expected timeline</p><p className="mt-1 font-semibold">10–15 working days</p></div>
        </div></aside>
      </div>
    </DashboardLayout>
  );
}

export function PositionsTable({ positions, onRemove }: { positions: Position[]; onRemove?: (i: number) => void }) {
  if (!positions.length) return <p className="border border-dashed p-6 text-center text-sm text-muted-foreground">No positions added yet.</p>;
  return <div className="overflow-x-auto border"><Table><TableHeader><TableRow><TableHead>Position</TableHead><TableHead>Grade</TableHead><TableHead className="text-right">Existing</TableHead><TableHead className="text-right">Requested</TableHead><TableHead>Location/unit</TableHead><TableHead>Justification</TableHead>{onRemove && <TableHead />}</TableRow></TableHeader>
    <TableBody>{positions.map((p, i) => <TableRow key={`${p.title}-${i}`}><TableCell className="font-medium">{p.title}</TableCell><TableCell>{p.grade}</TableCell><TableCell className="text-right">{p.existing}</TableCell><TableCell className="text-right font-semibold">{p.requested}</TableCell><TableCell>{p.location}</TableCell><TableCell className="min-w-48 text-muted-foreground">{p.justification}</TableCell>{onRemove && <TableCell><Button variant="ghost" size="icon" aria-label={`Remove ${p.title}`} onClick={() => onRemove(i)}><Trash2 /></Button></TableCell>}</TableRow>)}
      <TableRow><TableCell colSpan={2} className="font-semibold">Total</TableCell><TableCell className="text-right">{positions.reduce((n, p) => n + p.existing, 0)}</TableCell><TableCell className="text-right font-bold">{positions.reduce((n, p) => n + p.requested, 0)}</TableCell><TableCell colSpan={onRemove ? 3 : 2} /></TableRow>
    </TableBody></Table></div>;
}
function Err({ msg }: { msg: string | undefined }) { return msg ? <p className="mt-1 text-xs text-destructive" role="alert">{msg}</p> : null; }
function Field({ label, id, value, onChange, error, type = "text", area = false }: { label: string; id: string; value: string; onChange: (v: string) => void; error: string | undefined; type?: string; area?: boolean }) {
  return <div><Label htmlFor={id}>{label}</Label>{area ? <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 min-h-24" aria-invalid={!!error} /> : <Input id={id} type={type} min={type === "number" ? 0 : undefined} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2" aria-invalid={!!error} />}<Err msg={error} /></div>;
}
function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) { return <div className="border-b p-5 sm:border-r"><p className="text-xs text-muted-foreground">{label}</p><p className={`mt-1 font-semibold ${mono ? "font-mono text-lg text-primary" : ""}`}>{value}</p></div>; }
function ReviewHead({ title, onEdit }: { title: string; onEdit: () => void }) { return <div className="mb-2 flex items-center justify-between"><h3 className="font-display font-bold">{title}</h3><Button variant="ghost" size="sm" onClick={onEdit}><Pencil />Edit</Button></div>; }
function Review({ title, rows, onEdit }: { title: string; rows: string[][]; onEdit: () => void }) {
  return <div><ReviewHead title={title} onEdit={onEdit} /><dl className="divide-y border">{rows.map(([k, v], i) => <div key={`${k}-${i}`} className="grid gap-1 p-3 text-sm sm:grid-cols-[180px_1fr]"><dt className="text-muted-foreground">{k}</dt><dd className="break-words font-medium">{v || "—"}</dd></div>)}</dl></div>;
}
