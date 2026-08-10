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

  const totalSales = regionSales.reduce(
    (sum, row) =>
      sum +
      Number(
        row["Total Sales"] ||
        row["Sales"] ||
        row["total_sales"] ||
        0
      ),
    0
  );

  if (loading) {
    return (
      <div style={loadingStyle}>
        Loading Sales...
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorStyle}>
        {error}
      </div>
    );
  }

  return (
    <main style={pageStyle}>
      <section style={containerStyle}>

        <h1 style={headingStyle}>💰 Sales</h1>

        <p style={subtitleStyle}>
          Analyze sales performance across regions,
          categories and years.
        </p>

        
        <div style={summaryCardStyle}>
          <h3>Total Sales</h3>
          <h2 style={summaryValueStyle}>
            ₹ {totalSales.toFixed(2)}
          </h2>
        </div>

        
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>
            🌎 Sales by Region
          </h2>

          {regionSales.length === 0 ? (
            <EmptyState />
          ) : (
            <DataTable data={regionSales} />
          )}
        </section>

        
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>
            📦 Sales by Category
          </h2>

          {categorySales.length === 0 ? (
            <EmptyState />
          ) : (
            <DataTable data={categorySales} />
          )}
        </section>

        
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>
            📅 Sales by Year
          </h2>

          {yearSales.length === 0 ? (
            <EmptyState />
          ) : (
            <DataTable data={yearSales} />
          )}
        </section>

      </section>
    </main>
  );
}

function DataTable({
  data,
}: {
  data: SalesData[];
}) {
  const columns = Object.keys(data[0] || {});

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={tableStyle}>

        <thead style={tableHeadStyle}>
          <tr>
            {columns.map((column) => (
              <th key={column} style={thStyle}>
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
                <td key={column} style={tdStyle}>
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
    <div style={emptyStyle}>
      No sales data available.
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(to bottom, #F8FAFC 0%, #EEF2FF 100%)",
  padding: "60px 40px",
  fontFamily: "Arial, sans-serif",
  color: "#404e62",
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const headingStyle = {
  fontSize: "48px",
  fontWeight: "800",
  color: "#52465A",
  marginBottom: "10px",
};

const subtitleStyle = {
  fontSize: "18px",
  color: "#64748B",
  marginBottom: "35px",
  lineHeight: "30px",
};

const summaryCardStyle = {
  background: "#FFFFFF",
  borderRadius: "18px",
  padding: "25px",
  border: "1px solid #E5E7EB",
  boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
  marginBottom: "30px",
};

const summaryValueStyle = {
  color: "#794d6c",
  fontSize: "30px",
};

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

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
  minWidth: "600px",
};

const tableHeadStyle = {
  background: "#794d6c",
  color: "#FFFFFF",
};

const thStyle = {
  padding: "15px",
  textAlign: "center" as const,
};

const tdStyle = {
  padding: "14px",
  textAlign: "center" as const,
  color: "#404e62",
};

const emptyStyle = {
  padding: "35px",
  textAlign: "center" as const,
  color: "#64748B",
};

const loadingStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#794d6c",
  fontSize: "24px",
  fontWeight: "600",
};

const errorStyle = {
  minHeight: "100vh",
  padding: "60px 40px",
  color: "#DC2626",
  fontSize: "20px",
};