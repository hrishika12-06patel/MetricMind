export default function SortingDropdown() {
  return (
    <select
      style={{
        background: "#ffffff",
        color: "#374151",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "16px",
        padding: "14px 18px",
        minWidth: "220px",
        fontSize: "15px",
        fontWeight: 500,
        cursor: "pointer",
        outline: "none",
        boxShadow: "0 8px 20px rgba(0,0,0,.05)",
        transition: "all .25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 12px 25px rgba(124,58,237,.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 8px 20px rgba(0,0,0,.05)";
      }}
    >
      <option>↕ Sort By</option>
      <option>Sales (High → Low)</option>
      <option>Sales (Low → High)</option>
      <option>Profit</option>
      <option>Orders</option>
    </select>
  );
}