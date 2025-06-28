import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Input, Button, Spinner } from "@heroui/react";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/humanRS/product/${id}/`);
        setProduct(res.data);
      } catch {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put(`/humanRS/product/${id}/`, product);
      navigate("/Products");
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner className="m-auto" />;

  if (!product) return <p className="text-center text-danger">Product not found.</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Edit Product</h1>
      {error && <p className="text-danger mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          value={product.name || ""}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          required
          disabled={saving}
        />
        <Input
          label="Description"
          value={product.description || ""}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
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
