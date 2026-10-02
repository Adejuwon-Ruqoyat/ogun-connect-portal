import type { RequestItem, Service } from "@/types";
export const services: Service[] = [
 {slug:"establishment-request",title:"Establishment Request",description:"Request approval for new posts, restructuring, or changes to an approved establishment.",eligibility:"All Ogun State MDAs",documents:["Approved organogram","Justification memo","Budget provision"],process:"Submit → Review → Recommendation → Approval",status:"Available",icon:"Building2"},
 {slug:"appointment-placement",title:"Appointment & Placement",description:"Guidance and processing for appointments, placements, and regularisation matters.",eligibility:"Authorised MDA personnel officers",documents:["Appointment letter","Credentials","Personnel record"],process:"Submit → Verify → Place",status:"Coming Soon",icon:"UserRoundCheck"},
 {slug:"promotion-career",title:"Promotion & Career Progression",description:"Support for promotion exercises, advancement, and career progression enquiries.",eligibility:"Eligible public officers through their MDA",documents:["Last promotion letter","Performance records","Credentials"],process:"Nominate → Assess → Approve",status:"Coming Soon",icon:"TrendingUp"},
 {slug:"posting-transfer",title:"Posting & Transfer",description:"Submit and monitor inter-ministerial posting and transfer requests.",eligibility:"Confirmed public officers and MDAs",documents:["Request letter","Service record","Release endorsement"],process:"Request → Review → Decision",status:"Coming Soon",icon:"ArrowLeftRight"},
 {slug:"training-application",title:"Training Application",description:"Apply for approved capacity-development programmes and track nominations.",eligibility:"Ogun State public officers",documents:["Nomination letter","Course details","Supervisor approval"],process:"Apply → Endorse → Enrol",status:"Available",icon:"GraduationCap"},
 {slug:"industrial-relations",title:"Industrial Relations Support",description:"Request mediation and advisory support on workplace and labour matters.",eligibility:"MDAs and recognised staff representatives",documents:["Issue brief","Correspondence","Meeting record"],process:"Log → Assess → Mediate",status:"Available",icon:"Handshake"},
 {slug:"mda-support",title:"MDA Support & Enquiries",description:"Get policy clarification and operational guidance from the Bureau.",eligibility:"All Ogun State MDAs",documents:["Official enquiry letter"],process:"Enquire → Assign → Respond",status:"Available",icon:"MessagesSquare"},
];
export const requests: RequestItem[] = [
 {id:"OG/EST/2026/0148",mda:"Ministry of Health",type:"Establishment Request",requester:"Mrs. A. O. Adeyemi",submitted:"24 Sep 2026",status:"Under Review",priority:"High",sla:"2 days left"},
 {id:"OG/EST/2026/0144",mda:"Bureau of Public Service Reforms",type:"Organisational Review",requester:"Mr. K. A. Sobowale",submitted:"22 Sep 2026",status:"Clarification Required",priority:"Medium",sla:"Paused"},
 {id:"OG/TRN/2026/0391",mda:"Ministry of Education, Science & Technology",type:"Training Application",requester:"Mrs. T. O. Falana",submitted:"20 Sep 2026",status:"Recommended",priority:"Normal",sla:"On track"},
 {id:"OG/EST/2026/0137",mda:"Ministry of Works & Infrastructure",type:"Establishment Request",requester:"Engr. F. A. Olude",submitted:"17 Sep 2026",status:"Submitted",priority:"High",sla:"Overdue 1 day"},
 {id:"OG/IR/2026/0082",mda:"Ogun State Housing Corporation",type:"Industrial Relations",requester:"Mr. B. A. Ogunleye",submitted:"15 Sep 2026",status:"Approved",priority:"Normal",sla:"Completed"},
];
export const announcements = [
 {date:"25 Sep 2026",tag:"Circular",title:"2026 promotion exercise: submission of eligible officers",text:"MDAs are requested to submit verified nominal rolls by 16 October 2026."},
 {date:"19 Sep 2026",tag:"Training",title:"Public sector leadership programme — Cohort IV",text:"Nominations are now open for officers on GL 13–16."},
 {date:"11 Sep 2026",tag:"Notice",title:"Updated establishment request documentation",text:"A revised checklist applies to requests submitted from 1 October 2026."},
];
export const departments = [
 ["Establishments & Organisational Design","Policy, structures, schemes of service and workforce planning."],
 ["Personnel Management","Appointments, postings, promotions and career administration."],
 ["Training & Capacity Development","Learning needs, programmes, nominations and evaluation."],
 ["Industrial Relations","Labour relations, dispute prevention, mediation and advisory services."],
];
export const trendData=[{m:"Apr",requests:41,closed:32},{m:"May",requests:52,closed:39},{m:"Jun",requests:48,closed:43},{m:"Jul",requests:63,closed:51},{m:"Aug",requests:58,closed:49},{m:"Sep",requests:71,closed:56}];

/* ---------- Linked case records (shared by MDA, Officer and Management views) ---------- */
import type { CaseRecord } from "@/types";
export const CURRENT_MDA = "Ministry of Works and Infrastructure";
export const ASSIGNED_OFFICER = "Mr. D. A. Akinola";
export const checklistItems = ["Organisational justification reviewed","Organogram attached","Budget provision confirmed","Proposed positions reviewed","Establishment implications assessed"];
const docs = (status: CaseRecord["documents"][number]["status"] = "Verified"): CaseRecord["documents"] => [
  { label: "Organogram", name: "Approved_Organogram_2026.pdf", type: "PDF", size: "1.4 MB", status },
  { label: "Justification memo", name: "Justification_Memo_Signed.pdf", type: "PDF", size: "612 KB", status },
  { label: "Budget provision/evidence", name: "Budget_Provision_Extract.xlsx", type: "XLSX", size: "248 KB", status: "Pending review" },
];
type Seed = Pick<CaseRecord,"ref"|"service"|"title"|"mda"|"requester"|"submitted"|"updated"|"status"|"priority"|"ageDays"> & Partial<CaseRecord>;
const make = (s: Seed): CaseRecord => ({
  requestType: "New Establishment", department: "Department of Administration & Supplies", email: "establishments@ogunstate.gov.ng", phone: "0803 456 7812",
  justification: "Additional approved posts are required to support expanded service delivery mandates approved for 2026.", assignedTo: ASSIGNED_OFFICER,
  positions: [{ title: "Administrative Officer II", grade: "GL 08", existing: 6, requested: 2, unit: "Headquarters, Abeokuta", justification: "Workload increase from new directorate." }],
  documents: docs(), comments: [], checklist: [true, true, false, false, false],
  timeline: [{ date: s.submitted, text: "Request submitted" }, { date: s.submitted, text: `Assigned to ${ASSIGNED_OFFICER}` }],
  ...s,
});
export const seedCases: CaseRecord[] = [
  make({ ref:"BET-2026-000126", service:"Establishment Request", title:"Creation of Project Monitoring Unit posts", mda:CURRENT_MDA, requester:"Engr. F. A. Olude", submitted:"25 Sep 2026", updated:"28 Sep 2026", status:"Under Review", priority:"High", ageDays:7, requestType:"Restructuring",
    positions:[{title:"Principal Engineer (Civil)",grade:"GL 13",existing:4,requested:3,unit:"Project Monitoring Unit",justification:"Oversight of 14 ongoing road projects."},{title:"Quantity Surveyor II",grade:"GL 08",existing:2,requested:2,unit:"Project Monitoring Unit",justification:"Cost verification for contracts."}],
    timeline:[{date:"25 Sep 2026",text:"Request submitted"},{date:"25 Sep 2026",text:`Assigned to ${ASSIGNED_OFFICER}`},{date:"28 Sep 2026",text:"Under review"}] }),
  make({ ref:"BET-2026-000124", service:"Establishment Request", title:"Modification of Mechanical Workshop establishment", mda:CURRENT_MDA, requester:"Engr. F. A. Olude", submitted:"17 Sep 2026", updated:"24 Sep 2026", status:"Clarification Required", priority:"Medium", ageDays:15, requestType:"Modification of Existing Establishment",
    comments:[{author:ASSIGNED_OFFICER,date:"24 Sep 2026",text:"Please provide the current nominal roll for the Mechanical Workshop."}],
    timeline:[{date:"17 Sep 2026",text:"Request submitted"},{date:"18 Sep 2026",text:"Under review"},{date:"24 Sep 2026",text:"Clarification requested from MDA"}] }),
  make({ ref:"BET-2026-000121", service:"Establishment Request", title:"Upgrade of Highway Maintenance posts", mda:CURRENT_MDA, requester:"Mr. S. O. Adebayo", submitted:"02 Sep 2026", updated:"21 Sep 2026", status:"Approved", priority:"Normal", ageDays:30, checklist:[true,true,true,true,true],
    timeline:[{date:"02 Sep 2026",text:"Request submitted"},{date:"04 Sep 2026",text:"Under review"},{date:"15 Sep 2026",text:"Recommended for approval"},{date:"21 Sep 2026",text:"Approved by Permanent Secretary"}] }),
  make({ ref:"BET-2026-000125", service:"Establishment Request", title:"Creation of 24 Community Health Officer posts", mda:"Ministry of Health", requester:"Mrs. A. O. Adeyemi", submitted:"24 Sep 2026", updated:"24 Sep 2026", status:"Submitted", priority:"High", ageDays:8 }),
  make({ ref:"BET-2026-000123", service:"Training Application", title:"Leadership Programme Cohort IV nominations", mda:"Ministry of Education, Science & Technology", requester:"Mrs. T. O. Falana", submitted:"20 Sep 2026", updated:"27 Sep 2026", status:"Recommended", priority:"Normal", ageDays:12, positions:[] }),
  make({ ref:"BET-2026-000122", service:"Industrial Relations Support", title:"Mediation request: staff welfare dispute", mda:"Ogun State Housing Corporation", requester:"Mr. B. A. Ogunleye", submitted:"10 Sep 2026", updated:"26 Sep 2026", status:"Rejected", priority:"Normal", ageDays:22, positions:[] }),
  make({ ref:"BET-2026-000120", service:"Organisational Review", title:"Review of directorate structure", mda:"Bureau of Public Service Reforms", requester:"Mr. K. A. Sobowale", submitted:"29 Aug 2026", updated:"18 Sep 2026", status:"Closed", priority:"Medium", ageDays:34 }),
  make({ ref:"BET-2026-000119", service:"Establishment Request", title:"Creation of Revenue Officer posts", mda:"Ministry of Finance", requester:"Mrs. R. A. Lawal", submitted:"14 Sep 2026", updated:"16 Sep 2026", status:"Under Review", priority:"High", ageDays:18 }),
];
export const recentTraining = [
  { name: "Public Sector Leadership Programme — Cohort IV", officers: 4, status: "Approved" },
  { name: "Project Management for Engineers", officers: 6, status: "Under Review" },
  { name: "Digital Records Management", officers: 3, status: "Submitted" },
];
