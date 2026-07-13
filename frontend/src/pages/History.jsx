import "../styles/history.css";

const historyData = [
  {
    id: 1,
    date: "13 Jul 2026",
    energy: "28.4 kWh",
    cost: "₹242",
    carbon: "2.8 kg",
    status: "Normal",
  },
  {
    id: 2,
    date: "12 Jul 2026",
    energy: "31.8 kWh",
    cost: "₹276",
    carbon: "3.1 kg",
    status: "High",
  },
  {
    id: 3,
    date: "11 Jul 2026",
    energy: "24.2 kWh",
    cost: "₹205",
    carbon: "2.3 kg",
    status: "Low",
  },
  {
    id: 4,
    date: "10 Jul 2026",
    energy: "26.5 kWh",
    cost: "₹224",
    carbon: "2.6 kg",
    status: "Normal",
  },
  {
    id: 5,
    date: "09 Jul 2026",
    energy: "34.1 kWh",
    cost: "₹298",
    carbon: "3.4 kg",
    status: "High",
  },
];

function History() {
  return (
    <div className="history-page">

      <div className="history-header">
        <div>
          <h1>📜 Energy History</h1>
          <p>View your previous energy usage and electricity costs.</p>
        </div>

        <button className="download-btn">
          📥 Download CSV
        </button>
      </div>

      <div className="history-summary">

        <div className="history-card">
          <h3>Total Records</h3>
          <h2>{historyData.length}</h2>
        </div>

        <div className="history-card">
          <h3>Total Energy</h3>
          <h2>145 kWh</h2>
        </div>

        <div className="history-card">
          <h3>Total Cost</h3>
          <h2>₹1245</h2>
        </div>

        <div className="history-card">
          <h3>Carbon Saved</h3>
          <h2>14.2 kg</h2>
        </div>

      </div>

      <div className="history-table">

        <table>

          <thead>

            <tr>
              <th>Date</th>
              <th>Energy</th>
              <th>Cost</th>
              <th>CO₂</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {historyData.map((item) => (

              <tr key={item.id}>

                <td>{item.date}</td>

                <td>{item.energy}</td>

                <td>{item.cost}</td>

                <td>{item.carbon}</td>

                <td>
                  <span className={`status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default History;