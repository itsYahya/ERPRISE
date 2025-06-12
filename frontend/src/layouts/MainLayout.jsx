import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import './MainLayout.css'

const MainLayout = () => {
    return (
            <div className="layout-container">
                <Sidebar />
                <div className='layout-main'>
                    <Navbar />
                    <div className='layout-content'>
                        <Outlet />
                    </div>
                </div>
            </div>
    );
};

export default MainLayout;