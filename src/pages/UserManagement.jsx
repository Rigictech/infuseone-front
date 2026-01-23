import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, InputGroup, Spinner, Alert, Image } from 'react-bootstrap';
import { Search, Plus, PenLine, Trash2 } from 'lucide-react';
import userService from '../services/AdminUserService';
import UserModal from '../components/UserModal';
import Pagination from '../components/Pagination';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const role = localStorage.getItem('role');
    const isAdmin = role === 'Admin';

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.index(currentPage);
            const data = response?.data;

            let userList = [];
            let meta = {};

            if (data.user) {
                // If data.user is the paginator object
                if (data.user.data && Array.isArray(data.user.data)) {
                    userList = data.user.data;
                    meta = data.user.meta; // meta fields are on the top level object usually
                } else if (Array.isArray(data.user)) {
                    userList = data.user;
                }
            } else if (data.user.data && Array.isArray(data.user.data)) {
                userList = data.user.data;
                meta = data.user.meta || data;
            } else if (Array.isArray(data)) {
                userList = data;
            } else if (data.users && Array.isArray(data.users)) {
                userList = data.users;
            }

            setUsers(userList);
            setTotalPages(meta.last_page || 1);
            setTotalRecords(meta.total || userList.length);
            setStartIndex(meta.from || 1);
            setEndIndex(meta.to || userList.length);

            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to load users.');
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

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        setDeleteLoading(true);
        try {
            await userService.destroy(userToDelete.id);
            toast.success('User deleted successfully');
            fetchUsers();
            setShowDeleteModal(false);
            setUserToDelete(null);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleModalSubmit = async (userData, profileImage) => {
        try {
            const formData = new FormData();
            formData.append('name', userData.name);
            formData.append('email', userData.email);

            if (userData.password) {
                formData.append('password', userData.password);
            }

            if (profileImage) {
                formData.append('avatar', profileImage);
            }

            if (editingUser) {
                await userService.update(editingUser.id, formData);
                toast.success('User updated successfully');
            } else {
                await userService.store(formData);
                toast.success('User added successfully');
            }
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    // Filter Logic - Client side on current page
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Reset to page 1 on search
    useEffect(() => {
        // Debounce if needed
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
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                        {isAdmin && (
                            <Button
                                className="rounded-pill px-4"
                                style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                                onClick={handleAddUser}
                            >
                                <Plus size={18} className="me-2" />Add User
                            </Button>
                        )}
                    </div>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 text-muted fw-medium py-3" style={{ width: '60px' }}>Profile</th>
                                <th className="text-muted fw-medium py-3" style={{ width: '30%' }}>Name</th>
                                <th className="text-muted fw-medium py-3" style={{ width: '40%' }}>Email</th>
                                {isAdmin && <th className="pe-4 text-end text-muted fw-medium py-3" style={{ width: '110px' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
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
                                        {isAdmin && (
                                            <td className="pe-4 text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Button variant="link" className="p-1 text-success" onClick={() => handleEditUser(user)}><PenLine size={18} /></Button>
                                                    <Button variant="link" className="p-1 text-danger" onClick={() => handleDeleteClick(user)}><Trash2 size={18} /></Button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center py-5 text-muted">No users found.</td></tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
                <Card.Footer className="bg-white border-top-0">
                    {!loading && totalRecords > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={paginate}
                            totalRecords={totalRecords}
                            startIndex={startIndex}
                            endIndex={endIndex}
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

            <ConfirmationModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete User"
                message="Are you sure you want to delete this user?"
                confirmText="Delete"
                confirmVariant="danger"
                loading={deleteLoading}
            />
        </Container>
    );
};

export default UserManagement;
