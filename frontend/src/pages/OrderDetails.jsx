import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { FaPlus } from "react-icons/fa6";
import api from "../utils/api";

export default function OrderDetailsPage({ orderId = 1 }) {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);

  const [newItem, setNewItem] = useState({
    quantity: "",
    unit_price: "",
    product: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [orderRes, itemsRes, productsRes] = await Promise.all([
        api.get(`/api/orders/${orderId}/`),
        api.get(`/api/order-items/?order=${orderId}`),
        api.get(`/api/products/`),
      ]);

      setOrder(orderRes.data);
      setItems(itemsRes.data);
      setProducts(productsRes.data);
    };
    fetchData();
  }, [orderId]);

  const handleAddItem = async () => {
    if (!newItem.product || !newItem.quantity || !newItem.unit_price) return;

    const res = await api.post(`/api/order-items/`, {
      ...newItem,
      order: orderId,
    });

    setItems([...items, res.data]);
    setNewItem({ quantity: "", unit_price: "", product: "" });
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Order #{order?.id}</h1>

      <Card className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium">Status</p>
            <p>{order?.status}</p>
          </div>
          <div>
            <p className="font-medium">Order Date</p>
            <p>{order?.order_date}</p>
          </div>
          <div>
            <p className="font-medium">Client ID</p>
            <p>{order?.client}</p>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
        <Table isStriped isCompact>
          <TableHeader>
            <TableColumn>Product</TableColumn>
            <TableColumn>Quantity</TableColumn>
            <TableColumn>Unit Price</TableColumn>
            <TableColumn>Total</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.product}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                <TableCell>{formatCurrency(item.quantity * item.unit_price)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-xl font-medium mb-4">Add New Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <Select
            label="Product"
            value={newItem.product}
            onChange={(val) => setNewItem({ ...newItem, product: val })}
          >
            {products.map((prod) => (
              <SelectItem key={prod.id} value={prod.id}>
                {prod.name}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Quantity"
            type="number"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: e.target.value })
            }
          />

          <Input
            label="Unit Price"
            type="number"
            value={newItem.unit_price}
            onChange={(e) =>
              setNewItem({ ...newItem, unit_price: e.target.value })
            }
          />

          <Button
            onClick={handleAddItem}
            className="w-full h-[45px]"
            variant="solid"
          >
            <FaPlus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>
      </div>
    </div>
  );
}
