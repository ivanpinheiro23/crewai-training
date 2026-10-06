export type RunStatus = "running" | "done" | "failed";

export interface RunInput {
  topic: string;
  question: string;
}

export interface RunResult {
  summary: string;
  findings: string[];
}

export interface RunRecord {
  runId: string;
  input: RunInput;
  status: RunStatus;
  result?: RunResult;
  error?: string;
  startedAt: string;
}
