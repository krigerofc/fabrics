"use client";
import { useState, useEffect } from "react";

export default function BatchPage() {
  const [batches, setBatches] = useState([]);
  const [name, setName] = useState("");
  const [quantityOfProducts, setQuantityOfProducts] = useState(0);
  const [batchNumber, setBatchNumber] = useState("");
  const [userId, setUserId] = useState(""); // You should get this from your auth system

  useEffect(() => {
    // Fetch batches
    const fetchBatches = async () => {
      const res = await fetch("/api/backend/batch/get_all");
      const data = await res.json();
      setBatches(data);
    };
    fetchBatches();
  }, []);

  const handleCreateBatch = async () => {
    const res = await fetch("/api/backend/batch/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        quantityOfProducts,
        batchNumber,
        userId,
      }),
    });
    const data = await res.json();
    setBatches([...batches, data]);
  };

  return (
    <div>
      <h1>Batches</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity of Products"
          value={quantityOfProducts}
          onChange={(e) => setQuantityOfProducts(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Batch Number"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
        />
        <button onClick={handleCreateBatch}>Create Batch</button>
      </div>
      <ul>
        {batches.map((batch: any) => (
          <li key={batch.id}>
            {batch.name} - {batch.batchNumber}
          </li>
        ))}
      </ul>
    </div>
  );
}