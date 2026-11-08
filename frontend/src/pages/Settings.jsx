function Toggle({ id, label, hint, defaultChecked }) {
  return (
    <label className="toggle-row" htmlFor={id}>
      <span>
        {label}
        {hint && <small>{hint}</small>}
      </span>
      <input id={id} type="checkbox" className="switch" defaultChecked={defaultChecked} />
    </label>
  );
}

function Settings() {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p>Your profile, budget and EcoMind preferences.</p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="panel settings-card">
          <h2 className="panel-title">Profile</h2>
          <div className="field">
            <label htmlFor="set-name">Name</label>
            <input id="set-name" className="input" type="text" defaultValue="Chaaru Seelan" />
          </div>
          <div className="field">
            <label htmlFor="set-email">Email</label>
            <input id="set-email" className="input" type="email" defaultValue="you@example.com" />
          </div>
        </section>

        <section className="panel settings-card">
          <h2 className="panel-title">Monthly budget</h2>
          <div className="field">
            <label htmlFor="set-budget">Budget (₹)</label>
            <input id="set-budget" className="input" type="number" defaultValue="5000" />
          </div>
          <button type="button" className="btn primary">Save budget</button>
        </section>

        <section className="panel settings-card">
          <h2 className="panel-title">Notifications</h2>
          <Toggle id="set-energy-alerts" label="Energy alerts" hint="When usage spikes" defaultChecked />
          <Toggle id="set-bill-alerts" label="Bill alerts" hint="When you near your budget" defaultChecked />
          <Toggle id="set-ai-tips" label="AI suggestions" defaultChecked />
        </section>

        <section className="panel settings-card">
          <h2 className="panel-title">Appearance</h2>
          <Toggle id="set-dark" label="Dark mode" defaultChecked />
          <Toggle id="set-anim" label="Animations" defaultChecked />
          <Toggle id="set-compact" label="Compact view" />
        </section>

        <section className="panel settings-card">
          <h2 className="panel-title">AI assistant</h2>
          <Toggle id="set-ai" label="Enable AI" defaultChecked />
          <Toggle id="set-recs" label="Smart recommendations" defaultChecked />
          <Toggle id="set-auto" label="Auto optimization" hint="Switch idle devices off" />
        </section>

        <section className="panel settings-card">
          <h2 className="panel-title">System</h2>
          <dl className="facts">
            <div><dt>Version</dt><dd>EcoMind AI v1.0</dd></div>
            <div><dt>Backend</dt><dd>FastAPI</dd></div>
            <div><dt>Frontend</dt><dd>React + Vite</dd></div>
          </dl>
        </section>
      </div>
    </div>
  );
}

export default Settings;
