import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, InputGroup, Form, Spinner, Alert } from 'react-bootstrap';
import { Plus, Search, PenLine, Trash2 } from 'lucide-react';
import webURLService from '../services/webURLService';
import UrlModal from '../components/UrlModal';
import Pagination from '../components/Pagination';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';

const WebsiteList = () => {
    const [urls, setUrls] = useState([]);
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
    const [editingUrl, setEditingUrl] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [urlToDelete, setUrlToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchUrls();
    }, [currentPage]);

    const fetchUrls = async () => {
        try {
            setLoading(true);
            const response = await webURLService.index(currentPage);
            const data = response.data;

            let list = [];
            let meta = {};

            if (data.website_url) {
                list = data.website_url.data || [];
                meta = data.website_url.meta || {};
            } else if (data.data && Array.isArray(data.data)) {
                list = data.data;
                meta = data.meta || {};
            } else {
                list = Array.isArray(data) ? data : (data.data || []);
            }

            setUrls(list);
            setTotalPages(meta.last_page || 1);
            setTotalRecords(meta.total || list.length);
            setStartIndex(meta.from || 1);
            setEndIndex(meta.to || list.length);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load Website URLs.');
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
            await webURLService.delete(urlToDelete.id);
            toast.success('Website URL deleted successfully');
            fetchUrls();
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
                await webURLService.update(editingUrl.id, data);
                toast.success('Website URL updated successfully');
            } else {
                await webURLService.store(data);
                toast.success('Website URL added successfully');
            }
            setShowModal(false);
            fetchUrls();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    // Filter Logic - Client side on current page
    const filteredUrls = Array.isArray(urls)
        ? urls.filter(u => (u.title || u.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        // Reset or debounce logic if search was server-side
    }, [searchTerm]);

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
                                placeholder="Search websites..."
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
                                <Plus size={18} className="me-2" />Add Website
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
                title={editingUrl ? 'Edit Website' : 'Add New Website'}
            />

            <ConfirmationModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Website"
                message="Are you sure you want to delete this website URL?"
                confirmText="Delete"
                confirmVariant="danger"
                loading={deleteLoading}
            />
        </Container>
    );
};

export default WebsiteList;
