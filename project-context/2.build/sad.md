# MVP System Architecture Document: Automated Employee Onboarding Workflow

## Context & Instructions

This document specifies the MVP architecture for the developer onboarding workflow assistant. It follows `.cursor/templates/sad-template.md`. The user request referred to `srd.md`; no such file was present, so this SAD uses the available market research document, `project-context/1.define/mrd.md`, and the PRD.

**PRD Document**: `project-context/1.define/prd.md`  
**MRD**: `project-context/1.define/mrd.md`  
**User Stories**: Embedded in PRD as FR-001 through FR-012; no separate user-story files were present.  
**MVP Scope**: Developer onboarding from case creation through readiness tracking, including mocked integrations, approvals, blockers, evidence checks, grounded support, and audit trail.  
**Selected Runtime**: `crewai` (resolved from `aamad.config.yml`)

## 1. MVP Architecture Philosophy & Principles

### MVP Design Principles

- Keep persisted workflow state authoritative and deterministic; agents recommend and prepare work but do not own state.
- Keep the MVP to a web application, API, durable database, CrewAI orchestration, and mocked adapter interfaces.
- Require human review before sensitive access requests are submitted or treated as approved.
- Treat evidence checks and audit events as first-class workflow data, not chat history.
- Make integrations replaceable behind interfaces; do not make production vendor APIs a prerequisite for the capstone.
- Log operational outcomes while excluding credentials, secrets, and client source code from prompts, logs, and audit payloads.

### Core vs Future Features

**MVP**: Create developer onboarding cases; generate and review plans; track role-owned tasks and setup requests for client GitHub, VS Code, Docker or approved runtime, Cisco VPN, Zoom, and Citrix VDI; manage approvals, evidence, blockers, and escalations; provide approved-source support; record an audit trail.

**Future Work**: Real HRIS, ITSM, GitHub, IAM, VPN, VDI, calendar, messaging, and collaboration integrations; payroll or benefits changes; multi-tenant SaaS and billing; offboarding, transfers, contractor workflows, access recertification; advanced analytics and multi-region deployment.

### Technical Architecture Decisions

| ID | Decision | Rationale / Consequence |
|---|---|---|
| ADR-001 | Use CrewAI with a sequential, coordinator-led flow for MVP plan generation and support. | Matches configured runtime and keeps execution understandable and testable. Do not enable autonomous privileged tool execution. |
| ADR-002 | Persist cases, tasks, approvals, evidence, blockers, and audit events in an application database. | PRD requires durable, deterministic workflow state. Database technology remains a Build choice; a relational store is the recommended default because the records have explicit relationships and status transitions. |
| ADR-003 | Use mocked external-system adapters behind typed service interfaces. | PRD explicitly scopes external interactions to mocks unless later approved. Keep vendor-specific behavior out of the domain workflow. |
| ADR-004 | Use JSON request/response APIs; do not require token streaming for MVP. | PRD specifies response-time targets but no streaming requirement. A simpler contract helps trace, validate, and audit results. |
| ADR-005 | Make the dashboard and task/approval workflows primary; keep chat as a secondary support surface. | Matches PRD UX requirement that status clarity, blockers, and next actions take priority over conversational interaction. |
| ADR-006 | Do not persist long-lived agent memory for workflow facts. | Reproducibility, privacy, and source-of-truth requirements favor explicit, permission-checked database reads. |

Frontend framework and component library are not specified by the PRD. Choose them during project setup, document the choice, and preserve keyboard navigation, responsive layouts, and accessible status text. The backend language should be Python, consistent with `aamad.config.yml`; avoid committing to a particular web framework until project scaffolding selects one.

## 2. Multi-Agent System Specification

### Agent Architecture Requirements

Use at most four specialized agents. Agents return structured recommendations; the application service validates them and performs state transitions. HR, IT, security, client repository owners, managers, and new hires remain accountable human workflow actors, not additional autonomous agents.

| Agent | Role and goal | Allowed tools / data | Restrictions |
|---|---|---|---|
| `onboarding_coordinator` | Build a role-based plan, summarize case readiness, and identify missing fields or blockers. | Permission-filtered case/task reads; plan-generation service; audit event proposal. | Cannot approve access or directly mutate authoritative state. |
| `developer_setup_agent` | Prepare and track request details and evidence criteria for GitHub, VS Code, Docker/runtime, VPN, Zoom, and Citrix VDI tasks. | Mock request adapters; approved tool catalog; task/evidence reads. | Cannot execute real external writes in MVP; access requests require human review and least privilege. |
| `security_compliance_agent` | Flag sensitive requests, missing approvals, policy conflicts, and prohibited data. | Policy knowledge base; access-request summary; approval status; audit event proposal. | Cannot grant access or override denial; must not receive secrets or source code. |
| `employee_support_agent` | Answer onboarding questions from approved policies and guide users to next actions. | Retrieval over approved knowledge articles; permission-filtered task status; escalation service. | Cite retrieved sources when available; escalate sensitive, missing, or low-confidence answers rather than guessing. |

### Task / Turn Orchestration

1. API validates the caller, role, required case fields, and request schema.
2. For plan generation, the application loads only authorized, necessary case and role-profile fields and passes them to the coordinator. The coordinator may request setup-task recommendations from the developer setup agent and risk flags from the security/compliance agent.
3. The application validates the structured result against allowed task types, required fields, role permissions, and MVP policy. Invalid or incomplete results are rejected and surfaced for correction; they are not written as complete tasks.
4. A human reviews the proposed plan and confirms before task notifications or sensitive requests are advanced.
5. The application persists accepted tasks and audit events in one transaction where supported. State changes use validated transitions and are attributed to the initiating actor or system service.
6. Evidence and approvals are recorded independently. Sensitive tasks cannot reach complete until the required human approval and evidence check are both present.
7. Support requests retrieve only approved knowledge and authorized task context. Missing, sensitive, or low-confidence questions route to a named HR, IT, or security owner.

**Expected agent output**: JSON object validated against application schemas. Plan output includes task type, summary, suggested owner role, due-date basis, dependencies, sensitivity flag, approval requirement, validation method, and rationale. Agents do not choose arbitrary owners, permissions, due dates, or connector targets outside the validated role/profile and policy inputs.

**Context and memory**: No persistent agent memory is required. Each turn receives the minimum necessary case/task context and approved knowledge snippets. Do not pass credentials, MFA secrets, recovery codes, private keys, personal access tokens, or client source code to the LLM.

**Retries, errors, and cancellation**: Retry transient mock-adapter or model failures only within a bounded request policy; do not retry approval or state-transition writes blindly. Use idempotency keys for retried application commands. Return a visible failed state or blocker with owner and manual fallback for unavailable adapters. Enforce the PRD latency budgets at the application boundary. If an invocation times out or is cancelled, do not accept a late result as authoritative; confirm CrewAI execution cancellation semantics during implementation rather than assuming that cancelling an HTTP request stops runtime work.

**Performance budgets**: Plan generation under 30 seconds; support answers under 10 seconds; database status updates under 1 second after user action. Use bounded context and task iteration, record actual token/cost and duration per workflow, and surface timeout states. Exact token limits and cost caps remain Build decisions pending a cost baseline and operator threshold.

### Runtime-Conditional Configuration: CrewAI

- Use Python CrewAI agents and tasks, with a sequential process for bounded MVP flows. Keep orchestration definitions/configuration separate from API handlers.
- Use explicit task context chaining: validated case summary → setup recommendations → security flags → coordinator summary. Omit an agent from a path when its expertise is not needed.
- Configure a low, explicit per-agent iteration limit and a bounded application timeout; verify behavior with the selected CrewAI version and tests. Do not rely on the framework's agent memory as persistence.
- Expose only narrow application services or mocked adapters to agents. No direct database credentials, shell access, unrestricted network access, or real provisioning tools.
- Validate all model output against schemas before any persistence. Preserve the original recommendation, validation result, and user decision in the audit trail without sensitive values.
- Framework version, model/provider, model settings, and secret environment variable names must be recorded in implementation configuration, not hardcoded in this SAD. No secret values belong in source control or generated artifacts.

## 3. Frontend Architecture Specification

### Technology Stack

The PRD requires a web frontend but does not select framework, UI library, or state-management library. Project setup should select these and record the decision. Use a typed API boundary and a component structure that can support accessible forms and tables; do not make chat the only interaction pattern.

### Application Structure

Recommended MVP routes/views:

- `/cases`: authorized onboarding case list with readiness and blocker summaries.
- `/cases/{caseId}`: case detail, timeline, role-specific tasks, and next actions.
- `/approvals`: pending access and other sensitive-action approvals.
- `/blockers`: unresolved blockers and escalation ownership.
- `/knowledge` or an embedded assistant panel: support questions and cited answers.
- An audit timeline embedded in case detail for authorized reviewers.

The frontend calls the backend through a small API client. It must not invoke CrewAI, mock vendors, or external systems directly. The backend remains authoritative for access control and state validation. Frontend-only state is limited to view state and unsaved form input.

### Interface Requirements

- Show role-filtered cases/tasks and the specific next action, owner, due date, dependency, approval state, request ID, validation method, evidence, and blocker reason where applicable.
- Separate proposed actions from approved/completed actions; require explicit confirmation before sending a sensitive request.
- Make denial, unavailable connector, failed validation, and missing-data states actionable and name the next owner/escalation path.
- Include loading, empty, error, and stale-data states. Reflect a failed save clearly and do not optimistically show a persisted approval or completion.
- Keep status meaning available in text and icons, not color alone. Support keyboard navigation and responsive layouts as required by the PRD.
- Present support answers with source references and a clear escalation affordance. Do not expose unauthorized task or employee details in chat.

## 4. Backend Architecture Specification

### API Architecture

Use a versioned JSON API. The endpoint names below are proposed MVP contracts, not fixed vendor or framework requirements.

| Operation | Proposed endpoint | Contract summary |
|---|---|---|
| List/create cases | `GET/POST /api/v1/cases` | Lists authorized cases; create validates required employee, role, project, tool, and environment fields and returns a case ID plus initial status. |
| Read case | `GET /api/v1/cases/{case_id}` | Returns permission-filtered case, tasks, readiness, and blockers. |
| Generate/review plan | `POST /api/v1/cases/{case_id}/plan` | Returns a validated proposal with task recommendations and rationale; persists only after explicit review/confirmation. |
| Update task | `PATCH /api/v1/tasks/{task_id}` | Accepts allowed status transition, blocker details, or evidence reference; server validates role and prerequisites. |
| Record approval | `POST /api/v1/access-requests/{request_id}/approvals` | Records approve/deny, actor, timestamp, and non-sensitive reason; cannot be called by unauthorized users. |
| Support question | `POST /api/v1/support/answers` | Accepts question and authorized context reference; returns answer, source references, confidence/escalation outcome, and request ID. |
| Audit events | `GET /api/v1/cases/{case_id}/audit-events` | Returns read-only, role-filtered events; excludes prohibited sensitive payloads. |
| Health | `GET /health` | Reports service health without disclosing secrets or personal data. |

**Common request fields**: authenticated actor context comes from the auth layer, not a client-supplied user ID. Mutating requests include an idempotency key where retries are possible. **Common response fields**: request/correlation ID, result or resource, and validation/errors. Return structured errors with stable code, safe message, field errors when relevant, and retryability; never echo secrets or raw model prompts. Apply input validation, role authorization, and rate limiting at the API boundary. Concrete rate limits are a deployment decision because no numeric target is in the PRD.

### Data Architecture

Persist the PRD-required entities: `OnboardingCase`, `EmployeeProfile`, `RoleProfile`, `Task`, `AccessRequest`, `Approval`, `SystemOwner`, `EvidenceCheck`, `Blocker`, `Escalation`, `AuditEvent`, and `KnowledgeArticle` (or a reference to an approved knowledge source). The chosen database must support durable writes, referential integrity, and transactions for related task/audit changes.

Keep employee fields to those required for assignment and workflow. Keep evidence as a result/reference and minimal validation metadata; do not upload source code, secrets, credentials, MFA artifacts, or unnecessary employee documents. Apply retention and deletion rules when supplied by the organization; the PRD leaves retention duration open. Store audit events append-only from ordinary-user workflows and exclude secrets and unnecessary prompt content.

### Runtime Integration Layer

The HTTP/API layer calls an application service, which loads authorized context, invokes the CrewAI orchestration boundary, validates structured output, and commits accepted changes. The domain service owns state transitions; CrewAI does not write directly to the database. A worker/scheduler may process reminders and status checks, as allowed by PRD, but MVP external status checks use mocks. Record correlation ID, agent/task name, duration, outcome, token/cost metadata if available, adapter result, and validation result with sensitive-data filtering.

### Authentication & Secrets

Design authentication for later SSO integration. Enforce role-based authorization on every case, task, approval, knowledge, and audit operation. Distinguish new hire, HR coordinator, IT analyst, security/IAM approver, client repository owner, manager, and administrator capabilities based on PRD personas; exact role mapping and identity provider remain implementation/open decisions.

Load provider/database credentials only from environment or an approved secrets manager. The PRD does not provide an `.env.example`, so use no invented secret values or provider-specific credential names here. Do not place secrets in agent context, browser storage, logs, screenshots, or audit events. Encrypt traffic in transit and database/object storage at rest in deployed environments.

## 5. DevOps & Deployment Architecture

- **CI/CD**: Minimum pipeline runs formatting/lint, unit tests, integration tests against mocked adapters, and application build. Enforce secret scanning and dependency audit before delivery, as required by `aamad.config.yml` and PRD.
- **Hosting**: Use the smallest deployment environment supported by project setup; no cloud provider is selected by the inputs. Provide an application health endpoint and configuration through environment variables/secrets management.
- **Runtime services**: Web frontend, Python API/CrewAI service, durable database, and a scheduler/worker only for reminders or status checks that need background execution. Keep local/test deployment viable for the pilot.
- **Observability**: Structured application logs, health status, API latency, plan/support duration, mock-adapter failures, unresolved blockers, approval latency, audit write failures, and per-case LLM cost tracking. Redact personal and secret data.
- **Deferred**: Infrastructure as code, multi-region failover, horizontal scaling, advanced APM, production SSO integration, and production connectors unless Build scope changes with stakeholder/security approval.
- **Fallback**: For a failed or unavailable adapter, leave the request open, show a blocker and manual instructions, and retain an auditable failure event.

## 6. Data Flow & Integration Architecture

### Logical View (Presentation, Element Catalog, Rationale)

**Primary presentation**: Browser → authenticated web UI → versioned API → application/domain services → database; agent requests branch from the application service through a constrained CrewAI boundary. The API also calls mock adapter interfaces and approved-knowledge retrieval.

| Element | Responsibility |
|---|---|
| Web UI | Case, task, approval, blocker, audit, and support views; no direct vendor/runtime access. |
| API/auth boundary | Identity context, schema validation, authorization, rate limiting, response/error contract. |
| Workflow domain service | Required-field checks, plan confirmation, state transitions, evidence, escalation, and audit coordination. |
| CrewAI boundary | Structured recommendations and grounded support; no authoritative state writes. |
| Adapter interfaces | Mock HRIS, ITSM, GitHub access request, IAM, calendar/Zoom, notification, and knowledge operations. |
| Persistence | Durable case/task/access/approval/evidence/blocker/audit state. |

**Rationale/analysis**: This separation keeps the workflow testable without live client systems and prevents agent output from bypassing authorization or approval policy. All data access follows the same API authorization boundary regardless of whether a screen or agent requested it.

### Process/Runtime View (Presentation, Element Catalog, Rationale)

**Primary presentation**: User command → authentication and authorization → domain validation → optional CrewAI recommendation → schema/policy validation → human confirmation when needed → transactionally persisted state and audit event → UI response. Scheduled reminders and mock status checks run separately and produce normal task/audit updates through the domain service.

| Element | Runtime behavior |
|---|---|
| Synchronous API request | Handles case/task reads and writes; plan generation and support remain within their PRD response budgets. |
| CrewAI sequential flow | Uses bounded role-specific tasks with minimal context; returns structured data for application validation. |
| Human approval | Holds sensitive access work until authorized approval; denial and requested changes are persisted and visible. |
| Background scheduler/worker | Sends reminders or performs mock status checks; retries only idempotent transient work and reports final failures. |
| Audit writer | Records actor, timestamp, action, object, and outcome for required workflow/access events. |

**Rationale/analysis**: Human confirmation is a control point, not an agent convention. The domain service rechecks approval, permissions, and evidence at the time of each transition to prevent stale recommendations from becoming access actions.

### Deployment View (Presentation, Element Catalog, Rationale)

**Primary presentation**: Browser client communicates with an application deployment over TLS. The application deployment contains the UI hosting layer, Python API/CrewAI process, and optional worker; it connects to a durable database and configured LLM/approved knowledge service. MVP external business systems are mocked.

| Element | Boundary / deployment concern |
|---|---|
| User browser | No secrets stored client-side; only authenticated session and minimum view state. |
| Application service | Authenticated API and CrewAI orchestration; outbound access constrained to configured model and mock adapter boundaries. |
| Database | Private network/service boundary; encrypted at rest; least-privilege application credentials. |
| LLM/knowledge provider | Receives only minimized, authorized context; approved knowledge only. Provider, retention behavior, and region must be reviewed before production data is used. |
| Mock adapters | Local/test implementations return deterministic success, denial, validation failure, and unavailable outcomes for test coverage. |

**Rationale/analysis**: No hosting provider or production network topology is identified in the PRD. Keep deployment topology provider-neutral for MVP and decide with project setup; do not send live employee/client data to a model until provider data handling and organizational approval are confirmed.

### Data View (Presentation, Element Catalog, Rationale)

**Primary presentation**: OnboardingCase contains EmployeeProfile and RoleProfile references; it owns Tasks and associated AccessRequests, Approvals, EvidenceChecks, Blockers, Escalations, and AuditEvents. KnowledgeArticle records or references are isolated from case-specific state.

| Element | Key relationships / invariants |
|---|---|
| OnboardingCase | Has role, project/client, start date, environment/tool profile, status, and authorized participants. |
| Task | Belongs to a case; has owner, due date, dependency, status, completion criteria, and evidence requirement. |
| AccessRequest | References a task/system and requested least-privilege permission; records requester, approver, system owner, expiration/review date, and request ID. |
| Approval | Records authorized human decision and non-sensitive reason; approval is not inferred from task status. |
| EvidenceCheck | Records method, result, timestamp, and safe evidence reference; sensitive raw material is excluded. |
| Blocker/Escalation | Records reason, owner, target, state, and resolution; resolved records remain auditable. |
| AuditEvent | Records actor, timestamp, action, object, outcome; normal users cannot update/delete events. |

**Rationale/analysis**: Explicit entities support deterministic status, evidence-based completion, and auditability. For GitHub, VPN, VDI, container registry, and privileged identity tasks, completion requires approval and validation evidence. Evidence confirms access/readiness without storing credentials or client source code.

### MVP Integration Set and Error Propagation

Implement mock adapters for HRIS/profile lookup, ITSM requests, client GitHub access, IAM/VPN/VDI, Zoom/calendar readiness, notifications, and approved knowledge retrieval. VS Code and Docker/runtime setup can be represented by validated request/task workflows and evidence checks; do not claim direct provisioning where the PRD specifies tracking and mock requests. Each adapter returns a normalized request ID, status, safe message, and correlation ID.

An adapter error leaves the task incomplete, records a sanitized failure, creates or updates a blocker, and exposes an owner plus manual fallback. A denied request is distinct from a failed integration. Only add real API writes after explicit stakeholder and security approval and a revised architecture decision.

## 7. Performance & Scalability Specifications

| Measure | MVP target / behavior | Source |
|---|---|---|
| Dashboard load | Under 2 seconds for normal MVP datasets. | PRD, Performance Requirements |
| Plan generation | Under 30 seconds for a standard onboarding case. | PRD, Performance Requirements |
| Support response | Under 10 seconds for knowledge-grounded answers. | PRD, Performance Requirements |
| Status update persistence | Under 1 second after user action. | PRD, Performance Requirements |
| Test deployment concurrency | At least 10 active users and 50 active onboarding cases. | PRD, Performance Requirements |

Keep database queries paginated for case lists, index fields used for status/owner/due-date views, bound retrieved knowledge and prompt context, and avoid loading full audit histories by default. Track actual latency and cost by operation. Introduce queue-backed agent execution only if measured MVP latency or workload requires it; reminders/status checks may use a worker as already scoped. Horizontal scaling, multi-tenant isolation architecture, and multi-region operations are Future Work, not MVP acceptance claims.

## 8. Security & Compliance Architecture

- **Authentication/authorization**: SSO-ready authentication design and role-based authorization on every API operation. Enforce least privilege for employee data, approvals, audit, and client setup requests.
- **Approval controls**: Require human approval for sensitive access and privileged actions. Recheck approval and prerequisites server-side before transitions; never let agent recommendation equal approval.
- **Data minimization**: Pass only necessary employee/project context to agents. Never collect, store, display, log, or send passwords, MFA secrets, recovery codes, private keys, personal access tokens, or client source code.
- **Protection**: TLS in transit; encryption at rest for deployed persistence/storage; managed secret storage or environment injection; no credentials in source control or artifacts.
- **Audit**: Record every access-request state change, approval/denial, evidence check, recommendation, task transition, connector outcome, and escalation with actor, timestamp, action, object, and outcome. Redact sensitive payloads; ordinary users receive read-only access.
- **Input/output safety**: Validate request schemas, tool/agent output, state transitions, knowledge source permissions, and adapter responses. Treat retrieved content as untrusted data; do not allow it to grant tools or permissions.
- **Tenant/client boundaries**: Separate client/project contexts in authorization and query filters. Full multi-tenant SaaS controls are out of scope, but cross-case and cross-client access must not be allowed in the MVP.
- **Compliance**: No specific regulatory certification or retention schedule is committed by the inputs. Confirm data residency, retention/deletion, provider handling, and applicable jurisdiction with stakeholders before production employee data is used. Perform the required security and dependency assessment before Deliver.

## 9. Testing & Quality Assurance Specifications

### MVP Test Expectations

- **Unit**: Required field validation; plan schema/policy validation; task state-transition rules; role authorization; approval gates; evidence requirements; secret/personal-data redaction; adapter result normalization; audit event creation.
- **Integration**: API to database persistence and audit; CrewAI output validation with deterministic/fake model responses; each mock adapter's success/denial/unavailable/invalid response; support retrieval permissions and escalation; idempotent retry behavior.
- **Smoke/acceptance**: Create developer case; review generated plan; submit mock requests for all six named developer tool/access categories; approve/deny sensitive requests; record evidence; surface blockers and manual fallback; verify role-specific views and audit history.
- **Runtime-specific**: Verify CrewAI task ordering/context, bounded iterations/timeouts, structured output parsing, failure behavior, and that no agent has direct database or unrestricted connector access.
- **Security**: Test unauthorized case access, approval forgery, cross-client access, prompt injection in knowledge content, sensitive-data leakage in logs/audits, and secret/source-code collection attempts. Complete dependency audit and security assessment before delivery.
- **Traceability**: Map tests to FR-001 through FR-012 and the PRD's performance/security/reliability requirements. Include metrics for readiness and operational outcomes in the pilot, not only component tests.

### Evaluation Criteria

These are pass/fail criteria for the MVP contract. Golden datasets, judge rubrics, and eval runner implementation remain with `@qa.eng`.

| ID | Dimension | Metric | Threshold | Grading Method | Source |
|---|---|---|---|---|---|
| EC-001 | Accuracy | Agent plan generation success for complete input cases; output is schema-valid and contains required role tasks. | At least 95% successful plans; required developer tool tasks are present for the selected profile. | Code-based schema/coverage checks over acceptance cases. | PRD §7 Technical Metrics; FR-001/002; PRD Developer Setup requirements |
| EC-002 | Latency | Standard onboarding plan generation duration. | Under 30 seconds. | Code-based wall-clock measurement on the defined MVP test deployment. | PRD Performance Requirements |
| EC-003 | Latency | Grounded support response duration. | Under 10 seconds. | Code-based wall-clock measurement for supported knowledge questions. | PRD Performance Requirements |
| EC-004 | Safety | Low-confidence or sensitive support questions escalated instead of answered without authority. | At least 90% escalation accuracy on labeled evaluation cases; no answer may disclose a secret or unauthorized client code. | Labeled human-reviewed cases plus deterministic prohibited-content checks. | PRD §7 Technical Metrics; FR-011; security rules |
| EC-005 | Security | Access-request status changes and approvals have audit events; required approvals/evidence gate sensitive completion. | 100% audit coverage; 100% of tested sensitive completion attempts without required approval/evidence are rejected. | Integration tests and audit-event reconciliation. | PRD §7 Technical Metrics; FR-003/006/008/012; Build-Agent Decision Rules |
| EC-006 | Security | Prohibited secrets and client source code are collected, persisted, sent to agents, or written to logs/audits. | Zero occurrences in tested workflows and stored/logged payloads. | Adversarial input tests and automated data scans. | PRD §5 Security & Compliance; MRD-006 |
| EC-007 | Cost | LLM cost per onboarding case. | Track and report in Build; numeric pass threshold requires operator input after baseline measurement. | Provider usage metadata/cost accounting per case, reviewed against an operator-approved limit. | PRD §7 Technical Metrics states target is to be set during Build. |

EC-007 is intentionally not assigned an invented dollar amount. It is an open decision for the operator before cost can be graded as pass/fail. Business pilot KPIs such as 90% first-day readiness and 85% setup completion by start date are outcome measures; report them during pilot evaluation and do not treat them as architecture-only unit test thresholds.

## 10. MVP Launch & Feedback Strategy

- Pilot with a small simulated developer onboarding cohort using mock integrations; do not use live client or employee data until provider, security, and stakeholder approvals are complete.
- Include representative HR, IT, security, manager, client repository owner, and developer reviewers.
- Capture baseline and pilot values for first-day readiness, setup tasks completed by start date, blocker resolution time, coordinator/manager satisfaction, support usefulness, audit coverage, and per-case LLM cost.
- Confirm the PRD targets during pilot: 90% first-day readiness; 85% required setup completion by start date; P0 blocker resolution under one business day; 25% reduction in manual follow-up; satisfaction 4/5; tool-specific readiness metrics in PRD §7.
- Collect usability feedback on task ownership, next-action clarity, approval transparency, and fallback instructions. Prioritize changes that reduce missed tasks or unsafe ambiguity.
- Review failures, cost, and open questions before approving any real connector or production employee-data use.

## Implementation Guidance for AI Development Agents

1. Foundation: select and record the web/API/database stack; establish environment configuration, auth boundary, schema validation, and health check.
2. Backend: implement deterministic workflow entities/transitions, audit events, CrewAI boundary, and mock adapters.
3. Frontend: implement case list/detail, setup checklist, approvals, blockers, audit, and secondary support view against documented API contracts.
4. Integration: wire UI to API; retain mock external systems and ensure no browser-to-vendor or agent-to-database bypass.
5. QA/security: map tests to PRD acceptance criteria, run evals, test approval/privacy controls, and complete the required security/dependency review.
6. Deliver: document deployment, runbook, user guidance, limitations, and manual fallbacks.

## Architecture Validation Checklist

- [x] PRD and MRD requirements mapped to architecture components and evaluation criteria.
- [x] Four-agent maximum and CrewAI sequential orchestration defined.
- [x] Frontend/backend responsibilities and JSON contracts specified; framework remains an explicit Build choice.
- [x] Secrets are excluded from artifacts; environment/secrets-manager handling is specified without secret values.
- [x] MVP and Future Work boundaries are explicit; real integrations are deferred.
- [x] Resolved `AAMAD_TARGET_RUNTIME` recorded in Audit.

## Sources

- `project-context/1.define/prd.md` (FR-001–FR-012, runtime, integration, data, NFR, KPI, MVP scope, and open questions).
- `project-context/1.define/mrd.md` (technical feasibility, developer setup rules, security risks, architecture choices, and MRD-001–MRD-010 traceability).
- `aamad.config.yml` (`runtime.target: crewai`; security assessment, dependency audit, tests, and type checking requirements).
- `.cursor/templates/sad-template.md` (required SAD structure and selected-runtime expectations).
- `.cursor/agents/system-arch.md` (persona constraints, traceability, runtime audit, and evaluation-criteria rules).
- No separate `srd.md` or user-story files were present at SAD creation; PRD-embedded user stories and the available MRD were used.

## Assumptions

- The request's `srd.md` refers to the available `mrd.md`; no SRD artifact was found.
- The artifact is intentionally saved under `project-context/2.build/sad.md` as explicitly requested, although the persona's default path is `project-context/1.define/sad.md`.
- MVP is a capstone/internal workflow using mock integrations, not a production SaaS deployment.
- Python is the backend language per `aamad.config.yml`; specific frontend framework, API framework, database product, hosting provider, LLM provider/model, and queue technology remain project setup decisions.
- Relational persistence is recommended to implement PRD-required durable records and relationships; the exact database is not yet selected.
- Access to employee/client data and all permission-sensitive operations is mediated by backend authorization and human approval; mock adapters do not grant real access.
- Where the PRD defines no cost threshold, cost is measured and reported pending an operator-approved limit.

## Open Questions

- What is the maximum acceptable LLM cost per onboarding case after a representative Build baseline?
- Which frontend/API frameworks, database, hosting environment, and LLM provider/model are approved?
- What identity provider and exact role-to-permission mapping should the SSO-ready MVP use?
- Which HRIS and ticket/request system should mock adapter contracts model first?
- Which client GitHub org/repositories, permissions, approvers, branch rules, and validation method apply per developer profile?
- Which VS Code extensions and source-control validation are required for each client project?
- Is local Docker permitted, or must container work use Citrix VDI or an approved remote runtime?
- Which Cisco VPN profiles, network groups, Citrix images, mapped resources, and Zoom policies apply?
- What employee-data, audit-event, and support-transcript retention/deletion policy applies, and in which jurisdictions will the MVP be evaluated?
- What exact SLA targets are contractual versus pilot targets, and how should due dates/time zones be calculated?
- Which approved policy/FAQ sources and content owners will supply grounded support answers?

## Audit

- Timestamp: 2026-10-02
- Persona id: `system-arch`
- Action: `create-sad --mvp`
- Artifact: `project-context/2.build/sad.md`
- Source artifacts: `project-context/1.define/mrd.md`, `project-context/1.define/prd.md`, `aamad.config.yml`
- Resolved `AAMAD_TARGET_RUNTIME`: `crewai`