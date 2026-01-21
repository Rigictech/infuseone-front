import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../styles/DashboardLayout.css';

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false); // Mobile toggle
    const [isCollapsed, setIsCollapsed] = useState(false);   // Desktop collapse

    const toggleSidebar = () => {
        if (window.innerWidth > 768) {
            setIsCollapsed(!isCollapsed);
        } else {
            setSidebarOpen(!isSidebarOpen);
        }
    };

    return (
        <div className={`dashboard-layout ${isCollapsed ? 'collapsed' : ''}`}>
            <Sidebar
                isOpen={isSidebarOpen}
                isCollapsed={isCollapsed}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="main-content">
                <Topbar onMenuClick={toggleSidebar} isCollapsed={isCollapsed} />

                <div className="container" style={{ paddingTop: '2rem' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
