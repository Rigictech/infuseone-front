import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, InputGroup, Form, Spinner, Alert } from 'react-bootstrap';
import { Plus, Search, PenLine, Trash2 } from 'lucide-react';
import formStackService from '../services/formStackService';
import UrlModal from '../components/UrlModal';
import Pagination from '../components/Pagination';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const FormstackList = () => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const role = localStorage.getItem('role');
    const isAdmin = role == 'Admin';
    const navigate = useNavigate();
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingUrl, setEditingUrl] = useState(null);
    const [urlToDelete, setUrlToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchUrls(currentPage);
    }, [currentPage]);

    const fetchUrls = async (page = 1) => {
        try {
            setLoading(true);
            const response = await formStackService.index(page);
            const responseData = response?.data?.form_stack_url;

            if (responseData) {
                setUrls(Array.isArray(responseData.data) ? responseData.data : []);
                setTotalPages(responseData.meta.last_page);
                setTotalRecords(responseData.meta.total);
                setStartIndex(responseData.meta.from);
                setEndIndex(responseData.meta.to);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load Formstack URLs.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingUrl(null);
        setShowModal(true);
    };

    const handleEdit = (url) => {
        setEditingUrl(url);
        setShowModal(true);
    };

    const handleDeleteClick = (url) => {
        setUrlToDelete(url);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!urlToDelete) return;

        setDeleteLoading(true);
        try {
            await formStackService.delete(urlToDelete.id);
            toast.success('Formstack URL deleted successfully');
            fetchUrls(currentPage);
            setShowDeleteModal(false);
            setUrlToDelete(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete URL');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleModalSubmit = async (data) => {
        try {
            if (editingUrl) {

                const response = await formStackService.update(editingUrl.id, data);

                if (response.data.status) {
                    toast.success(response.data.message || 'Formstack URL updated successfully');
                    navigate('/formstack-list');
                } else {
                    toast.error(response.data.message || 'Failed to update URL.');
                }
            } else {
                const response = await formStackService.store(data);
                if (response.data.status) {
                    toast.success(response.data.message || 'Formstack URL added successfully');
                    navigate('/formstack-list');
                } else {
                    toast.error(response.data.message || 'Failed to add URL.');
                }
            }
            setShowModal(false);
            fetchUrls(currentPage);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    // Filter Logic - Applied to the currently fetched page
    const filteredUrls = Array.isArray(urls)
        ? urls.filter(u => (u.title || u.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Initial load handled by first use effect on currentPage change

    return (
        <Container fluid className="py-4">
            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom-0 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <InputGroup style={{ maxWidth: '300px' }}>
                            <InputGroup.Text className="bg-light border-0 ps-3 rounded-start-pill">
                                <Search size={18} className="text-muted" />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Search forms..."
                                className="bg-light border-0 rounded-end-pill"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                        {isAdmin && (
                            <Button
                                className="rounded-pill px-4"
                                style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                                onClick={handleAdd}
                            >
                                <Plus size={18} className="me-2" />Add Formstack
                            </Button>
                        )}
                    </div>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 py-3 text-muted fw-medium">Title</th>
                                <th className="py-3 text-muted fw-medium">URL</th>
                                {isAdmin && <th className="pe-4 py-3 text-center text-muted fw-medium" style={{ width: '120px' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="3" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                            ) : filteredUrls.length > 0 ? (
                                filteredUrls.map(url => (
                                    <tr key={url.id}>
                                        <td className="ps-4 fw-medium">{url.title || url.name}</td>
                                        <td><a href={url.url || url.URL} target="_blank" rel="noopener noreferrer" className="text-decoration-none">{url.url || url.URL}</a></td>
                                        {isAdmin && (
                                            <td className="pe-4 text-center">
                                                <Button variant="link" className="p-1 text-success me-2" onClick={() => handleEdit(url)}><PenLine size={18} /></Button>
                                                <Button variant="link" className="p-1 text-danger" onClick={() => handleDeleteClick(url)}><Trash2 size={18} /></Button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="text-center py-5 text-muted">No URLs found.</td></tr>
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

            <UrlModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleModalSubmit}
                initialData={editingUrl}
                title={editingUrl ? 'Edit Formstack' : 'Add New Formstack'}
            />

            <ConfirmationModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Form"
                message="Are you sure you want to delete this form URL?"
                confirmText="Delete"
                confirmVariant="danger"
                loading={deleteLoading}
            />
        </Container>
    );
};

export default FormstackList;
