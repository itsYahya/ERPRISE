import React, { useState, useEffect, useMemo } from "react";
import api from "../utils/api";
import {
  Input,
  Button,
  Pagination,
  Spinner,
  Card,
} from "@heroui/react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [name, setName] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    setError(null);
    try {
      const res = await api.get("/humanRS/department/");
      setDepartments(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch departments");
    } finally {
      setLoadingDepartments(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await api.delete(`/humanRS/department/${id}/`);
      fetchDepartments();
    } catch {
      alert("Failed to delete department");
    }
  };

  const handleEdit = (department) => {
    setEditingId(department.id);
    setName(department.name);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setName("");
    setShowForm((prev) => !prev);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Department name cannot be empty");
      return;
    }
    setLoadingForm(true);
    try {
      if (editingId) {
        await api.put(`/humanRS/department/${editingId}/`, { name });
      } else {
        await api.post("/humanRS/department/", { name });
      }
      setName("");
      setEditingId(null);
      setShowForm(false);
      fetchDepartments();
    } catch {
      alert("Failed to submit department");
    } finally {
      setLoadingForm(false);
    }
  };

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedDepartments = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [page, filtered]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Departments</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleAddClick} color={showForm ? "danger" : "primary"}>
            {showForm ? "Cancel" : "Add Department"}
          </Button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="mb-8 max-w-md border rounded p-4 shadow-sm">
          <Input
            label="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loadingForm}
          />
          <Button type="submit" color="primary" isLoading={loadingForm} className="mt-4">
            {editingId ? "Update" : "Submit"}
          </Button>
        </form>
      )}

      {error && <p className="text-danger mb-4">{error}</p>}

      {loadingDepartments ? (
        <div className="flex justify-center mt-8">
          <Spinner />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedDepartments.map((dept) => (
            <Card key={dept.id} className="p-4 flex flex-col justify-between shadow-md border">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">#{dept.id}</h2>
                <p className="text-xl font-bold">{dept.name}</p>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button size="sm" color="warning" onClick={() => handleEdit(dept)}>
                  <FaEdit className="mr-1" /> Edit
                </Button>
                <Button size="sm" color="danger" onClick={() => handleDelete(dept.id)}>
                  <FaTrash className="mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6">
        <Pagination
          page={page}
          total={Math.ceil(filtered.length / rowsPerPage) || 1}
          onChange={setPage}
        />
      </div>
    </motion.div>
  );
}
