import { useEffect, useMemo, useState } from "react";
import { getDevices } from "../services/api";
import DeviceCard from "../components/DeviceCard";
import "../styles/devices.css";

function Devices() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDevices();
  }, []);

  async function loadDevices() {
    try {
      const data = await getDevices();
      setDevices(data);
    } catch (error) {
      console.error("Error loading devices:", error);
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

  const filteredDevices = useMemo(() => {
    return devices.filter((device) =>
      device.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [devices, search]);

  const totalDevices = devices.length;

  const onlineDevices = devices.filter(
    (device) => device.status === "ON"
  ).length;

  const offlineDevices = totalDevices - onlineDevices;

  const totalPower = devices.reduce((sum, device) => {
    return device.status === "ON"
      ? sum + device.usage
      : sum;
  }, 0);

  return (
    <div className="devices-page">

      <div className="devices-header">

        <div>
          <h1>🔌 Smart Devices</h1>
          <p>Manage and monitor all connected smart devices.</p>
        </div>

        <input
          className="device-search"
          type="text"
          placeholder="Search devices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="device-summary">

        <div className="summary-card">
          <h3>Total Devices</h3>
          <h2>{totalDevices}</h2>
        </div>

        <div className="summary-card">
          <h3>Online</h3>
          <h2>{onlineDevices}</h2>
        </div>

        <div className="summary-card">
          <h3>Offline</h3>
          <h2>{offlineDevices}</h2>
        </div>

        <div className="summary-card">
          <h3>⚡ Total Power</h3>
          <h2>{totalPower} W</h2>
        </div>

      </div>

      <div className="device-grid">

        {filteredDevices.map((device) => (
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

    </div>
  );
}

export default Devices;