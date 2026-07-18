import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

<main
  style={{
    minHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
  }}
>
  <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
    MetricMind
  </h1>

  <p
    style={{
      fontSize: "20px",
      maxWidth: "700px",
      marginBottom: "30px",
    }}
  >
    AI-powered Semantic Business Intelligence Engine that helps users
    ask business questions and receive accurate insights.
  </p>

  <button
    style={{
      backgroundColor: "#2563eb",
      color: "white",
      padding: "15px 30px",
      border: "none",
      borderRadius: "8px",
      fontSize: "18px",
      cursor: "pointer",
    }}
  >
    Ask a Business Question
  </button>
</main>
    </>
  );
}