"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

interface RegionData {
  region: string;
  total_sales: number;
}

interface RegionSalesChartProps {
  region?: string;
}

export default function RegionSalesChart({
  region,
}: RegionSalesChartProps) {
  const [data, setData] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchRegionSales() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          "http://127.0.0.1:8000/sales/by-region"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch region sales");
        }

        const result = await response.json();

        const chartData = Array.isArray(result.data)
          ? result.data
              .map((item: RegionData) => ({
                region: item.region,
                total_sales: Number(item.total_sales) || 0,
              }))
              .sort(
                (a: RegionData, b: RegionData) =>
                  b.total_sales - a.total_sales
              )
          : [];

        setData(chartData);
      } catch (err) {
        console.error("Region sales error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchRegionSales();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
        }}
      >
        Loading region data...
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
        }}
      >
        Unable to load region data.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 25,
          right: 20,
          left: 10,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="region"
          tick={{ fontSize: 13 }}
          interval={0}
          angle={-30}
          textAnchor="end"
          height={65}
        />

        <YAxis
          width={65}
          tick={{ fontSize: 15 }}
          tickFormatter={(value) =>
            `₹${(Number(value) / 1000000).toFixed(1)}M`
          }
        />

        <Tooltip
          formatter={(value) => [
            `₹${Number(value).toLocaleString("en-IN")}`,
            "Sales",
          ]}
        />

        <Bar
          dataKey="total_sales"
          name="Sales"
          radius={[6, 6, 0, 0]}
          maxBarSize={55}
        >
          {data.map((entry, index) => (
            <Cell
             key={`cell-${index}`}
             fill={[
              "#ef8737",
              "#efa852",
              "#f57c0b81",
              "#b17659",
              "#f56740",
              "#ba8c6b",
              "#903e2c",
              "#f06962",
              "#f3244a",
              "#f1bb0a",
              "#8b2636",
              "#7b4702",
              "#3e0320",
             ][index]}
           />
          ))}  
          <LabelList
            dataKey="total_sales"
            position="top"
            offset={6}
            formatter={(value) =>
              `₹${(Number(value) / 1000000).toFixed(1)}M`
            }
            style={{
              fontSize: 12.5,
              fill: "#06080b",
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}