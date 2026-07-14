import { useState } from "react";
import { askAI } from "../services/api";
import "../styles/ai.css";

function AIAssistant() {
  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "👋 Hello! I'm EcoMind AI. I can help you reduce electricity usage, estimate bills, explain your energy data and suggest smart energy-saving tips.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "How can I reduce my electricity bill?",
    "Which appliance consumes the most power?",
    "Give me energy saving tips",
    "How can I reduce carbon emissions?",
  ];

  async function sendMessage(customQuestion) {
    const text = customQuestion || question;

    if (!text.trim()) return;

    const userMessage = {
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setQuestion("");

    setLoading(true);

    try {
      const response = await askAI(text);

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

    setLoading(false);
  }

  return (
    <div className="ai-page">

      <div className="ai-header">

        <h1>🤖 EcoMind AI Assistant</h1>

        <p>
          Ask anything about your energy usage, electricity bills and smart
          devices.
        </p>

      </div>

      <div className="quick-prompts">

        {quickQuestions.map((item, index) => (
          <button
            key={index}
            onClick={() => sendMessage(item)}
          >
            {item}
          </button>
        ))}

      </div>

      <div className="chat-container">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={
              msg.sender === "user"
                ? "message user-message"
                : "message ai-message"
            }
          >
            {msg.text}
          </div>

        ))}

        {loading && (

          <div className="message ai-message">
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
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button onClick={() => sendMessage()}>
          Send
        </button>

      </div>

    </div>
  );
}

export default AIAssistant;