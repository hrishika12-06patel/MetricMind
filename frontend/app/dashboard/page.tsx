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
  const isLoading = false;
  const hasData = true;
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
             fontSize: "16px",
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
              }}
            >
              <h3
               style={{
                 color: "#6b7280",
                 fontSize: "15px",
                 marginBottom: "10px",
                 fontWeight: "600",
                }}
              >
                {item}
              </h3>
              <h2
               style={{
                color:
                 item === "Total Sales"
                   ? "#2563eb"
                   : item === "Profit"
                   ? "#16a34a"
                   : item === "Orders"
                   ? "#7c3aed"
                   : "#ea580c",
                marginTop: "10px",
                fontSize: "28px",
                fontWeight: "bold",
                letterSpacing: "0.5px",
               }}
              >
               {item === "Total Sales"
                 ? "₹1,25,000"
                 : item === "Profit"
                 ? "₹32,500"
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
              }}
              >
               ▲ 12% from last month
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