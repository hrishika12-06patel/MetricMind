"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/orders")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />

      <main style={{ padding: "30px" }}>
        <h1>MetricMind</h1>

        {loading && <p>Loading...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <table border={1} cellPadding={10}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Sales</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 10).map((order: any, index) => (
                <tr key={index}>
                  <td>{order["Order.ID"]}</td>
                  <td>{order["Customer.Name"]}</td>
                  <td>{order["Product.Name"]}</td>
                  <td>{order["Sales"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}