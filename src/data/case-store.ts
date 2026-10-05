import { useSyncExternalStore } from "react";
import type { CaseRecord, Priority, Status } from "@/types";

/** Local in-memory case store shared by MDA, Officer and Management views. Replace with API calls later. */
const doc = (name: string, category: string, size: string, status: CaseRecord["documents"][number]["status"] = "Verified") => ({ name, category, size, type: name.split(".").pop()?.toUpperCase() ?? "FILE", status });
const pos = (title: string, grade: string, existing: number, requested: number, location: string) => ({ title, grade, existing, requested, location, justification: "Required to meet expanded service delivery obligations." });

function seed(id: string, mda: string, service: string, title: string, submitted: string, iso: string, status: Status, priority: Priority, requester: string): CaseRecord {
  return {
    id, service, title, requestType: "New Establishment", mda, department: "Administration & Supplies", requester,
    email: "establishment@ogunstate.gov.ng", phone: "0803 000 0000", submitted, submittedISO: iso, updated: submitted,
    status, priority, assignedOfficer: "Mr. D. A. Akinola", summary: "Request to strengthen staffing in line with the approved 2026 work plan.",
    positions: [pos("Administrative Officer II", "GL 08", 12, 4, "Headquarters"), pos("Executive Officer (Accounts)", "GL 07", 6, 2, "Finance Unit")],
    documents: [doc("Approved organogram.pdf", "Organogram", "684 KB"), doc("Justification memo.pdf", "Justification memo", "212 KB"), doc("Budget provision.xlsx", "Budget provision", "1.2 MB", "Pending check")],
    comments: [], timeline: [{ date: submitted, text: "Request submitted" }, { date: submitted, text: "Assigned to Establishment Officer" }],
    checklist: [false, false, false, false, false],
  };
}

let cases: CaseRecord[] = [
  seed("BET-2026-000126", "Ministry of Health", "Establishment Request", "Creation of 24 Community Health Officer posts", "24 Sep 2026", "2026-09-24", "Under Review", "High", "Mrs. A. O. Adeyemi"),
  seed("BET-2026-000125", "Ministry of Works and Infrastructure", "Establishment Request", "Restructuring of Highways Maintenance Unit", "22 Sep 2026", "2026-09-22", "Clarification Required", "Medium", "Engr. F. A. Olude"),
  seed("BET-2026-000124", "Ministry of Education, Science & Technology", "Training Application", "Leadership Programme nominations — Cohort IV", "20 Sep 2026", "2026-09-20", "Recommended", "Normal", "Mrs. T. O. Falana"),
  seed("BET-2026-000123", "Ministry of Agriculture", "Establishment Request", "New posts for Agricultural Extension Services", "15 Sep 2026", "2026-09-15", "Submitted", "High", "Mr. S. K. Adebayo"),
  seed("BET-2026-000122", "Ministry of Works and Infrastructure", "Establishment Request", "Modification of Project Monitoring establishment", "10 Sep 2026", "2026-09-10", "Approved", "Normal", "Engr. F. A. Olude"),
  seed("BET-2026-000121", "Ogun State Housing Corporation", "Industrial Relations Support", "Mediation on staff welfare matters", "04 Sep 2026", "2026-09-04", "Closed", "Normal", "Mr. B. A. Ogunleye"),
  seed("BET-2026-000120", "Ministry of Finance", "Establishment Request", "Upgrade of Internal Audit posts", "28 Aug 2026", "2026-08-28", "Rejected", "Medium", "Mrs. O. A. Bello"),
];
cases[2]!.checklist = [true, true, true, true, false];
cases[4]!.timeline.push({ date: "18 Sep 2026", text: "Recommended for approval" }, { date: "21 Sep 2026", text: "Approved by Management" });
cases[1]!.comments.push({ author: "Mr. D. A. Akinola", date: "25 Sep 2026", text: "Please provide the current nominal roll for the Highways Unit." });

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
export const TODAY = "29 Sep 2026";
export const TODAY_ISO = "2026-09-29";

export function useCases() { return useSyncExternalStore(subscribe, () => cases, () => cases); }
export function useCase(id: string) { return useCases().find((c) => c.id === id); }
export function nextReference() { const max = Math.max(...cases.map((c) => Number(c.id.slice(-6)))); return `BET-2026-${String(max + 1).padStart(6, "0")}`; }
export function addCase(c: CaseRecord) { cases = [c, ...cases]; emit(); }
export function updateCase(id: string, fn: (c: CaseRecord) => CaseRecord) { cases = cases.map((c) => (c.id === id ? fn(c) : c)); emit(); }
export function ageDays(c: CaseRecord) { return Math.max(0, Math.round((Date.parse(TODAY_ISO) - Date.parse(c.submittedISO)) / 86400000)); }
export const MDA_NAME = "Ministry of Works and Infrastructure";
export const OPEN: Status[] = ["Submitted", "Under Review", "Clarification Required", "Recommended"];
