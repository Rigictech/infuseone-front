import React from 'react';
import { Navbar, Dropdown, Image, Container } from 'react-bootstrap';
import { User, LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Topbar = () => {
    const { userProfile } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

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

    const handleLogout = () => {
        // Implement logout logic here (e.g., clear tokens)
        navigate('/login');
    };

    return (
        <Navbar bg="white" variant="light" className="shadow-sm border-bottom py-2 sticky-top">
            <Container fluid className="px-4">
                <Navbar.Brand className="fw-bold text-primary d-none d-md-block">
                    {getPageTitle(location.pathname)}
                </Navbar.Brand>

                <div className="ms-auto d-flex align-items-center gap-3">
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center b-0 border-0 bg-transparent p-0 hide-arrow">
                            <div className="d-flex align-items-center gap-2">
                                <div className="text-end d-none d-sm-block">
                                    <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Welcome</div>
                                    <div className="text-muted ">{userProfile.name}</div>
                                </div>
                                {userProfile.avatar ? (
                                    <Image
                                        src={userProfile.avatar}
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
                                        {userProfile.avatar ? (
                                            <Image
                                                src={userProfile.avatar}
                                                roundedCircle
                                                className="w-100 h-100 object-fit-cover"
                                            />
                                        ) : (
                                            <span
                                                className="fw-bold"
                                                style={{ fontSize: 15, color: '#003366' }}
                                            >
                                                {userProfile.name
                                                    .split(' ')
                                                    .map(n => n[0])
                                                    .join('')
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow-sm border-0 mt-2">
                            <Dropdown.Item onClick={() => navigate('/profile')}>
                                <User size={16} className="me-2" />Profile
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout} className="text-danger">
                                <LogOut size={16} className="me-2" />Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Container>
        </Navbar>
    );
};

export default Topbar;
