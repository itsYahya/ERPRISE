import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { FaUser, FaBuilding, FaClipboardCheck, FaChartBar } from "react-icons/fa6";

const StatCard = ({ title, value, icon: Icon }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }} 
    className="flex items-center justify-between p-6 bg-white rounded-lg shadow-md border border-gray-200"
  >
    <div>
      <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h2>
      <p className="mt-1 text-3xl font-extrabold text-gray-900">{value}</p>
    </div>
    <div className="text-primary text-4xl">
      <Icon />
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    departments: 0,
    products: 0,
    inventoryItems: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, deptRes, productsRes, invRes] = await Promise.all([
          api.get("/humanRS/employees/"),
          api.get("/humanRS/department/"),
          api.get("/products/products/"),
          api.get("/products/inventory/"),
        ]);
        setStats({
          users: usersRes.data.length,
          departments: deptRes.data.length,
          products: productsRes.data.length,
          inventoryItems: invRes.data.length,
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Employees" value={stats.users} icon={FaUser} />
        <StatCard title="Departments" value={stats.departments} icon={FaBuilding} />
        <StatCard title="Products" value={stats.products} icon={FaClipboardCheck} />
        <StatCard title="Inventory Items" value={stats.inventoryItems} icon={FaChartBar} />
      </div>
    </motion.div>
  );
}