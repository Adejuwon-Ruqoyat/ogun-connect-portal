# Ogun State Bureau Digital Platform — Frontend Prototype

## Goal
Build a credible, responsive civic-government frontend prototype for the Ogun State Bureau of Establishments & Training. All content, charts, forms, role switching, filters, and workflows will use local mock data and frontend state only.

## Experience and visual system
- Establish a navy, government green, white, light-neutral, and restrained gold design system with accessible contrast, compact radii, subtle shadows, and clear typography.
- Create a simple neutral government-emblem placeholder and consistent Bureau branding.
- Provide shared responsive public navigation, four role-aware navigation experiences, mobile menus, status styling, tooltips, and clear keyboard/focus states.
- Keep motion restrained and functional; no glassmorphism, excessive gradients, or decorative effects.

## Public website
- Build separate, fully navigable routes for Home, Services, Establishment Request, About, Departments, and Contact.
- Home will include the requested introduction, service highlights, training, announcements, departments, “Explore Services” call-to-action, and footer.
- Services will provide searchable/filterable service cards with description, eligibility, required documents, process, status, and working actions.
- About, Departments, and Contact will use realistic Bureau content, useful directory information, and a validated local contact form.

## Establishment Request flow
- Build the five-step request flow with progress tracking, per-step validation, back/next controls, file-selection mock UI, save-as-draft behavior, and a final review.
- Submission will create a local success state with a realistic reference number, date, current status, and next step.
- Include purposeful empty, loading, and error demonstrations without any network calls.

## Role workspaces
- **MDA dashboard:** welcome area, KPIs, recent requests, action items, notifications, training applications, and establishment summary.
- **Officer dashboard:** assigned-case metrics, status summaries, searchable/filterable work queue, priority and SLA indicators, completed work, and activity feed.
- **Case detail:** case metadata, supporting files, establishment details, review checklist, comments, timeline, and mock workflow actions across the full status lifecycle.
- **Management dashboard:** executive metrics plus MDA activity, workload, request trends, service distribution, ageing, and training charts.
- Add a mock role switcher linking the Public, MDA, Officer, and Management experiences.

## Reusable frontend foundation
- Organise shared UI, layouts, feature modules, types, utilities, and mock data into focused folders.
- Reuse buttons, cards, badges, tables, modals, form controls, navigation, stat cards, timelines, and state displays.
- Keep data in a dedicated typed mock layer so later API replacement is straightforward.
- Add route-specific page titles and social descriptions for every content route.

## Verification
- Confirm the current build has no errors.
- Exercise navigation, role switching, search/filter controls, the full establishment request submission, case workflow actions, and responsive layouts in the live preview.
- Check representative desktop and mobile screens for overflow, overlap, accessibility, and credible content density.

## Technical details
- Use the existing React 19, TanStack Start/Router, Tailwind CSS v4, shadcn components, Lucide icons, and Recharts stack.
- Use local React state only; no Cloud, authentication, database, payments, external APIs, AI, or persistent storage.
- Keep each named experience in its own TanStack route, including dynamic officer case IDs.
