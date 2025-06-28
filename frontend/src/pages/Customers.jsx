import React from "react";
import api from "../utils/api";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Spinner,
  Chip,
} from "@heroui/react";
import { motion } from "framer-motion";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "INDUSTRY", uid: "industry", sortable: true },
  { name: "CONTACTS", uid: "contacts" },
  { name: "CREATED AT", uid: "created_at", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "industry",
  "contacts",
  "created_at",
  "actions",
];

export default function Customers() {
  const [customers, setCustomers] = React.useState([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  // Form state
  const [form, setForm] = React.useState({
    name: "",
    industry: "",
  });
  const [formError, setFormError] = React.useState(null);
  const [formLoading, setFormLoading] = React.useState(false);
  const [formSuccess, setFormSuccess] = React.useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/clients/clients/");
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/clients/clients/${id}/`);
      fetchCustomers();
    } catch (err) {
      console.error("Failed to delete client:", err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const filteredItems = React.useMemo(() => {
    if (!filterValue) return customers;
    const lower = filterValue.toLowerCase();
    return customers.filter(
      (client) =>
        client.name.toLowerCase().includes(lower) ||
        client.industry?.toLowerCase().includes(lower)
    );
  }, [filterValue, customers]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, rowsPerPage, filteredItems]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const col = sortDescriptor.column;
      const first = a[col];
      const second = b[col];
      if (first === undefined || first === null) return 1;
      if (second === undefined || second === null) return -1;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [items, sortDescriptor]);

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "contacts":
        return (
          <div className="flex flex-col gap-1">
            {item.contacts?.map((contact) => (
              <Chip key={contact.id || contact.name} size="sm" color="primary">
                {contact.name || contact}
              </Chip>
            )) || <span>-</span>}
          </div>
        );
      case "created_at":
        return item.created_at ? formatDate(item.created_at) : "-";
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light" aria-label="Actions">
                ⋮
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="view">View</DropdownItem>
              <DropdownItem key="edit">Edit</DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return item[columnKey] || "-";
    }
  };

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((col) =>
      Array.from(visibleColumns).includes(col.uid)
    );
  }, [visibleColumns]);

  // Form handlers
  const handleFormChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.industry.trim()) return "Industry is required";
    return null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      setFormSuccess(null);
      return;
    }
    setFormError(null);
    setFormLoading(true);
    try {
      await api.post("/clients/clients/", {
        name: form.name.trim(),
        industry: form.industry.trim(),
      });

      setFormSuccess("Client added successfully!");
      setForm({
        name: "",
        industry: "",
      });

      fetchCustomers();
    } catch (err) {
      setFormError(
        err.response?.data?.detail ||
          "Failed to add client. Please try again."
      );
      setFormSuccess(null);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 w-full min-h-screen"
    >
      {/* Add Client Form */}
      <form
        onSubmit={handleFormSubmit}
        className="mb-8 bg-white p-6 rounded shadow-md max-w-full"
        aria-label="Add new client form"
      >
        <h2 className="text-2xl font-semibold mb-6">Add New Client</h2>

        {formError && (
          <div className="mb-4 text-danger font-semibold">{formError}</div>
        )}
        {formSuccess && (
          <div className="mb-4 text-success font-semibold">{formSuccess}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Name"
            placeholder="Client Name"
            value={form.name}
            onValueChange={handleFormChange("name")}
            required
            size="md"
          />
          <Input
            label="Industry"
            placeholder="Industry"
            value={form.industry}
            onValueChange={handleFormChange("industry")}
            required
            size="md"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            color="primary"
            type="submit"
            isLoading={formLoading}
            disabled={formLoading}
          >
            Add Client
          </Button>
        </div>
      </form>

      {/* Filter + Table */}
      <div className="flex justify-between items-center mb-4">
        <Input
          isClearable
          placeholder="Search by name or industry..."
          value={filterValue}
          onValueChange={setFilterValue}
          size="sm"
          className="flex-grow mr-4"
        />
      </div>

      {error ? (
        <div className="text-danger text-center">{error}</div>
      ) : (
        <Table
          isHeaderSticky
          bottomContent={
            <div className="flex justify-center">
              <Pagination
                isCompact
                showControls
                page={page}
                total={pages}
                onChange={setPage}
              />
            </div>
          }
          classNames={{ wrapper: "min-h-[400px]" }}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
                onSortChange={(direction) =>
                  setSortDescriptor({ column: column.uid, direction })
                }
                sortDirection={
                  sortDescriptor.column === column.uid
                    ? sortDescriptor.direction
                    : undefined
                }
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={sortedItems}
            isLoading={loading}
            loadingContent={<Spinner />}
            emptyContent={!loading && "No clients found"}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </motion.div>
  );
}