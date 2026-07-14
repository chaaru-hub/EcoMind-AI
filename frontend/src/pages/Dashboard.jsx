import { useEffect, useState } from "react";

import StatCard from "../components/StatCard";
import EnergyChart from "../components/EnergyChart";
import DeviceCard from "../components/deviceCard";

import { getDevices, updateDevice } from "../services/api";

import "../styles/dashboard.css";

function Dashboard() {
  const [devices, setDevices] =useState([]);

  useEffect(() => {
    loadDevices();
  }, []);

  async function loadDevices() {
    try {
      const data = await getDevices();
      setDevices(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function toggleDevice(id) {

    const current = devices.find((d) => d.id === id);

    if (!current) return;

    const newStatus =
      current.status === "ON"
        ? "OFF"
        : "ON";

    const newUsage =
      newStatus === "ON"
        ? (current.usage === 0 ? 100 : current.usage)
        : 0;

    try {

      await updateDevice(
        id,
        newStatus,
        newUsage
      );

      setDevices((prev) =>
        prev.map((device) =>
          device.id === id
            ? {
                ...device,
                status: newStatus,
                usage: newUsage,
              }
            : device
        )
      );

    } catch (error) {
      console.error(error);
    }
  }

  function getEmoji(icon) {
    switch (icon) {
      case "light":
        return "💡";
      case "ac":
        return "❄️";
      case "fan":
        return "🌀";
      case "tv":
        return "📺";
      case "pc":
        return "🖥️";
      case "laptop":
        return "💻";
      case "fridge":
        return "🧊";
      case "washing":
        return "🧺";
      case "microwave":
        return "🍽️";
      case "router":
        return "📡";
      default:
        return "🔌";
    }
  }

  const online = devices.filter(
    (d) => d.status === "ON"
  );

  const totalPower = online.reduce(
    (sum, d) => sum + d.usage,
    0
  );

  const highestConsumer =
    online.length > 0
      ? online.reduce((a, b) =>
          a.usage > b.usage ? a : b
        )
      : null;

  const lowestConsumer =
    online.length > 0
      ? online.reduce((a, b) =>
          a.usage < b.usage ? a : b
        )
      : null;

  const monthlyPrediction = 124 * 30;

  return (
    <div className="dashboard-page">

      <div className="welcome">

        <div>
          <h1>Welcome Back 👋</h1>
          <p>
            Monitor and optimize your energy usage with AI.
          </p>
        </div>

      </div>

      <div className="stats">

        <StatCard
          title="Current Usage"
          value="1.82 kW"
          change="▼ 5% Lower than yesterday"
          color="#22C55E"
        />

        <StatCard
          title="Today's Bill"
          value="₹124"
          change={`Monthly ₹${monthlyPrediction}`}
          color="#3B82F6"
        />

        <StatCard
          title="CO₂ Saved"
          value="4.6 kg"
          change="🌳 Equivalent to 2 Trees"
          color="#22C55E"
        />

        <StatCard
          title="Devices Online"
          value={`${online.length}/${devices.length}`}
          change="Live Monitoring"
          color="#F59E0B"
        />

      </div>

      <section className="chart-section">

        <h2>📈 Weekly Energy Usage</h2>

        <EnergyChart />

      </section>

      <section className="chart-section">

        <h2>📊 Smart Insights</h2>

        <div className="insight-grid">

          <div className="insight-card">
            <h3>⚡ Highest Consumer</h3>
            <p>{highestConsumer?.name || "-"}</p>
            <span>{highestConsumer?.usage || 0} W</span>
          </div>

          <div className="insight-card">
            <h3>💡 Lowest Consumer</h3>
            <p>{lowestConsumer?.name || "-"}</p>
            <span>{lowestConsumer?.usage || 0} W</span>
          </div>

          <div className="insight-card">
            <h3>⚡ Total Power</h3>
            <p>{totalPower} W</p>
            <span>Current Consumption</span>
          </div>

          <div className="insight-card">
            <h3>💰 Monthly Prediction</h3>
            <p>₹{monthlyPrediction}</p>
            <span>Based on Today's Usage</span>
          </div>

        </div>

      </section>

      <section className="device-section">

        <h2>🔌 Smart Devices</h2>

        <div className="device-grid">

          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              icon={getEmoji(device.icon)}
              name={device.name}
              status={device.status}
              usage={device.usage}
              onToggle={() => toggleDevice(device.id)}
            />
          ))}

        </div>

      </section>

    </div>
  );
}

export default Dashboard;