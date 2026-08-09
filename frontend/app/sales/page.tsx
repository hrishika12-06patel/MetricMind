"use client";

import { useEffect, useState } from "react";

type SalesData = {
  [key: string]: any;
};

export default function SalesPage() {
  const [regionSales, setRegionSales] = useState<SalesData[]>([]);
  const [categorySales, setCategorySales] = useState<SalesData[]>([]);
  const [yearSales, setYearSales] = useState<SalesData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSalesData() {
      try {
        setLoading(true);

        const [
          regionResponse,
          categoryResponse,
          yearResponse,
        ] = await Promise.all([
          fetch("http://127.0.0.1:8000/sales/by-region"),
          fetch("http://127.0.0.1:8000/sales/by-category"),
          fetch("http://127.0.0.1:8000/sales/by-year"),
        ]);

        if (
          !regionResponse.ok ||
          !categoryResponse.ok ||
          !yearResponse.ok
        ) {
          throw new Error("Failed to fetch sales data.");
        }

        const regionData = await regionResponse.json();
        const categoryData = await categoryResponse.json();
        const yearData = await yearResponse.json();

        setRegionSales(
          regionData.data || regionData || []
        );

        setCategorySales(
          categoryData.data || categoryData || []
        );

        setYearSales(
          yearData.data || yearData || []
        );
      } catch (err) {
        setError(
          "Unable to load sales data. Please check the backend."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSalesData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom, #F8FAFC 0%, #EEF2FF 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#794d6c",
          fontSize: "24px",
          fontWeight: "600",
        }}
      >
        Loading Sales...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom, #F8FAFC 0%, #EEF2FF 100%)",
          padding: "60px 40px",
          color: "#DC2626",
          fontSize: "20px",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #F8FAFC 0%, #EEF2FF 100%)",
        padding: "60px 40px",
        fontFamily: "Arial, sans-serif",
        color: "#404e62",
      }}
    >
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "800",
            color: "#52465A",
            marginBottom: "10px",
          }}
        >
          💰 Sales
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#64748B",
            marginBottom: "40px",
            lineHeight: "30px",
          }}
        >
          Analyze sales performance across regions, categories,
          and years.
        </p>

        {/* Sales by Region */}
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>
            🌎 Sales by Region
          </h2>

          {regionSales.length === 0 ? (
            <EmptyState />
          ) : (
            <DataTable
              data={regionSales}
              firstColumn="Region"
            />
          )}
        </section>

        {/* Sales by Category */}
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>
            📦 Sales by Category
          </h2>

          {categorySales.length === 0 ? (
            <EmptyState />
          ) : (
            <DataTable
              data={categorySales}
              firstColumn="Category"
            />
          )}
        </section>

        {/* Sales by Year */}
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>
            📅 Sales by Year
          </h2>

          {yearSales.length === 0 ? (
            <EmptyState />
          ) : (
            <DataTable
              data={yearSales}
              firstColumn="Year"
            />
          )}
        </section>
      </section>
    </main>
  );
}

function DataTable({
  data,
  firstColumn,
}: {
  data: SalesData[];
  firstColumn: string;
}) {
  if (!data.length) {
    return <EmptyState />;
  }

  const columns = Object.keys(data[0]);

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: "600px",
        }}
      >
        <thead
          style={{
            background: "#794d6c",
            color: "#FFFFFF",
          }}
        >
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                style={{
                  padding: "15px",
                  textAlign: "center",
                }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              style={{
                background:
                  index % 2 === 0
                    ? "#FFFFFF"
                    : "#F8FAFC",
              }}
            >
              {columns.map((column) => (
                <td
                  key={column}
                  style={{
                    padding: "14px",
                    textAlign: "center",
                    color:
                      column === firstColumn
                        ? "#52465A"
                        : "#794d6c",
                    fontWeight:
                      column === firstColumn
                        ? "600"
                        : "700",
                  }}
                >
                  {typeof row[column] === "number"
                    ? Number(row[column]).toFixed(2)
                    : row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        padding: "35px",
        textAlign: "center",
        color: "#64748B",
      }}
    >
      No sales data available.
    </div>
  );
}

const sectionStyle = {
  background: "#FFFFFF",
  borderRadius: "18px",
  padding: "28px",
  border: "1px solid #E5E7EB",
  boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
  marginBottom: "30px",
};

const sectionTitle = {
  color: "#52465A",
  marginBottom: "20px",
  fontSize: "24px",
};