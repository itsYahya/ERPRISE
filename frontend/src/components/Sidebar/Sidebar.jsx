import React, { useState } from 'react';
import NavLink from '../NavLink/NavLink';
import './Sidebar.css';
import { FaChartPie } from "react-icons/fa6";
import { FaUserGear } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { FaBox } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";

const menuItems = [
    {
        label: 'Dashboard',
        icon: <FaChartPie />,
        submenus: [
            { label: 'Overview', path: '/dashboard/overview' },
            { label: 'Sales Analytics', path: '/dashboard/sales' },
            { label: 'Revenue Report', path: '/dashboard/revenue' },
            { label: 'Activity Timeline', path: '/dashboard/activity' },
            { label: 'Notifications', path: '/dashboard/notifications' }
        ]
    },
    {
        label: 'User Management',
        icon: <FaUserGear />,
        submenus: [
            { label: 'All Users', path: '/users' },
            { label: 'Add New User', path: '/users/add' },
            { label: 'Roles & Permissions', path: '/users/permissions' },
            { label: 'User Activity Logs', path: '/users/activity' },
            { label: 'Account Status', path: '/users/status' }
        ]
    },
    {
        label: 'HR Management',
        icon: < FaUserTie />,
        submenus: [
            { label: 'Employee Directory', path: '/employees' },
            { label: 'Add New Employee', path: '/employees/add' },
            { label: 'Attendance Tracker', path: '/employees/attendance' },
            { label: 'Leave Management', path: '/employees/leave' },
            { label: 'Payroll', path: '/employees/payroll' }
        ]
    },
    {
        label: 'CR Management',
        icon: < FaUser />,
        submenus: [
            { label: 'All Customers', path: '/customers' },
            { label: 'Add New Customer', path: '/customers/add' },
            { label: 'Leads & Opportunities', path: '/customers/opportunities' },
            { label: 'Customer Feedback', path: '/customers/feedback' },
            { label: 'Support Tickets', path: '/customers/tickets' }
        ]
    },
    {
        label: 'Product Management',
        icon: < FaBox />,
        submenus: [
            { label: 'Product List', path: '/products' },
            { label: 'Add New Product', path: '/products/add' },
            { label: 'Inventory Control', path: '/products/inventory' },
            { label: 'Categories', path: '/products/categories' },
            { label: 'Suppliers', path: '/products/suppliers' }
        ]
    },
    {
        label: 'Settings',
        icon: < FaGear />,
        submenus: [
            { label: 'General Settings', path: '/settings/general' },
            { label: 'Profile Settings', path: '/settings/profile' },
            { label: 'Security & Privacy', path: '/settings/security' },
            { label: 'Notification Preferences', path: '/settings/notification' },
            { label: 'System Logs', path: '/settings/logs' }
        ]
    }
];

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <nav className='sidebar-container'>
            <div className="nav-header">
                <div className="hamburger-menu">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                <div className="nav-logo"></div>
            </div>
            <ul className="sidebar">
            {menuItems.map((item, index) => (
                <NavLink
                    key={index}
                    icon={item.icon}
                    path={item.path}
                    label={item.label}
                    submenus={item.submenus}
                />
            ))}
            <li className="nav-btn-container">
                <div className="nav-img">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor"
                        className="bi bi-door-closed" viewBox="0 0 16 16">
                        <path
                            d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3zm1 13h8V2H4z" />
                        <path d="M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
                    </svg>
                </div>
                <div className="nav-label">You are logged in as Rachid EDDAHBI</div>
                <button className="nav-btn">Logout</button>
            </li>
        </ul>
    </nav >
    );
}

export default Sidebar;
