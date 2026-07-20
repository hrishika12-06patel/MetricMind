import DashboardNavbar from "../../components/DashboardNavbar";
export default function Dashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          background: "#1e293b",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>MetricMind</h2>

        <p>Dashboard</p>
        <p>Sales</p>
        <p>Orders</p>
        <p>Reports</p>
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
        <h1>Dashboard</h1>

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
            "Discount",
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
              <h2 style={{ color: "#2563eb", marginTop: "10px" }}>
                ₹0
              </h2>
   

              <p style={{ color: "gray" }}>
                Placeholder Data
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}