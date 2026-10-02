export type Status = "Submitted" | "Under Review" | "Clarification Required" | "Recommended" | "Approved" | "Rejected" | "Closed";
export type Priority = "High" | "Medium" | "Normal";
export interface Service { slug: string; title: string; description: string; eligibility: string; documents: string[]; process: string; status: "Available" | "Coming Soon"; icon: string }
export interface RequestItem { id: string; mda: string; type: string; requester: string; submitted: string; status: Status; priority: Priority; sla: string }
export interface Position { title: string; grade: string; existing: number; requested: number; unit: string; justification: string }
export interface CaseDocument { label: string; name: string; type: string; size: string; status: "Verified" | "Pending review" | "Query raised" }
export interface CaseComment { author: string; date: string; text: string }
export interface CaseEvent { date: string; text: string }
export interface CaseRecord {
  ref: string; service: string; title: string; requestType: string; mda: string; department: string;
  requester: string; email: string; phone: string; justification: string;
  submitted: string; updated: string; status: Status; priority: Priority; assignedTo: string; ageDays: number;
  positions: Position[]; documents: CaseDocument[]; comments: CaseComment[]; timeline: CaseEvent[]; checklist: boolean[];
}
