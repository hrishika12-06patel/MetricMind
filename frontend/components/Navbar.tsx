export default function Navbar() {
  return (
    <nav
      style={{
        background: "#2563eb",
        color: "white",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <a
        href="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "22px",
          fontWeight: "700",
        }}
      >
        MetricMind
      </a>

      <div
        style={{
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Home
        </a>

        <span
          style={{
            color: "#dbeafe",
          }}
        >
          About
        </span>

        <span
          style={{
            color: "#dbeafe",
          }}
        >
          Contact
        </span>
      </div>
    </nav>
  );
}