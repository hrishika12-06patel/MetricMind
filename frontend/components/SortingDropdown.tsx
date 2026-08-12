export default function SortingDropdown({
  sortBy,
  order,
  setSortBy,
  setOrder,
}: {
  sortBy: string;
  order: string;
  setSortBy: (value: string) => void;
  setOrder: (value: string) => void;
}) {
  const handleChange = (value: string) => {
    if (value === "") {
      setSortBy("");
      return;
    }

    const [field, direction] = value.split("-");

    setSortBy(field);
    setOrder(direction);
  };

  return (
    <select
      value={sortBy ? `${sortBy}-${order}` : ""}
      onChange={(e) => handleChange(e.target.value)}
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
      }}
    >
      <option value="">↕ Sort By</option>
      <option value="Sales-desc">Sales (High → Low)</option>
      <option value="Sales-asc">Sales (Low → High)</option>
      <option value="Profit-desc">Profit (High → Low)</option>
      <option value="Profit-asc">Profit (Low → High)</option>
      <option value="Region-asc">Region (A → Z)</option>
      <option value="Category-asc">Category (A → Z)</option>
    </select>
  );
}