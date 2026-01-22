import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import userService from '../services/userService';
import { useUser } from '../context/UserContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();
    const { setUserProfile, refreshUser } = useUser();

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
        if (!password) newErrors.password = 'Password is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            try {
                setLoading(true);
                setApiError('');

                const response = await userService.login({ email, password, "device_name": "web" });

                // Assuming response.data.token or similar structure
                const { token, type, user } = response.data; // Adjust based on actual API response
                if (token) {
                    localStorage.setItem('authToken', token);
                    if (type) localStorage.setItem('role', type);
                    localStorage.setItem('user', JSON.stringify(user));

                    // Update context immediately
                    setUserProfile({
                        name: user?.name || '',
                        email: user?.email || '',
                        role: user?.roles[0]?.name || type?.[0] || '',
                        profile_image: user.profile_image || user.avatar || null,
                        avatarVersion: Date.now(),
                    });

                    // Trigger a fresh fetch in background just in case
                    refreshUser().catch(() => { });

                    if (user?.roles?.[0]?.name === 'Admin') {
                        navigate('/users-list');
                    } else {
                        navigate('/formstack-list');
                    }
                } else {
                    setApiError('Login failed: No token received');
                }
            } catch (err) {
                console.error(err);
                setApiError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <Card className="shadow-sm border-0" style={{ maxWidth: '400px', width: '100%' }}>
                <Card.Body className="p-4 p-sm-5">
                    <div className="text-center mb-4">
                        <img
                            src="./favicon.png"
                            alt="Infuse One Logo"
                            height={100}
                            width="auto"
                            className="mb-3"
                        />
                    </div>

                    {apiError && <Alert variant="danger">{apiError}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({ ...errors, email: null });
                                }}
                                placeholder="Enter your email"
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors({ ...errors, password: null });
                                    }}
                                    placeholder="Enter your password"
                                    isInvalid={!!errors.password}
                                />
                                <div
                                    className="position-absolute top-50 end-0 translate-middle-y pe-3 d-flex align-items-center text-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ cursor: 'pointer' }}
                                    title={showPassword ? "Hide" : "Show"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </div>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mb-3 fw-semibold"
                            style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                            disabled={loading}
                        >
                            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Login'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
