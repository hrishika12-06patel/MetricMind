"use client";

import { useEffect, useMemo, useState } from "react";
import page from "../page";

type Order = {
  [key: string]: any;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState(1);
  const ordersPerPage = 10;


  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://127.0.0.1:8000/orders?limit=100"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders.");
        }

        const data = await response.json();

        if (data.success) {
          setOrders(data.data || []);
        } else {
          setError(data.message || "Unable to fetch orders.");
        }
      } catch (err) {
        setError("Unable to fetch orders. Please check the backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);
  

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

  if (search.trim()) {
      result = result.filter((order) =>
        String(order["Customer.Name"] || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (regionFilter) {
      result = result.filter(
        (order) =>
          String(order["Region"] || "").toLowerCase() ===
          regionFilter.toLowerCase()
      );
    }

    if (categoryFilter) {
      result = result.filter(
        (order) =>
          String(order["Category"] || "").toLowerCase() ===
          categoryFilter.toLowerCase()
      );
    }

    result.sort((a, b) => {
      const first = Number(a[sortBy] || 0);
      const second = Number(b[sortBy] || 0);

      return sortOrder === "asc"
        ? first - second
        : second - first;
    });

    return result;
  }, [orders, search, regionFilter, categoryFilter, sortBy, sortOrder]);

  
  const totalPages = Math.ceil(
    filteredAndSortedOrders.length / ordersPerPage
  );

  const paginatedOrders = filteredAndSortedOrders.slice(
    (page - 1) * ordersPerPage,
    page * ordersPerPage
  );

  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order["Sales"] || 0),
    0
  );

  const totalProfit = orders.reduce(
    (sum, order) => sum + Number(order["Profit"] || 0),
    0
  );

  const totalOrders = orders.length;

  const averageSales =
    totalOrders > 0 ? totalSales / totalOrders : 0;

  
  useEffect(() => {
    setPage(1);
  }, [search, regionFilter, categoryFilter, sortBy, sortOrder]);

  const resetFilters = () => {
  setSearch("");
  setRegionFilter("");
  setCategoryFilter("");
  setSortBy("");
  setSortOrder("asc");
  setPage(1);
};

  if (loading) {
    return (
      <div style={loadingStyle}>
        Loading Orders...
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

        
        <h1 style={headingStyle}>📦 Orders</h1>

        <p style={subtitleStyle}>
          Track customer orders, sales, profit and order activity.
        </p>

        
        <div style={cardGridStyle}>

          <SummaryCard
            title="Total Orders"
            value={totalOrders.toString()}
          />

          <SummaryCard
            title="Total Sales"
            value={`₹ ${totalSales.toFixed(2)}`}
          />

          <SummaryCard
            title="Total Profit"
            value={`₹ ${totalProfit.toFixed(2)}`}
          />

          <SummaryCard
            title="Average Sales"
            value={`₹ ${averageSales.toFixed(2)}`}
          />

        </div>

        
        <div style={controlBoxStyle}>

          <input
            type="text"
            placeholder="🔍 Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Regions</option>
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="Central">Central</option>
            <option value="South">South</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Categories</option>
            <option value="Furniture">Furniture</option>
            <option value="Technology">Technology</option>
            <option value="Office Supplies">
              Office Supplies
            </option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={selectStyle}
          >
            <option value="Sales">Sort by Sales</option>
            <option value="Profit">Sort by Profit</option>
          </select>

          <button
            onClick={() =>
              setSortOrder(
                sortOrder === "asc" ? "desc" : "asc"
              )
            }
            style={buttonStyle}
          >
            {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
          </button>

          <button
            onClick={resetFilters}
             style={{
              background: "#E5E7EB",
              color: "#52465A",
              border: "none",
              padding: "11px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              }}
        >
          Reset
        </button>

        </div>

        
        <div style={tableContainerStyle}>

          {paginatedOrders.length === 0 ? (
            <div style={emptyStyle}>
              No orders found.
            </div>
          ) : (
            <table style={tableStyle}>

              <thead style={tableHeadStyle}>
                <tr>
                  <th style={thStyle}>Order ID</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Product</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Region</th>
                  <th style={thStyle}>Sales</th>
                  <th style={thStyle}>Profit</th>
                </tr>
              </thead>

              <tbody>
                {paginatedOrders.map((order, index) => (
                  <tr
                    key={index}
                    style={{
                      background:
                        index % 2 === 0
                          ? "#FFFFFF"
                          : "#F8FAFC",
                    }}
                  >
                    <td style={tdStyle}>
                      {order["Order.ID"]}
                    </td>

                    <td style={tdStyle}>
                      {order["Customer.Name"]}
                    </td>

                    <td style={tdStyle}>
                      {order["Product.Name"]}
                    </td>

                    <td style={tdStyle}>
                      {order["Category"]}
                    </td>

                    <td style={tdStyle}>
                      {order["Region"]}
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        color: "#794d6c",
                        fontWeight: "700",
                      }}
                    >
                      ₹ {Number(order["Sales"] || 0).toFixed(2)}
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        color: "#794d6c",
                        fontWeight: "700",
                      }}
                    >
                      ₹ {Number(order["Profit"] || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>

        
        {totalPages > 1 && (
          <div style={paginationStyle}>

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={paginationButtonStyle}
            >
              ← Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              style={paginationButtonStyle}
            >
              Next →
            </button>

          </div>
        )}

      </section>
    </main>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div style={summaryCardStyle}>
      <h3 style={summaryTitleStyle}>{title}</h3>
      <h2 style={summaryValueStyle}>{value}</h2>
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

const cardGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "24px",
  marginBottom: "35px",
};

const summaryCardStyle = {
  background: "#FFFFFF",
  borderRadius: "18px",
  padding: "24px",
  border: "1px solid #E5E7EB",
  boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
};

const summaryTitleStyle = {
  color: "#64748B",
  marginBottom: "10px",
};

const summaryValueStyle = {
  color: "#794d6c",
  fontSize: "28px",
  fontWeight: "700",
};

const controlBoxStyle = {
  background: "#FFFFFF",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
  display: "flex",
  gap: "12px",
  flexWrap: "wrap" as const,
  marginBottom: "30px",
};

const inputStyle = {
  padding: "11px",
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
  minWidth: "220px",
};

const selectStyle = {
  padding: "11px",
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
};

const buttonStyle = {
  background: "#794d6c",
  color: "#FFFFFF",
  border: "none",
  padding: "11px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const tableContainerStyle = {
  background: "#FFFFFF",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
  overflowX: "auto" as const,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
  minWidth: "850px",
};

const tableHeadStyle = {
  background: "#794d6c",
  color: "#FFFFFF",
};

const thStyle = {
  padding: "14px",
  textAlign: "center" as const,
};

const tdStyle = {
  padding: "14px",
  textAlign: "center" as const,
};

const paginationStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
  marginTop: "25px",
};

const paginationButtonStyle = {
  background: "#794d6c",
  color: "#FFFFFF",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
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

const emptyStyle = {
  padding: "50px",
  textAlign: "center" as const,
  color: "#64748B",
};