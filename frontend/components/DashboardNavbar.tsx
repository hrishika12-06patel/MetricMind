export default function DashboardNavbar() {
  return (
    <header
      style={{
        height: "72px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 32px",
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
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: "600",
        color: "#374151",
       }}
      >
       

        <span>👤 User</span>
      </div>
    </header>
  );
}