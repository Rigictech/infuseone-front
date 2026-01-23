import React, { useState } from 'react';
import { Navbar, Dropdown, Image, Container, Button } from 'react-bootstrap';
import { User, LogOut, Menu } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import userService from '../services/userService';
import LogoutConfirmationModal from './LogoutConfirmationModal';

const Topbar = ({ onMenuClick }) => {
    const { userProfile, getAvatarSrc } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const imageUrl = import.meta.env.VITE_LARAVEL_IMAGE_URL;
    const avatarSrc = getAvatarSrc(imageUrl);

    const getPageTitle = (pathname) => {
        switch (pathname) {
            case '/users-list': return 'User Management';
            case '/formstack-list': return 'Formstack URLs';
            case '/website-list': return 'Website URLs';
            case '/info': return 'Important Information';
            case '/uploads': return 'Uploads';
            case '/profile': return 'Profile';
            default: return '';
        }
    };

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
            setLogoutLoading(false);
            setShowLogoutModal(false);
        }
    };

    return (
        <>
            <Navbar bg="white" variant="light" className="shadow-sm border-bottom py-2 sticky-top">
                <Container fluid className="px-4">
                    <div className="d-flex align-items-center">
                        <Button variant="link" className="p-0 text-dark me-3 mobile-menu-btn" onClick={onMenuClick}>
                            <Menu size={24} />
                        </Button>
                    </div>

                    <Navbar.Brand className="fw-bold text-primary d-none d-md-block">
                        {getPageTitle(location.pathname)}
                    </Navbar.Brand>

                    <div className="ms-auto d-flex align-items-center gap-3">
                        <Dropdown align="end">
                            <Dropdown.Toggle
                                variant="light"
                                id="dropdown-basic"
                                className="d-flex align-items-center b-0 border-0 bg-transparent p-0 hide-arrow"
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <div className="text-end d-none d-sm-block">
                                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Welcome</div>
                                        <div className="text-muted ">{userProfile.name}</div>
                                    </div>

                                    {avatarSrc ? (
                                        <Image
                                            src={avatarSrc}
                                            roundedCircle
                                            width={40}
                                            height={40}
                                            className="border"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div
                                            className="avatar-wrapper position-relative rounded-circle border border-4 border-white shadow-sm d-flex align-items-center justify-content-center"
                                            style={{ width: '40px', height: '40px', fontSize: '1.2rem', backgroundColor: '#d2d5e0' }}
                                        >
                                            <span className="fw-bold" style={{ fontSize: 15, color: '#003366' }}>
                                                {userProfile.name
                                                    .split(' ')
                                                    .map(n => n[0])
                                                    .join('')
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="shadow-sm border-0 mt-2">
                                <Dropdown.Item onClick={() => navigate('/profile')}>
                                    <User size={16} className="me-2" />Profile
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleLogoutClick} className="text-danger">
                                    <LogOut size={16} className="me-2" />Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Container>
            </Navbar>
            <LogoutConfirmationModal
                show={showLogoutModal}
                onHide={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
                loading={logoutLoading}
            />
        </>
    );
};

export default Topbar;
