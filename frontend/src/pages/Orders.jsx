import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  Spinner,
  Card,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function OrdersListPage() {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [showForm, setShowForm] = useState(false);
  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchClients();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/products/orders/");
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients/clients/");
      setClients(res.data);
    } catch (err) {
      console.error("Failed to load clients", err);
    }
  };

  const normalizedSearch = search.toLowerCase();

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(normalizedSearch) ||
      (order.client_name && order.client_name.toLowerCase().includes(normalizedSearch))
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientId || !status || !orderDate) {
      alert("Please fill all fields");
      return;
    }

    setLoadingForm(true);

    try {
      // Assure-toi ici que clientId est bien un simple id (string ou number)
      await api.post("/products/orders/", {
        client: clientId,
        status,
        order_date: orderDate,
      });
      setShowForm(false);
      setClientId("");
      setStatus("");
      setOrderDate("");
      fetchOrders();
    } catch (err) {
      console.error("Failed to create order", err);
      alert("Failed to create order");
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search by Order ID or Client"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-64"
          />
          <Button
            color={showForm ? "danger" : "primary"}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "Add Order"}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="p-4 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 items-end">
            <Select
              label="Client"
              value={clientId}
              onChange={(val) => {
                setClientId(val); // val est l'id sélectionné (string/number)
              }}
              required
              placeholder="Select client"
            >
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
            <Input
              label="Order Date"
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              required
            />
            <div>
              <Button type="submit" isLoading={loadingForm} color="primary">
                Create
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-8">{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8">No orders found</div>
        ) : (
          <>
            <Table isStriped>
              <TableHeader>
                <TableColumn>Order ID</TableColumn>
                <TableColumn>Client</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Order Date</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.client_name || order.client}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{formatDate(order.order_date)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-center mt-4">
              <Pagination
                page={currentPage}
                total={Math.ceil(filteredOrders.length / pageSize)}
                onChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
