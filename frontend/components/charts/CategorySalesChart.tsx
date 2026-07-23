"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

const data = [
  { category: "Electronics", sales: 4000 },
  { category: "Fashion", sales: 3000 },
  { category: "Home", sales: 2000 },
  { category: "Sports", sales: 3500 },
];

export default function CategorySalesChart() {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart 
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
        dataKey="category"
        tick={{ fontSize: 12 }}
        height={40}
        />

        <YAxis
          width={45}
          tick={{ fontSize: 11 }}
        />
        
        <Tooltip
          formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Category"]}
        />
        <Legend
          verticalAlign="bottom"
          align="center"
          height={30}
        />
        <Bar

          dataKey="sales"
          fill="#f97316"
          radius={[4, 4, 0, 0]}  
        >        
          <LabelList
            dataKey="sales"
            position="top"
            offset={18}
            style={{
                fontSize: 11,
                fill: "#666",
            }}
        
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}