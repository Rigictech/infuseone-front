import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { Search, Plus, Eye, PenLine, Trash2 } from 'lucide-react';
import userService from '../services/AdminUserService';
import UserModal from '../components/UserModal';
import Pagination from '../components/Pagination';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.index({});
            console.log("User API Response:", response);
            // Safely determine the array source
            let userList = [];
            if (response.data && Array.isArray(response.data.user.data)) {
                userList = response.data.user.data;
            } else if (response.data && Array.isArray(response.data)) {
                userList = response.data;
            } else if (response.data && response.data.users && Array.isArray(response.data.users)) {
                userList = response.data.users;
            } else {
                console.warn("Could not find array in response, defaulting to empty", response.data);
            }
            setUsers(userList);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

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
                await userService.destroy(id);
                fetchUsers();
            } catch (err) {
                console.error(err);
                alert('Failed to delete user');
            }
        }
    };

    const handleModalSubmit = async (userData, profileImage) => {
        try {
            const formData = new FormData();
            formData.append('name', userData.name);
            formData.append('email', userData.email);
            // formData.append('phone', userData.phone); // Add phone if needed by API
            // formData.append('role', 'user'); // Add role if needed

            if (userData.password) {
                formData.append('password', userData.password);
            }

            if (profileImage) {
                formData.append('avatar', profileImage);
            }

            if (editingUser) {
                await userService.update(editingUser.id, formData);
            } else {
                await userService.store(formData);
            }
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert('Operation failed');
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Reset to page 1 on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <Container className="py-4">
            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom-0 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <InputGroup style={{ maxWidth: '300px' }}>
                            <InputGroup.Text className="bg-light border-0 ps-3 rounded-start-pill">
                                <Search size={18} className="text-muted" />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Search users..."
                                className="bg-light border-0 rounded-end-pill"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                        <Button
                            className="rounded-pill px-4"
                            style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                            onClick={handleAddUser}
                        >
                            <Plus size={18} className="me-2" />Add User
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 text-muted fw-medium py-3" style={{ width: '60px' }}>Profile</th>
                                <th className="text-muted fw-medium py-3" style={{ width: '30%' }}>Name</th>
                                <th className="text-muted fw-medium py-3" style={{ width: '40%' }}>Email</th>
                                <th className="pe-4 text-end text-muted fw-medium py-3" style={{ width: '110px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                            ) : currentUsers.length > 0 ? (
                                currentUsers.map(user => (
                                    <tr key={user.id}>
                                        <td className="ps-4">
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold"
                                                style={{ width: '40px', height: '40px', backgroundColor: '#d2d5e0' }}
                                            >
                                                {user.avatar ? (
                                                    <Image
                                                        src={user.avatar}
                                                        roundedCircle
                                                        className="w-100 h-100 object-fit-cover"
                                                    />
                                                ) : (
                                                    <span
                                                        className="fw-bold"
                                                        style={{ fontSize: 15, color: '#003366' }}
                                                    >
                                                        {user.name
                                                            .split(' ')
                                                            .map(n => n[0])
                                                            .join('')
                                                            .substring(0, 2)
                                                            .toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-muted">{user.name}</td>
                                        <td className="text-muted">{user.email}</td>
                                        <td className="pe-4 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button variant="light" size="sm" className="text-success" onClick={() => handleEditUser(user)}><PenLine size={16} /></Button>
                                                <Button variant="light" size="sm" className="text-danger" onClick={() => handleDeleteUser(user.id)}><Trash2 size={16} /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center py-5 text-muted">No users found.</td></tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
                <Card.Footer className="bg-white border-top-0">
                    {!loading && filteredUsers.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={paginate}
                            totalRecords={filteredUsers.length}
                            startIndex={indexOfFirstUser + 1}
                            endIndex={Math.min(indexOfLastUser, filteredUsers.length)}
                        />
                    )}
                </Card.Footer>
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
