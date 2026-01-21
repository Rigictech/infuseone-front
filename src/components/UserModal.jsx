import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const UserModal = ({ show, onHide, onSubmit, user, title }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'Active'
    });
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                status: user.status || 'Active'
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                status: 'Active'
            });
        }
        setValidated(false);
    }, [user, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        onSubmit(formData);
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-3">
                <Form noValidate validated={validated} onSubmit={handleSubmit} id="userForm">
                    <Row className="gy-3">
                        <Col xs={12}>
                            <Form.Group controlId="name">
                                <Form.Label className="fw-medium">Full Name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="name"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Name is required.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col xs={12}>
                            <Form.Group controlId="email">
                                <Form.Label className="fw-medium">Email Address</Form.Label>
                                <Form.Control
                                    required
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a valid email.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col xs={12}>
                            <Form.Group controlId="phone">
                                <Form.Label className="fw-medium">Phone Number</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Phone number is required.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col xs={12}>
                            <Form.Group controlId="status">
                                <Form.Label className="fw-medium">Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
                <Button variant="light" onClick={onHide}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    type="submit"
                    form="userForm"
                    style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                >
                    {user ? 'Save Changes' : 'Create User'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserModal;
