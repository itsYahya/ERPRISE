import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import ViewEmployee from './pages/ViewEmployee';
import EditEmployee from './pages/EditEmployee';
import EditCustomer from "./pages/EditCustomer";
import ViewCustomer from "./pages/ViewCustomer";
import AttendanceTracker from './pages/AttendanceTracker';
import Salaries from './pages/Salaries';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import UserLogs from './pages/UserLogs';
import CreateUser from './pages/CreateUser';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

import './App.css';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/overview/dashboard" element={<Dashboard />} />
            <Route path="/overview/departments" element={<Departments />} />
            <Route path="/overview/jobs" element={<Jobs />} />
            <Route path="/" element={<Home />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/add" element={<AddEmployee />} />
            <Route path="/employees/:id" element={<ViewEmployee />} />
            <Route path="/employees/:id/edit" element={<EditEmployee />} />
            <Route path="/employees/attendance" element={<AttendanceTracker />} />
            <Route path="/employees/payroll" element={<Salaries />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<ViewCustomer />} />
            <Route path="/customers/:id/edit" element={<EditCustomer />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/inventory" element={<Inventory />} />
            <Route path="/products/orders" element={<Orders />} />
            <Route path="/products/orders/:id" element={<OrderDetails />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="/user/logs" element={<UserLogs />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;