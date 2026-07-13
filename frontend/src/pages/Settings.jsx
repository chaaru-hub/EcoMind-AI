import "../styles/settings.css";

function Settings() {
  return (
    <div className="settings-page">

      <div className="settings-header">

        <h1>⚙️ Settings</h1>

        <p>Manage your EcoMind AI preferences.</p>

      </div>

      <div className="settings-grid">

        {/* Profile */}

        <div className="settings-card">

          <h2>👤 Profile</h2>

          <label>Name</label>
          <input type="text" defaultValue="Chaaru Seelan" />

          <label>Email</label>
          <input type="email" defaultValue="you@example.com" />

        </div>

        {/* Monthly Budget */}

        <div className="settings-card">

          <h2>💰 Monthly Budget</h2>

          <label>Budget (₹)</label>

          <input type="number" defaultValue="5000" />

          <button className="save-btn">
            Save Budget
          </button>

        </div>

        {/* Notifications */}

        <div className="settings-card">

          <h2>🔔 Notifications</h2>

          <div className="toggle">
            <span>Energy Alerts</span>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="toggle">
            <span>Bill Alerts</span>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="toggle">
            <span>AI Suggestions</span>
            <input type="checkbox" defaultChecked />
          </div>

        </div>

        {/* Appearance */}

        <div className="settings-card">

          <h2>🌙 Appearance</h2>

          <div className="toggle">
            <span>Dark Mode</span>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="toggle">
            <span>Animations</span>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="toggle">
            <span>Compact View</span>
            <input type="checkbox" />
          </div>

        </div>

        {/* AI */}

        <div className="settings-card">

          <h2>🤖 AI Assistant</h2>

          <div className="toggle">
            <span>Enable AI</span>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="toggle">
            <span>Smart Recommendations</span>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="toggle">
            <span>Auto Optimization</span>
            <input type="checkbox" />
          </div>

        </div>

        {/* System */}

        <div className="settings-card">

          <h2>ℹ️ System</h2>

          <p>Version</p>
          <h3>EcoMind AI v1.0</h3>

          <p>Backend</p>
          <h3>FastAPI</h3>

          <p>Frontend</p>
          <h3>React + Vite</h3>

        </div>

      </div>

    </div>
  );
}

export default Settings;