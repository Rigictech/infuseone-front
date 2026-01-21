import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { Eye, EyeOff, RefreshCw, Copy, Check, WandSparkles } from 'lucide-react';

const UserModal = ({ show, onHide, onSubmit, user, title }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [validated, setValidated] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '', // Usually don't show existing password
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
            });
        }
        setValidated(false);
        setCopied(false);
        setShowPassword(false);
    }, [user, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generatePassword = () => {
        const length = 8;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let newPassword = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            newPassword += charset.charAt(Math.floor(Math.random() * n));
        }
        setFormData(prev => ({ ...prev, password: newPassword }));
        setCopied(false);
    };

    const copyToClipboard = () => {
        if (formData.password) {
            navigator.clipboard.writeText(formData.password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
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
                                    autoComplete="off"
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
                                    autoComplete="off"
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a valid email.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col xs={12}>
                            <Form.Group controlId="password">
                                <Form.Label className="fw-medium">Password</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        required={!user} // Password required only for new users
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder={user ? "Leave blank to keep unchanged" : "Enter password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        minLength={6}
                                        autoComplete="new-password"
                                        style={{ paddingRight: '120px' }}
                                    />
                                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3 d-flex gap-3 align-items-center">
                                        <WandSparkles
                                            size={18}
                                            className="text-secondary"
                                            style={{ cursor: 'pointer' }}
                                            onClick={generatePassword}
                                            title="Generate Strong Password"
                                        />
                                        <div
                                            className="text-secondary"
                                            style={{ cursor: 'pointer' }}
                                            onClick={copyToClipboard}
                                            title="Copy to Clipboard"
                                        >
                                            {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                                        </div>
                                        <div
                                            className="text-secondary"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setShowPassword(!showPassword)}
                                            title={showPassword ? "Hide" : "Show"}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </div>
                                    </div>
                                </div>
                                <Form.Control.Feedback type="invalid">
                                    Password is required (min 6 chars).
                                </Form.Control.Feedback>
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
