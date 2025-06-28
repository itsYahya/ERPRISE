import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Input, Button, Spinner } from "@heroui/react";

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/humanRS/order/${id}/`);
        setOrder(res.data);
      } catch {
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put(`/humanRS/order/${id}/`, order);
      navigate("/Orders");
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner className="m-auto" />;

  if (!order) return <p className="text-center text-danger">Order not found.</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Edit Order</h1>
      {error && <p className="text-danger mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          value={order.name || ""}
          onChange={(e) => setOrder({ ...order, name: e.target.value })}
          required
          disabled={saving}
        />
        <Input
          label="Description"
          value={order.description || ""}
          onChange={(e) => setOrder({ ...order, description: e.target.value })}
          disabled={saving}
          className="mt-4"
        />
        <Button type="submit" color="primary" isLoading={saving} className="mt-4" disabled={saving}>
          Save
        </Button>
      </form>
    </div>
  );
}
