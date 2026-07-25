export default function DashboardFilters() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "20px",
        marginBottom: "25px",
      }}
    >
      {/* Search Box */}
      <input
        type="text"
        placeholder="Search..."
        style={{
          flex: "1",
          minWidth: "220px",
          padding: "10px 14px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          outline: "none",
          fontSize: "14px",
        }}
      />

      {/* Region */}
      <select
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
        }}
      >
        <option>Region</option>
        <option>North</option>
        <option>South</option>
        <option>East</option>
        <option>West</option>
      </select>

      {/* Category */}
      <select
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
        }}
      >
        <option>Category</option>
        <option>Electronics</option>
        <option>Fashion</option>
        <option>Home</option>
        <option>Sports</option>
      </select>

      {/* Segment */}
      <select
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
        }}
      >
        <option>Segment</option>
        <option>Consumer</option>
        <option>Corporate</option>
        <option>Home Office</option>
      </select>
    </div>
  );
}