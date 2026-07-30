"use client";
import {useEffect, useState} from "react";
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
export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(true);

  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  useEffect(() => {
   async function loadDashboardData() {
    try {
      const salesRes = await fetch("http://127.0.0.1:8000/orders/total-sales");
      const salesData = await salesRes.json();
      setTotalSales(salesData.total_sales);

      const profitRes = await fetch("http://127.0.0.1:8000/orders/total-profit");
      const profitData = await profitRes.json();
      setTotalProfit(profitData.total_profit);

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setHasData(false);
      setIsLoading(false);
    }
  }

  loadDashboardData();
}, []);
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "150px",
          background: "#1e293b",
          color: "white",
          padding: "12px",
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

        <p
         style={{
          padding: "10px",
          borderRadius: "8px",
          background: "#334155",
          marginBottom: "10px",
          cursor: "pointer",
         }}
        >
         📊 Dashboard
        </p>

        <p
         style={{
          padding: "10px",
          marginBottom: "10px",
          cursor: "pointer",
         }}
        >
         💰 Sales
        </p>

        <p
         style={{
          padding: "10px",
          marginBottom: "10px",
          cursor: "pointer",
         }}
        >
         📦 Orders
        </p>

        <p
         style={{
          padding: "10px",
          cursor: "pointer",
         }}
        >
         📑 Reports
        </p>
      </aside>
      
      {/* Main Content */}
      <main
        style={{
          flex: 1,
          background: "#f8fafc",
          padding: "20px",
        }}
      >
        <DashboardNavbar />

        <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          marginBottom: "15px",
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
          color: "#374151"
         }}
        >
         Jul 21 – Jul 27, 2026
        </div>
        </div>
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
          <DashboardFilters />
          <SortingDropdown />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {[
            "Total Sales",
            "Profit",
            "Orders",
            "Customers",
          ].map((item) => (
            <div
              key={item}
              style={{
               background: "white",
               padding: "20px",
               borderRadius: "12px",
               border: "1px solid #e5e7eb",
               boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
               transition: "all 0.3s ease",
               cursor: "pointer",
               display: "flex",
               flexDirection: "column",
               gap: "10px"
              }}
            >
              <div
               style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
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
                  background:
                   item === "Total Sales"
                    ? "#dbeafe"
                    : item === "Profit"
                    ? "#dcfce7"
                    : item === "Orders"
                    ? "#ede9fe"
                    : "#ffedd5",
                 }}
                >
                 {item === "Total Sales"
                  ? "💰"
                  : item === "Profit"
                  ? "📈"
                  : item === "Orders"
                  ? "📦"
                  : "👥"}
                </div>

                <h3
                 style={{
                  color: "#374151",
                  fontSize: "18px",
                  fontWeight: "700",
                  margin: 0,
                 }}
                >
                 {item}
                </h3>
              </div>
              <h2
               style={{
                color:
                 item === "Total Sales"
                   ? "#21408a"
                   : item === "Profit"
                   ? "#1b9347"
                   : item === "Orders"
                   ? "#563989"
                   : "rgb(183, 74, 11)",
                marginTop: "10px",
                fontSize: "34px",
                fontWeight: "bold",
                letterSpacing: "0.5px",
                margin: 0,
               }}
              >
               {item === "Total Sales"
                 ? `₹${totalSales.toLocaleString()}`
                 : item === "Profit"
                 ? `₹${totalProfit.toLocaleString()}`
                 : item === "Orders"
                 ? "248"
                 : "156"}
              </h2>

              <p
               style={{
               color: "#16a34a",
               fontWeight: "600",
               marginTop: "8px",
               fontSize: "14px",
               margin: 0,
              }}
              >
               ▲ 12% increase from last month
              </p>
            </div>
          ))}
        </div>
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  }}
>
  <div
    style={{
      background: "white",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      transition: "0.3s ease",
      border: "1px solid #e5e7eb",
      cursor: "pointer",
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
        height: "280px",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
      }}
    >
      {isLoading ? (
        <LoadingSkeleton />
      ) :hasData ? (
        <SalesTrendChart />
      ) : (
        <EmptyState />
      )}
    </div>
  </div>

  <div
    style={{
      background: "white",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      transition: "0.3s ease",
      border: "1px solid #e5e7eb",
      cursor: "pointer",
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
        height: "280px",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
        
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
  <div
    style={{
      background: "white",
      padding: "24px",
      borderRadius: "16px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      transition: "0.3s ease",
      cursor: "pointer",
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
        height: "280px",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
      }}
    >
      {isLoading ? (
       <LoadingSkeleton />
      ) : hasData ? (
       <CategorySalesChart />
      ) : (
       <EmptyState />
      )}
    </div>
  </div>
  <div
    style={{
      background: "white",
      padding: "24px",
      borderRadius: "16px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      transition: "0.3s ease",
      cursor: "pointer",
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
        height: "280px",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
      }}
    >
      {isLoading ? (
       <LoadingSkeleton />
      ) : hasData ? (
       <RegionSalesChart />
      ) : (
       <EmptyState />
      )}
    </div>
  </div>
</div>
<Pagination />
      </main>
    </div>
  );
}