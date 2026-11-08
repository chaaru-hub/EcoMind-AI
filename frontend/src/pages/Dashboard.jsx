import { Link } from "react-router-dom";
import { LuArrowUpRight, LuCalendar } from "react-icons/lu";

import EnergyChart from "../components/EnergyChart";
import { useEnergy } from "../hooks/useEnergy";
import CategoryDonut from "../components/CategoryDonut";
import { useDevices } from "../hooks/useDevices";
import { loadByCategory } from "../lib/devices";

const TODAY_BILL = 124;

function Stat({ title, value, unit, delta, note, to, highlight }) {
  return (
    <article className={`stat ${highlight ? "stat-light" : ""}`}>
      <div className="stat-top">
        <span className="stat-title">{title}</span>
        <Link to={to} className={`go ${highlight ? "solid" : ""}`} aria-label={`Open ${title}`}>
          <LuArrowUpRight />
        </Link>
      </div>
      <div className="stat-value">
        <span className="num">{value}</span>
        {unit && <span className="stat-unit">{unit}</span>}
        {delta && <span className={`delta ${delta.tone}`}>{delta.text}</span>}
      </div>
      <span className="stat-note">{note}</span>
    </article>
  );
}

function Dashboard() {
  const { devices, online, totalWatts } = useDevices();
  const energy = useEnergy();

  const weekKwh = energy.reduce((s, d) => s + Number(d.usage || 0), 0);
  const peak = energy.reduce((a, b) => (b.usage > a.usage ? b : a), energy[0]);
  const offCount = devices.length - online.length;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Hello, Chaaru! 👋</h1>
          <p>Here's how your home is using energy this week.</p>
        </div>
        <div className="head-tools">
          <span className="pill-label">
            <LuCalendar aria-hidden="true" /> This week
          </span>
        </div>
      </div>

      <div className="dash-grid">
        <div className="stat-grid">
          <Stat
            highlight
            title="Live load"
            value={(totalWatts / 1000).toFixed(2)}
            unit="kW"
            delta={{ text: "▼ 5%", tone: "good" }}
            note="Lower than yesterday"
            to="/devices"
          />
          <Stat
            title="Today's bill"
            value={`₹${TODAY_BILL}`}
            note={`Projected ₹${(TODAY_BILL * 30).toLocaleString("en-IN")} this month`}
            to="/history"
          />
          <Stat
            title="CO₂ saved"
            value="4.6"
            unit="kg"
            delta={{ text: "+12%", tone: "good" }}
            note="About 2 trees' worth"
            to="/analytics"
          />
          <Stat
            title="Used this week"
            value={weekKwh.toFixed(1)}
            unit="kWh"
            note={peak ? `Peak on ${peak.day}, ${peak.usage} kWh` : ""}
            to="/analytics"
          />
        </div>

        <section className="panel chart-panel">
          <div className="panel-head">
            <h2 className="panel-title">
              Energy usage <small>kWh per day, this week</small>
            </h2>
            <Link to="/analytics" className="go light" aria-label="Open analytics">
              <LuArrowUpRight />
            </Link>
          </div>
          <EnergyChart data={energy} height={290} />
        </section>

        <section className="split">
          <Link to="/devices" className="split-half">
            <span className="split-badge on" aria-hidden="true">●</span>
            <div>
              <div className="split-value">
                <span className="num">{online.length}</span> on
              </div>
              <p className="caption">
                Drawing <span className="hl">{totalWatts} W</span> right now.
              </p>
            </div>
          </Link>

          <Link to="/devices" className="split-go go light" aria-label="Manage devices">
            <LuArrowUpRight />
          </Link>

          <Link to="/devices" className="split-half">
            <span className="split-badge off" aria-hidden="true">○</span>
            <div>
              <div className="split-value">
                <span className="num">{offCount}</span> off
              </div>
              <p className="caption">
                Switched off and <span className="hl">using 0 W</span>.
              </p>
            </div>
          </Link>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2 className="panel-title">
              Load by category <small>devices that are on</small>
            </h2>
            <Link to="/devices" className="go light" aria-label="Open devices">
              <LuArrowUpRight />
            </Link>
          </div>
          <CategoryDonut slices={loadByCategory(devices)} />
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
