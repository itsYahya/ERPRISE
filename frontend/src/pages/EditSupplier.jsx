import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Input, Button, Spinner } from "@heroui/react";

export default function EditSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/humanRS/supplier/${id}/`);
        setSupplier(res.data);
      } catch {
        setError("Failed to load supplier.");
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put(`/humanRS/supplier/${id}/`, supplier);
      navigate("/Suppliers");
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner className="m-auto" />;

  if (!supplier) return <p className="text-center text-danger">Supplier not found.</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Edit Supplier</h1>
      {error && <p className="text-danger mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          value={supplier.name || ""}
          onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
          required
          disabled={saving}
        />
        <Input
          label="Description"
          value={supplier.description || ""}
          onChange={(e) => setSupplier({ ...supplier, description: e.target.value })}
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
