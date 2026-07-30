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
          padding: "12px 16px",
          fontSize: "15px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          background: "#ffffff",
          outline: "none",
          width: "220px",
          height: "44px",
        }}
      />

      {/* Region */}
      <select
        style={{
          padding: "12px 16px",
          fontSize: "15px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          background: "#ffffff",
          cursor: "pointer",
          height: "44px",
          minWidth: "120px",
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
          padding: "12px 16px",
          fontSize: "15px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          background: "#ffffff",
          cursor: "pointer",
          height: "44px",
          minWidth: "120px",
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
          padding: "12px 16px",
          fontSize: "15px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          background: "#ffffff",
          cursor: "pointer",
          height: "44px",
          minWidth: "120px",
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