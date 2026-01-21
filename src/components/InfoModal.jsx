import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const InfoModal = ({ show, onHide, onSubmit, initialData }) => {
    const [text, setText] = useState('');
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (initialData) {
            setText(initialData.text);
        } else {
            setText('');
        }
        setValidated(false);
    }, [initialData, show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            onSubmit(text);
        }
        setValidated(true);
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold">{initialData ? 'Edit Info' : 'Add Info Paragraph'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit} id="infoForm">
                    <Form.Group controlId="infoText">
                        <Form.Label className="fw-medium">Content</Form.Label>
                        <Form.Control
                            required
                            as="textarea"
                            rows={6}
                            placeholder="Enter important information here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">Content cannot be empty.</Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="light" onClick={onHide}>Cancel</Button>
                <Button
                    variant="primary"
                    type="submit"
                    form="infoForm"
                    style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default InfoModal;
