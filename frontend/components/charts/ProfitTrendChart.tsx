"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

const data = [
  { month: "Jan", profit: 1200 },
  { month: "Feb", profit: 1800 },
  { month: "Mar", profit: 1500 },
  { month: "Apr", profit: 2200 },
  { month: "May", profit: 2800 },
  { month: "Jun", profit: 3500 },
];

export default function ProfitTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <LineChart 
      data={data}
      margin={{
        top: 70,
        right: 30,
        left: 20,
        bottom: 50,
      }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
        dataKey="month"
        tick={{ fontSize: 12}}
        height={40}
        
        />
        <YAxis
        width={45}
        tick={{fontSize: 11}}
        />
        <Tooltip
          formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Profit"]}
        />
        <Legend
          verticalAlign="bottom"
          align="center"
          height={30}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="#16a34a"
          strokeWidth={3}
          dot={{ r: 5 }}
        >
          <LabelList
            dataKey="profit"
            position="top"
            offset={18}
            style={{
                fontSize: 11,
                fill: "#666",
            }}
          />    
        </Line>    
      </LineChart>
    </ResponsiveContainer>
  );
}