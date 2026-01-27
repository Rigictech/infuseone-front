import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Users, User, LogOut, FormIcon, Link, Info, FileText } from 'lucide-react';
import { Nav, Image } from 'react-bootstrap';
import '../styles/Sidebar.css';
import userService from '../services/userService';
import LogoutConfirmationModal from './LogoutConfirmationModal';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose, isCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const role = localStorage.getItem('role');
    const isAdmin = role == 'Admin';

    const navItems = [
        { path: '/users-list', label: 'User Management', icon: Users, adminOnly: true },
        { path: '/formstack-list', label: 'Formstack URLs', icon: FormIcon },
        { path: '/website-list', label: 'Website URLs', icon: Link },
        { path: '/info', label: 'Important Info', icon: Info },
        { path: '/uploads', label: 'Uploads', icon: FileText },
        { path: '/profile', label: 'Profile', icon: User },
    ].filter(item => isAdmin || !item.adminOnly);

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = async () => {
        setLogoutLoading(true);
        try {
            await userService.logout();
            localStorage.removeItem('authToken');
            localStorage.removeItem('role');
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error("Logout API error:", error);
            toast.error(error.response?.data?.message || 'Logout failed');
            setLogoutLoading(false); // Only stop loading on error, otherwise we navigate away
            setShowLogoutModal(false);
        }
    }

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="brand-logo">
                        <div className="logo-icon">
                            <Image src="./favicon.png" alt="Infuse One Logo" className="sidebar-logo-img" fluid />
                        </div>
                    </div>
                </div>

                <Nav className="sidebar-nav flex-column">
                    {navItems.map((item) => {
                        const isActive = location.pathname == item.path;
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
                        onClick={handleLogoutClick}
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
            <LogoutConfirmationModal
                show={showLogoutModal}
                onHide={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
                loading={logoutLoading}
            />
        </>
    );
};

export default Sidebar;
