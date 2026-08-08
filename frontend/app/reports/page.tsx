"use client";

import { useState } from "react";

export default function ReportsPage() {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

   // Generate AI Business Report
  const generateReport = async () => {
    setLoading(true);
    setError("");
    setReport("");

    try {
      const response = await fetch("http://127.0.0.1:8000/ai/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            type: "sales_summary",
            message:
              "Generate a business summary based on the available sales and order data.",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI report.");
      }

      const data = await response.json();

      setReport(
        data.summary ||
          data.message ||
          "AI report generated successfully."
      );
    } catch (err) {
      setError(
        "Unable to generate AI report. Please make sure the backend AI service is running."
      );
    } finally {
      setLoading(false);
    }
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
      {/* ================= HEADER ================= */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
      <div style={{ marginBottom: "40px" }}> 
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
          }}
        >
          Generate business reports and AI-powered insights to understand your
          business performance.
        </p>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {[
            {
              title: "Total Sales",
              icon: "💰",
            },
            {
              title: "Total Orders",
              icon: "📦",
            },
            {
              title: "Total Profit",
              icon: "📊",
            },
            {
              title: "Average Profit",
              icon: "📈",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: "#FFFFFF",
                borderRadius: "18px",
                padding: "24px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
                transition: "0.3s",
              }}
            >
               <div
                style={{
                  fontSize: "28px",
                  marginBottom: "12px",
                }}
              >
                {item.icon}
              </div>

              <h3
                style={{
                  color: "#404e62",
                  marginBottom: "10px",
                }}
              >
                 {item.title}
              </h3>

              <h2
                style={{
                  color: "#794d6c",
                  fontSize: "30px",
                  fontWeight: "700",
                  margin: 0,
                }}
              >
                --
              </h2>
            </div>
          ))}
        </div>

        {/* ================= AI INSIGHTS ================= */}
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
              fontSize: "28px",
            }}
          >
            🤖 AI Business Insights
          </h2>

          <p
            style={{
              color: "#64748B",
              marginBottom: "20px",
              lineHeight: "28px",
            }}
          >
            Generate an AI-powered business report using your sales and order
            data.
          </p>

          {/* CHANGED: Functional AI button */}

          <button
            onClick={generateReport}
            disabled={loading}
            style={{
              background: loading ? "#A98FA0" : "#794d6c",
              color: "#FFFFFF",
              border: "none",
              padding: "14px 26px",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            {loading 
              ? "Generating..." 
              : " 🤖 Generate AI Report"
            }
          </button>

           {/* NEW: Error message */}

           {error && (
            <div
              style={{
                marginTop: "20px",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderLeft: "5px solid #DC2626",
                borderRadius: "10px",
                padding: "15px",
                color: "#B91C1C",
              }}
            >
              {error}
            </div>
          )}

           {/* AI REPORT RESULT */}

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
              <h3
                style={{
                  color: "#52465A",
                  marginBottom: "10px",
                }}
              >
                AI Generated Summary
              </h3>

              <p style={{ margin: 0 }}>
                {report}
              </p>
            </div>
          )}
        </div>

        {/* ================= REPORT HISTORY ================= */}
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
              fontSize: "26px",
            }}
          >
             📋 Recent Reports
          </h2>
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
                <th style={{ padding: "15px" }}>
                  Report Name
                </th>
                <th style={{ padding: "15px" }}>
                  Generated On
                </th>
                <th style={{ padding: "15px" }}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td 
                  style={{ 
                    padding: "15px", 
                    textAlign: "center" ,
                    color: "#404e62",
                    }}
                >
                  Monthly Sales Report
                </td>

                <td  
                  style={{ 
                    padding: "15px", 
                    textAlign: "center",
                     color: "#64748B", 
                  }}
                >
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
                <td 
                  style={{ 
                    padding: "15px", 
                    textAlign: "center" ,
                    color: "#404e62",
                  }}
                >
                  Profit Analysis
                </td>

                <td  
                  style={{ 
                    padding: "15px", 
                    textAlign: "center",
                     color: "#64748B", 
                  }}
                >
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
        </div>
      </section>
    </div>
  );
}