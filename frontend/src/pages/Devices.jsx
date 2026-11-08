import { useMemo, useState } from "react";
import { LuSearch, LuPower } from "react-icons/lu";

import { useDevices } from "../hooks/useDevices";
import { deviceCategory, deviceEmoji } from "../lib/devices";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "ON", label: "On" },
  { id: "OFF", label: "Off" },
];

function Devices() {
  const { devices, loading, error, toggle, switchAllOff, online, totalWatts } = useDevices();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(false);

  const counts = {
    all: devices.length,
    ON: online.length,
    OFF: devices.length - online.length,
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return devices.filter(
      (d) =>
        (filter === "all" || d.status === filter) &&
        (!q ||
          d.name.toLowerCase().includes(q) ||
          deviceCategory(d.icon).toLowerCase().includes(q))
    );
  }, [devices, search, filter]);

  const share = devices.length ? Math.round((online.length / devices.length) * 100) : 0;
  const biggest = online.reduce((a, b) => (b.usage > (a?.usage ?? -1) ? b : a), null);

  async function allOff() {
    setBusy(true);
    await switchAllOff(visible);
    setBusy(false);
  }

  async function flip(device) {
    setBusy(true);
    await toggle(device);
    setBusy(false);
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Devices</h1>
          <p>Switch devices on or off and see what each one is drawing.</p>
        </div>
      </div>

      <div className="tiles">
        <div className="tile">
          <div className="tile-cap">All devices</div>
          <div className="tile-body">
            <span className="tile-value num">{devices.length}</span>
            <span className="tile-note">Connected to EcoMind</span>
          </div>
        </div>
        <div className="tile mint">
          <div className="tile-cap">Switched on</div>
          <div className="tile-body">
            <span className="tile-value num">{online.length}</span>
            <span className="delta good">{share}%</span>
            <span className="tile-note">Of all devices</span>
          </div>
        </div>
        <div className="tile amber">
          <div className="tile-cap">Switched off</div>
          <div className="tile-body">
            <span className="tile-value num">{counts.OFF}</span>
            <span className="tile-note">Standing by at 0 W</span>
          </div>
        </div>
        <div className="tile butter">
          <div className="tile-cap">Live load</div>
          <div className="tile-body">
            <span className="tile-value num">{totalWatts}</span>
            <span className="caption">W</span>
            <span className="tile-note">
              {biggest ? `Largest: ${biggest.name}` : "Nothing is on"}
            </span>
          </div>
        </div>
      </div>

      <section className="panel">
        <div className="toolbar">
          <label className="search">
            <LuSearch aria-hidden="true" />
            <input
              id="device-search"
              type="search"
              placeholder="Search by name or category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <span className="caption">
            <span className="num">{visible.length}</span> devices
          </span>

          <div className="toolbar-end">
            <button
              type="button"
              className="btn primary"
              onClick={allOff}
              disabled={busy || !visible.some((d) => d.status === "ON")}
            >
              <LuPower aria-hidden="true" /> Switch all off
            </button>
          </div>
        </div>

        <div className="chips filter-row" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip ${filter === f.id ? "active" : ""}`}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label} <span className="count">{counts[f.id]}</span>
            </button>
          ))}
        </div>

        {error && <p className="notice">{error}</p>}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Device</th>
                <th>Category</th>
                <th>Device ID</th>
                <th className="num-cell">Load</th>
                <th>Status</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="empty-row">Loading devices…</td>
                </tr>
              )}
              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-row">No devices match this search.</td>
                </tr>
              )}
              {visible.map((d) => (
                <tr key={d.id}>
                  <td className="strong">
                    <div className="cell-device">
                      <span className="emoji" aria-hidden="true">{deviceEmoji(d.icon)}</span>
                      {d.name}
                    </div>
                  </td>
                  <td>{deviceCategory(d.icon)}</td>
                  <td>#EM-{String(d.id).padStart(3, "0")}</td>
                  <td className="num-cell">{d.usage} W</td>
                  <td>
                    <span className={`status ${d.status === "ON" ? "on" : "off"}`}>
                      {d.status === "ON" ? "On" : "Off"}
                    </span>
                  </td>
                  <td className="num-cell">
                    <button
                      type="button"
                      className="btn small"
                      onClick={() => flip(d)}
                      disabled={busy}
                    >
                      {d.status === "ON" ? "Turn off" : "Turn on"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Devices;
