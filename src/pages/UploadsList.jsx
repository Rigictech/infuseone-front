import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { Plus, Search, PenLine, Trash2, Download, FileText } from 'lucide-react';
import { uploadService } from '../services/uploadService';
import UploadModal from '../components/UploadModal';
import Pagination from '../components/Pagination';

const UploadsList = () => {
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [showModal, setShowModal] = useState(false);
    const [editingUpload, setEditingUpload] = useState(null);

    useEffect(() => {
        fetchUploads();
    }, []);

    const fetchUploads = async () => {
        try {
            setLoading(true);
            const data = await uploadService.getUploads();
            setUploads(data);
        } catch (err) {
            setError('Failed to load uploads.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingUpload(null);
        setShowModal(true);
    };

    const handleEdit = (upload) => {
        setEditingUpload(upload);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this file?')) {
            try {
                await uploadService.deleteUpload(id);
                fetchUploads();
            } catch (err) {
                alert('Failed to delete upload');
            }
        }
    };

    const handleDownload = async (fileName) => {
        try {
            await uploadService.downloadFile(fileName);
        } catch (err) {
            alert('Download failed');
        }
    };

    const handleModalSubmit = async (formData) => {
        try {
            if (editingUpload) {
                await uploadService.updateUpload(editingUpload.id, formData);
            } else {
                await uploadService.uploadFile(formData);
            }
            setShowModal(false);
            fetchUploads();
        } catch (err) {
            alert('Operation failed');
        }
    };

    // Filter Logic
    const filteredUploads = uploads.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUploads.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUploads.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        setCurrentPage(1);
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
                                placeholder="Search uploads..."
                                className="bg-light border-0 rounded-end-pill"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                        <Button
                            className="rounded-pill px-4"
                            style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                            onClick={handleAdd}
                        >
                            <Plus size={18} className="me-2" />Add Upload
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 py-3 text-muted fw-medium">Name</th>
                                <th className="py-3 text-muted fw-medium">Created Date</th>
                                <th className="pe-4 py-3 text-center text-muted fw-medium" style={{ width: '150px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="3" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map(upload => (
                                    <tr key={upload.id}>
                                        <td className="ps-4 fw-medium">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-light p-2 rounded text-danger"><FileText size={18} /></div>
                                                {upload.name}
                                            </div>
                                        </td>
                                        <td className="text-muted small">{upload.uploadDate}</td>
                                        <td className="pe-4 text-center">
                                            <div className="d-flex justify-content-center gap-1">
                                                <Button variant="link" className="p-1 text-primary" onClick={() => handleDownload(upload.fileName)} title="Download"><Download size={18} /></Button>
                                                <Button variant="link" className="p-1 text-success" onClick={() => handleEdit(upload)} title="Edit"><PenLine size={18} /></Button>
                                                <Button variant="link" className="p-1 text-danger" onClick={() => handleDelete(upload.id)} title="Delete"><Trash2 size={18} /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="text-center py-5 text-muted">No uploads found.</td></tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
                <Card.Footer className="bg-white border-top-0">
                    {!loading && filteredUploads.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={paginate}
                            totalRecords={filteredUploads.length}
                            startIndex={indexOfFirstItem + 1}
                            endIndex={Math.min(indexOfLastItem, filteredUploads.length)}
                        />
                    )}
                </Card.Footer>
            </Card>

            <UploadModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleModalSubmit}
                initialData={editingUpload}
            />
        </Container>
    );
};

export default UploadsList;
