export type Status = "Draft" | "Submitted" | "Under Review" | "Clarification Required" | "Recommended" | "Approved" | "Rejected" | "Closed";
export type Priority = "High" | "Medium" | "Normal";
export interface Service { slug: string; title: string; description: string; eligibility: string; documents: string[]; process: string; status: "Available" | "Coming Soon"; icon: string }
export interface RequestItem { id: string; mda: string; type: string; requester: string; submitted: string; status: Status; priority: Priority; sla: string }
export interface Position { title: string; grade: string; existing: number; requested: number; location: string; justification: string }
export interface CaseDocument { name: string; type: string; size: string; category: string; status: "Verified" | "Pending check" | "Missing" }
export interface CaseComment { author: string; date: string; text: string }
export interface TimelineEvent { date: string; text: string }
export interface CaseRecord {
  id: string; service: string; title: string; requestType: string; mda: string; department: string;
  requester: string; email: string; phone: string; submitted: string; submittedISO: string; updated: string;
  status: Status; priority: Priority; assignedOfficer: string; summary: string;
  positions: Position[]; documents: CaseDocument[]; comments: CaseComment[]; timeline: TimelineEvent[]; checklist: boolean[];
}
