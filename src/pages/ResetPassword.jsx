import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, WandSparkles, Copy, Check } from 'lucide-react';
import userService from '../services/userService';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');

    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const urlEmail = searchParams.get('email');
        const urlToken = searchParams.get('token');

        if (urlEmail) setEmail(urlEmail);
        if (urlToken) setToken(urlToken);
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let newPassword = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            newPassword += charset.charAt(Math.floor(Math.random() * n));
        }
        setPasswords(prev => ({ ...prev, newPassword: newPassword, confirmPassword: newPassword }));
        setCopied(false);
    };

    const copyToClipboard = () => {
        if (passwords.newPassword) {
            navigator.clipboard.writeText(passwords.newPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success('Password copied to clipboard!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !token) {
            setError('Invalid reset link. Missing email or token.');
            return;
        }

        if (passwords.newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            debugger
            const response = await userService.resetPassword({
                email,
                token,
                password: passwords.newPassword,
                password_confirmation: passwords.confirmPassword
            });

            if (response.data.status) {
                toast.success(response.data.message || 'Password reset successfully! You can now login.');
                navigate('/login');
            } else {
                toast.error(response.data.message || 'Failed to reset password.');
            }

        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to reset password. Link may be expired.';
            setError(errorMessage);
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
                        <h4 className="fw-bold" style={{ color: '#003366' }}>Reset Password</h4>
                        <p className="text-muted small">Create a new strong password for your account.</p>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        {/* Hidden/Read-only Email Field if you want to show it, or just keep it internal */}
                        {/* <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={email} disabled className="bg-light" />
                        </Form.Group> */}

                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>New Password</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showPassword.new ? "text" : "password"}
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handleChange}
                                    placeholder="New password"
                                    required
                                    style={{ paddingRight: '120px' }}
                                />
                                <div className="position-absolute top-50 end-0 translate-middle-y pe-3 d-flex gap-3 align-items-center text-secondary">
                                    <WandSparkles
                                        size={18}
                                        style={{ cursor: 'pointer' }}
                                        onClick={generatePassword}
                                        title="Generate Strong Password"
                                    />
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        onClick={copyToClipboard}
                                        title="Copy to Clipboard"
                                    >
                                        {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                                    </div>
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => togglePasswordVisibility('new')}
                                        title={showPassword.new ? "Hide" : "Show"}
                                    >
                                        {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </div>
                                </div>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    required
                                />
                                <div
                                    className="position-absolute top-50 end-0 translate-middle-y pe-3 d-flex align-items-center text-secondary"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    style={{ cursor: 'pointer' }}
                                    title={showPassword.confirm ? "Hide" : "Show"}
                                >
                                    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mb-3 fw-semibold"
                            style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                            disabled={loading}
                        >
                            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Reset Password'}
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

export default ResetPassword;
