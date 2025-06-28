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
  Select,
  SelectItem,
} from "@heroui/react";
import { motion } from "framer-motion";

export default function Salaries() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingSalaries, setLoadingSalaries] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Form states
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch salaries
  const fetchSalaries = async () => {
    setLoadingSalaries(true);
    setError(null);
    try {
      const res = await api.get("/humanRS/salary/");
      setSalaries(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch salaries");
    } finally {
      setLoadingSalaries(false);
    }
  };

  // Fetch employees for the dropdown
  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const res = await api.get("/humanRS/employees/");
      setEmployees(res.data);
    } catch {
      // Silent fail
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salary?")) return;
    try {
      await api.delete(`/humanRS/salary/${id}/`);
      fetchSalaries();
    } catch {
      // Silent fail
    }
  };

  const displayedSalaries = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return salaries.slice(start, end);
  }, [page, salaries]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) return; // Prevent submission without selecting employee

    setLoadingForm(true);
    try {
      await api.post("/humanRS/salary/", {
        employee: selectedEmployeeId,
        amount,
        effective_date: date,
      });
      setSelectedEmployeeId("");
      setAmount("");
      setDate("");
      setShowAddForm(false);
      fetchSalaries();
    } catch {
      // Silent fail
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Salaries</h1>
        <Button
          onClick={() => setShowAddForm((v) => !v)}
          color={showAddForm ? "danger" : "primary"}
        >
          {showAddForm ? "Cancel" : "Add Salary"}
        </Button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="mb-8 max-w-md border rounded p-4 shadow-sm"
        >
          <label htmlFor="employeeSelect" className="mb-1 block font-semibold">
            Employee
          </label>
          <Select
            id="employeeSelect"
            aria-label="Select Employee"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            disabled={loadingForm || loadingEmployees}
            required
            className="mb-4"
          >
            <SelectItem key="" value="" disabled>
              -- Select Employee --
            </SelectItem>
            {employees.map((emp) => (
              <SelectItem key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            disabled={loadingForm}
          />
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={loadingForm}
            className="mt-4"
          />
          <Button
            type="submit"
            color="primary"
            isLoading={loadingForm}
            className="mt-4"
          >
            Submit
          </Button>
        </form>
      )}

      {error && <p className="text-danger mb-4">{error}</p>}

      <Table
        isHeaderSticky
        isLoading={loadingSalaries}
        loadingContent={<Spinner />}
        emptyContent={!loadingSalaries && "No salaries found"}
        classNames={{ wrapper: "min-h-[300px]" }}
      >
        <TableHeader
          columns={[
            { name: "ID", uid: "id" },
            { name: "Employee", uid: "employee" },
            { name: "Amount", uid: "amount" },
            { name: "Date", uid: "date" },
            { name: "Actions", uid: "actions" },
          ]}
        >
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={displayedSalaries}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                {(() => {
                  if (
                    typeof item.employee === "object" &&
                    item.employee !== null
                  ) {
                    return `${item.employee.first_name} ${item.employee.last_name}`;
                  }
                  // fallback: find employee in the list by id if item.employee is ID
                  const emp = employees.find((e) => e.id == item.employee);
                  return emp
                    ? `${emp.first_name} ${emp.last_name}`
                    : item.employee;
                })()}
              </TableCell>

              <TableCell>{item.amount}</TableCell>
              <TableCell>{item.effective_date}</TableCell>
              <TableCell>
                <Button color="danger" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-4">
        <Pagination
          page={page}
          total={Math.ceil(salaries.length / rowsPerPage) || 1}
          onChange={setPage}
        />
      </div>
    </motion.div>
  );
}
