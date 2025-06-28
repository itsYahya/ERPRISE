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

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    setError(null);
    try {
      const res = await api.get("/humanRS/job/");
      setJobs(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/humanRS/job/${id}/`);
      fetchJobs();
    } catch {
      // Silent fail, no toast
    }
  };

  const displayedJobs = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return jobs.slice(start, end);
  }, [page, jobs]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    try {
      await api.post("/humanRS/job/", {
        title,
        description,
      });
      setTitle("");
      setDescription("");
      setShowAddForm(false);
      fetchJobs();
    } catch {
      // Silent fail, no toast
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Button onClick={() => setShowAddForm((v) => !v)} color={showAddForm ? "danger" : "primary"}>
          {showAddForm ? "Cancel" : "Add Job"}
        </Button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="mb-8 max-w-md border rounded p-4 shadow-sm">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
        isLoading={loadingJobs}
        loadingContent={<Spinner />}
        emptyContent={!loadingJobs && "No jobs found"}
        classNames={{ wrapper: "min-h-[300px]" }}
      >
        <TableHeader columns={[{ name: "ID", uid: "id" }, { name: "Title", uid: "title" }, { name: "Description", uid: "description" }, { name: "Actions", uid: "actions" }]}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={displayedJobs}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.title}</TableCell>
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
        <Pagination page={page} total={Math.ceil(jobs.length / rowsPerPage) || 1} onChange={setPage} />
      </div>
    </motion.div>
  );
}
