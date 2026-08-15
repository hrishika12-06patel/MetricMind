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

interface CategoryData {
  category: string;
  total_sales: number;
}

interface CategorySalesChartProps {
  region?: string;
  category?: string;
  segment?: string;
}

export default function CategorySalesChart({
  region,
  category,
  segment,
}: CategorySalesChartProps) {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchCategorySales() {
      try {
        setLoading(true);
        setError(false);

        const params = new URLSearchParams();

        if (region) {
          params.append("region", region);
        }

        if (category) {
          params.append("category", category);
        }

        if (segment) {
          params.append("segment", segment);
        }

        const queryString = params.toString();

        const url = `http://127.0.0.1:8000/reports/sales-by-category${
          queryString ? `?${queryString}` : ""
        }`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch category sales");
        }

        const result = await response.json();

        const chartData: CategoryData[] = Array.isArray(result)
          ? result
              .map((item: CategoryData) => ({
                category: item.category,
                total_sales: Number(item.total_sales) || 0,
              }))
              .sort((a, b) => b.total_sales - a.total_sales)
          : [];

        setData(chartData);
      } catch (err) {
        console.error("Category sales error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchCategorySales();
  }, [region, category, segment]);

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
        Loading category data...
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
        Unable to load category data.
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
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="category"
          tick={{ fontSize: 16 }}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={55}
        />

        <YAxis
          width={65}
          tick={{ fontSize: 16 }}
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
          fill="#eb9525"
          radius={[6, 6, 0, 0]}
          maxBarSize={70}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={["#28468d", "#b91010", "#a78a08"][index % 3]}
            />
          ))}

          <LabelList
            dataKey="total_sales"
            position="top"
            offset={8}
            formatter={(value) =>
              `₹${(Number(value) / 1000000).toFixed(1)}M`
            }
            style={{
              fontSize: 14,
              fill: "#0c0e12",
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}