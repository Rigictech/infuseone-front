import React from 'react';
import { Bell, Menu, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Button, Dropdown, Badge, Container, Nav } from 'react-bootstrap';
import '../styles/Topbar.css';

const Topbar = ({ onMenuClick }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout logic here
        console.log('Logging out...');
        navigate('/login');
    };

    return (
        <Navbar bg="white" className="border-bottom shadow-sm px-3 topbar" style={{ height: '64px' }}>
            <Container fluid className="p-0">
                <div className="d-flex align-items-center">
                    <Button variant="link" className="p-0 text-dark me-3 mobile-menu-btn" onClick={onMenuClick}>
                        <Menu size={24} />
                    </Button>
                    <Badge bg="primary" className="py-2 px-3 fw-medium admin-badge" style={{ backgroundColor: '#003366' }}>Admin Panel</Badge>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <Button variant="link" className="p-0 text-secondary position-relative notification-btn">
                        <Bell size={20} />
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light p-1" style={{ fontSize: '0.6rem' }}>
                            2
                        </span>
                    </Button>

                    <Dropdown align="end">
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                            <div className="d-flex align-items-center gap-2 cursor-pointer">
                                <img
                                    src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
                                    alt="Admin"
                                    className="rounded-circle"
                                    width="32"
                                    height="32"
                                />
                                <span className="fw-medium text-dark d-none d-sm-inline">Admin</span>
                            </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow-sm border-0 mt-2">
                            <Dropdown.Item as={Link} to="/profile" className="d-flex align-items-center gap-2 py-2">
                                <User size={16} /> My Profile
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout} className="d-flex align-items-center gap-2 py-2 text-danger">
                                <LogOut size={16} /> Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Container>
        </Navbar>
    );
};

// Custom Toggle for Dropdown to avoid default caret if desired, or styling
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        style={{ cursor: 'pointer' }}
    >
        {children}
    </div>
));

export default Topbar;
