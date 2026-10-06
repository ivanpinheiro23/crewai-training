# Market Research Document: Automated Employee Onboarding Workflow

## Executive Summary

Employee onboarding remains a high-friction operational workflow for HR, IT, hiring managers, security, facilities, payroll, and new hires. The market opportunity is strongest as an internal enterprise productivity and compliance solution rather than a standalone consumer product: organizations already spend heavily on HR information systems, identity tooling, collaboration suites, ticketing platforms, and workflow automation, yet onboarding still often depends on fragmented handoffs, manual checklist tracking, duplicate data entry, and inconsistent policy communication. A multi-agent onboarding workflow can reduce cycle time, improve day-one readiness, and create a more auditable experience across HR and IT operations.

Technical feasibility is high for an MVP if scope is constrained to orchestration, task generation, status tracking, knowledge retrieval, and human approvals. Full autonomous execution across HRIS, payroll, identity, procurement, compliance, and learning systems is feasible only with strong integration boundaries, role-based access control, audit logging, and staged rollout. The configured AAMAD runtime target is `crewai`, which is a reasonable fit for task-oriented agent collaboration in a capstone MVP, especially where distinct agents can represent HR coordination, IT provisioning, compliance review, and employee support.

Recommended strategy: build an internal workflow assistant that coordinates onboarding across systems and stakeholders, starting with a small set of integrations or mocked connectors. For developer onboarding, the workflow should explicitly include setup requests for VS Code, Docker, Cisco VPN, Zoom, and Citrix VDI so new technical employees can install approved tools, join meetings, connect to private networks, and access virtual desktops before their first assigned development task. Position the MVP around measurable operational outcomes: faster time-to-productivity, fewer missed onboarding tasks, lower HR/IT coordination load, improved compliance evidence, and improved new-hire experience. Treat market sizing as adjacent-market evidence, not as proof of standalone demand, until stakeholder discovery confirms the target buyer and deployment model.

## Detailed Findings by Dimension

### 1. Market Analysis & Opportunity Assessment

#### Key Insights

- Onboarding is a durable enterprise problem because hiring events trigger repeated cross-functional workflows: employee records, identity access, equipment, workspace, benefits, payroll, compliance acknowledgements, training, team introductions, and manager follow-ups.
- The strongest buying centers are People Operations, HR Shared Services, IT Service Management, Security/IAM, and Operations Excellence. For small organizations, the buyer is often HR leadership; for mid-market and enterprise, purchasing is usually tied to HRIS, ITSM, or workflow automation budgets.
- The solution competes less with one feature and more with a stack of substitutes: HRIS onboarding modules, ITSM workflows, spreadsheet/checklist processes, email templates, robotic process automation, and general workflow automation platforms.
- A capstone MVP can differentiate by using multi-agent coordination and knowledge-aware assistance rather than only static checklist automation.
- Demand is tied to broader trends: hybrid work, distributed hiring, employee experience investment, compliance pressure, and the normalization of AI copilots in business workflows.

#### Data Points

- Gallup has reported that only a small minority of employees strongly agree their organization does a great job onboarding new employees, indicating a persistent experience gap.
- Microsoft Work Trend Index 2024 reported continued employee and business adoption of generative AI at work, supporting acceptance of AI-assisted operational workflows.
- Gartner and other analyst firms have identified HR technology, employee experience platforms, and workflow automation as active enterprise software categories, but exact market-size figures should be refreshed with licensed or current sources before investment decisions.
- BLS labor data can be used to estimate onboarding volume by combining hiring rates, separations, and target industry headcount.
- SHRM and HCI research consistently identify onboarding quality, manager involvement, and early employee engagement as major factors in retention and productivity.

#### Source Citations

- Gallup, employee engagement and onboarding research, https://www.gallup.com/workplace/
- Microsoft, Work Trend Index 2024, https://www.microsoft.com/en-us/worklab/work-trend-index
- U.S. Bureau of Labor Statistics, Job Openings and Labor Turnover Survey, https://www.bls.gov/jlt/
- SHRM, onboarding and employee experience resources, https://www.shrm.org/topics-tools/tools/toolkits/understanding-employee-onboarding
- Human Capital Institute, onboarding research and resources, https://www.hci.org/

#### Implications

- The MVP should not try to replace a full HRIS. It should orchestrate work around existing systems and make task ownership visible.
- Positioning should emphasize operational reliability and employee readiness rather than vague AI productivity.
- Buyer validation should focus on organizations with enough onboarding volume or compliance complexity to feel the coordination pain.

### 2. Technical Feasibility & Requirements Analysis

#### Key Insights

- The use case maps well to a multi-agent pattern: intake agent, HR coordinator agent, IT provisioning agent, compliance agent, manager enablement agent, and employee support agent.
- The core workflow can be built with deterministic state transitions plus AI-assisted interpretation, generation, routing, and summarization. Deterministic workflow state should remain authoritative.
- Integration complexity is the primary technical constraint. Production systems may need HRIS, identity, ticketing, messaging, calendar, document storage, e-signature, learning management, and asset management integrations.
- Human-in-the-loop approvals are required for sensitive actions such as payroll, benefits, background-check status, privileged access, and policy exceptions.
- The configured `crewai` runtime is suitable for a capstone agent orchestration layer, but production reliability should include structured workflow execution, idempotent tasks, retries, audit events, and clear failure states.

#### Data Points

- Common enterprise integration targets include Workday, SAP SuccessFactors, BambooHR, Greenhouse, Lever, Okta, Microsoft Entra ID, ServiceNow, Jira Service Management, Slack, Microsoft Teams, Google Workspace, Microsoft 365, DocuSign, and learning platforms.
- Typical onboarding task categories include identity provisioning, device shipping, account setup, mandatory policy acknowledgements, tax/payroll setup, benefits enrollment, role-specific training, and manager check-ins.
- Developer onboarding setup should include request workflows and verification checks for VS Code, Docker, Cisco VPN, Zoom, and Citrix VDI.
- Security and privacy obligations may involve SOC 2 controls, GDPR, CCPA/CPRA, HIPAA for covered employers, regional labor laws, and internal access governance.
- MVP infrastructure can remain modest: web app, API service, database, queue or scheduler, object storage for generated artifacts, and LLM provider integration.

#### Source Citations

- Workday API documentation, https://community.workday.com/api
- SAP SuccessFactors documentation, https://help.sap.com/docs/SAP_SUCCESSFACTORS_PLATFORM
- Okta Lifecycle Management, https://www.okta.com/products/lifecycle-management/
- Microsoft Entra identity governance, https://learn.microsoft.com/en-us/entra/id-governance/
- ServiceNow HR Service Delivery, https://www.servicenow.com/products/hr-service-delivery.html
- NIST Cybersecurity Framework 2.0, https://www.nist.gov/cyberframework
- Visual Studio Code documentation, https://code.visualstudio.com/docs
- Docker documentation, https://docs.docker.com/
- Cisco Secure Client documentation, https://www.cisco.com/c/en/us/support/security/anyconnect-secure-mobility-client/series.html
- Zoom support documentation, https://support.zoom.com/
- Citrix Workspace documentation, https://docs.citrix.com/en-us/citrix-workspace-app.html

#### Implications

- Build connectors behind interfaces so the capstone can use mock connectors first and replace them with real APIs later.
- Require audit logs for every automated recommendation, task state change, and approval decision.
- Separate AI reasoning from permissioned actions: agents may recommend or prepare actions, while trusted services execute only after validation.
- Model developer tool setup as a checklist with request status, owner, prerequisite, evidence, and validation fields instead of a freeform note.

#### Developer Setup Rules

- Create one IT service ticket per onboarding case with the fixed identifier pattern `IT0001` (for example, `IT0001-<onboarding_case_id>`), used as the master developer setup request.
- The master `IT0001` ticket must contain five detailed software access items: VS Code, Docker, Cisco VPN, Zoom, and Citrix VDI.
- For each software item in `IT0001`, the workflow must follow this sequence: request details captured -> approver assigned -> approver decision recorded -> item sent to IT execution queue -> completion evidence validated.
- VS Code item in `IT0001`: capture approved IDE access, required extensions, and settings sync policy. Completion evidence must include successful VS Code launch and required extension installation status.
- Docker item in `IT0001`: capture Docker Desktop or approved runtime access, license eligibility, local virtualization permissions, registry access, and security policy agreement. Completion evidence must include successful `docker version` or approved equivalent runtime check.
- Cisco VPN item in `IT0001`: capture Cisco Secure Client access, VPN profile assignment, MFA enrollment, and network group membership. Completion evidence must include successful connection to the approved developer network without storing credentials in the onboarding system.
- Zoom item in `IT0001`: capture corporate Zoom account activation, account sign-in readiness without SSO, approved calendar integration, and required meeting settings. Completion evidence must include ability to join a test meeting and access onboarding sessions.
- Citrix VDI item in `IT0001`: capture Citrix Workspace or VDI entitlement, desktop image assignment, MFA, and required development resources inside the virtual desktop. Completion evidence must include successful VDI launch and validation of mapped applications or network paths.
- Every `IT0001` software item must capture request ID, requester, approver, system owner, queue-entry timestamp, due date, completion status, validation result, and escalation path.
- Access requests must apply least privilege and be tied to role, project, location, employment type, and start date.
- Any approved access to client source code must follow the client's access policies and confirm that secrets, private keys, and client code are not copied outside approved environments.

### 3. User Experience & Workflow Analysis

#### Key Insights

- The primary UX should serve repeated operational work: dashboard, task timeline, ownership, blockers, approvals, and searchable new-hire context.
- New hires need a simple, guided view with upcoming tasks, status, reminders, documents, and a support assistant that can answer policy and role-specific questions from approved knowledge sources.
- Hiring managers need visibility into readiness milestones and nudges for human tasks such as welcome messages, team introductions, goals, buddy assignment, and first-week plan.
- HR and IT teams need exception handling, escalations, audit trails, and bulk progress visibility across cohorts.
- Automation should reduce coordination overhead while preserving sensitive decisions for accountable humans.

#### Data Points

- New-hire onboarding spans multiple time windows: preboarding, day one, week one, first 30 days, first 60 days, and first 90 days.
- Common failure points include late equipment shipment, missing access, unclear first-day schedule, incomplete paperwork, policy confusion, manager inaction, and fragmented communication channels.
- Developer-specific failure points include unapproved container runtime access, VPN profile delays, Zoom account sign-in issues, and Citrix VDI entitlement gaps.
- Workflow usability should be measured by task completion rate, mean time to resolve blockers, support-ticket deflection, first-day readiness rate, and stakeholder satisfaction.

#### Source Citations

- SHRM onboarding toolkit, https://www.shrm.org/topics-tools/tools/toolkits/understanding-employee-onboarding
- Gallup workplace research, https://www.gallup.com/workplace/
- Microsoft Viva employee experience resources, https://www.microsoft.com/en-us/microsoft-viva
- Atlassian onboarding and service management resources, https://www.atlassian.com/software/jira/service-management

#### Implications

- The interface should prioritize status clarity over conversational novelty.
- Chat should be a support surface, not the only control surface.
- The MVP should include role-specific checklists and a blocker/escalation path.
- The developer onboarding view should expose each required setup request with status, approver, blocker reason, validation evidence, and next action.

### 4. Production & Operations Requirements

#### Key Insights

- Production deployment requires strong identity controls because onboarding workflows handle employment records, personal data, access requests, and compliance artifacts.
- Auditability is a core product requirement. Every user-visible recommendation, automated task creation, approval, connector call, and escalation should be traceable.
- Observability should include workflow metrics, LLM usage metrics, integration failures, queue latency, user activity, and security events.
- Data retention policies must account for employee records, rejected candidates if included, generated documents, and chat transcripts.
- Business continuity matters because onboarding is time-sensitive; fallback manual workflows should be documented.

#### Data Points

- Security controls should include a supported sign-in flow that does not depend on SSO, RBAC, least privilege, encryption in transit and at rest, secrets management, audit logging, rate limiting, data minimization, and tenant isolation if multi-tenant.
- Operational metrics should include onboarding cycle time, task SLA breach count, failed integration calls, approval latency, unresolved blockers, LLM cost per onboarded employee, and knowledge-answer quality.
- Developer setup operations should track SLA and exception metrics for IDE access, Docker/runtime approval, VPN profile assignment, Zoom activation, and Citrix VDI entitlement.
- A reasonable MVP can use local development plus a deployable cloud path; production should use managed database, queue, logs, and secrets manager.

#### Source Citations

- NIST Cybersecurity Framework 2.0, https://www.nist.gov/cyberframework
- OWASP Top 10 for Large Language Model Applications, https://owasp.org/www-project-top-10-for-large-language-model-applications/
- SOC 2 trust services criteria overview, https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services
- GDPR official text, https://gdpr.eu/
- IBM Cost of a Data Breach Report 2024, https://www.ibm.com/reports/data-breach

#### Implications

- The MVP should include auth boundaries even if connectors are mocked.
- The architecture should avoid placing secrets, raw employee documents, or unnecessary personal data in LLM prompts.
- Security assessment is required by `aamad.config.yml` and should occur before delivery.
- VPN, VDI, and container registry requests should never expose passwords, MFA secrets, private keys, personal access tokens, recovery codes, or client source code to the workflow assistant.

### 5. Innovation & Differentiation Analysis

#### Key Insights

- Differentiation can come from cross-functional orchestration: HRIS modules often support HR workflows, while ITSM tools support service tickets; an agentic layer can coordinate across both with context-aware prioritization.
- A knowledge-grounded assistant can reduce repetitive HR and IT questions while directing users to authoritative policies.
- Multi-agent specialization can make the system more explainable than a single general chatbot by separating responsibilities and approvals.
- The product can evolve into lifecycle automation beyond onboarding: internal transfers, role changes, leave transitions, offboarding, contractor onboarding, and compliance recertification.
- Partnership opportunities exist with HRIS, IAM, ITSM, collaboration, and learning-management ecosystems.

#### Data Points

- Adjacent categories include HR technology, employee experience platforms, identity governance, IT service management, low-code workflow automation, RPA, and enterprise AI assistants.
- Monetization options for a market-facing product include per-employee pricing, per-onboarded-worker pricing, workflow-volume tiers, enterprise seat bundles, or HRIS/ITSM marketplace distribution.
- For an internal enterprise implementation, value capture is measured through reduced manual coordination, fewer escalations, better compliance evidence, and faster employee readiness.

#### Source Citations

- Gartner HR technology market research, https://www.gartner.com/en/human-resources
- Forrester employee experience and automation research, https://www.forrester.com/
- Microsoft Copilot and Viva ecosystem, https://www.microsoft.com/en-us/microsoft-365/copilot
- ServiceNow platform ecosystem, https://www.servicenow.com/
- Zapier automation reports/resources, https://zapier.com/blog/
- UiPath automation resources, https://www.uipath.com/resources/automation

#### Implications

- The capstone should demonstrate agent coordination, not merely a CRUD checklist application.
- The roadmap should include extensible connector interfaces and a policy-aware knowledge base.
- Commercial positioning should be validated after the MVP demonstrates operational value in an internal pilot scenario.

## Critical Decision Points

### Go/No-Go Factors

- Go if stakeholders confirm onboarding tasks are fragmented across at least three systems or teams.
- Go if there is clear pain around late access, missing equipment, repeated questions, compliance evidence, or manager follow-through.
- Go if HR/IT stakeholders accept human approval checkpoints for sensitive actions.
- No-go or defer if target users require unrestricted autonomous changes to payroll, legal, identity, or benefits systems without approval controls.
- No-go for production if audit logging, RBAC, and data minimization cannot be implemented.

### Technical Architecture Choices

- Use `crewai` for the capstone MVP agent orchestration layer.
- Keep workflow state deterministic in an application database; do not make agent memory the system of record.
- Use mocked connector adapters for initial HRIS, IAM, ITSM, calendar, and messaging flows.
- Include mocked service-request adapters for VS Code setup, Docker/container runtime approval, Cisco VPN enrollment, Zoom account activation, and Citrix VDI entitlement.
- Add real integrations only behind permissioned service interfaces with validation and audit logging.
- Use retrieval over approved internal policy documents for new-hire Q&A.

### Market Positioning

- Primary target: mid-market or enterprise People Operations and IT teams with recurring hiring volume and cross-functional onboarding complexity.
- Initial value proposition: "coordinate every onboarding task from offer acceptance to first productive week, with AI-assisted routing, reminders, answers, and audit trails."
- Avoid positioning as a payroll, benefits, or HRIS replacement.

### Resource Requirements

- Capstone MVP team: product/requirements owner, system architect, backend engineer, frontend engineer, integration engineer, QA engineer, security reviewer, and DevOps support as represented by AAMAD personas.
- MVP timeline assumption: 2-4 weeks for a constrained prototype with mock connectors; 6-12+ weeks for production-grade integrations depending on APIs and security review.
- Cost drivers: LLM usage, integration development, identity/security setup, data storage, monitoring, and ongoing policy/document maintenance.

## Risk Assessment Matrix

| Risk Level | Risk | Impact | Mitigation |
| :-- | :-- | :-- | :-- |
| High | Sensitive employee data exposed to unauthorized users or LLM prompts | Legal, privacy, and trust harm | RBAC, least privilege, prompt data minimization, encryption, audit logs, security review |
| High | Incorrect automated provisioning or missed access steps | Productivity loss and security exposure | Human approvals for privileged access, idempotent connector calls, deterministic workflow state |
| High | Integration failures with HRIS/IAM/ITSM systems | Broken onboarding workflows | Adapter pattern, retries, clear failure states, manual fallback process |
| Medium | AI responses give outdated or noncompliant HR guidance | Employee confusion and compliance risk | Retrieval from approved policies, citations, escalation to HR, response disclaimers in UI policy |
| Medium | Low adoption by HR, IT, or managers | Limited ROI | Build dashboard-first workflows, show role-specific value, measure cycle-time reduction |
| Medium | Scope creep into full HR suite | Delayed capstone delivery | MVP boundaries: onboarding orchestration, mocked connectors, limited roles |
| Low | Market crowded by HRIS and workflow tools | Harder commercialization | Position as orchestration layer and integration accelerator |
| Low | LLM cost unpredictability | Budget variance | Track cost per workflow, cache policy retrieval, constrain model usage by task |

## Actionable Recommendations

### Immediate Next Steps Within 48 Hours

- Confirm whether this capstone is an internal enterprise workflow, a market-facing SaaS concept, or both.
- Interview at least one HR stakeholder, one IT/service desk stakeholder, one hiring manager, and one recent new hire if available.
- Define the first MVP onboarding journey: preboarding through first week is recommended.
- Identify which integrations will be real, mocked, or out of scope for the capstone.
- Draft the PRD using this MRD as context and record unresolved market/source gaps as assumptions.

### Short-Term Priorities For 30 Days

- Build a role-based onboarding workflow dashboard.
- Implement task orchestration with agent-generated task plans and deterministic status tracking.
- Add mock adapters for HRIS, IAM, ITSM, calendar, messaging, and document acknowledgment.
- Add developer setup request flows for VS Code, Docker, Cisco VPN, Zoom, and Citrix VDI with evidence-based completion checks.
- Add a knowledge-grounded employee support assistant for onboarding policies and FAQs.
- Define acceptance criteria for readiness, task completion, escalation, audit logs, and access controls.

### Long-Term Strategy For 6-12 Months

- Add production connectors for the highest-value systems first: HRIS, ITSM, and collaboration platforms. Authentication must continue to work without SSO.
- Expand workflows to transfers, offboarding, contractor onboarding, and access recertification.
- Add analytics for cycle time, bottlenecks, SLA breaches, sentiment, and ticket deflection.
- Establish governance: policy document ownership, LLM evaluation suite, connector permissions, and quarterly security review.
- Validate commercial demand through pilots, pricing discovery, and partner marketplace feasibility.

## Traceability Anchors For PRD

| MRD ID | Insight / Finding | Product Requirement Implication |
| :-- | :-- | :-- |
| MRD-001 | Onboarding is fragmented across HR, IT, security, managers, facilities, payroll, and new hires. | PRD must define a central onboarding case, role-based task dashboard, owner assignment, blockers, and escalation workflow. |
| MRD-002 | Developer onboarding requires VS Code, Docker, Cisco VPN, Zoom, and Citrix VDI setup. | PRD must include explicit P0 setup/access requirements and acceptance criteria for each developer tool/service. |
| MRD-003 | Sensitive actions require human-in-the-loop approvals. | PRD must require approval workflows for VPN, VDI, identity, container registry, and privileged setup tasks. |
| MRD-004 | Deterministic workflow state should remain authoritative; agent reasoning should not be the system of record. | PRD must require persisted onboarding cases, tasks, access requests, approvals, evidence checks, blockers, and audit events. |
| MRD-005 | Completion should be evidence-based rather than informal status tracking. | PRD must require validation evidence for VS Code, Docker/runtime, Cisco VPN, Zoom, and Citrix VDI setup completion. |
| MRD-006 | The system must avoid exposing credentials, MFA secrets, private keys, personal access tokens, recovery codes, or client source code. | PRD must include security NFRs and acceptance criteria forbidding secret/source-code collection, storage, prompt inclusion, and audit leakage. |
| MRD-007 | The interface should prioritize status clarity over conversational novelty. | PRD must specify dashboard-first UX, checklist views, approval queues, blocker views, and support chat as a secondary support surface. |
| MRD-008 | Mock adapters are appropriate for capstone delivery while preserving future integration boundaries. | PRD must scope MVP integrations as mocked adapters and defer real external writes until stakeholder/security approval. |
| MRD-009 | Success should be measured by readiness, cycle time, blocker resolution, support-ticket deflection, satisfaction, and setup SLA metrics. | PRD must define measurable KPIs for first-day readiness, setup completion, blocker resolution, support usefulness, audit coverage, and agent performance. |
| MRD-010 | Security assessment is required before delivery. | PRD must include security assessment, dependency audit, RBAC, audit logging, and least-privilege requirements. |

## Sources

1. Gallup workplace research and onboarding resources, https://www.gallup.com/workplace/
2. Microsoft Work Trend Index 2024, https://www.microsoft.com/en-us/worklab/work-trend-index
3. U.S. Bureau of Labor Statistics, Job Openings and Labor Turnover Survey, https://www.bls.gov/jlt/
4. SHRM onboarding toolkit, https://www.shrm.org/topics-tools/tools/toolkits/understanding-employee-onboarding
5. Human Capital Institute onboarding research, https://www.hci.org/
6. Workday API and platform resources, https://community.workday.com/api
7. SAP SuccessFactors documentation, https://help.sap.com/docs/SAP_SUCCESSFACTORS_PLATFORM
8. BambooHR API documentation, https://documentation.bamboohr.com/
9. Greenhouse API documentation, https://developers.greenhouse.io/
10. Lever API documentation, https://hire.lever.co/developer/documentation
11. Okta Lifecycle Management, https://www.okta.com/products/lifecycle-management/
12. Microsoft Entra identity governance, https://learn.microsoft.com/en-us/entra/id-governance/
13. ServiceNow HR Service Delivery, https://www.servicenow.com/products/hr-service-delivery.html
14. Jira Service Management, https://www.atlassian.com/software/jira/service-management
15. NIST Cybersecurity Framework 2.0, https://www.nist.gov/cyberframework
16. OWASP Top 10 for Large Language Model Applications, https://owasp.org/www-project-top-10-for-large-language-model-applications/
17. AICPA SOC suite of services overview, https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services
18. GDPR information portal, https://gdpr.eu/
19. IBM Cost of a Data Breach Report 2024, https://www.ibm.com/reports/data-breach
20. UiPath automation resources, https://www.uipath.com/resources/automation
21. Visual Studio Code documentation, https://code.visualstudio.com/docs
22. Docker documentation, https://docs.docker.com/
23. Cisco Secure Client documentation, https://www.cisco.com/c/en/us/support/security/anyconnect-secure-mobility-client/series.html
24. Zoom support documentation, https://support.zoom.com/
25. Citrix Workspace app documentation, https://docs.citrix.com/en-us/citrix-workspace-app.html

## Assumptions

- The project is a capstone MVP for an automated employee onboarding workflow, not yet a fully funded commercial SaaS product.
- The target environment is a mid-market or enterprise organization with separate HR, IT, and manager responsibilities.
- Market-size figures are intentionally described through adjacent categories because no live paid analyst dataset was accessed during this draft.
- The configured AAMAD runtime target is `crewai` based on `aamad.config.yml`.
- Initial integrations may be mocked for capstone delivery while preserving realistic connector boundaries.
- Developer onboarding requires setup workflows for VS Code, Docker, Cisco VPN, Zoom, and Citrix VDI.
- The system will process employee-related personal data, so privacy, security, and audit controls are required even for MVP design.
- The application must provide a supported sign-in flow without SSO; the exact mechanism remains a Build/security decision.

## Open Questions

- Is the intended buyer an internal HR/IT operations sponsor, a SaaS customer, or a training evaluator for the capstone?
- Which HRIS, ticketing, messaging, calendar, and document systems should the MVP model?
- Which non-SSO user sign-in mechanism is approved for the MVP?
- What onboarding scope is required: preboarding only, first day, first week, first 30/60/90 days, or the full lifecycle?
- Which jurisdictions and compliance regimes matter for the target organization?
- What quantitative success target should define MVP success: readiness rate, cycle-time reduction, fewer tickets, satisfaction, cost reduction, or all of these?
- Should the product support employees, contractors, interns, and international hires in the first version?
- Which developer roles are allowed to use local Docker versus Citrix VDI-only development environments?

## Audit

- Timestamp: 2026-09-22
- Persona id: `product-mgr`
- Action: `create-mrd`
- Artifact: `project-context/1.define/mrd.md`
- Resolved `AAMAD_TARGET_RUNTIME`: `crewai`
- Timestamp: 2026-09-23
- Persona id: `product-mgr`
- Action: `update-mrd-developer-access-rules`
- Artifact: `project-context/1.define/mrd.md`
- Resolved `AAMAD_TARGET_RUNTIME`: `crewai`
- Timestamp: 2026-09-23
- Persona id: `product-mgr`
- Action: `quality-pass-add-traceability-anchors`
- Artifact: `project-context/1.define/mrd.md`
- Resolved `AAMAD_TARGET_RUNTIME`: `crewai`
- Timestamp: 2026-10-05
- Persona id: `product-mgr`
- Action: `remove-unwanted-platform-integration-references`
- Artifact: `project-context/1.define/mrd.md`
- Resolved `AAMAD_TARGET_RUNTIME`: `crewai`
- Timestamp: 2026-10-05
- Persona id: `product-mgr`
- Action: `detail-it0001-developer-setup-flow`
- Artifact: `project-context/1.define/mrd.md`
- Resolved `AAMAD_TARGET_RUNTIME`: `crewai`
- Timestamp: 2026-10-06
- Persona id: `product-mgr`
- Action: `remove-sso-requirement`
- Artifact: `project-context/1.define/mrd.md`
- Resolved `AAMAD_TARGET_RUNTIME`: `crewai`
