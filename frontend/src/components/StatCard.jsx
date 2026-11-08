// Dark stat card used on Analytics and History.
function StatCard({ title, value, unit, delta, note }) {
  return (
    <article className="stat">
      <div className="stat-top">
        <span className="stat-title">{title}</span>
      </div>
      <div className="stat-value">
        <span className="num">{value}</span>
        {unit && <span className="stat-unit">{unit}</span>}
        {delta && <span className={`delta ${delta.tone}`}>{delta.text}</span>}
      </div>
      {note && <span className="stat-note">{note}</span>}
    </article>
  );
}

export default StatCard;
