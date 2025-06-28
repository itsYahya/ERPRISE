import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import { Outlet } from 'react-router-dom';
import './MainLayout.css'

const MainLayout = () => {
    return (
        <div className="layout-container">
            <Sidebar />
            <div className='layout-main'>
                <Navbar />
                <div className='layout-content'>
                    <Breadcrumbs />
                    <div className="mt-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;