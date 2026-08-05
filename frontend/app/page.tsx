"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  const pages = [
    {
      title: "Dashboard",
      icon: "📊",
      description: "Monitor KPIs and business performance in one place.",
      href: "/dashboard",
    },
    {
      title: "Sales",
      icon: "💰",
      description: "Analyze revenue, profit and sales trends.",
      href: "/sales",
    },
    {
      title: "Orders",
      icon: "📦",
      description: "Track customer orders and order activity.",
      href: "/orders",
    },
    {
      title: "Reports",
      icon: "📈",
      description: "View and manage business reports.",
      href: "/reports",
    },
  ];

  return (
    <>
      <Navbar />

      <main
       style={{
        background: "linear-gradient(to bottom, #F8FAFC 0%, #EEF2FF 100%)",
        minHeight: "100vh",
        padding: "80px 40px",
       }}
      >
        <section
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "54px",
              fontWeight: "800",
              color: "#52465A",
              marginBottom: "18px",
            }}
          >
            MetricMind
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#64748B",
              maxWidth: "720px",
              margin: "0 auto 60px",
              lineHeight: "34px",
              fontWeight: "400"
            }}
          >
            Enterprise Analytics Platform for monitoring sales, orders,
            business performance and reports through a clean and modern
            dashboard.
          </p>

          <Link
            href="/dashboard"
            style={{
              display: "inline-block",
              background: "#794d6c",
              color: "#fff",
              padding: "14px 30px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "600",
              marginBottom: "60px",
            }}
          >
            Go to Dashboard →
          </Link>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: "24px",
            }}
          >
            {pages.map((page) => (
              <Link
                key={page.title}
                href={page.href}
                style={{
                  textDecoration: "none",
                  color: "#111827",
                  display: "block",
                }}
              >
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "18px",
                    padding: "30px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 15px 40px rgba(15,23,42,0.08)",
                    transition: "0.3s",
                    cursor: "pointer",
                    transform: "translateY(0)",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      fontSize: "52px",
                      marginBottom: "20px",
                    }}
                  >
                    {page.icon}
                  </div>

                  <h2
                    style={{
                      marginBottom: "14px",
                      fontSize: "28px",
                      fontWeight: "700",
                      color: "#404e62"
                    }}
                  >
                    {page.title}
                  </h2>

                  <p
                    style={{
                      color: "#5e697d",
                      lineHeight: "30px",
                    }}
                  >
                    {page.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}