export default function Pagination() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "20px",
        padding: "10px 16px",
        background: "white",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
      }}
    >
      <span
       style={{
         color: "#6b7280",
         fontSize: "14px",
        }}
      >
        Showing 1–10 of 50 results
      </span>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          style={{
            padding: "5px 10px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "13px",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Previous
        </button>

        <button
          style={{
            padding: "5px 10px",
            border: "none",
            borderRadius: "6px",
            fontSize: "13px",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          1
        </button>

        <button
          style={{
            padding: "5px 10px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "13px",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          2
        </button>

        <button
          style={{
            padding: "5px 10px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "13px",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}