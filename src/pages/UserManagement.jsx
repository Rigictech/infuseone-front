import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Button,
    Badge,
    Form,
    InputGroup,
    Spinner,
    Alert
} from 'react-bootstrap';
import {
    PenLine,
    Trash2,
    Unlock,
    ChevronLeft,
    ChevronRight,
    Search,
    Plus
} from 'lucide-react';
import { userService } from '../services/userService';
import UserModal from '../components/UserModal';
import '../styles/UserManagement.css';

const UserManagement = () => {
    // State Management
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Initial Data Fetching
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    // Actions
    const handleAddUser = () => {
        setEditingUser(null);
        setShowModal(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(id);
                fetchUsers(); // Refresh list
            } catch (err) {
                alert('Failed to delete user');
            }
        }
    };

    const handleModalSubmit = async (userData) => {
        try {
            setActionLoading(true);
            if (editingUser) {
                await userService.updateUser(editingUser.id, userData);
            } else {
                await userService.createUser(userData);
            }
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            alert('Operation failed');
        } finally {
            setActionLoading(false);
        }
    };

    // Loading State
    if (loading) {
        return (
            <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container fluid className="py-4 user-management">
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <h2 className="text-primary fw-bold">User List</h2>
                </Col>
            </Row>

            {/* Error Message */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Controls */}
            <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                    <Row className="gy-3 align-items-center justify-content-between">
                        <Col xs={12} md={6} lg={4}>
                            <InputGroup>
                                <InputGroup.Text className="bg-light border-0 ps-3">
                                    <Search size={18} className="text-muted" />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1); // Reset to first page on search
                                    }}
                                    className="bg-light border-0"
                                />
                            </InputGroup>
                        </Col>
                        <Col xs="auto">
                            <Button
                                variant="primary"
                                className="rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
                                style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                                onClick={handleAddUser}
                            >
                                <Plus size={18} /> Add New User
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* User Table */}
            <Card className="border-0 shadow-sm table-card">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0 user-table align-middle text-nowrap">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3 ps-4 text-muted fw-medium" style={{ width: '60px' }}>No</th>
                                    <th className="py-3 text-muted fw-medium text-center" style={{ width: '120px' }}>Profile Image</th>
                                    <th className="py-3 text-muted fw-medium">Name</th>
                                    <th className="py-3 text-muted fw-medium">Email</th>
                                    <th className="py-3 text-muted fw-medium">Phone Number</th>
                                    <th className="py-3 text-muted fw-medium text-center">Status</th>
                                    <th className="py-3 pe-4 text-muted fw-medium text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.length > 0 ? (
                                    currentUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td className="ps-4 text-muted">{user.no}</td>
                                            <td className="text-center">
                                                <div
                                                    className="d-flex align-items-center justify-content-center mx-auto rounded-circle fw-bold"
                                                    style={{
                                                        width: '45px',
                                                        height: '45px',
                                                        backgroundColor: user.bgColor || '#e0e7ff',
                                                        color: user.textColor || '#3730a3',
                                                        fontSize: '16px'
                                                    }}
                                                >
                                                    {user.initials}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-semibold text-dark">
                                                    {user.name}
                                                </div>
                                            </td>
                                            <td className="text-muted small">{user.email}</td>
                                            <td className="text-dark">{user.phone}</td>
                                            <td className="text-center">
                                                <Badge
                                                    pill
                                                    bg={user.status === 'Active' ? 'success' : 'danger'}
                                                    className="px-3 py-2 fw-medium"
                                                    style={{ minWidth: '80px' }}
                                                >
                                                    {user.status}
                                                </Badge>
                                            </td>
                                            <td className="pe-4 text-center">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Button
                                                        variant="link"
                                                        className="p-1 text-success action-icon"
                                                        onClick={() => handleEditUser(user)}
                                                        title="Edit"
                                                    >
                                                        <PenLine size={18} />
                                                    </Button>
                                                    <Button
                                                        variant="link"
                                                        className="p-1 text-danger action-icon"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-muted">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Card.Footer className="bg-white border-0 py-3">
                        <div className="d-flex justify-content-end">
                            <div className="d-flex gap-2">
                                <Button
                                    variant="light"
                                    className="p-2 border-0 text-muted"
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    <ChevronLeft size={18} />
                                </Button>
                                {[...Array(totalPages)].map((_, idx) => (
                                    <Button
                                        key={idx + 1}
                                        variant={currentPage === idx + 1 ? "primary" : "light"}
                                        className={`px-3 fw-bold ${currentPage === idx + 1 ? 'shadow-sm' : 'border-0 text-muted'}`}
                                        style={currentPage === idx + 1 ? { backgroundColor: '#5ab1ef', borderColor: '#5ab1ef' } : {}}
                                        onClick={() => handlePageChange(idx + 1)}
                                    >
                                        {idx + 1}
                                    </Button>
                                ))}
                                <Button
                                    variant="light"
                                    className="p-2 border-0 text-muted"
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    <ChevronRight size={18} />
                                </Button>
                            </div>
                        </div>
                    </Card.Footer>
                )}
            </Card>

            <UserModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleModalSubmit}
                user={editingUser}
                title={editingUser ? 'Edit User' : 'Add New User'}
            />
        </Container>
    );
};

export default UserManagement;
