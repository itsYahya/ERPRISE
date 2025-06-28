import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Input, Button, Spinner } from "@heroui/react";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/humanRS/job/${id}/`);
        setJob(res.data);
      } catch {
        setError("Failed to load job.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put(`/humanRS/job/${id}/`, job);
      navigate("/jobs");
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner className="m-auto" />;

  if (!job) return <p className="text-center text-danger">Job not found.</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Edit Job</h1>
      {error && <p className="text-danger mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <Input
          label="Title"
          value={job.title || ""}
          onChange={(e) => setJob({ ...job, title: e.target.value })}
          required
          disabled={saving}
        />
        <Input
          label="Description"
          value={job.description || ""}
          onChange={(e) => setJob({ ...job, description: e.target.value })}
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
