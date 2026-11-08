import { useEffect, useRef, useState } from "react";
import { LuSendHorizontal, LuSparkles } from "react-icons/lu";

import { askAI } from "../services/api";

const QUICK_QUESTIONS = [
  "How can I reduce my electricity bill?",
  "Which appliance uses the most power?",
  "Give me energy saving tips",
  "How can I cut my carbon emissions?",
];

function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "Hi! I'm EcoMind AI. Ask me how to lower your bill, which devices use the most power, or how to cut your carbon footprint.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages, loading]);

  async function sendMessage(custom) {
    const text = (custom ?? question).trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await askAI(text);
      setMessages((prev) => [...prev, { sender: "ai", text: response.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "I couldn't reach the AI service. Try again in a moment.", error: true },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="page ai-page">
      <div className="page-head">
        <div>
          <h1>AI Assistant</h1>
          <p>Ask about your energy use, bills and devices.</p>
        </div>
      </div>

      <div className="chips">
        {QUICK_QUESTIONS.map((q) => (
          <button key={q} type="button" className="chip" onClick={() => sendMessage(q)} disabled={loading}>
            {q}
          </button>
        ))}
      </div>

      <section className="panel chat">
        <div className="chat-log" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.sender} ${m.error ? "error" : ""}`}>
              {m.sender === "ai" && (
                <span className="msg-avatar" aria-hidden="true">
                  <LuSparkles />
                </span>
              )}
              <div className="msg-bubble">{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="msg ai">
              <span className="msg-avatar" aria-hidden="true">
                <LuSparkles />
              </span>
              <div className="msg-bubble typing">Thinking…</div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          className="chat-input"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            id="ai-question"
            className="input"
            type="text"
            placeholder="Ask EcoMind AI…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button type="submit" className="btn primary" disabled={loading || !question.trim()}>
            <LuSendHorizontal aria-hidden="true" /> Send
          </button>
        </form>
      </section>
    </div>
  );
}

export default AIAssistant;
