export default function EmptyState() {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#64748b",
        fontSize: "16px",
      }}
    >
      <div style={{ fontSize: "42px" }}>📊</div>

      <h3 style={{ margin: "10px 0 5px" }}>No Data Available</h3>

      <p style={{ margin: 0 }}>
        Data will appear here once available.
      </p>
    </div>
  );
}