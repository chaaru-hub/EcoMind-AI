import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tip">
      {label} · {payload[0].value} kWh
    </div>
  );
}

function PeakLabel({ x, y, width, value, index, peakIndex }) {
  if (index !== peakIndex) return null;
  const w = 64;
  return (
    <g>
      <rect x={x + width / 2 - w / 2} y={y - 30} width={w} height={22} rx={7} fill="#f3f3f5" />
      <text
        x={x + width / 2}
        y={y - 15}
        textAnchor="middle"
        fill="#111113"
        fontSize={11.5}
        fontWeight={700}
      >
        {value} kWh
      </text>
    </g>
  );
}

function EnergyChart({ data, height = 280 }) {
  const peakIndex = data.reduce(
    (best, d, i) => (d.usage > data[best].usage ? i : best),
    0
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 36, right: 4, left: -18, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 5" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#84848d", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#84848d", fontSize: 11 }}
          tickFormatter={(v) => `${v}`}
          width={44}
        />
        <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="usage" radius={[10, 10, 4, 4]} maxBarSize={44}>
          {data.map((d, i) => (
            <Cell key={d.day} fill={i === peakIndex ? "#7d97ff" : "#5b7cfa"} />
          ))}
          <LabelList dataKey="usage" content={(p) => <PeakLabel {...p} peakIndex={peakIndex} />} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default EnergyChart;
