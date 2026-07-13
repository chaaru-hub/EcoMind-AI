import "../styles/ai.css";

function AIChat() {
  return (
    <div className="ai-panel">

      <h2>🤖 EcoMind AI</h2>

      <p>
        Ask anything about your electricity usage.
      </p>

      <div className="suggestions">

        <button>Why is my bill high?</button>

        <button>Save Electricity</button>

        <button>Today's Usage</button>

      </div>

      <input
        type="text"
        placeholder="Ask EcoMind AI..."
      />

      <button className="send-btn">
        Send
      </button>

    </div>
  );
}

export default AIChat;