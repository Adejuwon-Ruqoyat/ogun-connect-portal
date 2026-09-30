# Ogun Bureau Connect

Build the frontend foundation for a modern digital transformation platform for the Ogun State Bureau of Establishments & Training.

IMPORTANT:
This is a FRONTEND PROTOTYPE ONLY at this stage.
Do NOT build backend services, database integrations, authentication, payments, external APIs, or AI features yet.
Use realistic mock data and local frontend state.

PRODUCT CONTEXT

The Bureau of Establishments & Training is responsible for:
- Establishment policies and organisational structures
- Personnel and staffing matters
- Industrial relations
- Training and capacity development
- Career progression
- Collaboration with Ministries, Departments and Agencies (MDAs)

The prototype should demonstrate what a modern digital Bureau could look like.

DESIGN DIRECTION

Create a polished civic-government technology interface.

Visual style:
- Modern government / enterprise SaaS
- Professional and trustworthy
- Clean and spacious
- Deep navy and government green as primary colours
- White and light neutral backgrounds
- Subtle gold accent
- Accessible typography
- Responsive layout
- Modern cards, tables, badges, charts and forms
- Avoid excessive gradients, glassmorphism or flashy animations

The platform should feel credible enough to present to a government stakeholder.

BRAND

Display:

OGUN STATE
Bureau of Establishments & Training

Use a simple government-style emblem placeholder rather than inventing an official logo.

PUBLIC WEBSITE

Create these routes:

/
 /services
 /services/establishment-request
 /about
 /departments
 /contact

The public website should include:

1. Header/navigation
2. Hero section
3. Bureau introduction
4. Digital services
5. Training section
6. Latest announcements
7. Departments
8. Call-to-action
9. Footer

The main CTA should encourage users to:
"Explore Services"

SERVICES

Create a service catalogue containing:

- Establishment Request
- Appointment & Placement
- Promotion & Career Progression
- Posting & Transfer
- Training Application
- Industrial Relations Support
- MDA Support & Enquiries

Each service should show:
- Description
- Eligibility
- Required documents
- Expected process
- Status
- Apply button

APPLICATION FLOW

Create a polished multi-step Establishment Request form.

Steps:

1. Request Information
2. MDA Information
3. Establishment Details
4. Supporting Documents
5. Review & Submit

After submission, display a success state with:
- Reference number
- Submission date
- Current status
- Next step

MDA DASHBOARD

Create route:

/mda/dashboard

Include:
- Sidebar navigation
- Header
- Welcome section
- KPI cards
- Recent requests
- Requests requiring action
- Notifications
- Training applications
- Establishment summary

Use realistic Nigerian public-sector sample data.

OFFICER DASHBOARD

Create route:

/officer/dashboard

Include:
- Total assigned cases
- Pending review
- Awaiting clarification
- Overdue cases
- Recently completed
- Work queue table
- Priority indicators
- SLA indicators
- Recent activity

CASE DETAIL

Create route:

/officer/cases/:id

Show:
- Case reference
- MDA
- Request type
- Requester
- Submission date
- Current status
- Priority
- Supporting documents
- Establishment details
- Review checklist
- Officer comments
- Activity timeline
- Workflow actions

Workflow actions should visually support:

Submitted
→ Under Review
→ Clarification Required
→ Recommended
→ Approved
→ Rejected
→ Closed

Use mock actions only.

MANAGEMENT DASHBOARD

Create route:

/management/dashboard

Include:

- Total requests
- Requests this month
- Average turnaround time
- SLA compliance
- Pending approvals
- MDA activity
- Department workload
- Request trends
- Service distribution
- Ageing cases
- Training activity

Use charts where appropriate.

NAVIGATION

Create separate navigation experiences for:

Public user
MDA user
Bureau officer
Management

Use mock role switching for the prototype.

IMPORTANT UX REQUIREMENTS

- Every major button should work.
- Navigation should work.
- Tables should have realistic data.
- Filters/search should have visible interactions.
- Forms should have validation states.
- Status badges should be visually consistent.
- Empty states should exist.
- Loading states should exist.
- Error states should exist.
- Make the interface responsive.

ARCHITECTURE

Organise the frontend into reusable components:

components/
layouts/
pages/
features/
data/
types/
lib/

Create reusable:
- Button
- Card
- Badge
- Table
- Modal
- Form fields
- Sidebar
- Header
- Stat card
- Status timeline
- Empty state
- Loading state

Use mock data from a dedicated data layer so that it can later be replaced by API calls.

DO NOT implement the backend yet.

The priority is a polished, believable frontend prototype with clean reusable components.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ogun-connect-portal.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2043f155-466c-4f11-9602-ff717d1a7b4c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
