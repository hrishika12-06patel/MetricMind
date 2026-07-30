"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "North", value: 400 },
  { name: "South", value: 300 },
  { name: "East", value: 200 },
  { name: "West", value: 100 },
];

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444"];

export default function RegionSalesChart() {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <PieChart
      margin={{
       top: 20,
       right: 20,
       left: 40,
       bottom: 20,
      }}
     >
      <Pie
       data={data}
       dataKey="value"
       nameKey="name"
       cx="38%"
       cy="50%"
       outerRadius={65}
       label
       labelLine={true}
      >
       {data.map((entry, index) => (
        <Cell
         key={index}
         fill={COLORS[index % COLORS.length]}
        />
       ))}
      </Pie>

      <Tooltip
        formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Region"]}
      />

      <Legend
      layout="vertical"
      verticalAlign="middle"
      align="right"
     />
    </PieChart>
    </ResponsiveContainer>
  );
}