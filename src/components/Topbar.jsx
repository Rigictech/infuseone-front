import React, { useState } from 'react';
import { Bell, Menu, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Topbar.css';

const Topbar = ({ onMenuClick }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout logic here
        console.log('Logging out...');
        navigate('/login');
    };

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="btn mobile-menu-btn" onClick={onMenuClick}>
                    <Menu size={24} />
                </button>
                <div className="page-title-group">
                    {/* The specific page title (like "User List") is technically in the page content in the design, 
                        but the "Admin Panel" badge is in the top bar area or sidebar in the image? 
                        Looking at the image, "Admin Panel" is a blue badge at the top. */}
                    <span className="admin-badge">Admin Panel</span>
                </div>
            </div>

            <div className="topbar-right">
                <button className="notification-btn">
                    <Bell size={20} />
                    <span className="notification-badge">2</span>
                </button>

                <div className="user-menu">
                    <button
                        className="user-btn"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                    >
                        <div className="user-avatar">
                            <img src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" alt="Admin" />
                        </div>
                        <span className="user-name">Admin</span>
                    </button>

                    <div className={`user-dropdown ${showUserMenu ? 'active' : ''}`}>
                        <Link to="/dashboard/profile" className="dropdown-item">
                            <User size={16} />
                            <span>My Profile</span>
                        </Link>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item" onClick={handleLogout}>
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
