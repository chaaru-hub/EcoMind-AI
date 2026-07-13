import { useState } from "react";
import { askAI } from "../services/api";
import "../styles/ai.css";

function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello! I'm EcoMind AI. Ask me anything about energy usage, electricity bills, or smart home devices.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!question.trim()) return;

    const userMessage = {
      sender: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await askAI(question);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: response.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ Unable to connect to EcoMind AI.",
        },
      ]);
    }

    setQuestion("");
    setLoading(false);
  }

  return (
    <div className="ai-page">

      <h1>🤖 EcoMind AI Assistant</h1>

      <div className="chat-box">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === "user"
                ? "message user"
                : "message ai"
            }
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="message ai">
            🤖 EcoMind AI is thinking...
          </div>
        )}

      </div>

      <div className="chat-input">

        <input
          type="text"
          placeholder="Ask EcoMind AI..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}

export default AIAssistant;