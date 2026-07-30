export default function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "#2563eb",
        color: "white",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>MetricMind</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <a href="#" style={{ color: "white", textDecoration: "none" }}>
          Home
        </a>
        <a href="#" style={{ color: "white", textDecoration: "none" }}>
          About
        </a>
        <a href="#" style={{ color: "white", textDecoration: "none" }}>
          Contact
        </a>
      </div>
    </nav>
  );
}