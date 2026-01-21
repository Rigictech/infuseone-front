import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Users,
    User,
    LogOut
} from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, onClose, isCollapsed }) => {
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
                            <img src="/favicon.png" alt="Infuse One Logo" className="sidebar-logo-img" />
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => onClose && onClose()}
                            title={isCollapsed ? item.label : ''}
                        >
                            <item.icon className="nav-icon" size={20} />
                            <span className={`nav-label ${isCollapsed ? 'hidden' : ''}`}>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-link logout-btn">
                        <LogOut className="nav-icon" size={20} />
                        <span className={`nav-label ${isCollapsed ? 'hidden' : ''}`}>Logout</span>
                    </button>
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
