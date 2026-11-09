import AnimatedNumber from "./AnimatedNumber";

// Dark stat card used on Analytics and History.
// A numeric `value` counts up; `prefix` and `decimals` format it.
function StatCard({ title, value, decimals = 0, prefix = "", unit, delta, note }) {
  return (
    <article className="stat">
      <div className="stat-top">
        <span className="stat-title">{title}</span>
      </div>
      <div className="stat-value">
        <span className="num">
          {typeof value === "number" ? (
            <AnimatedNumber value={value} decimals={decimals} prefix={prefix} />
          ) : (
            value
          )}
        </span>
        {unit && <span className="stat-unit">{unit}</span>}
        {delta && <span className={`delta ${delta.tone}`}>{delta.text}</span>}
      </div>
      {note && <span className="stat-note">{note}</span>}
    </article>
  );
}

export default StatCard;
