import React, { useState, useEffect, useMemo } from "react";
import api from "../utils/api";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Pagination,
  Input,
  Spinner,
} from "@heroui/react";
import { motion } from "framer-motion";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);

  const fetchSuppliers = async () => {
    setLoadingSuppliers(true);
    setError(null);
    try {
      const res = await api.get("/humanRS/department/");
      setSuppliers(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch suppliers");
    } finally {
      setLoadingSuppliers(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await api.delete(`/humanRS/department/${id}/`);
      fetchSuppliers();
    } catch {
      // Silent fail, no toast
    }
  };

  const displayedSuppliers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return suppliers.slice(start, end);
  }, [page, suppliers]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    try {
      await api.post("/humanRS/department/", {
        name,
        description,
      });
      setName("");
      setDescription("");
      setShowAddForm(false);
      fetchSuppliers();
    } catch {
      // Silent fail, no toast
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Button onClick={() => setShowAddForm((v) => !v)} color={showAddForm ? "danger" : "primary"}>
          {showAddForm ? "Cancel" : "Add Department"}
        </Button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="mb-8 max-w-md border rounded p-4 shadow-sm">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loadingForm}
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loadingForm}
            className="mt-4"
          />
          <Button type="submit" color="primary" isLoading={loadingForm} className="mt-4">
            Submit
          </Button>
        </form>
      )}

      {error && <p className="text-danger mb-4">{error}</p>}

      <Table
        isHeaderSticky
        isLoading={loadingSuppliers}
        loadingContent={<Spinner />}
        emptyContent={!loadingSuppliers && "No suppliers found"}
        classNames={{ wrapper: "min-h-[300px]" }}
      >
        <TableHeader columns={[{ name: "ID", uid: "id" }, { name: "Name", uid: "name" }, { name: "Description", uid: "description" }, { name: "Actions", uid: "actions" }]}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={displayedSuppliers}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description || "-"}</TableCell>
              <TableCell>
                <div className="flex gap-2 justify-center">
                  <Button size="sm" color="danger" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-4">
        <Pagination page={page} total={Math.ceil(suppliers.length / rowsPerPage) || 1} onChange={setPage} />
      </div>
    </motion.div>
  );
}