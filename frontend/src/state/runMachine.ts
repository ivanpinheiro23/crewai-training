import type { RunRecord, RunResult } from "../types";

export type RunState =
  | { status: "idle" }
  | { status: "running"; runId: string }
  | { status: "done"; runId: string; result: RunResult }
  | { status: "error"; message: string };

export type RunEvent =
  | { type: "START"; runId: string }
  | { type: "DONE"; result: RunResult }
  | { type: "FAIL"; message: string }
  | { type: "RESET" };

export const initialState: RunState = { status: "idle" };

export function runReducer(state: RunState, event: RunEvent): RunState {
  switch (state.status) {
    case "idle":
      return event.type === "START" ? { status: "running", runId: event.runId } : state;
    case "running":
      if (event.type === "DONE") return { status: "done", runId: state.runId, result: event.result };
      if (event.type === "FAIL") return { status: "error", message: event.message };
      return state;
    case "done":
    case "error":
      return event.type === "RESET" ? initialState : state;
  }
}

export function eventFromRecord(rec: RunRecord): RunEvent | null {
  if (rec.status === "done" && rec.result) return { type: "DONE", result: rec.result };
  if (rec.status === "failed") return { type: "FAIL", message: rec.error ?? "Run failed" };
  return null;
}
