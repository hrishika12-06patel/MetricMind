export default function LoadingSkeleton() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        background:
          "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
        backgroundSize: "200% 100%",
        animation: "loading 1.5s infinite",
      }}
    >
      <style>{`
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}