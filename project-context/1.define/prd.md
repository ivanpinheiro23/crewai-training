# Product Requirements Document: Automated Employee Onboarding Workflow

## 1. Executive Summary

### Problem Statement

Employee onboarding for developer roles is fragmented across HR, IT, security, hiring managers, client account owners, and new hires. New employees often need multiple requests completed before they can contribute: employee profile creation, hardware or virtual desktop readiness, VS Code setup, Docker or approved container runtime access, Cisco VPN enrollment, Zoom activation, Citrix VDI entitlement, policy acknowledgements, and role-specific training. When these tasks are tracked through email, spreadsheets, chat messages, and separate ticketing systems, blockers are easy to miss and ownership becomes unclear.

The operational impact is delayed time-to-productivity, repeated HR/IT follow-up, inconsistent compliance evidence, and poor new-hire experience. For developer onboarding, the highest-value readiness milestone is not only "employee record created" but "developer can securely access the approved development environment, collaboration tools, and runtime."

### Solution Overview

The product is a multi-agent onboarding workflow assistant that coordinates onboarding tasks from offer acceptance through the first productive development task. It provides a role-based dashboard, automated task planning, request tracking, evidence-based completion checks, escalation handling, and a knowledge-grounded support assistant for onboarding questions.

The MVP focuses on developer onboarding and explicitly includes setup request workflows grouped under a single IT master ticket `IT0001` per onboarding case, with detailed items for:

- VS Code setup
- Docker or approved container runtime access
- Cisco Secure Client VPN access
- Zoom account activation and meeting readiness
- Citrix Workspace / Citrix VDI entitlement

The system does not replace HRIS, identity, ticketing, source-control, or collaboration platforms, and does not integrate with source-control platforms. It coordinates setup requests, tracks readiness, creates auditable task state, and supports human approvals.

### Strategic Rationale

A multi-agent architecture fits this problem because onboarding is inherently cross-functional. Different agents can own HR coordination, IT provisioning, developer environment validation, compliance checks, manager enablement, and employee support. This separation makes responsibilities easier to audit and allows sensitive actions to remain behind permissioned services and human approvals.

For the capstone, the configured runtime is `crewai`. The product requirements remain runtime-neutral, but Phase 2 implementation should use CrewAI-compatible agent roles and orchestration patterns where appropriate.

## 2. Market Context & User Analysis

### Target Market / Users

This capstone is positioned primarily as an internal enterprise onboarding workflow tool for consulting, software delivery, and technology teams that onboard developers into client projects.

Primary personas:

- New developer: needs clear tasks, tool setup, secure access, onboarding sessions, and fast blocker resolution.
- HR / People Operations coordinator: needs visibility into employee readiness, documents, policy acknowledgements, and cross-team task completion.
- IT service desk analyst: needs complete request details, approval status, due dates, access prerequisites, and escalation rules.
- Security / IAM approver: needs least-privilege access requests, identity verification, audit trails, and evidence of approvals.
- Hiring manager / project manager: needs visibility into readiness, blockers, first-week plan, and developer productivity milestones.
- DevOps / platform owner: needs Docker, registry, VPN, VDI, and environment setup requests to comply with client and corporate policy.

### User Needs Analysis

Critical needs:

- One place to see onboarding status and blockers.
- Clear task ownership across HR, IT, security, client teams, and manager tasks.
- Request templates for developer-specific setup.
- Evidence-based completion checks instead of manual status assumptions.
- Secure handling of source-code, VPN, VDI, identity, and container runtime access.
- Human approvals for sensitive access and privileged actions.
- Audit trail for compliance and accountability.

Typical developer onboarding journey:

1. HR starts onboarding record after hiring confirmation.
2. System generates role-based onboarding plan for developer profile.
3. Manager confirms project, client, location, employment type, start date, and required environments.
4. System creates one master ticket `IT0001` with detailed software items for VS Code, Docker/runtime, Zoom, VPN, and Citrix VDI, then routes each item to its approver.
5. Approved `IT0001` items are added to the IT execution queue and monitored until evidence validation is complete.
6. New hire completes profile, policy, tool, and meeting-readiness steps.
7. System verifies readiness evidence and flags unresolved blockers.
8. Manager confirms first productive development task can begin.

### Competitive Landscape

Direct and indirect alternatives include HRIS onboarding modules, ITSM workflow templates, standalone checklists, spreadsheets, email-based coordination, collaboration tool reminders, low-code automation, and RPA. Differentiation comes from combining cross-functional workflow state, role-specific developer setup rules, AI-assisted routing, knowledge-aware support, and auditable human approvals.

## 3. Technical Requirements & Architecture

### Runtime & Agent Specifications

Selected implementation runtime for this workspace: `crewai`.

The MVP should use a deterministic workflow state model with agents assisting in planning, routing, summarization, validation, and support. Agent memory must not be the system of record.

Recommended collaboration pattern:

- Intake and planning run sequentially when a new onboarding case is created.
- Specialized agents produce task recommendations and request payloads.
- A coordinator agent maintains workflow status and escalates blockers.
- Human approvals gate sensitive access before connector actions are executed.
- Validation routines confirm completion evidence before marking setup tasks complete.

### Core Agent Definitions

#### Agent: onboarding_coordinator

- Role: Central workflow coordinator for the onboarding case.
- Goal: Create and maintain the onboarding plan, coordinate owners, monitor blockers, and summarize readiness.
- Tools: onboarding case database, task service, notification service, ticket adapter, audit log.
- Runtime notes: May delegate to specialized agents; cannot execute privileged access changes directly.

#### Agent: hr_operations_agent

- Role: HR and People Operations coordination agent.
- Goal: Ensure employee profile, policy acknowledgements, required documents, benefits/payroll handoff, and HR tasks are completed.
- Tools: HRIS adapter or mock HRIS adapter, document checklist, notification service, audit log.
- Runtime notes: Must record assumptions and route missing HR data to a human coordinator.

#### Agent: it_provisioning_agent

- Role: IT service and device/tool provisioning agent.
- Goal: Prepare requests for VS Code, Docker/runtime, Zoom, VPN, Citrix VDI, hardware, accounts, and standard tools.
- Tools: ITSM adapter or mock ticket adapter, tool catalog, device request service, validation checklist.
- Runtime notes: May draft service requests; completion requires external status or human validation.

#### Agent: security_compliance_agent

- Role: Security and compliance validation agent.
- Goal: Enforce least privilege, approval policies, data minimization, audit logging, and readiness checks for sensitive access.
- Tools: policy knowledge base, IAM request adapter or mock adapter, audit log, risk checklist.
- Runtime notes: Flags high-risk requests for human security review.

#### Agent: manager_enablement_agent

- Role: Hiring manager and project-readiness support agent.
- Goal: Ensure the manager provides project assignment, first-week plan, buddy, team introductions, and role-specific milestones.
- Tools: calendar adapter, task service, notification service, onboarding plan templates.
- Runtime notes: May draft reminders and manager checklists.

#### Agent: employee_support_agent

- Role: New-hire support and onboarding Q&A agent.
- Goal: Answer onboarding questions from approved knowledge sources and guide the employee to the next task.
- Tools: retrieval over approved policies/FAQs, task status lookup, escalation service.
- Runtime notes: Must cite approved sources or escalate when confidence is low or policy is missing.

### Integration Requirements

MVP integrations may be mocked but should preserve realistic adapter boundaries.

Required MVP adapters:

- HRIS/mock HRIS for employee profile and start date.
- ITSM/mock ticketing system for setup requests.
- IAM/mock identity adapter for VPN, VDI, and application access.
- Calendar/meeting mock adapter for Zoom readiness.
- Notification adapter for email/chat reminders.
- Knowledge base adapter for onboarding policies and FAQs.

Developer setup request requirements:

- One master ticket `IT0001` must be created per onboarding case, with five software-specific items and full request metadata.
- Each software item must follow the same sequence: detail capture -> approver decision -> IT queue entry -> evidence validation.
- VS Code item: approved IDE availability, required extensions, settings sync policy, and successful IDE launch validation.
- Docker item: approved runtime, license eligibility, virtualization permission, registry access, security policy acknowledgement, runtime validation.
- Cisco VPN item: VPN profile, MFA enrollment, network group, connection validation.
- Zoom item: corporate account activation and non-federated sign-in readiness, calendar integration where approved, and test meeting validation.
- Citrix VDI item: Workspace app readiness, desktop image entitlement, VDI MFA, required application/network validation.

### Data Requirements

Core entities:

- OnboardingCase
- EmployeeProfile
- RoleProfile
- Task
- AccessRequest
- Approval
- SystemOwner
- EvidenceCheck
- Blocker
- Escalation
- AuditEvent
- KnowledgeArticle

Each setup/access task must capture:

- Request ID
- Master ticket ID (`IT0001`)
- Request type
- Requester
- Approver
- System owner
- IT queue status
- Queue entry timestamp
- Due date
- Status
- Dependency/prerequisite
- Permission level requested
- Validation method
- Completion evidence
- Escalation path
- Audit timestamps

### Infrastructure Specifications

MVP infrastructure:

- Web frontend for role-based dashboard and task detail views.
- Backend API for cases, tasks, agents, approvals, evidence checks, and audit events.
- Database for deterministic workflow state.
- Queue or scheduler for reminders and status checks.
- LLM integration for agent planning, summarization, and support responses.
- File/object storage only if needed for non-sensitive generated artifacts.
- Logging and metrics for workflow, agent, and integration events.

Security architecture:

- A user sign-in flow that does not depend on SSO; the exact mechanism is a project setup/security decision.
- Role-based access control.
- Least-privilege access request model.
- No storage of passwords, MFA secrets, private keys, personal access tokens, recovery codes, or client source code.
- Encryption in transit and at rest for production.
- Audit log for every recommendation, task update, approval, connector action, and escalation.

## 4. Functional Requirements

### P0 Core Features

#### FR-001: Create Developer Onboarding Case

User story: As an HR coordinator, I want to create an onboarding case for a new developer so that all required onboarding tasks are generated and tracked.

Acceptance criteria:

- Given required employee fields are provided, when the case is created, then the system creates an onboarding case with a unique ID.
- Given the role is developer, when the onboarding plan is generated, then developer-specific setup tasks are included.
- Given required fields are missing, when the coordinator submits the case, then the system identifies missing fields and does not create incomplete access requests.

Required fields:

- Employee name
- Start date
- Employment type
- Location/time zone
- Role/profile
- Manager
- Client/project assignment
- Required tool profile
- Required environment profile

#### FR-002: Generate Role-Based Onboarding Plan

User story: As an onboarding coordinator, I want the system to generate a role-based onboarding plan so that every owner knows what must be completed.

Acceptance criteria:

- The generated plan includes HR, IT, security, manager, and employee tasks.
- Each task has owner, due date, status, dependencies, and completion criteria.
- The plan identifies sensitive access tasks that require approval.
- The plan creates one master IT ticket `IT0001` for developer setup with five software-specific items.
- Each `IT0001` item must include requester, approver, and IT queue routing fields before execution.
- The coordinator can review and adjust the plan before notifications are sent.

#### FR-003: Track VS Code Setup

User story: As a new developer, I want clear instructions and validation for VS Code setup so that I can prepare my approved development environment.

Acceptance criteria:

- The task lists approved IDE installation or availability requirements.
- Required extensions can be listed by role or project.
- The settings sync policy is communicated to the developer.
- The VS Code setup item is linked to master ticket `IT0001`, approved by the designated approver, and moved to the IT queue before execution.
- Completion evidence confirms VS Code launches and required extensions are installed.

#### FR-004: Track Docker or Approved Runtime Access

User story: As a platform owner, I want Docker/runtime access controlled and validated so that developers can run approved local or remote development environments.

Acceptance criteria:

- The request captures whether local Docker is allowed, VDI-only development is required, or an alternative runtime is approved.
- The request captures license eligibility, virtualization permission, registry access, and policy acknowledgement.
- The Docker/runtime setup item is linked to master ticket `IT0001`, approved by the designated approver, and moved to the IT queue before execution.
- Completion evidence includes `docker version` or an approved equivalent runtime check.
- If local Docker is not permitted, the system directs the developer to Citrix VDI or approved remote runtime instructions.

#### FR-005: Track Cisco VPN Enrollment

User story: As a security approver, I want VPN access requests to include network group, MFA, and profile information so that access follows least privilege.

Acceptance criteria:

- The task captures VPN profile, network group, MFA status, and approver.
- The Cisco VPN setup item is linked to master ticket `IT0001`, approved by the designated approver, and moved to the IT queue before execution.
- The system prevents completion until VPN connection validation is recorded.
- No VPN credentials, MFA secrets, or recovery codes are stored.
- Failed validation creates a blocker and escalation path.

#### FR-006: Track Zoom Meeting Readiness

User story: As a new employee, I want my Zoom access ready before onboarding meetings so that I can join required sessions.

Acceptance criteria:

- The task captures corporate Zoom account activation and account sign-in readiness without SSO.
- Calendar integration is tracked where approved.
- The Zoom setup item is linked to master ticket `IT0001`, approved by the designated approver, and moved to the IT queue before execution.
- Completion evidence includes ability to join a test meeting or attend onboarding meeting.
- Zoom blockers can be assigned to IT or the meeting owner.

#### FR-007: Track Citrix VDI Entitlement

User story: As a developer working in a restricted client environment, I want Citrix VDI entitlement completed so that I can access approved virtual desktops and development resources.

Acceptance criteria:

- The request captures Citrix Workspace readiness, VDI image assignment, MFA, and required mapped applications or network paths.
- The Citrix VDI setup item is linked to master ticket `IT0001`, approved by the designated approver, and moved to the IT queue before execution.
- Completion evidence includes successful VDI launch and validation of required resources.
- If VDI is mandatory, dependent tasks such as Docker/runtime validation reflect VDI constraints.

#### FR-008: Role-Based Dashboard

User story: As each stakeholder, I want a dashboard showing tasks relevant to my role so that I can act quickly.

Acceptance criteria:

- New developer sees personal tasks, blockers, due dates, and next actions.
- HR sees onboarding case progress and HR-owned tasks.
- IT sees setup requests and validation gaps.
- Security sees sensitive access approvals and risks.
- Manager sees readiness milestones and first-week tasks.

#### FR-009: Blocker and Escalation Management

User story: As a coordinator, I want blockers escalated with ownership and context so that onboarding delays are resolved quickly.

Acceptance criteria:

- Any task can be marked blocked with reason, owner, and escalation target.
- SLA breaches trigger reminders or escalation events.
- The system summarizes blockers by onboarding case and owner.
- Resolved blockers remain visible in the audit trail.

#### FR-010: Knowledge-Grounded Employee Support

User story: As a new hire, I want to ask onboarding questions and receive answers from approved company or client sources so that I can complete setup without waiting for manual help.

Acceptance criteria:

- Answers are grounded in approved knowledge articles, policies, or FAQs.
- The assistant provides source references when available.
- The assistant escalates to HR, IT, or security when the answer is missing, sensitive, or low confidence.
- The assistant never reveals secrets, private credentials, or unauthorized client code.

#### FR-011: Audit Trail

User story: As a security or operations reviewer, I want an audit trail so that access decisions and workflow changes are explainable.

Acceptance criteria:

- The system records task creation, status changes, approvals, denials, evidence checks, agent recommendations, and escalations.
- Audit events include actor, timestamp, action, object, and outcome.
- Audit logs are read-only to normal users.
- Sensitive data is excluded from audit event payloads.

### P1 Enhanced Features

- Real ticketing integration with ServiceNow, Jira Service Management, or equivalent.
- Slack or Microsoft Teams reminders.
- Calendar-based onboarding session scheduling.
- Onboarding cohort view for HR and IT.
- Manager first-week plan generator.
- Readiness score by role and project.
- Configurable role profiles for frontend, backend, data, QA, DevOps, and support engineers.

### P2 Future Features

- Offboarding workflows.
- Internal transfer and project reassignment workflows.
- Contractor onboarding variants.
- Access recertification and expiration review.
- Multi-client onboarding profiles.
- Production analytics for bottlenecks and SLA trends.
- Integration with learning management systems.
- Automated policy-change impact analysis.

### Build-Agent Decision Rules

These rules make the requirements specific enough for downstream development agents to make consistent implementation decisions.

- Treat `OnboardingCase`, `Task`, `AccessRequest`, `Approval`, `EvidenceCheck`, `Blocker`, and `AuditEvent` as required MVP domain objects.
- Treat VS Code, Docker/runtime, Cisco VPN, Zoom, and Citrix VDI setup as P0 developer onboarding tasks.
- Use mock adapters for all external system interactions unless a later stakeholder/security decision explicitly approves real API writes.
- Do not mark VPN, VDI, container registry, or privileged identity requests complete unless both approval and validation evidence exist.
- Do not collect, store, display, log, or send to agents any passwords, MFA secrets, private keys, personal access tokens, recovery codes, or client source code.
- Store workflow state in the backend persistence layer; do not rely on chat messages or agent memory as authoritative state.
- Show support chat as an assistive surface, while dashboard, checklist, approval queue, blocker view, and audit timeline remain the primary workflow controls.
- If a required integration detail is unknown, implement the documented mock adapter contract and record the gap in Build-phase documentation rather than inventing a vendor-specific behavior.

### MRD-to-PRD Traceability Matrix

| MRD ID | MRD Finding | PRD Requirement Coverage |
| :-- | :-- | :-- |
| MRD-001 | Fragmented onboarding across teams creates ownership and blocker visibility gaps. | FR-001 Create Developer Onboarding Case; FR-002 Generate Role-Based Onboarding Plan; FR-008 Role-Based Dashboard; FR-009 Blocker and Escalation Management. |
| MRD-002 | Developer onboarding requires VS Code, Docker, Cisco VPN, Zoom, and Citrix VDI setup. | FR-003 through FR-007; Developer Setup Metrics; MVP Scope mocked request flows. |
| MRD-003 | Sensitive actions require human-in-the-loop approvals. | FR-005 VPN validation; FR-007 VDI entitlement; Security & Compliance NFRs; Build-Agent Decision Rules. |
| MRD-004 | Deterministic workflow state should remain authoritative. | Runtime & Agent Specifications; Data Requirements; Reliability NFRs; Build-Agent Decision Rules. |
| MRD-005 | Completion should be evidence-based. | FR-003 through FR-007 completion evidence; Developer setup checklist fields; Technical Metrics. |
| MRD-006 | Credentials, MFA secrets, private keys, personal access tokens, recovery codes, and client source code must not be exposed. | FR-005, FR-007, FR-010, FR-011; Security & Compliance NFRs; Risk Mitigation; Assumptions. |
| MRD-007 | UX should prioritize status clarity over conversational novelty. | FR-008 dashboard; User Experience Design primary screens; Agent Interaction Design; Error Handling. |
| MRD-008 | Mock adapters are appropriate for capstone delivery while preserving future integration boundaries. | Integration Requirements; MVP Scope; Out of Scope; P1 enhanced real integrations; Implementation Strategy. |
| MRD-009 | Success should be measured by readiness, setup completion, blocker resolution, support usefulness, audit coverage, and cycle time. | Business / Operational Metrics; Developer Setup Metrics; Technical Metrics; User Experience Metrics. |
| MRD-010 | Security assessment is required before delivery. | Security & Compliance NFRs; Phase 2 Build security assessment; Risk Mitigation; Quality Assurance Checklist. |

## 5. Non-Functional Requirements

### Performance Requirements

- Dashboard page load target: under 2 seconds for normal MVP datasets.
- Agent-generated plan target: under 30 seconds for a standard onboarding case.
- Support assistant response target: under 10 seconds for knowledge-grounded answers.
- Status update persistence target: under 1 second after user action.
- MVP concurrency target: at least 10 active users and 50 active onboarding cases in local/test deployment.

### Security & Compliance

- The MVP must provide a supported user sign-in flow that does not depend on SSO; the exact mechanism is a project setup/security decision.
- Authorization must support role-based access control.
- Access requests must follow least privilege.
- Sensitive access requires human approval.
- The system must not store passwords, MFA secrets, recovery codes, private keys, personal access tokens, or client source code.
- Employee personal data must be minimized in prompts and logs.
- Audit logging is required for workflow and access events.
- Security assessment is required before delivery because `aamad.config.yml` requires it.
- Dependency audit is required before delivery because `aamad.config.yml` requires it.

### Reliability

- Workflow state must be persisted in a database or durable store.
- Agent output must be reviewable before sensitive actions are taken.
- Failed connector calls must produce visible task errors or blockers.
- Manual fallback instructions must exist for critical onboarding tasks.
- Task status must not depend only on chat messages.

### Scalability

MVP scaling is limited but the design should support future growth through:

- Adapter interfaces for HRIS, ITSM, IAM, VPN, VDI, calendar, and notifications.
- Queue-based background processing for reminders and status checks.
- Configurable role profiles and tool profiles.
- Tenant or client separation if commercialized.

### Accessibility and Usability

- Core UI should be keyboard navigable.
- Status, blocker, and due-date information should not rely only on color.
- Copy should be clear for non-technical HR users and technical developers.
- Error states should explain next action and owner.

## 6. User Experience Design

### Interface Requirements

Primary screens:

- Onboarding case list
- Onboarding case detail
- Role-based task dashboard
- Developer setup checklist
- Access request detail
- Approval queue
- Blocker and escalation view
- Knowledge assistant panel
- Audit event view

Developer setup checklist fields:

- Task name
- System/tool
- Master ticket ID
- Owner
- Approver
- IT queue status
- Status
- Due date
- Dependency
- Request ID
- Permission level
- Validation method
- Completion evidence
- Blocker reason
- Escalation contact

### Agent Interaction Design

Agents should be visible through recommendations, summaries, and suggested next actions. Users should understand when an action is a recommendation versus an approved system action.

Required interaction behaviors:

- Show why a task was generated.
- Show what data or rule triggered an access request.
- Require user confirmation before sending sensitive requests.
- Provide clear escalation messages for blocked tasks.
- Ask short clarifying questions when required data is missing.
- Ground employee support answers in approved knowledge sources.

### Error Handling

- Missing required data: identify exact missing fields and owner.
- Approval denied: record denial reason and route back to requester.
- Validation failed: create blocker with retry or support path.
- Connector unavailable: keep task open, record failure, and provide manual fallback.
- Low-confidence support answer: escalate rather than guess.

## 7. Success Metrics & KPIs

### Business / Operational Metrics

- First-day developer readiness rate: target 90% for MVP pilot cases.
- Required setup tasks completed by start date: target 85% for pilot cases.
- Mean time to resolve onboarding blockers: target under 1 business day for P0 blockers.
- Reduction in manual HR/IT follow-up: target 25% in pilot feedback.
- Onboarding case visibility satisfaction: target 4 out of 5 from coordinators and managers.

### Developer Setup Metrics

- Master tickets `IT0001` created with five software items: target 100% for developer onboarding cases.
- Approved setup items added to IT queue within SLA: target 95%.
- VS Code launch and required extension validation completed: target 90%.
- Docker or approved runtime validation completed: target 85% where applicable.
- Cisco VPN validation completed before network-dependent tasks: target 90%.
- Zoom readiness before onboarding meetings: target 95%.
- Citrix VDI launch validation completed where required: target 90%.

### Technical Metrics

- Agent plan generation success rate: target 95% for complete input cases.
- Knowledge assistant escalation accuracy: target 90% of low-confidence or sensitive questions escalated.
- Audit event coverage: target 100% for access request status changes and approvals.
- Failed connector/mock adapter calls are surfaced as blockers: target 100%.
- LLM cost per onboarding case: tracked; target to be set during Build after baseline measurement.

### User Experience Metrics

- New-hire task completion rate: target 90% for assigned P0 tasks.
- User-reported clarity of next action: target 4 out of 5.
- Support assistant usefulness: target 4 out of 5 for answerable onboarding questions.
- Time-to-first-productive-development-task: baseline in pilot, then target 20% reduction.

## 8. Implementation Strategy

### Development Phases

Phase 1 Define:

- MRD completed at `project-context/1.define/mrd.md`.
- PRD completed at `project-context/1.define/prd.md`.
- SAD to be completed by `@system.arch` before Build.
- User stories should be created after PRD approval.

Phase 2 Build:

- Project setup by `@project.mgr`.
- Backend implements workflow state, agents, adapters, audit events, and API.
- Frontend implements dashboards, task views, approvals, blocker view, and support assistant UI.
- Integration connects frontend to backend APIs and mock adapters.
- QA maps tests to acceptance criteria.
- Security assessment validates access, secrets, audit, and dependency risks.

Phase 3 Deliver:

- DevOps prepares runbook, deploy documentation, CI, and user guide.
- Release includes known limitations and manual fallback process.

### MVP Scope

In scope:

- Developer onboarding case creation.
- Role-based onboarding plan generation.
- Mocked setup request flows for VS Code, Docker, Cisco VPN, Zoom, and Citrix VDI.
- Task dashboard and task detail view.
- Approval and blocker tracking.
- Evidence-based completion checks.
- Knowledge-grounded support assistant.
- Audit trail.

Out of scope for MVP:

- Real payroll or benefits changes.
- Source-control platform integrations.
- Real VPN/VDI/IAM provisioning without security review.
- Storage of credentials or source code.
- Full HRIS replacement.
- Multi-tenant SaaS billing.

### Resource Requirements

- Product Manager: PRD, requirements boundaries, success metrics.
- System Architect: SAD, architecture views, eval criteria.
- Project Manager: scaffold and environment setup.
- Backend Engineer: agents, workflow state, adapters, audit, API.
- Frontend Engineer: dashboards, forms, checklist, assistant UI.
- Integration Engineer: API integration and mock connector wiring.
- QA Engineer: unit, integration, and acceptance tests.
- Security Engineer: secrets, access control, least privilege, dependency review.
- DevOps Engineer: deployment, CI, runbook, user guide.

### Risk Mitigation

- Use mock adapters first to avoid unsafe access operations during capstone development.
- Require approvals for sensitive access requests.
- Keep deterministic database state as the authority.
- Do not include secrets or client source code in prompts, logs, or audit payloads.
- Record assumptions and open questions for architecture handoff.
- Add fallback manual process for blocked or unavailable integrations.

## 9. Launch & Go-to-Market Strategy

This is primarily an internal capstone workflow tool, so a commercial go-to-market plan is not required for MVP.

Internal launch approach:

- Pilot with a small simulated developer onboarding cohort.
- Use mocked integrations to demonstrate end-to-end workflow safely.
- Collect feedback from HR, IT, manager, security, and developer personas.
- Measure readiness, blocker resolution, and task clarity metrics.
- Decide whether to pursue real integrations after security and stakeholder review.

Potential future commercialization:

- Position as an onboarding orchestration layer for consulting and enterprise delivery teams.
- Package integration profiles for HRIS, ITSM, IAM, VPN, VDI, and collaboration tools.
- Offer per-employee, per-onboarding-case, or enterprise workflow pricing.

## Quality Assurance Checklist

- [x] Requirements traceable to MRD, system description, or recorded assumptions.
- [x] Technical specifications feasible with the selected runtime adapter.
- [x] Success metrics aligned with stated objectives.
- [x] MVP vs Future Work boundaries explicit.
- [x] Market sections marked internal-tool oriented where commercial strategy is not required.
- [x] MRD insights explicitly mapped to PRD functional requirements, NFRs, metrics, and scope decisions.
- [x] Developer setup requirements specific enough for Build agents to implement consistent mock adapters and validation checks.

## Sources

- `project-context/1.define/mrd.md`
- `.cursor/templates/prd-template.md`
- `aamad.config.yml`
- Visual Studio Code documentation, https://code.visualstudio.com/docs
- Docker documentation, https://docs.docker.com/
- Cisco Secure Client documentation, https://www.cisco.com/c/en/us/support/security/anyconnect-secure-mobility-client/series.html
- Zoom support documentation, https://support.zoom.com/
- Citrix Workspace app documentation, https://docs.citrix.com/en-us/citrix-workspace-app.html

## Assumptions

- The capstone MVP focuses on developer onboarding into client project environments.
- `crewai` is the selected runtime based on `aamad.config.yml`.
- Real external integrations may be replaced by mock adapters for capstone delivery.
- Docker access may be local, remote, or disallowed depending on client security policy.
- Citrix VDI may be mandatory for restricted client environments.
- Cisco VPN, Citrix VDI, and container registry workflows must not expose credentials or secrets to the onboarding assistant.
- A security assessment is required before delivery.
- SSO is unavailable and is not a dependency for the MVP; a non-SSO sign-in mechanism must be selected during project setup.

## Open Questions

- Which HRIS or employee data source should be modeled in the MVP?
- Which non-SSO user sign-in mechanism is approved for the MVP?
- Which ticketing/request system owns setup requests: ServiceNow, Jira Service Management, or another system?
- Which VS Code extensions are mandatory for the client project?
- Is Docker Desktop approved locally, or must container workflows run inside Citrix VDI or remote development environments?
- Which Cisco VPN profiles and network groups are required for each developer role?
- Which Citrix VDI desktop images and mapped resources are needed?
- Should Zoom readiness include calendar integration and required meeting recordings policy acknowledgement?
- Which onboarding SLA targets should be contractual versus internal best-effort targets?
- What data retention policy applies to onboarding audit events and support assistant transcripts?

## Audit

- Timestamp: 2026-09-23
- Persona id: `product-mgr`
- Action: `create-prd`
- Artifact: `project-context/1.define/prd.md`
- Source artifact: `project-context/1.define/mrd.md`
- Resolved `AAMAD_TARGET_RUNTIME`: `crewai`
- Timestamp: 2026-09-23
- Persona id: `product-mgr`
- Action: `quality-pass-specificity-traceability`
- Artifact: `project-context/1.define/prd.md`
- Source artifact: `project-context/1.define/mrd.md`
- Resolved `AAMAD_TARGET_RUNTIME`: `crewai`
- Timestamp: 2026-10-05
- Persona id: `product-mgr`
- Action: `align-prd-with-mrd-remove-source-control-integration`
- Artifact: `project-context/1.define/prd.md`
- Source artifact: `project-context/1.define/mrd.md`
- Resolved `AAMAD_TARGET_RUNTIME`: `crewai`
- Timestamp: 2026-10-05
- Persona id: `product-mgr`
- Action: `align-prd-with-it0001-developer-setup-flow`
- Artifact: `project-context/1.define/prd.md`
- Source artifact: `project-context/1.define/mrd.md`
- Resolved `AAMAD_TARGET_RUNTIME`: `crewai`
- Timestamp: 2026-10-06
- Persona id: `product-mgr`
- Action: `remove-sso-requirement`
- Artifact: `project-context/1.define/prd.md`
- Source artifact: `project-context/1.define/mrd.md`
- Resolved `AAMAD_TARGET_RUNTIME`: `crewai`
