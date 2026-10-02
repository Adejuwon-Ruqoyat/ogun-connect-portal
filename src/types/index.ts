export type Status = "Submitted" | "Under Review" | "Clarification Required" | "Recommended" | "Approved" | "Rejected" | "Closed";
export type Priority = "High" | "Medium" | "Normal";
export interface Service { slug: string; title: string; description: string; eligibility: string; documents: string[]; process: string; status: "Available" | "Coming Soon"; icon: string }
export interface RequestItem { id: string; mda: string; type: string; requester: string; submitted: string; status: Status; priority: Priority; sla: string }
