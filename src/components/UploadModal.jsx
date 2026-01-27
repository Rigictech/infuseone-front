import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const UploadModal = ({ show, onHide, onSubmit, initialData }) => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setFile(null); // Reset file on edit, user might not change it
        } else {
            setTitle('');
            setFile(null);
        }
        setError(null);
        setValidated(false);
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [initialData, show]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setError('Only PDF files are allowed.');
                setFile(null);
                e.target.value = ''; // Clear input
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                setError('File size must be less than 5MB.');
                setFile(null);
                e.target.value = '';
                return;
            }
            setError(null);
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        if (!initialData && !file) {
            setError('Please select a PDF file to upload.');
            setValidated(true);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        if (file) {
            formData.append('pdf', file);
        }

        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold">{initialData ? 'Edit File' : 'Add New File'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger" className="py-2 text-center small">{error}</Alert>}
                <Form noValidate validated={validated} onSubmit={handleSubmit} id="uploadForm">
                    <Form.Group className="mb-3" controlId="uploadName">
                        <Form.Label className="fw-medium">Document Title</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={100}
                            isInvalid={validated ? !title : title.length > 50}
                        />
                        <Form.Control.Feedback type="invalid">{title.length > 50 ? "Title must be within 50 characters." : "Title is required."}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="uploadFile">
                        <Form.Label className="fw-medium">Upload File (PDF Only, Max size: 5MB)</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            required={!initialData} // Required only for new uploads
                            ref={fileInputRef}
                        />
                        <Form.Control.Feedback type="invalid">File is required.</Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="light" onClick={onHide}>Cancel</Button>
                <Button
                    variant="primary"
                    type="submit"
                    form="uploadForm"
                    style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                    disabled={loading || title.length > 50}
                >
                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : (initialData ? 'Save Changes' : 'Upload')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UploadModal;
