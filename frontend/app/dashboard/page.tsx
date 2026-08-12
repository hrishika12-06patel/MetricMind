"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import DashboardFilters from "@/components/DashboardFilters";
import Pagination from "@/components/Pagination";
import DashboardNavbar from "../../components/DashboardNavbar";
import SortingDropdown from "@/components/SortingDropdown";

import SalesTrendChart from "@/components/charts/SalesTrendChart";
import ProfitTrendChart from "@/components/charts/ProfitTrendChart";
import CategorySalesChart from "@/components/charts/CategorySalesChart";
import RegionSalesChart from "@/components/charts/RegionSalesChart";

const API_BASE_URL = "http://127.0.0.1:8000";

interface DashboardStats {
  total_orders: number;
  total_sales: number;
  total_profit: number;
  avg_sales: number;
  avg_profit: number;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(true);

  
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  
  const [totalCustomers, setTotalCustomers] = useState(0);

  const [orders, setOrders] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [segment, setSegment] = useState("");

  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");

  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const limit = 10;

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setHasData(true);

        
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          order,
        });

        if (region) {
          params.append("region", region);
        }

        if (category) {
          params.append("category", category);
        }

        if (segment) {
          params.append("segment", segment);
        }

        if (sortBy) {
          params.append("sort_by", sortBy);
        }

        const ordersRes = await fetch(
          `${API_BASE_URL}/orders?${params.toString()}`
        );

        if (!ordersRes.ok) {
          throw new Error("Failed to fetch orders");
        }

        const ordersData = await ordersRes.json();

        setOrders(ordersData.data || []);
        setTotalRecords(ordersData.total_records || 0);

         
        const statsRes = await fetch(
          `${API_BASE_URL}/dashboard/stats`
        );

        if (!statsRes.ok) {
          throw new Error("Failed to fetch dashboard statistics");
        }

        const statsResponse = await statsRes.json();

        const stats: DashboardStats = statsResponse.data;

        setTotalSales(Number(stats.total_sales) || 0);
        setTotalProfit(Number(stats.total_profit) || 0);
        setTotalOrders(Number(stats.total_orders) || 0);
        const customersRes = await fetch(
         `${API_BASE_URL}/customers/count`
        );

        if (!customersRes.ok) {
         throw new Error("Failed to fetch customer count");
        }

        const customersData = await customersRes.json();

        setTotalCustomers(
         Number(customersData.total_customers) || 0
        );
      } catch (error) {
        console.error("Dashboard loading error:", error);

        setHasData(false);

        setTotalSales(0);
        setTotalProfit(0);
        setTotalOrders(0);
        setTotalCustomers(0);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [page, region, category, segment, sortBy, order]);


  const kpiCards = [
    {
      title: "Total Sales",
      value: `₹${totalSales.toLocaleString("en-IN")}`,
      icon: "💰",
      iconBackground: "#dbeafe",
      valueColor: "#c02604",
    },
    {
      title: "Profit",
      value: `₹${totalProfit.toLocaleString("en-IN")}`,
      icon: "📈",
      iconBackground: "#dcfce7",
      valueColor: "#1b9347",
    },
    {
      title: "Orders",
      value: totalOrders.toLocaleString("en-IN"),
      icon: "📦",
      iconBackground: "#ede9fe",
      valueColor: "#322b87",
    },
    {
      title: "Customers",
      value: totalCustomers.toLocaleString("en-IN"),
      icon: "👥",
      iconBackground: "#ffedd5",
      valueColor: "rgb(120, 5, 124)",
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}

      <aside
        className="dashboard-sidebar"
        style={{
          width: "150px",
          background: "#1e293b",
          color: "white",
          padding: "12px",
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            marginBottom: "30px",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          MetricMind
        </h2>

        <Link
          href="/dashboard"
          style={{
            display: "block",
            padding: "10px",
            borderRadius: "8px",
            background: "#334155",
            marginBottom: "10px",
            color: "white",
            textDecoration: "none",
          }}
        >
          📊 Dashboard
        </Link>

        <Link
          href="/sales"
          style={{
            display: "block",
            padding: "10px",
            marginBottom: "10px",
            color: "white",
            textDecoration: "none",
          }}
        >
          💰 Sales
        </Link>

        <Link
          href="/orders"
          style={{
            display: "block",
            padding: "10px",
            marginBottom: "10px",
            color: "white",
            textDecoration: "none",
          }}
        >
          📦 Orders
        </Link>

        <Link
          href="/reports"
          style={{
            display: "block",
            padding: "10px",
            color: "white",
            textDecoration: "none",
          }}
        >
          📑 Reports
        </Link>
      </aside>

      {}

      <main
        className="dashboard-main"
        style={{
          flex: 1,
          minWidth: 0,
          background: "#f8fafc",
          padding: "20px",
        }}
      >
        <DashboardNavbar />

        {}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            marginBottom: "15px",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Dashboard
            </h1>

            <p
              style={{
                color: "#6b7280",
                marginTop: "8px",
                fontSize: "17px",
                lineHeight: "26px",
              }}
            >
              Welcome back! Here's your business overview.
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "10px 16px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Jul 21 – Jul 27, 2026
          </div>
        </div>

        {}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <DashboardFilters
            region={region}
            category={category}
            segment={segment}
            setRegion={(value) => {
              setRegion(value);
              setPage(1);
            }}
            setCategory={(value) => {
              setCategory(value);
              setPage(1);
            }}
            setSegment={(value) => {
              setSegment(value);
              setPage(1);
            }}
          />

          <SortingDropdown
            sortBy={sortBy}
            order={order}
            setSortBy={(value) => {
              setSortBy(value);
              setPage(1);
            }}
            setOrder={(value) => {
              setOrder(value);
              setPage(1);
            }}
          />
        </div>

        {}

        <div
          className="dashboard-kpi-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {kpiCards.map((item) => (
            <div
              key={item.title}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    background: item.iconBackground,
                  }}
                >
                  {item.icon}
                </div>

                <h3
                  style={{
                    color: "#374151",
                    fontSize: "18px",
                    fontWeight: "700",
                    margin: 0,
                  }}
                >
                  {item.title}
                </h3>
              </div>

              <h2
                style={{
                  color: item.valueColor,
                  margin: 0,
                  fontSize: "34px",
                  fontWeight: "bold",
                }}
              >
                {isLoading ? "Loading..." : item.value}
              </h2>

              <p
                style={{
                  color: "#6b7280",
                  fontWeight: "500",
                  margin: 0,
                  fontSize: "13px",
                }}
              >
                Live data
              </p>
            </div>
          ))}
        </div>

        {}

        <div
          className="dashboard-chart-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: "24px",
            marginTop: "32px",
          }}
        >
          {/* Sales Trend */}

          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08)",
              minHeight: "360px",
            }}
          >
            <h3
              style={{
                marginBottom: "16px",
                color: "#111827",
                fontWeight: "600",
              }}
            >
              Sales Trend
            </h3>

            <div
              style={{
                height: "320px",
                background: "#f3f4f6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {isLoading ? (
                <LoadingSkeleton />
              ) : hasData ? (
                <SalesTrendChart />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>

          {/* Profit Trend */}

          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08)",
              minHeight: "360px",
            }}
          >
            <h3
              style={{
                marginBottom: "16px",
                color: "#111827",
                fontWeight: "600",
              }}
            >
              Profit Trend
            </h3>

            <div
              style={{
                height: "320px",
                background: "#f3f4f6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {isLoading ? (
                <LoadingSkeleton />
              ) : hasData ? (
                <ProfitTrendChart />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>

          {/* Category-wise Sales */}

          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08)",
              minHeight: "360px",
            }}
          >
            <h3
              style={{
                marginBottom: "16px",
                color: "#111827",
                fontWeight: "600",
              }}
            >
              Category-wise Sales
            </h3>

            <div
              style={{
                height: "320px",
                background: "#f3f4f6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {isLoading ? (
                <LoadingSkeleton />
              ) : hasData ? (
                <CategorySalesChart
                  region={region}
                  category={category}
                  segment={segment}
                />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>

          {/* Region-wise Sales */}

          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08)",
              minHeight: "360px",
            }}
          >
            <h3
              style={{
                marginBottom: "16px",
                color: "#111827",
                fontWeight: "600",
              }}
            >
              Region-wise Sales
            </h3>

            <div
              style={{
                height: "320px",
                background: "#f3f4f6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {isLoading ? (
                <LoadingSkeleton />
              ) : hasData ? (
                <RegionSalesChart region={region} />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}

        <Pagination
          page={page}
          totalRecords={totalRecords}
          limit={limit}
          setPage={setPage}
        />
      </main>
    </div>
  );
}