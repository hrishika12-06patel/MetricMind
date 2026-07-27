export default function DashboardNavbar() {
  return (
    <header
      style={{
        height: "50px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "20px",
          fontWeight: "600",
          color: "#111827",
        }}
      >
        MetricMind 
      </h2>

      <div
        style={{
          fontSize: "15px",
          fontWeight: "500",
        }}
      >
        👤 User
      </div>
    </header>
  );
}