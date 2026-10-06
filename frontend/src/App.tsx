import { useEffect, useReducer } from "react";
import { History } from "./components/History";
import { InputsForm } from "./components/InputsForm";
import { Results } from "./components/Results";
import { runService } from "./services/runService";
import { eventFromRecord, initialState, runReducer } from "./state/runMachine";

const POLL_MS = 1000;

export function App() {
  const [state, dispatch] = useReducer(runReducer, initialState);

  useEffect(() => {
    if (state.status !== "running") return;
    let cancelled = false;
    const timer = setInterval(async () => {
      try {
        const evt = eventFromRecord(await runService.getRunStatus(state.runId));
        if (!cancelled && evt) dispatch(evt);
      } catch (e) {
        if (!cancelled) dispatch({ type: "FAIL", message: (e as Error).message });
      }
    }, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [state]);

  return (
    <main>
      <h1>Critical Research Workflow</h1>
      <section aria-labelledby="inputs">
        <h2 id="inputs">Inputs</h2>
        <InputsForm
          disabled={state.status === "running"}
          onSubmit={async (input) => {
            try {
              const { runId } = await runService.startRun(input);
              dispatch({ type: "START", runId });
            } catch (e) {
              dispatch({ type: "START", runId: "" });
              dispatch({ type: "FAIL", message: (e as Error).message });
            }
          }}
        />
      </section>
      <section aria-labelledby="results">
        <h2 id="results">Run &amp; Results</h2>
        <Results state={state} onReset={() => dispatch({ type: "RESET" })} />
      </section>
      <section aria-labelledby="history">
        <h2 id="history">History</h2>
        <History />
      </section>
    </main>
  );
}
