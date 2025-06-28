import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Button, Chip, User, Spinner } from "@heroui/react";

const statusColorMap = {
  active: "success",
  inactive: "danger",
};

export default function ViewEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEmployee() {
      setLoading(true);
      try {
        const res = await api.get(`/humanRS/employees/${id}/`);
        const emp = res.data;
        setEmployee({
          ...emp,
          name: `${emp.first_name} ${emp.last_name}`,
          avatar: emp.photo,
          status: emp.status.toLowerCase(),
        });
      } catch (err) {
        setError("Failed to load employee");
      } finally {
        setLoading(false);
      }
    }
    fetchEmployee();
  }, [id]);

  if (loading) return <Spinner label="Loading..." />;
  if (error) return <div className="text-danger">{error}</div>;
  if (!employee) return null;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Button
        onClick={() => navigate(-1)}
        variant="light"
        size="sm"
        className="mb-4"
      >
        ← Back
      </Button>
      <User
        avatarProps={{ src: employee.avatar, radius: "lg" }}
        name={employee.name}
        description={employee.email}
      />
      <div className="mt-6 space-y-2">
        <p>
          <strong>Phone:</strong> {employee.phone || "N/A"}
        </p>
        <p>
          <strong>Department:</strong> {employee.department || "N/A"}
        </p>
        <p>
          <strong>Job:</strong> {employee.job || "N/A"}
        </p>
        <p>
          <strong>Hire Date:</strong> {employee.hire_date || "N/A"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <Chip
            color={statusColorMap[employee.status] || "default"}
            size="sm"
            variant="flat"
            className="capitalize"
          >
            {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
          </Chip>
        </p>
      </div>
      <Button
        onClick={() => navigate(`/employees/${id}/edit`)}
        color="primary"
        className="mt-6"
      >
        Edit Employee
      </Button>
    </div>
  );
}
