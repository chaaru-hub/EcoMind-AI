import "../styles/cards.css";

function StatCard({ title, value, change, color }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>

      <h1 style={{ color }}>{value}</h1>

      <p>{change}</p>
    </div>
  );
}

export default StatCard;