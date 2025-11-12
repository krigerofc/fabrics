"use client";
import { useState } from "react";

export default function TestApiPage() {
  const [result, setResult] = useState("");

  const testGetAll = async () => {
    try {
      const response = await fetch("/api/backend/batch/get_all");
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(JSON.stringify(error, null, 2));
    }
  };

  const testCreate = async () => {
    try {
      const response = await fetch("/api/backend/batch/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "New Batch " + Date.now(),
          quantityOfProducts: 100,
          batchNumber: "B" + Date.now(),
        }),
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(JSON.stringify(error, null, 2));
    }
  };

  const testUpdate = async () => {
    try {
        // First, create a batch to update
        const createResponse = await fetch("/api/backend/batch/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Batch to Update",
                quantityOfProducts: 50,
                batchNumber: "BU" + Date.now(),
            }),
        });
        const createData = await createResponse.json();
        const batchId = createData.id;

        if (!batchId) {
            setResult("Failed to create batch for updating.");
            return;
        }

      const response = await fetch(`/api/backend/batch/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: batchId,
          name: "Updated Batch Name",
          quantityOfProducts: 150,
        }),
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(JSON.stringify(error, null, 2));
    }
  };

  const testDelete = async () => {
    try {
        // First, create a batch to delete
        const createResponse = await fetch("/api/backend/batch/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Batch to Delete",
                quantityOfProducts: 10,
                batchNumber: "BD" + Date.now(),
            }),
        });
        const createData = await createResponse.json();
        const batchId = createData.id;

        if (!batchId) {
            setResult("Failed to create batch for deletion.");
            return;
        }

      const response = await fetch(`/api/backend/batch/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: batchId }),
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(JSON.stringify(error, null, 2));
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>API Test Page</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={testGetAll}>Get All Batches</button>
        <button onClick={testCreate}>Create Batch</button>
        <button onClick={testUpdate}>Update Batch</button>
        <button onClick={testDelete}>Delete Batch</button>
      </div>
      <h2>Result:</h2>
      <pre
        style={{
          backgroundColor: "#f0f0f0",
          padding: "10px",
          borderRadius: "5px",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        {result}
      </pre>
    </div>
  );
}
