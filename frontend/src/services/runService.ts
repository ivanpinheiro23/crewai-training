import type { RunInput, RunRecord } from "../types";

// Stubs only: no backend wiring (integration phase). Replace behind this interface.
export interface RunService {
  startRun(input: RunInput): Promise<{ runId: string }>;
  getRunStatus(runId: string): Promise<RunRecord>;
}

const POLLS_UNTIL_DONE = 3;
const runs = new Map<string, { input: RunInput; startedAt: string; polls: number }>();

export const runService: RunService = {
  async startRun(input) {
    const runId = `stub-${Date.now()}`;
    runs.set(runId, { input, startedAt: new Date().toISOString(), polls: 0 });
    return { runId };
  },

  async getRunStatus(runId) {
    const run = runs.get(runId);
    if (!run) throw new Error(`Unknown run: ${runId}`);
    run.polls += 1;
    const base = { runId, input: run.input, startedAt: run.startedAt };
    if (run.polls < POLLS_UNTIL_DONE) return { ...base, status: "running" };
    return {
      ...base,
      status: "done",
      result: {
        summary: `[stub] Research summary for "${run.input.topic}".`,
        findings: [`[stub] Finding about: ${run.input.question}`],
      },
    };
  },
};
