"use client";

import { useState } from "react";

export default function ReportsPage() {
  const [report, setReport] = useState("");

  const generateReport = () => {
    setReport(
      "AI-generated business report will appear here after backend integration."
    );
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #F8FAFC 0%, #EEF2FF 100%)",
        minHeight: "100vh",
        padding: "80px 40px",
        fontFamily: "Arial, sans-serif",
        color: "#404e62",
      }}
    >
      {/* Header */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "800",
            color: "#52465A",
            marginBottom: "10px",
          }}
        >
          📈 Reports
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#64748B",
            lineHeight: "30px",
            marginBottom: "40px",
          }}
        >
          Generate business reports and AI-powered insights to understand your
          business performance.
        </p>

        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {[
            "Total Sales",
            "Total Orders",
            "Total Profit",
            "Average Profit",
          ].map((item) => (
            <div
              key={item}
              style={{
                background: "#FFFFFF",
                borderRadius: "18px",
                padding: "24px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
              }}
            >
              <h3
                style={{
                  color: "#404e62",
                  marginBottom: "10px",
                }}
              >
                {item}
              </h3>

              <h2
                style={{
                  color: "#794d6c",
                  fontSize: "30px",
                  fontWeight: "700",
                }}
              >
                --
              </h2>
            </div>
          ))}
        </div>

        {/* AI Insights */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "18px",
            padding: "30px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              color: "#52465A",
              marginBottom: "10px",
            }}
          >
            🤖 AI Business Insights
          </h2>

          <p
            style={{
              color: "#64748B",
              marginBottom: "20px",
            }}
          >
            Generate an AI-powered business report using your sales and order
            data.
          </p>

          <button
            onClick={generateReport}
            style={{
              background: "#794d6c",
              color: "#FFFFFF",
              border: "none",
              padding: "14px 26px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            Generate AI Report
          </button>

          {report && (
            <div
              style={{
                marginTop: "25px",
                background: "#F8FAFC",
                border: "1px solid #E5E7EB",
                borderLeft: "5px solid #794d6c",
                borderRadius: "12px",
                padding: "20px",
                color: "#404e62",
                lineHeight: "28px",
              }}
            >
              {report}
            </div>
          )}
        </div>

        {/* Recent Reports */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "18px",
            padding: "30px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
          }}
        >
          <h2
            style={{
              color: "#52465A",
              marginBottom: "20px",
            }}
          >
            Recent Reports
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead
              style={{
                background: "#794d6c",
                color: "#FFFFFF",
              }}
            >
              <tr>
                <th style={{ padding: "15px" }}>Report Name</th>
                <th style={{ padding: "15px" }}>Generated On</th>
                <th style={{ padding: "15px" }}>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={{ padding: "15px", textAlign: "center" }}>
                  Monthly Sales Report
                </td>

                <td style={{ padding: "15px", textAlign: "center" }}>
                  07 Aug 2026
                </td>

                <td
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    color: "#16A34A",
                    fontWeight: "600",
                  }}
                >
                  Ready
                </td>
              </tr>

              <tr
                style={{
                  background: "#F8FAFC",
                }}
              >
                <td style={{ padding: "15px", textAlign: "center" }}>
                  Profit Analysis
                </td>

                <td style={{ padding: "15px", textAlign: "center" }}>
                  07 Aug 2026
                </td>

                <td
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    color: "#16A34A",
                    fontWeight: "600",
                  }}
                >
                  Ready
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}