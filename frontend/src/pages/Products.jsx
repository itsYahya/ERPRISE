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
  Checkbox,
  Tooltip,
} from "@heroui/react";
import { motion } from "framer-motion";


const DeleteIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 20 20" width="1em" height="1em">
    <path d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}/>
    <path d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}/>
    <path d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}/>
    <path d="M8.60834 13.75H11.3833M7.91669 10.4167H12.0834" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}/>
  </svg>
);

const EditIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 20 20" width="1em" height="1em">
    <path d="M11.05 3L4.208 10.242c-.258.275-.508.816-.558 1.191l-.308 2.7c-.108.975.592 1.642 1.559 1.475l2.683-.458c.375-.067.9-.342 1.158-.625L15.583 7.283c1.183-1.25 1.717-2.675-.125-4.417C13.625 1.142 12.233 1.75 11.05 3Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}/>
    <path d="M9.908 4.208c.358 2.3 2.225 4.058 4.542 4.292M2.5 18.333h15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}/>
  </svg>
);

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setError(null);
    try {
      const res = await api.get("/products/products/");
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/products/${id}/`);
      fetchProducts();
    } catch {}
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setAvailable(product.available);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setDescription("");
    setPrice("");
    setAvailable(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    const payload = { name, description, price: parseFloat(price), available };
    try {
      if (editId) await api.put(`/products/products/${editId}/`, payload);
      else await api.post("/products/products/", payload);
      resetForm();
      setShowForm(false);
      fetchProducts();
    } catch {} finally {
      setLoadingForm(false);
    }
  };

  const displayedProducts = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return products.slice(start, start + rowsPerPage);
  }, [page, products]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button size="sm" onClick={() => { resetForm(); setShowForm((v) => !v); }} color={showForm ? "danger" : "primary"}>
          {showForm ? "Cancel" : "Add Product"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-2 gap-4 bg-white p-4 rounded shadow-md">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loadingForm} />
          <Input label="Price (MAD)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required disabled={loadingForm} />
          <div className="col-span-2">
            <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loadingForm} />
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Checkbox isSelected={available} onValueChange={setAvailable}>Available</Checkbox>
          </div>
          <div className="col-span-2">
            <Button size="sm" type="submit" color="primary" isLoading={loadingForm}>
              {editId ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      )}

      {error && <p className="text-danger mb-4">{error}</p>}

      <Table
        isHeaderSticky
        isLoading={loadingProducts}
        loadingContent={<Spinner />}
        emptyContent={!loadingProducts && "No products found"}
        classNames={{ wrapper: "min-h-[300px]" }}
      >
        <TableHeader columns={[
          { name: "ID", uid: "id" },
          { name: "Name", uid: "name" },
          { name: "Description", uid: "description" },
          { name: "Price", uid: "price" },
          { name: "Available", uid: "available" },
          { name: "Actions", uid: "actions" },
        ]}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={displayedProducts}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description || "-"}</TableCell>
              <TableCell>{item.price ? `${item.price} MAD` : "-"}</TableCell>
              <TableCell>{item.available ? "Yes" : "No"}</TableCell>
              <TableCell>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Edit product">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(item)}>
                      <EditIcon />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete product">
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
        <Pagination page={page} total={Math.ceil(products.length / rowsPerPage) || 1} onChange={setPage} />
      </div>
    </motion.div>
  );
}