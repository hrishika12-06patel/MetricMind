export default function DashboardFilters({
  region,
  category,
  segment,
  setRegion,
  setCategory,
  setSegment,
}: {
  region: string;
  category: string;
  segment: string;
  setRegion: (value: string) => void;
  setCategory: (value: string) => void;
  setSegment: (value: string) => void;
}) {
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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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

        >
          <option value="">Region</option>
          <option>East</option>
          <option>West</option>
          <option>South</option>
          <option>Central</option>
        </select>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
        
        >
          <option value="">Category</option>
          <option>Furniture</option>
          <option>Technology</option>
          <option>Office Supplies</option>
        </select>

        {/* Segment */}
        <select
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
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
        
        >
          <option value="">Segment</option>
          <option>Consumer</option>
          <option>Corporate</option>
          <option>Home Office</option>
        </select>
      </div>
    </div>
  );
}