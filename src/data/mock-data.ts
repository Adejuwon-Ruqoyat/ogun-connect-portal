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
