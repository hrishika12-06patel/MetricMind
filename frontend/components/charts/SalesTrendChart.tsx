"use client";

import { useEffect, useState } from "react";
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

interface SalesData {
  year: number;
  total_sales: number;
}

export default function SalesTrendChart() {
  const [data, setData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchSalesTrend() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          "http://127.0.0.1:8000/sales/by-year"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch sales trend");
        }

        const result = await response.json();

        const chartData = Array.isArray(result.data)
          ? result.data
              .map((item: SalesData) => ({
                year: Number(item.year),
                total_sales: Number(item.total_sales) || 0,
              }))
              .sort((a: SalesData, b: SalesData) => a.year - b.year)
          : [];

        setData(chartData);
      } catch (err) {
        console.error("Sales trend error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSalesTrend();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#2a3036",
        }}
      >
        Loading sales data...
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
          color: "#30343c",
        }}
      >
        Unable to load sales data.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 25,
          right: 20,
          left: 10,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="year"
          tick={{ fontSize: 14 }}
          tickMargin={8}
        />

        <YAxis
          width={65}
          tick={{ fontSize: 14 }}
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

        <Legend
          verticalAlign="bottom"
          align="center"
          height={30}
        />

        <Line
          type="monotone"
          dataKey="total_sales"
          name="Sales"
          stroke="#eb2577"
          strokeWidth={3}
          dot={{ r: 5 }}
          activeDot={{ r: 7 }}
        >
          <LabelList
            dataKey="total_sales"
            position="top"
            offset={8}
            formatter={(value) =>
              `₹${(Number(value) / 1000000).toFixed(1)}M`
            }
            style={{
              fontSize: 11,
              fill: "#1a1f26",
            }}
          />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
}