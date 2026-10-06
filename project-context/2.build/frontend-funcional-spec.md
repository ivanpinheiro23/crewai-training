# Frontend Functional Spec — Critical Research Workflow

Stack: React 18 + TypeScript + Vite (`frontend/`). Single route `/`. No backend wiring (services are stubs).

## Inputs
- Fields: `topic` (text, required), `question` (textarea, required).
- Submit disabled while a run is `running` or when any field is blank.
- Component: `frontend/src/components/InputsForm.tsx`.

## Run
- Submit calls `runService.startRun(input)` → `{ runId }`, dispatches `START`.
- While `running`, the app polls `runService.getRunStatus(runId)` every 1s and dispatches `DONE` / `FAIL`.
- State machine (`frontend/src/state/runMachine.ts`):
  - `idle --START--> running --DONE--> done`
  - `running --FAIL--> error`
  - `done | error --RESET--> idle`
  - All other events ignored.

## Results
- `idle`: "No run yet." · `running`: status indicator · `done`: summary + findings list + "New run" · `error`: alert + "Try again".
- Component: `frontend/src/components/Results.tsx`.

## History
- Visible stub only ("coming soon"); non-functional in MVP. Component: `History.tsx`.

## Services (stubs) — `frontend/src/services/runService.ts`
- `startRun(input): Promise<{ runId }>`
- `getRunStatus(runId): Promise<RunRecord>` — returns `running` for 2 polls, then `done` with canned result.
- Integration phase replaces the implementation behind the `RunService` interface.

## Spec Sync Checklist (update after each commit)
- [ ] Inputs fields/validation match `InputsForm.tsx`
- [ ] FSM states/events/transitions match `runMachine.ts` and its tests
- [ ] Service signatures and `types.ts` match this spec
- [ ] Results rendering per state matches `Results.tsx`
- [ ] History still stub-only (or spec updated if implemented)
- [ ] `project-context/2.build/frontend.md` updated with any decisions
- [ ] Open Questions below reviewed

## Sources
- User request; `.cursor/agents/frontend-eng.md`; `project-context/2.build/sad.md` (note: SAD describes an onboarding workflow, not research).

## Assumptions
- "Critical Research Workflow" inputs (topic, question) are placeholders as no PRD section defines them.
- Vite chosen over Next.js/Tailwind for a minimal single-route app.

## Open Questions
- Should the frontend align with the Next.js/Tailwind stack named in the persona definition?
- Real run input/result schema from backend?

## Audit
- persona: frontend-eng · action: develop-fe/document-frontend · timestamp: 2026-10-06 · runtime: crewai (default)
