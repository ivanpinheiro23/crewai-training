import { useState } from "react";
import type { RunInput } from "../types";

export function InputsForm({ disabled, onSubmit }: { disabled: boolean; onSubmit: (i: RunInput) => void }) {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const valid = topic.trim() !== "" && question.trim() !== "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onSubmit({ topic: topic.trim(), question: question.trim() });
      }}
    >
      <label>
        Topic
        <input value={topic} onChange={(e) => setTopic(e.target.value)} disabled={disabled} />
      </label>
      <label>
        Research question
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} disabled={disabled} rows={3} />
      </label>
      <button type="submit" disabled={disabled || !valid}>
        Run research
      </button>
    </form>
  );
}
