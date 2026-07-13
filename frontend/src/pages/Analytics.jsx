import EnergyChart from "../components/EnergyChart";
import StatCard from "../components/StatCard";
import "../styles/analytics.css";

function Analytics() {
  return (
    <div className="analytics-page">

      <div className="analytics-header">
        <h1>📊 Energy Analytics</h1>
        <p>Monitor and analyze your electricity consumption.</p>
      </div>

      <div className="analytics-stats">

        <StatCard
          title="This Month"
          value="86 kWh"
          change="+5%"
          color="#22C55E"
        />

        <StatCard
          title="Monthly Bill"
          value="₹2,840"
          change="-₹220"
          color="#3B82F6"
        />

        <StatCard
          title="Average Usage"
          value="2.7 kWh"
          change="+2%"
          color="#22C55E"
        />

        <StatCard
          title="CO₂ Reduced"
          value="18 kg"
          change="+12%"
          color="#10B981"
        />

      </div>

      <div className="analytics-grid">

        <div className="chart-card">

          <h2>📈 Monthly Energy Trend</h2>

          <EnergyChart />

        </div>

        <div className="insight-card">

          <h2>🤖 AI Insights</h2>

          <div className="insight">

            <h3>Peak Usage</h3>

            <p>Friday (3.2 kWh)</p>

          </div>

          <div className="insight">

            <h3>Highest Device</h3>

            <p>Air Conditioner</p>

          </div>

          <div className="insight">

            <h3>Recommendation</h3>

            <p>
              Reduce AC usage by 1 hour/day to save approximately ₹350 every month.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;