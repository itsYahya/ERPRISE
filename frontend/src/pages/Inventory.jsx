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
  Tooltip,
  Select,
  SelectItem,
} from "@heroui/react";
import { motion } from "framer-motion";

// Icônes Delete et Edit (inchangées)
const DeleteIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 20 20" width="1em" height="1em">
    <path
      d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M8.60834 13.75H11.3833M7.91669 10.4167H12.0834"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);

const EditIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 20 20" width="1em" height="1em">
    <path
      d="M11.05 3L4.208 10.242c-.258.275-.508.816-.558 1.191l-.308 2.7c-.108.975.592 1.642 1.559 1.475l2.683-.458c.375-.067.9-.342 1.158-.625L15.583 7.283c1.183-1.25 1.717-2.675-.125-4.417C13.625 1.142 12.233 1.75 11.05 3Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M9.908 4.208c.358 2.3 2.225 4.058 4.542 4.292M2.5 18.333h15"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [quantity, setQuantity] = useState("");
  const [restockThreshold, setRestockThreshold] = useState("");
  const [productId, setProductId] = useState(""); // initialisé à string vide
  const [editId, setEditId] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products/inventory/");
      setInventory(res.data);
    } catch (err) {
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/products/");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setQuantity("");
    setRestockThreshold("");
    setProductId("");
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setQuantity(item.quantity);
    setRestockThreshold(item.restock_threshold);
    setProductId(item.product_id ? item.product_id.toString() : "");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inventory item?")) return;
    await api.delete(`/products/inventory/${id}/`);
    fetchInventory();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    const data = {
      quantity: parseInt(quantity, 10),
      restock_threshold: parseInt(restockThreshold, 10),
      product_id: parseInt(productId, 10), // conversion en entier obligatoire
    };
    try {
      if (editId) await api.put(`/products/inventory/${editId}/`, data);
      else await api.post("/products/inventory/", data);
      resetForm();
      setShowForm(false);
      fetchInventory();
    } catch {
      console.error("Submit failed");
    } finally {
      setLoadingForm(false);
    }
  };

  const displayed = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return inventory.slice(start, start + rowsPerPage);
  }, [page, inventory]);

  return (
    <motion.div className="p-6 max-w-5xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <Button size="sm" onClick={() => { resetForm(); setShowForm((v) => !v); }} color={showForm ? "danger" : "primary"}>
          {showForm ? "Cancel" : "Add Item"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-8">
          <Input
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <Input
            label="Restock Threshold"
            type="number"
            value={restockThreshold}
            onChange={(e) => setRestockThreshold(e.target.value)}
            required
          />
          <Select
            label="Product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)} // récupération correcte de la valeur
            required
          >
            <SelectItem value="" disabled>
              -- Select a product --
            </SelectItem>
            {products.map((prod) => (
              <SelectItem key={prod.id} value={prod.id.toString()}>
                {prod.name}
              </SelectItem>
            ))}
          </Select>
          <div className="col-span-2">
            <Button size="sm" type="submit" isLoading={loadingForm} color="primary">
              {editId ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      )}

      <Table
        isHeaderSticky
        isLoading={loading}
        loadingContent={<Spinner />}
        emptyContent={!loading && "No inventory found"}
        classNames={{ wrapper: "min-h-[300px]" }}
      >
        <TableHeader
          columns={[
            { name: "ID", uid: "id" },
            { name: "Quantity", uid: "quantity" },
            { name: "Restock Threshold", uid: "restock_threshold" },
            { name: "Product Name", uid: "product_name" },
            { name: "Actions", uid: "actions" },
          ]}
        >
          {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody items={displayed}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.restock_threshold}</TableCell>
              <TableCell>{item.product_name}</TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <Tooltip content="Edit">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(item)}>
                      <EditIcon />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete">
                    <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(item.id)}>
                      <DeleteIcon />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-4">
        <Pagination page={page} total={Math.ceil(inventory.length / rowsPerPage) || 1} onChange={setPage} />
      </div>
    </motion.div>
  );
}
