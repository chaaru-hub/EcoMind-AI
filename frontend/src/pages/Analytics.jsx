import { LuSparkles } from "react-icons/lu";

import EnergyChart from "../components/EnergyChart";
import { useEnergy } from "../hooks/useEnergy";
import StatCard from "../components/StatCard";

function Analytics() {
  const energy = useEnergy();
  const peak = energy.reduce((a, b) => (b.usage > a.usage ? b : a), energy[0]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Analytics</h1>
          <p>How much you use, what it costs and where it goes.</p>
        </div>
      </div>

      <div className="stat-row">
        <StatCard
          title="This month"
          value="86"
          unit="kWh"
          delta={{ text: "+5%", tone: "bad" }}
          note="vs. last month"
        />
        <StatCard
          title="Monthly bill"
          value="₹2,840"
          delta={{ text: "−₹220", tone: "good" }}
          note="vs. last month"
        />
        <StatCard
          title="Average per day"
          value="2.7"
          unit="kWh"
          delta={{ text: "+2%", tone: "bad" }}
          note="vs. last month"
        />
        <StatCard
          title="CO₂ reduced"
          value="18"
          unit="kg"
          delta={{ text: "+12%", tone: "good" }}
          note="vs. last month"
        />
      </div>

      <div className="analytics-grid">
        <section className="panel">
          <div className="panel-head">
            <h2 className="panel-title">
              Daily usage <small>kWh, this week</small>
            </h2>
          </div>
          <EnergyChart data={energy} height={320} />
        </section>

        <section className="panel insights">
          <div className="panel-head">
            <h2 className="panel-title">
              <LuSparkles aria-hidden="true" className="title-icon" /> AI insights
            </h2>
          </div>

          <div className="insight">
            <span className="caption">Peak day</span>
            <strong>
              {peak.day} · <span className="num">{peak.usage} kWh</span>
            </strong>
          </div>
          <div className="insight">
            <span className="caption">Biggest consumer</span>
            <strong>Air Conditioner</strong>
          </div>
          <div className="insight highlight">
            <span className="caption">Recommendation</span>
            <p>
              Run the AC one hour less each day to save about{" "}
              <strong className="num">₹350</strong> a month.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Analytics;
