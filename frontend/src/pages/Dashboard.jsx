import { useEffect, useState } from "react";

import StatCard from "../components/StatCard";
import EnergyChart from "../components/EnergyChart";
import DeviceCard from "../components/deviceCard";

import { getDevices } from "../services/api";

import "../styles/dashboard.css";

function Dashboard() {
  const [devices, setDevices] = useState([]);

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

  function toggleDevice(id) {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id
          ? {
              ...device,
              status: device.status === "ON" ? "OFF" : "ON",
              usage: device.status === "ON" ? 0 : 100,
            }
          : device
      )
    );
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

  return (
    <div className="dashboard-page">

      <div className="welcome">
        <div>
          <h1>Welcome Back 👋</h1>
          <p>Monitor and optimize your energy usage with AI.</p>
        </div>
      </div>

      <div className="stats">

        <StatCard
          title="Current Usage"
          value="1.82 kW"
          change="Live"
          color="#22C55E"
        />

        <StatCard
          title="Today's Bill"
          value="₹124"
          change="Today"
          color="#3B82F6"
        />

        <StatCard
          title="CO₂ Saved"
          value="4.6 kg"
          change="Today"
          color="#22C55E"
        />

        <StatCard
          title="Devices Online"
          value={devices.filter(d => d.status === "ON").length}
          change="Live"
          color="#F59E0B"
        />

      </div>

      <section className="chart-section">

        <h2>📈 Weekly Energy Usage</h2>

        <EnergyChart />

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