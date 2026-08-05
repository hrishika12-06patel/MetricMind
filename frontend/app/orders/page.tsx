"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("http://127.0.0.1:8000/orders");

        const data = await response.json();

        if (data.success) {
          setOrders(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Unable to fetch orders.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return <h2 style={{ padding: "40px" }}>
      <div
        style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "24px",
        color: "#0F766E",
        }}
      >
         Loading Orders...
      </div>
      </h2>;
  }

  if (error) {
    return <h2 style={{ padding: "40px", color: "red" }}>{error}</h2>;
  }

  if (orders.length === 0) {
    return <h2 style={{ padding: "40px" }}>No Orders Found.</h2>;
  }

  return (
    <div style={{ padding: "40px",
      background: "#F8FAFC",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
    }}
    >
    
      <div
  style={{
    marginBottom: "30px",
  }}
>
  <h1
    style={{
      fontSize: "36px",
      color: "#0F766E",
      marginBottom: "8px",
    }}
  >
    📦 Orders
  </h1>

  <p
    style={{
      color: "#6B7280",
      fontSize: "16px",
    }}
  >
    Manage and track customer orders efficiently.
  </p>
</div>

      <br />

      <div
  style={{
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "25px",
  }}
>
  <input
    type="text"
    placeholder="🔍 Search Orders..."
    style={{
      padding: "10px",
      width: "300px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    }}
  />

  <button>Search</button>

  <button>Filter</button>

  <button>Sort</button>
</div>

<div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "25px",
  }}
>
  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      flex: 1,
    }}
  >
    <h3>Total Orders</h3>
    <h2>{orders.length}</h2>
  </div>

  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      flex: 1,
    }}
  >
    <h3>Total Sales</h3>
    <h2>₹ --</h2>
  </div>

  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      flex: 1,
    }}
  >
    <h3>Total Profit</h3>
    <h2>₹ --</h2>
  </div>
</div>

      <br />
      <br />

      <div style={{ overflowX: "auto" }}>
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            padding: "20px",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead
              style={{
                background: "#0F766E",
                color: "white",
                textAlign: "left",
              }}>
              <tr>
                <th style={{ padding: "15px" }}>Order ID</th>
                <th style={{ padding: "15px" }}>Customer</th>
                <th style={{ padding: "15px" }}>Product</th>
                <th style={{ padding: "15px" }}>Category</th>
                <th style={{ padding: "15px" }}>Region</th>
                <th style={{ padding: "15px" }}>Sales</th>
                <th style={{ padding: "15px" }}>Profit</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order: any, index: number) => (
                <tr key={index}>
                  <td 
                    style={{
                     padding: "12px",
                      textAlign: "center",
                    }}
                    >
                      {order["Order.ID"]}
                  </td>
                  <td 
                    style={{ 
                      padding: "12px",
                      textAlign: "center", 
                    }}
                  >
                    {order["Customer.Name"]}
                  </td>
                  <td 
                    style={{ 
                      padding: "12px" ,
                      textAlign: "center",
                    }}
                  >
                    {order["Product.Name"]}
                  </td>
                  <td 
                    style={{ 
                      padding: "12px", 
                      textAlign: "center"
                     }}
                  >
                    {order["Category"]}
                  </td>
                  <td 
                    style={{ 
                      padding: "12px", 
                      textAlign: "center" 
                    }}
                  >
                    {order["Region"]}
                  </td>
                  <td 
                    style={{ 
                      padding: "12px", 
                      textAlign: "center" , 
                      color: "#059669", 
                      fontWeight: "bold" 
                    }}
                  >
                    {order["Sales"]}
                  </td>
                  <td 
                    style={{ 
                      padding: "12px", 
                      textAlign: "center" 
                    }}
                  >
                    {order["Profit"]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}