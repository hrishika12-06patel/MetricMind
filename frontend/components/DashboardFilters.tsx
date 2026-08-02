export default function DashboardFilters() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "20px",
        marginBottom: "25px",
      }}
    >
      {/* Left Side */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          flex: 1,
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          style={{
            width: "280px",
            height: "46px",
            padding: "0 16px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            backgroundColor: "#ffffff",
            color: "#111827",
            fontSize: "15px",
            fontWeight: "500",
            outline: "none",
          }}
        />

        {/* Region */}
        <select
          style={{
            width: "140px",
            height: "46px",
            padding: "0 12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            backgroundColor: "#ffffff",
            color: "#111827",
            fontSize: "15px",
            fontWeight: "500",
            cursor: "pointer",
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Region
          </option>
          <option>East</option>
          <option>West</option>
          <option>South</option>
          <option>Central</option>
        </select>

        {/* Category */}
        <select
          style={{
            width: "150px",
            height: "46px",
            padding: "0 12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            backgroundColor: "#ffffff",
            color: "#111827",
            fontSize: "15px",
            fontWeight: "500",
            cursor: "pointer",
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Category
          </option>
          <option>Furniture</option>
          <option>Technology</option>
          <option>Office Supplies</option>
        </select>

        {/* Segment */}
        <select
          style={{
            width: "150px",
            height: "46px",
            padding: "0 12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            backgroundColor: "#ffffff",
            color: "#111827",
            fontSize: "15px",
            fontWeight: "500",
            cursor: "pointer",
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Segment
          </option>
          <option>Consumer</option>
          <option>Corporate</option>
          <option>Home Office</option>
        </select>
      </div>
    </div>
  );
}