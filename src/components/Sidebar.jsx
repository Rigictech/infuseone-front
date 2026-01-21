import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Users, User, LogOut } from 'lucide-react';
import { Nav, Button, Image } from 'react-bootstrap';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, onClose, isCollapsed }) => {
    const location = useLocation();

    const navItems = [
        { path: '/users-list', label: 'User Management', icon: Users },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="brand-logo">
                        <div className="logo-icon">
                            <Image src="/favicon.png" alt="Infuse One Logo" className="sidebar-logo-img" fluid />
                        </div>
                    </div>
                </div>

                <Nav className="sidebar-nav flex-column">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Nav.Link
                                key={item.path}
                                as={NavLink}
                                to={item.path}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                                onClick={() => onClose && onClose()}
                                title={isCollapsed ? item.label : ''}
                            >
                                <item.icon className="nav-icon" size={20} />
                                <span className={`nav-label ${isCollapsed ? 'hidden' : ''}`}>{item.label}</span>
                            </Nav.Link>
                        );
                    })}
                </Nav>

                <div className="sidebar-footer">
                    <Nav.Link
                        as="button"
                        className="logout-btn d-flex align-items-center w-100 border-0 bg-transparent"
                    >
                        <LogOut className="nav-icon" size={20} />
                        <span className={`nav-label ${isCollapsed ? 'hidden' : ''}`}>Logout</span>
                    </Nav.Link>
                </div>
            </div>

            <div
                className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
                onClick={onClose}
            />
        </>
    );
};

export default Sidebar;
