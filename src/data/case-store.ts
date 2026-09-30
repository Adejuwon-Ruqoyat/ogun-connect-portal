import { useSyncExternalStore } from "react";
import type { CaseRecord, CaseDocument, Position, Status } from "@/types";

/**
 * Local, in-memory case store shared by the MDA, Officer and Management views.
 * Replace these functions with API calls when a backend is introduced.
 */
export const CURRENT_MDA = "Ministry of Works and Infrastructure";
export const ASSIGNED_OFFICER = "Mr. D. A. Akinola";
export const checklistItems = [
  "Organisational justification reviewed",
  "Organogram attached",
  "Budget provision confirmed",
  "Proposed positions reviewed",
  "Establishment implications assessed",
];
export const OPEN_STATUSES: Status[] = ["Submitted", "Under Review", "Clarification Required", "Recommended"];

const docs = (status: CaseDocument["status"] = "Pending verification"): CaseDocument[] => [
  { category: "Organogram", name: "Approved_Organogram_2026.pdf", type: "PDF", size: "1.2 MB", status },
  { category: "Justification memo", name: "Justification_Memo_Signed.docx", type: "DOCX", size: "340 KB", status },
  { category: "Budget provision/evidence", name: "Budget_Provision_2026.xlsx", type: "XLSX", size: "88 KB", status },
];
const pos = (title: string, grade: string, existing: number, requested: number, unit: string): Position => ({
  title, grade, existing, requested, unit, justification: "Required to meet expanded service delivery obligations.",
});

function seed(
  n: number, mda: string, requestType: string, title: string, submitted: string, ageDays: number,
  status: Status, priority: CaseRecord["priority"], requester: string, positions: Position[], service = "Establishment Request",
): CaseRecord {
  const timeline = [
    { date: submitted, text: "Request submitted", by: requester },
    { date: submitted, text: `Assigned to ${ASSIGNED_OFFICER}`, by: "System" },
  ];
  if (status !== "Submitted") timeline.push({ date: submitted, text: "Under review", by: ASSIGNED_OFFICER });
  if (status !== "Submitted" && status !== "Under Review") timeline.push({ date: submitted, text: status, by: ASSIGNED_OFFICER });
  return {
    id: `BET-2026-${String(n).padStart(6, "0")}`, service, title, requestType, mda, department: "Administration & Supplies",
    requester, email: "establishments@ogunstate.gov.ng", phone: "0803 000 0000",
    justification: "Workload growth and new statutory responsibilities require additional approved positions.",
    submitted, lastUpdated: submitted, status, priority, ageDays, assignedOfficer: ASSIGNED_OFFICER,
    positions, documents: docs(status === "Submitted" ? "Pending verification" : "Verified"),
    checklist: checklistItems.map(() => status !== "Submitted" && status !== "Under Review"),
    comments: status === "Clarification Required"
      ? [{ author: ASSIGNED_OFFICER, date: submitted, text: "Please provide the updated budget provision for FY2026.", internal: false }]
      : [],
    timeline,
  };
}

let cases: CaseRecord[] = [
  seed(126, "Ministry of Health", "Restructuring", "Restructuring of Primary Health Care Directorate", "26 Sep 2026", 4, "Under Review", "High", "Mrs. A. O. Adeyemi", [pos("Senior Nursing Officer", "GL 10", 12, 6, "PHC Directorate")]),
  seed(125, CURRENT_MDA, "New Establishment", "Creation of Highway Maintenance Unit", "22 Sep 2026", 8, "Clarification Required", "Medium", "Engr. F. A. Olude", [pos("Principal Engineer (Civil)", "GL 13", 2, 3, "Highways Department"), pos("Technical Officer", "GL 08", 10, 8, "Highways Department")]),
  seed(124, "Ministry of Education, Science & Technology", "Modification of Existing Establishment", "Upgrade of ICT Officer posts", "18 Sep 2026", 12, "Recommended", "Normal", "Mrs. T. O. Falana", [pos("ICT Officer", "GL 09", 6, 4, "ICT Unit")]),
  seed(123, CURRENT_MDA, "Modification of Existing Establishment", "Redesignation of Quantity Surveyor posts", "15 Sep 2026", 15, "Submitted", "High", "Engr. F. A. Olude", [pos("Quantity Surveyor", "GL 12", 4, 2, "Project Monitoring")]),
  seed(122, "Ministry of Agriculture", "New Establishment", "Agro-Processing Extension Unit", "10 Sep 2026", 20, "Approved", "Normal", "Mr. S. K. Bello", [pos("Agricultural Officer", "GL 08", 20, 10, "Extension Services")]),
  seed(121, CURRENT_MDA, "Restructuring", "Merger of Mechanical and Electrical units", "02 Sep 2026", 28, "Approved", "Normal", "Engr. F. A. Olude", [pos("Chief Engineer (Mech./Elect.)", "GL 14", 2, 1, "Engineering Services")]),
  seed(120, "Ogun State Housing Corporation", "Restructuring", "Estate Management Department review", "28 Aug 2026", 33, "Rejected", "Medium", "Mr. B. A. Ogunleye", [pos("Estate Officer", "GL 09", 8, 5, "Estate Management")]),
  seed(119, "Bureau of Public Service Reforms", "New Establishment", "Performance Management Office", "20 Aug 2026", 41, "Closed", "Normal", "Mr. K. A. Sobowale", [pos("Performance Analyst", "GL 10", 0, 4, "PMO")]),
];
let nextNumber = 127;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const getSnapshot = () => cases;

export const today = () => new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export function useCases() { return useSyncExternalStore(subscribe, getSnapshot, getSnapshot); }
export function useCase(id: string) { return useCases().find((c) => c.id === id); }

export type NewCaseInput = Pick<CaseRecord, "title" | "requestType" | "mda" | "department" | "requester" | "email" | "phone" | "justification" | "positions" | "documents">;

export function submitCase(input: NewCaseInput): CaseRecord {
  const date = today();
  const record: CaseRecord = {
    ...input, id: `BET-2026-${String(nextNumber++).padStart(6, "0")}`, service: "Establishment Request",
    submitted: date, lastUpdated: date, status: "Submitted", priority: "Medium", ageDays: 0, assignedOfficer: ASSIGNED_OFFICER,
    checklist: checklistItems.map(() => false), comments: [],
    timeline: [{ date, text: "Request submitted", by: input.requester }, { date, text: `Assigned to ${ASSIGNED_OFFICER}`, by: "System" }],
  };
  cases = [record, ...cases];
  emit();
  return record;
}

export function updateCase(id: string, fn: (c: CaseRecord) => CaseRecord) {
  cases = cases.map((c) => (c.id === id ? { ...fn(c), lastUpdated: today() } : c));
  emit();
}

export const trainingApplications = [
  { name: "Mr. O. J. Adebayo", course: "Project Management for Engineers", date: "24 Sep 2026", status: "Under Review" as Status },
  { name: "Mrs. K. A. Salami", course: "Public Sector Leadership — Cohort IV", date: "19 Sep 2026", status: "Approved" as Status },
  { name: "Engr. T. S. Olaniyan", course: "Procurement & Contract Management", date: "12 Sep 2026", status: "Submitted" as Status },
];
export const mdaDrafts = [{ title: "Creation of Materials Testing Laboratory posts", saved: "27 Sep 2026" }, { title: "Drivers pool restructuring", saved: "21 Sep 2026" }];
