import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Input, Button, Select, SelectItem, Spinner } from "@heroui/react";

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Inactive", uid: "inactive" },
];

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEmployee() {
      setLoading(true);
      try {
        const res = await api.get(`/humanRS/employees/${id}/`);
        setEmployee({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          status: res.data.status?.toLowerCase() || "active",
        });
      } catch (err) {
        setError("Failed to load employee");
      } finally {
        setLoading(false);
      }
    }
    fetchEmployee();
  }, [id]);

  const handleChange = (field, value) => {
    setEmployee((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put(`/humanRS/employees/${id}/`, {
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone,
        status: employee.status,
      });
      navigate(`/employees/${id}`);
    } catch (err) {
      setError("Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading..." />;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Button onClick={() => navigate(-1)} variant="light" size="sm" className="mb-4">
        ← Back
      </Button>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="First Name"
          value={employee.first_name}
          onValueChange={(v) => handleChange("first_name", v)}
          required
        />
        <Input
          label="Last Name"
          value={employee.last_name}
          onValueChange={(v) => handleChange("last_name", v)}
          required
        />
        <Input
          type="email"
          label="Email"
          value={employee.email}
          onValueChange={(v) => handleChange("email", v)}
          required
        />
        <Input label="Phone" value={employee.phone} onValueChange={(v) => handleChange("phone", v)} />
        <Select label="Status" value={employee.status} onValueChange={(v) => handleChange("status", v)} required>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.uid} value={opt.uid}>
              {opt.name}
            </SelectItem>
          ))}
        </Select>
        <Button type="submit" color="primary" isDisabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}
