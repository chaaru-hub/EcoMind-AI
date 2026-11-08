import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

function CategoryDonut({ slices }) {
  const total = slices.reduce((s, c) => s + c.watts, 0);

  if (!total) {
    return (
      <p className="caption donut-empty">
        Everything is switched off, so nothing is drawing power right now.
      </p>
    );
  }

  return (
    <div className="donut">
      <div className="donut-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="watts"
              nameKey="name"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={2}
              cornerRadius={6}
              stroke="none"
              isAnimationActive={false}
            >
              {slices.map((s) => (
                <Cell key={s.name} fill={s.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center">
          <span className="num">{total}</span>
          <small>watts</small>
        </div>
      </div>

      <ul className="legend">
        {slices.map((s) => (
          <li key={s.name}>
            <span className="swatch" style={{ background: s.color }} />
            <span className="legend-name">{s.name}</span>
            <span className="legend-value num">{Math.round((s.watts / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryDonut;
