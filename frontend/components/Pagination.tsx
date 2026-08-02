export default function Pagination() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "20px",
        padding: "14px 18px",
        background: "#ffffff",
        borderRadius: "10px",
        border: "1px solid #d1d5db",
      }}
    >
      {/* Left Side */}
      <span
        style={{
          color: "#111827",
          fontSize: "15px",
          fontWeight: "600",
        }}
      >
        Showing 1–10 of 50 results
      </span>

      {/* Right Side */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {/* Previous */}
        <button
          style={{
            padding: "8px 14px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            background: "#f8fafc",
            color: "#64748b",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "not-allowed",
            opacity: 1,
          }}
          disabled
        >
          Previous
        </button>

        {/* Active Page */}
        <button
          style={{
            padding: "8px 14px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#ffffff",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          1
        </button>

        {/* Page 2 */}
        <button
          style={{
            padding: "8px 14px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#111827",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          2
        </button>

        {/* Next */}
        <button
          style={{
            padding: "8px 14px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#111827",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}