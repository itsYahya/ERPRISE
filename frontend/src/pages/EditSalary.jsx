import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Input, Button, Spinner } from "@heroui/react";

export default function EditSalary() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalary = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/humanRS/salary/${id}/`);
        setSalary(res.data);
      } catch {
        setError("Failed to load salary.");
      } finally {
        setLoading(false);
      }
    };
    fetchSalary();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put(`/humanRS/salary/${id}/`, salary);
      navigate("/salaries");
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner className="m-auto" />;

  if (!salary) return <p className="text-center text-danger">Salary not found.</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Edit Salary</h1>
      {error && <p className="text-danger mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <Input
          label="Employee ID"
          value={salary.employee || ""}
          onChange={(e) => setSalary({ ...salary, employee: e.target.value })}
          required
          disabled={saving}
        />
        <Input
          label="Amount"
          type="number"
          value={salary.amount || ""}
          onChange={(e) => setSalary({ ...salary, amount: e.target.value })}
          required
          disabled={saving}
          className="mt-4"
        />
        <Input
          label="Date"
          type="date"
          value={salary.date || ""}
          onChange={(e) => setSalary({ ...salary, date: e.target.value })}
          required
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