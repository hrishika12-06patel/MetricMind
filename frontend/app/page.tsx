"use client";

import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import DashboardFilters from "../components/DashboardFilters";
import SortingDropdown from "../components/SortingDropdown";
import Pagination from "../components/Pagination";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";

export default function Home() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/orders")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        return res.json();
      })
      .then((data) => {
        setOrders(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />

      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        <h1
          style={{
            marginBottom: "20px",
            fontSize: "32px",
            fontWeight: 700,
          }}
        >
          MetricMind
        </h1>

        {/* Filters */}
        <DashboardFilters />

        {/* Sorting */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <SortingDropdown />
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ height: "350px" }}>
            <LoadingSkeleton />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            style={{
              color: "#ef4444",
              textAlign: "center",
              marginTop: "40px",
              fontSize: "18px",
            }}
          >
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div style={{ height: "300px" }}>
            <EmptyState />
          </div>
        )}

        {/* Table */}
        {!loading && !error && orders.length > 0 && (
          <>
            <div
              style={{
                overflowX: "auto",
                borderRadius: "12px",
                border: "1px solid #374151",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "#111827",
                  color: "white",
                }}
              >
                <thead
                  style={{
                    background: "#1f2937",
                  }}
                >
                  <tr>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        borderBottom: "1px solid #374151",
                      }}
                    >
                      Order ID
                    </th>

                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        borderBottom: "1px solid #374151",
                      }}
                    >
                      Customer
                    </th>

                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        borderBottom: "1px solid #374151",
                      }}
                    >
                      Product
                    </th>

                    <th
                      style={{
                        padding: "16px",
                        textAlign: "right",
                        borderBottom: "1px solid #374151",
                      }}
                    >
                      Sales
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.slice(0, 10).map((order: any, index: number) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: "1px solid #374151",
                      }}
                    >
                      <td style={{ padding: "14px" }}>
                        {order["Order.ID"]}
                      </td>

                      <td style={{ padding: "14px" }}>
                        {order["Customer.Name"]}
                      </td>

                      <td style={{ padding: "14px" }}>
                        {order["Product.Name"]}
                      </td>

                      <td
                        style={{
                          padding: "14px",
                          textAlign: "right",
                          fontWeight: 600,
                        }}
                      >
                        ${Number(order["Sales"]).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination />
          </>
        )}
      </main>
    </>
  );
}