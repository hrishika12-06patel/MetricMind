"use client";

import { useEffect, useState } from "react";

type ReportData = {
  [key: string]: any;
};

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);

  const [profitByRegion, setProfitByRegion] =
    useState<ReportData[]>([]);

  const [profitByCategory, setProfitByCategory] =
    useState<ReportData[]>([]);

  const [topProducts, setTopProducts] =
    useState<ReportData[]>([]);

  const [report, setReport] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Fetch Report Data
  // =========================

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        setError("");

        const [
          statsResponse,
          regionResponse,
          categoryResponse,
          productsResponse,
        ] = await Promise.all([
          fetch(
            "http://127.0.0.1:8000/dashboard/stats"
          ),
          fetch(
            "http://127.0.0.1:8000/reports/profit-by-region"
          ),
          fetch(
            "http://127.0.0.1:8000/reports/profit-by-category"
          ),
          fetch(
            "http://127.0.0.1:8000/reports/top-products"
          ),
        ]);

        if (
          !statsResponse.ok ||
          !regionResponse.ok ||
          !categoryResponse.ok ||
          !productsResponse.ok
        ) {
          throw new Error(
            "Failed to fetch report data."
          );
        }

        const statsData =
          await statsResponse.json();

        const regionData =
          await regionResponse.json();

        const categoryData =
          await categoryResponse.json();

        const productsData =
          await productsResponse.json();

        setStats(
          statsData.data || statsData
        );

        setProfitByRegion(
          regionData.data || regionData || []
        );

        setProfitByCategory(
          categoryData.data ||
            categoryData ||
            []
        );

        setTopProducts(
          productsData.data ||
            productsData ||
            []
        );
      } catch (err) {
        setError(
          "Unable to load reports. Please check the backend."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  // =========================
  // AI Report
  // =========================

  const generateReport = async () => {
    try {
      setAiLoading(true);
      setAiError("");
      setReport("");

      const response = await fetch(
        "http://127.0.0.1:8000/ai/summary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              total_sales:
                stats?.total_sales || 0,
              total_orders:
                stats?.total_orders || 0,
              total_profit:
                stats?.total_profit || 0,
              avg_sales:
                stats?.avg_sales || 0,
              avg_profit:
                stats?.avg_profit || 0,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to generate AI report."
        );
      }

      const data = await response.json();

      setReport(
        data.summary ||
          data.data?.summary ||
          data.message ||
          "AI report generated successfully."
      );
    } catch (err) {
      setAiError(
        "Unable to generate AI report. Please try again."
      );
    } finally {
      setAiLoading(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={centerStateStyle}>
          Loading Reports...
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (error) {
    return (
      <div style={pageStyle}>
        <div
          style={{
            ...centerStateStyle,
            color: "#DC2626",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <main style={pageStyle}>
      <section style={containerStyle}>

        {/* =========================
            HEADER
        ========================= */}

        <h1 style={headingStyle}>
          📈 Reports
        </h1>

        <p style={subtitleStyle}>
          Generate business reports and AI-powered
          insights to understand your business
          performance.
        </p>

        {/* =========================
            SUMMARY CARDS
        ========================= */}

        <div style={cardGridStyle}>

          <SummaryCard
            title="Total Sales"
            value={`₹ ${Number(
              stats?.total_sales || 0
            ).toFixed(2)}`}
            icon="💰"
          />

          <SummaryCard
            title="Total Orders"
            value={String(
              stats?.total_orders || 0
            )}
            icon="📦"
          />

          <SummaryCard
            title="Total Profit"
            value={`₹ ${Number(
              stats?.total_profit || 0
            ).toFixed(2)}`}
            icon="📈"
          />

          <SummaryCard
            title="Average Profit"
            value={`₹ ${Number(
              stats?.avg_profit || 0
            ).toFixed(2)}`}
            icon="📊"
          />

        </div>

        {/* =========================
            AI INSIGHTS
        ========================= */}

        <section style={sectionStyle}>

          <h2 style={sectionTitle}>
            🤖 AI Business Insights
          </h2>

          <p style={paragraphStyle}>
            Generate an AI-powered business report
            using your sales and order data.
          </p>

          <button
            onClick={generateReport}
            disabled={aiLoading}
            style={{
              ...primaryButtonStyle,
              opacity: aiLoading ? 0.6 : 1,
            }}
          >
            {aiLoading
              ? "Generating..."
              : "Generate AI Report"}
          </button>

          {aiError && (
            <div
              style={{
                marginTop: "20px",
                color: "#DC2626",
              }}
            >
              {aiError}
            </div>
          )}

          {report && (
            <div style={aiResultStyle}>
              <h3
                style={{
                  color: "#52465A",
                  marginBottom: "10px",
                }}
              >
                AI Generated Summary
              </h3>

              <p
                style={{
                  lineHeight: "28px",
                  margin: 0,
                }}
              >
                {report}
              </p>
            </div>
          )}

        </section>

        {/* =========================
            PROFIT BY REGION
        ========================= */}

        <ReportSection
          title="🌎 Profit by Region"
          data={profitByRegion}
          firstColumn="Region"
        />

        {/* =========================
            PROFIT BY CATEGORY
        ========================= */}

        <ReportSection
          title="📦 Profit by Category"
          data={profitByCategory}
          firstColumn="Category"
        />

        {/* =========================
            TOP PRODUCTS
        ========================= */}

        <ReportSection
          title="🏆 Top Products"
          data={topProducts}
          firstColumn="Product"
        />

        {/* =========================
            RECENT REPORTS
        ========================= */}

        <section style={sectionStyle}>

          <h2 style={sectionTitle}>
            📋 Recent Reports
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>

              <thead>
                <tr>
                  <th style={tableHeaderStyle}>
                    Report Name
                  </th>

                  <th style={tableHeaderStyle}>
                    Generated On
                  </th>

                  <th style={tableHeaderStyle}>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>

                <ReportHistoryRow
                  name="Monthly Sales Report"
                  date="10 Aug 2026"
                />

                <ReportHistoryRow
                  name="Profit Analysis"
                  date="10 Aug 2026"
                />

              </tbody>

            </table>
          </div>

        </section>

      </section>
    </main>
  );
}

/* =========================
   SUMMARY CARD
========================= */

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div style={summaryCardStyle}>
      <div style={{ fontSize: "30px" }}>
        {icon}
      </div>

      <h3
        style={{
          color: "#404e62",
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>

      <h2
        style={{
          color: "#794d6c",
          fontSize: "28px",
          margin: 0,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

/* =========================
   REPORT SECTION
========================= */

function ReportSection({
  title,
  data,
  firstColumn,
}: {
  title: string;
  data: ReportData[];
  firstColumn: string;
}) {
  return (
    <section style={sectionStyle}>

      <h2 style={sectionTitle}>
        {title}
      </h2>

      {data.length === 0 ? (
        <div style={emptyStyle}>
          No report data available.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>

            <thead>
              <tr>
                {Object.keys(data[0]).map(
                  (column) => (
                    <th
                      key={column}
                      style={tableHeaderStyle}
                    >
                      {column}
                    </th>
                  )
                )}
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
                  {Object.keys(row).map(
                    (column) => (
                      <td
                        key={column}
                        style={{
                          ...tableCellStyle,
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
                        {typeof row[column] ===
                        "number"
                          ? Number(
                              row[column]
                            ).toFixed(2)
                          : row[column]}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </section>
  );
}

/* =========================
   REPORT HISTORY ROW
========================= */

function ReportHistoryRow({
  name,
  date,
}: {
  name: string;
  date: string;
}) {
  return (
    <tr>
      <td style={tableCellStyle}>
        {name}
      </td>

      <td style={tableCellStyle}>
        {date}
      </td>

      <td
        style={{
          ...tableCellStyle,
          color: "#16A34A",
          fontWeight: "600",
        }}
      >
        Ready
      </td>
    </tr>
  );
}

/* =========================
   STYLES
========================= */

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
  lineHeight: "30px",
  marginBottom: "40px",
};

const cardGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "24px",
  marginBottom: "40px",
};

const summaryCardStyle = {
  background: "#FFFFFF",
  borderRadius: "18px",
  padding: "24px",
  border: "1px solid #E5E7EB",
  boxShadow:
    "0 15px 40px rgba(15,23,42,0.08)",
};

const sectionStyle = {
  background: "#FFFFFF",
  borderRadius: "18px",
  padding: "30px",
  border: "1px solid #E5E7EB",
  boxShadow:
    "0 15px 40px rgba(15,23,42,0.08)",
  marginBottom: "30px",
};

const sectionTitle = {
  color: "#52465A",
  marginBottom: "15px",
  fontSize: "24px",
};

const paragraphStyle = {
  color: "#64748B",
  lineHeight: "28px",
  marginBottom: "20px",
};

const primaryButtonStyle = {
  background: "#794d6c",
  color: "#FFFFFF",
  border: "none",
  padding: "14px 26px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
};

const aiResultStyle = {
  marginTop: "25px",
  background: "#F8FAFC",
  border: "1px solid #E5E7EB",
  borderLeft: "5px solid #794d6c",
  borderRadius: "12px",
  padding: "20px",
  color: "#404e62",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
  minWidth: "600px",
};

const tableHeaderStyle = {
  padding: "15px",
  background: "#794d6c",
  color: "#FFFFFF",
  textAlign: "center" as const,
};

const tableCellStyle = {
  padding: "15px",
  textAlign: "center" as const,
  color: "#404e62",
};

const emptyStyle = {
  padding: "35px",
  textAlign: "center" as const,
  color: "#64748B",
};

const centerStateStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#794d6c",
  fontSize: "24px",
  fontWeight: "600",
};