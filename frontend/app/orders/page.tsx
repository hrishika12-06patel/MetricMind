"use client";

import { useEffect, useMemo, useState } from "react";

type Order = {
  "Order.ID": string | number;
  "Customer.Name": string;
  "Product.Name": string;
  Category: string;
  Region: string;
  Sales: number;
  Profit: number;
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

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;


  useEffect(() => {
    async function fetchOrders() {
       try {
        setLoading(true);

        const response = await fetch(
          "http://127.0.0.1:8000/orders?limit=100"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        if (data.success) {
          setOrders(data.data || []);
        } else {
          setError(data.message || "Unable to fetch orders.");
        }
      } catch (err) {
        setError("Unable to connect to the backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

  // Search
    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter(
        (order) =>
          String(order["Order.ID"]).toLowerCase().includes(searchValue) ||
          String(order["Customer.Name"])
            .toLowerCase()
            .includes(searchValue) ||
          String(order["Product.Name"])
            .toLowerCase()
            .includes(searchValue)
      );
    }

    // Region filter
    if (regionFilter) {
      result = result.filter(
        (order) => order.Region === regionFilter
      );
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter(
        (order) => order.Category === categoryFilter
      );
    }

    // Sorting
    if (sortBy) {
      result.sort((a, b) => {
        let valueA: any = a[sortBy as keyof Order];
        let valueB: any = b[sortBy as keyof Order];

        if (typeof valueA === "number") {
          return sortOrder === "asc"
            ? valueA - valueB
            : valueB - valueA;
        }

        return sortOrder === "asc"
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      });
    }

    return result;
  }, [
    orders,
    search,
    regionFilter,
    categoryFilter,
    sortBy,
    sortOrder,
  ]);

  const totalPages = Math.ceil(
    filteredAndSortedOrders.length / ordersPerPage
  );

  const startIndex = (currentPage - 1) * ordersPerPage;

  const displayedOrders = filteredAndSortedOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.Sales || 0),
    0
  );

  const totalProfit = orders.reduce(
    (sum, order) => sum + Number(order.Profit || 0),
    0
  );

  const regions = [...new Set(orders.map((order) => order.Region))];

  const categories = [
    ...new Set(orders.map((order) => order.Category)),
  ];

  const resetFilters = () => {
    setSearch("");
    setRegionFilter("");
    setCategoryFilter("");
    setSortBy("");
    setSortOrder("asc");
    setCurrentPage(1);
  };

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
        Loading Orders...
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
          📦 Orders
        </h1>

        <p
          style={{
            color: "#64748B",
            fontSize: "18px",
            marginBottom: "35px",
          }}
        >
          Track and analyze customer orders and business activity.
        </p>

        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <SummaryCard
            title="Total Orders"
            value={orders.length.toLocaleString()}
          />

          <SummaryCard
            title="Total Sales"
            value={`₹ ${totalSales.toFixed(2)}`}
          />

          <SummaryCard
            title="Total Profit"
            value={`₹ ${totalProfit.toFixed(2)}`}
          />
        </div>

        {/* Controls */}
        <div
          style={{
            background: "#FFFFFF",
            padding: "22px",
            borderRadius: "18px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="🔍 Search orders..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              style={inputStyle}
            />

            <select
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={inputStyle}
            >
              <option value="">All Regions</option>

              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={inputStyle}
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={inputStyle}
            >
              <option value="">Sort By</option>
              <option value="Sales">Sales</option>
              <option value="Profit">Profit</option>
              <option value="Region">Region</option>
              <option value="Category">Category</option>
            </select>

            <button
              onClick={() =>
                setSortOrder(
                  sortOrder === "asc" ? "desc" : "asc"
                )
              }
              style={buttonStyle}
            >
              {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>

            <button
              onClick={resetFilters}
              style={{
                ...buttonStyle,
                background: "#52465A",
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "18px",
            padding: "20px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
            overflowX: "auto",
          }}
        >
          {displayedOrders.length === 0 ? (
            <div
              style={{
                padding: "50px",
                textAlign: "center",
                color: "#64748B",
              }}
            >
              No matching orders found.
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "850px",
              }}
            >
              <thead
                style={{
                  background: "#794d6c",
                  color: "#FFFFFF",
                }}
              >
                <tr>
                  {[
                    "Order ID",
                    "Customer",
                    "Product",
                    "Category",
                    "Region",
                    "Sales",
                    "Profit",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "15px",
                        textAlign: "center",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {displayedOrders.map((order, index) => (
                  <tr
                    key={index}
                    style={{
                      background:
                        index % 2 === 0
                          ? "#FFFFFF"
                          : "#F8FAFC",
                    }}
                  >
                    <td style={cellStyle}>
                      {order["Order.ID"]}
                    </td>

                    <td style={cellStyle}>
                      {order["Customer.Name"]}
                    </td>

                    <td style={cellStyle}>
                      {order["Product.Name"]}
                    </td>

                    <td style={cellStyle}>
                      {order.Category}
                    </td>

                    <td style={cellStyle}>
                      {order.Region}
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        color: "#794d6c",
                        fontWeight: "700",
                      }}
                    >
                      ₹ {Number(order.Sales).toFixed(2)}
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        color: "#794d6c",
                        fontWeight: "700",
                      }}
                    >
                      ₹ {Number(order.Profit).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
              marginTop: "25px",
            }}
          >
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) => page - 1)
              }
              style={buttonStyle}
            >
              ← Previous
            </button>

            <span
              style={{
                color: "#52465A",
                fontWeight: "600",
              }}
            >
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => page + 1)
              }
              style={buttonStyle}
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
    <div
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
          color: "#64748B",
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>

      <h2
        style={{
          color: "#794d6c",
          fontSize: "30px",
          fontWeight: "700",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

const inputStyle = {
  padding: "11px 14px",
  borderRadius: "9px",
  border: "1px solid #E5E7EB",
  background: "#FFFFFF",
  color: "#404e62",
  minWidth: "180px",
};

const buttonStyle = {
  background: "#794d6c",
  color: "#FFFFFF",
  border: "none",
  padding: "11px 18px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "600",
};

const cellStyle = {
  padding: "13px",
  textAlign: "center" as const,
  color: "#404e62",
};