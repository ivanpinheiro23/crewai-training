import type { RunState } from "../state/runMachine";

export function Results({ state, onReset }: { state: RunState; onReset: () => void }) {
  if (state.status === "idle") return <p className="muted">No run yet.</p>;
  if (state.status === "running") return <p role="status">Running… (run {state.runId})</p>;
  if (state.status === "error") {
    return (
      <div role="alert">
        <p>Error: {state.message}</p>
        <button onClick={onReset}>Try again</button>
      </div>
    );
  }
  return (
    <div>
      <p>{state.result.summary}</p>
      <ul>
        {state.result.findings.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <button onClick={onReset}>New run</button>
    </div>
  );
}
