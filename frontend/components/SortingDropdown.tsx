export default function SortingDropdown() {
  return (
    <select
      style={{
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        background: "white",
        width: "160px",
        cursor: "pointer",
      }}
    >
      <option>Sort By</option>
      <option>Sales (High → Low)</option>
      <option>Sales (Low → High)</option>
      <option>Profit</option>
      <option>Orders</option>
    </select>
  );
}