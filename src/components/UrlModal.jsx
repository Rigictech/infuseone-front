import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const UrlModal = ({ show, onHide, onSubmit, initialData, title }) => {
    const [formData, setFormData] = useState({ title: '', URL: '' });
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || initialData.name || '',
                URL: initialData.url || initialData.URL || ''
            });
        } else {
            setFormData({ title: '', URL: '' });
        }
        setValidated(false);
    }, [initialData, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            onSubmit(formData);
        }
        setValidated(true);
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit} id="urlForm">
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label className="fw-medium">Title</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="title"
                            placeholder="Enter title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">Title is required.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="URL">
                        <Form.Label className="fw-medium">URL</Form.Label>
                        <Form.Control
                            required
                            type="url"
                            name="URL"
                            placeholder="https://example.com"
                            value={formData.URL}
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">Please enter a valid URL.</Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="light" onClick={onHide}>Cancel</Button>
                <Button
                    variant="primary"
                    type="submit"
                    form="urlForm"
                    style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UrlModal;
