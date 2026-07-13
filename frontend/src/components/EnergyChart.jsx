import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", usage: 2.3 },
  { day: "Tue", usage: 2.0 },
  { day: "Wed", usage: 2.8 },
  { day: "Thu", usage: 2.1 },
  { day: "Fri", usage: 3.2 },
  { day: "Sat", usage: 2.6 },
  { day: "Sun", usage: 2.1 },
];

function EnergyChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>

      <LineChart data={data}>

        <CartesianGrid stroke="#1F2937" />

        <XAxis
          dataKey="day"
          stroke="#94A3B8"
        />

        <YAxis stroke="#94A3B8" />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="usage"
          stroke="#22C55E"
          strokeWidth={4}
        />

      </LineChart>

    </ResponsiveContainer>
  );
}

export default EnergyChart;