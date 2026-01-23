import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await userService.forgotPassword({ email });
            if (response.data.status) {
                toast.success(response.data.message || 'Password reset successfully! You can now login.');
                navigate('/login');
            } else {
                toast.error(response.data.message || 'Failed to reset password.');
            }
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
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
                        <h4 className="fw-bold " style={{ color: '#003366' }}>Forgot Password?</h4>
                        <p className="text-muted small">Enter your email to receive a reset link.</p>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4" controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mb-3 fw-semibold"
                            style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                            disabled={loading}
                        >
                            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Send Reset Link'}
                        </Button>

                        <div className="text-center">
                            <Link to="/login" className="text-decoration-none text-muted small">
                                Back to Login
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ForgotPassword;
