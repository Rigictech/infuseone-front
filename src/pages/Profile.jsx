import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Image, Alert } from 'react-bootstrap';
import { Eye, EyeOff, PenLine } from 'lucide-react';
import { useUser } from '../context/UserContext';
import '../styles/Profile.css';

const Profile = () => {
    const { userProfile, updateProfileImage, updateProfileData } = useUser();

    // Separate states for separate forms
    const [email, setEmail] = useState(userProfile.email);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: ''
    });

    // UI State
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false
    });
    const [status, setStatus] = useState({
        type: '', // 'success' or 'error'
        message: ''
    });

    const fileInputRef = useRef(null);

    // Sync local email state if context changes externally
    useEffect(() => {
        setEmail(userProfile.email);
    }, [userProfile.email]);

    // Avatar Handling
    const handleAvatarClick = () => fileInputRef.current.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setStatus({ type: 'error', message: 'Image size must be less than 2MB.' });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                updateProfileImage(reader.result); // Update Context mainly
                setStatus({ type: 'success', message: 'Profile picture updated!' });
            };
            reader.readAsDataURL(file);
        }
    };

    // Email Update
    const handleEmailUpdate = (e) => {
        e.preventDefault();
        // Simulate API call
        console.log('Updating Email:', email);
        updateProfileData({ email });
        setStatus({ type: 'success', message: 'Email updated successfully!' });
    };

    // Password Update
    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (!passwords.currentPassword || !passwords.newPassword) {
            setStatus({ type: 'error', message: 'Please fill in all password fields.' });
            return;
        }
        if (passwords.newPassword.length < 6) {
            setStatus({ type: 'error', message: 'New password must be at least 6 characters.' });
            return;
        }
        // Simulate API call
        console.log('Updating Password:', passwords);
        setStatus({ type: 'success', message: 'Password updated successfully!' });
        setPasswords({ currentPassword: '', newPassword: '' });
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <Container fluid className="py-4">
            {status.message && (
                <Alert variant={status.type === 'error' ? 'danger' : 'success'} onClose={() => setStatus({ type: '', message: '' })} dismissible>
                    {status.message}
                </Alert>
            )}

            <Row className="justify-content-center">
                <Col>
                    <Card className="border-0 shadow-sm overflow-hidden mb-4">
                        <div className="profile-header-bg"></div>
                        <Card.Body className="pt-0 position-relative text-center">
                            {/* Avatar Section */}
                            <div className="d-flex flex-column align-items-center mb-3" style={{ marginTop: '-50px' }}>
                                <div
                                  className="avatar-wrapper position-relative rounded-circle border border-4 border-white shadow-sm d-flex align-items-center justify-content-center"
                                  style={{ width: 100, height: 100, backgroundColor: '#d2d5e0' }}
                                  onClick={handleAvatarClick}
                                  role="button"                             
>
                                  {userProfile.avatar ? (
                                    <Image
                                      src={userProfile.avatar}
                                      roundedCircle
                                      className="w-100 h-100 object-fit-cover"
                                    />
                                  ) : (
                                    <span
                                      className="fw-bold"
                                      style={{ fontSize: 32, color: '#003366' }}
                                    >
                                      {userProfile.name
                                        .split(' ')
                                        .map(n => n[0])
                                        .join('')
                                        .substring(0, 2)
                                        .toUpperCase()}
                                    </span>
                                  )}

                                  {/* Camera icon */}
                                  <div
                                    className="position-absolute bottom-0 end-0 bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                    style={{ width: 28, height: 28, transform: 'translate(25%, 25%)' }}
                                  >
                                    <PenLine size={16} />
                                  </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/png, image/jpeg"
                                        className="d-none"
                                    />
                                </div>
                                <h3 className="mt-3 fw-bold mb-1">{userProfile.name}</h3>
                                <p className="text-muted small mb-0">{userProfile.role}</p>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Email Update Form */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body>
                            <h6 className="fw-bold mb-3 text-primary">Update Email</h6>
                            <Form onSubmit={handleEmailUpdate}>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label className="fw-medium small">Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <div className="text-end">
                                    <Button
                                        type="submit"
                                        size="sm"
                                        style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                                    >
                                        Update Email
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Password Update Form */}
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h6 className="fw-bold mb-3 text-primary">Change Password</h6>
                            <Form onSubmit={handlePasswordUpdate}>
                                <Form.Group className="mb-3" controlId="currentPassword">
                                    <Form.Label className="fw-medium small">Current Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showPassword.current ? "text" : "password"}
                                            value={passwords.currentPassword}
                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                            required
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            className="border-start-0 border"
                                            onClick={() => togglePasswordVisibility('current')}
                                        >
                                            {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </Button>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="newPassword">
                                    <Form.Label className="fw-medium small">New Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showPassword.new ? "text" : "password"}
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            required
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            className="border-start-0 border"
                                            onClick={() => togglePasswordVisibility('new')}
                                        >
                                            {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                                <div className="text-end">
                                    <Button
                                        type="submit"
                                        size="sm"
                                        style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                                    >
                                        Update Password
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
