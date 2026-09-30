export type Status = "Submitted" | "Under Review" | "Clarification Required" | "Recommended" | "Approved" | "Rejected" | "Closed";
export type Priority = "High" | "Medium" | "Normal";
export interface Service { slug: string; title: string; description: string; eligibility: string; documents: string[]; process: string; status: "Available" | "Coming Soon"; icon: string }
export interface RequestItem { id: string; mda: string; type: string; requester: string; submitted: string; status: Status; priority: Priority; sla: string }
export type WorkflowMode = "mda" | "officer" | "management";
export interface Position { title: string; grade: string; existing: number; requested: number; unit: string; justification: string }
export interface CaseDocument { category: string; name: string; type: string; size: string; status: "Pending verification" | "Verified" | "Query raised" }
export interface CaseEvent { date: string; text: string; by: string }
export interface CaseComment { author: string; date: string; text: string; internal: boolean }
export interface CaseRecord {
  id: string; service: string; title: string; requestType: string; mda: string; department: string;
  requester: string; email: string; phone: string; justification: string;
  submitted: string; lastUpdated: string; status: Status; priority: Priority; ageDays: number; assignedOfficer: string;
  positions: Position[]; documents: CaseDocument[]; checklist: boolean[]; comments: CaseComment[]; timeline: CaseEvent[];
}
