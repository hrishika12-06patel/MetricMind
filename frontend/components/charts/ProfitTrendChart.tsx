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

const API_BASE_URL = "http://127.0.0.1:8000";

interface ProfitData {
  year: number;
  total_profit: number;
}

export default function ProfitTrendChart() {
  const [data, setData] = useState<ProfitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
   async function fetchProfitData() {
    try {
      setLoading(true);

      const url = "http://127.0.0.1:8000/reports/profit-by-year";

      console.log("Fetching profit data from:", url);

      const response = await fetch(url, {
        cache: "no-store",
      });

      console.log("Profit API status:", response.status);

      if (!response.ok) {
        throw new Error(`Profit API failed: ${response.status}`);
      }

      const result = await response.json();

      console.log("Profit API response:", result);

      if (!Array.isArray(result)) {
        throw new Error("Profit API response is not an array");
      }

      const formattedData = result.map((item: any) => ({
        year: Number(item.year),
        total_profit: Number(item.total_profit) || 0,
      }));

      console.log("Formatted profit data:", formattedData);

      setData(formattedData);
    } catch (error) {
      console.error("Profit trend loading error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  fetchProfitData();
 }, []);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "340px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#6b7280",
        }}
      >
        Loading profit trend...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: "340px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#dc2626",
        }}
      >
        Failed to load profit trend.
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "340px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#6b7280",
        }}
      >
        No profit data available.
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
          height={40}
        />

        <YAxis
          width={60}
          tick={{ fontSize: 14 }}
        />

        <Tooltip
          formatter={(value) => [
            `₹${Number(value).toLocaleString("en-IN")}`,
            "Profit",
          ]}
        />

        <Legend
          verticalAlign="bottom"
          align="center"
          height={30}
        />

        <Line
          type="monotone"
          dataKey="total_profit"
          name="Profit"
          stroke="#5fb306"
          strokeWidth={3}
          dot={{ r: 5 }}
        >
          <LabelList
            dataKey="total_profit"
            position="top"
            offset={18}
            formatter={(value) =>
              `₹${Number(value).toLocaleString("en-IN")}`
            }
            style={{
              fontSize: 11,
              fill: "#0b0606",
            }}
          />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
}