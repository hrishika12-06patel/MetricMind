import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main
        style={{
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h1>Welcome to MetricMind</h1>

        <p>
          This is the homepage of the MetricMind project.
        </p>
      </main>
    </>
  );
}