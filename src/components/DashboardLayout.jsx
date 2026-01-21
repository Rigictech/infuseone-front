import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Container } from 'react-bootstrap';
import '../styles/DashboardLayout.css';

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false); 
    const [isCollapsed, setIsCollapsed] = useState(false);

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

            <div className="main-content d-flex flex-column min-vh-100">
                <Topbar onMenuClick={toggleSidebar} isCollapsed={isCollapsed} />

                <Container fluid className="pt-4 flex-grow-1">
                    <Outlet />
                </Container>
            </div>
        </div>
    );
};

export default DashboardLayout;
