import { describe, expect, it } from "vitest";
import { initialState, runReducer } from "./runMachine";

describe("runReducer", () => {
  it("goes idle -> running -> done", () => {
    const running = runReducer(initialState, { type: "START", runId: "r1" });
    expect(running).toEqual({ status: "running", runId: "r1" });
    const done = runReducer(running, { type: "DONE", result: { summary: "s", findings: [] } });
    expect(done.status).toBe("done");
    expect(runReducer(done, { type: "RESET" })).toEqual(initialState);
  });

  it("ignores invalid transitions", () => {
    expect(runReducer(initialState, { type: "DONE", result: { summary: "", findings: [] } })).toBe(initialState);
  });
});
