export default function DashboardNavbar() {
  return (
    <header
      style={{
        height: "60px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h2>MetricMind Dashboard</h2>

      <div>👤 User</div>
    </header>
  );
}