import { LuDownload } from "react-icons/lu";

import StatCard from "../components/StatCard";

const historyData = [
  { id: 1, date: "13 Jul 2026", energy: 28.4, cost: 242, carbon: 2.8, status: "Normal" },
  { id: 2, date: "12 Jul 2026", energy: 31.8, cost: 276, carbon: 3.1, status: "High" },
  { id: 3, date: "11 Jul 2026", energy: 24.2, cost: 205, carbon: 2.3, status: "Low" },
  { id: 4, date: "10 Jul 2026", energy: 26.5, cost: 224, carbon: 2.6, status: "Normal" },
  { id: 5, date: "09 Jul 2026", energy: 34.1, cost: 298, carbon: 3.4, status: "High" },
];

function downloadCsv() {
  const rows = [
    ["Date", "Energy (kWh)", "Cost (INR)", "CO2 (kg)", "Status"],
    ...historyData.map((r) => [r.date, r.energy, r.cost, r.carbon, r.status]),
  ];
  const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ecomind-energy-history.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function History() {
  const totalEnergy = historyData.reduce((s, r) => s + r.energy, 0);
  const totalCost = historyData.reduce((s, r) => s + r.cost, 0);
  const totalCarbon = historyData.reduce((s, r) => s + r.carbon, 0);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>History</h1>
          <p>Your daily energy use and electricity costs.</p>
        </div>
        <button type="button" className="btn" onClick={downloadCsv}>
          <LuDownload aria-hidden="true" /> Download CSV
        </button>
      </div>

      <div className="stat-row">
        <StatCard title="Days recorded" value={historyData.length} note="Most recent first" />
        <StatCard title="Total energy" value={totalEnergy.toFixed(1)} unit="kWh" />
        <StatCard title="Total cost" value={`₹${totalCost.toLocaleString("en-IN")}`} />
        <StatCard title="Carbon" value={totalCarbon.toFixed(1)} unit="kg CO₂" />
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2 className="panel-title">
            Daily log <small>{historyData.length} days</small>
          </h2>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th className="num-cell">Energy</th>
                <th className="num-cell">Cost</th>
                <th className="num-cell">CO₂</th>
                <th>Usage level</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((r) => (
                <tr key={r.id}>
                  <td className="strong">{r.date}</td>
                  <td className="num-cell">{r.energy} kWh</td>
                  <td className="num-cell">₹{r.cost}</td>
                  <td className="num-cell">{r.carbon} kg</td>
                  <td>
                    <span className={`status ${r.status.toLowerCase()}`}>{r.status}</span>
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

export default History;
