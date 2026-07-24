import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import DashboardNavbar from "../../components/DashboardNavbar";
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
          padding: "30px",
        }}
      >
        <DashboardNavbar />

        <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "30px",
          marginBottom: "20px",
         }}
        >
         <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p style={{ color: "#6b7280", marginTop: "5px" }}>
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
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{item}</h3>
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
    <h3>Sales Trend</h3>

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
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      minHeight: "250px",
    }}
  >
    <h3>Profit Trend</h3>

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
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      minHeight: "250px",
    }}
  >
    <h3>Category-wise Sales</h3>

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
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      minHeight: "250px",
    }}
  >
    <h3>Region-wise Sales</h3>

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
      </main>
    </div>
  );
}