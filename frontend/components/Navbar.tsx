import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        background: "#52465a",
        color: "white",
        padding: "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #1F2937",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      }}
    >
      <Link
        href="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "28px",
          fontWeight: "700",
          letterSpacing: "0.5px",
        }}
      >
        MetricMind
      </Link>

      <div
        style={{
          display: "flex",
          gap: "28px",
          alignItems: "center",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Dashboard
        </Link>

        <Link
          href="/sales"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Sales
        </Link>

        <Link
          href="/orders"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Orders
        </Link>

        <Link
          href="/reports"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Reports
        </Link>
      </div>
    </nav>
  );
}