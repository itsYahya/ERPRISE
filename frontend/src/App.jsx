import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import './App.css'
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import AttendanceTracker from './pages/AttendanceTracker';
import Payroll from './pages/Payroll';
import RolesPermissions from './pages/RolesPermissions';

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<Employees />} /> 
          <Route path="/employees/add" element={<AddEmployee />} />
          <Route path="/employees/attendance" element={<AttendanceTracker />} />
          <Route path="/employees/payroll" element={<Payroll />} />
          <Route path="/users/permissions" element={<RolesPermissions />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
