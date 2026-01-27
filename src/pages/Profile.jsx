import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Spinner } from 'react-bootstrap';
import { Eye, EyeOff, PenLine, Copy, Check, WandSparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import userService from '../services/userService';
import toast from 'react-hot-toast';
import '../styles/Profile.css';

const Profile = () => {
    const { userProfile, updateUserAfterSuccess, refreshUser, getAvatarSrc } = useUser();

    const [name, setName] = useState(userProfile.name);
    const [email, setEmail] = useState(userProfile.email);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: ''
    });

    // UI State
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [validatedProfile, setValidatedProfile] = useState(false);
    const [validatedPassword, setValidatedPassword] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false
    });
    const [copied, setCopied] = useState(false);

    const imageUrl = import.meta.env.VITE_LARAVEL_IMAGE_URL;
    const fileInputRef = useRef(null);

    // Sync local email state if context changes externally
    useEffect(() => {
        setEmail(userProfile.email);
        setName(userProfile.name);
    }, [userProfile.email, userProfile.name]);

    // Avatar Handling
    const handleAvatarClick = () => fileInputRef.current.click();
    const avatarSrc = getAvatarSrc(imageUrl);

    const handleFileChange = async (e) => {

        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size must be less than 2MB.');
            return;
        }

        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64Image = reader.result;

            setLoading(true);
            try {
                const payload = {
                    profile_image: base64Image
                };

                await userService.updateProfileImage(payload);

                // Update global state ONCE (bump version) + re-fetch latest server image path
                updateUserAfterSuccess({});
                await refreshUser();

                toast.success('Profile picture updated!');

            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to update profile picture.');
            } finally {
                setLoading(false);
            }
        };

        reader.readAsDataURL(file);
    };

    // Email Update
    const handleEmailUpdate = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidatedProfile(true);
            return;
        }

        setLoadingProfile(true);

        try {
            await userService.updateProfile({ name, email });

            // Update global ONCE
            updateUserAfterSuccess({ name, email });

            // Re-fetch to ensure UI is in sync with backend (and triggers re-render everywhere)
            await refreshUser();

            toast.success('Profile updated successfully!');

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoadingProfile(false);
        }
    };

    // Password Update
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidatedPassword(true);
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters.');
            return;
        }

        setLoadingPassword(true);

        try {
            await userService.changePassword({
                current_password: passwords.currentPassword,
                new_password: passwords.newPassword,
                new_password_confirmation: passwords.newPassword // Often required
            });
            toast.success('Password updated successfully!');
            setPasswords({ currentPassword: '', newPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password.');
        } finally {
            setLoadingPassword(false);
        }
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
        setPasswords(prev => ({ ...prev, newPassword: newPassword }));
        setCopied(false);
    };

    const copyToClipboard = () => {
        if (passwords.newPassword) {
            navigator.clipboard.writeText(passwords.newPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Container fluid className="py-4">

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
                                    {avatarSrc ? (
                                        <Image
                                            src={avatarSrc}
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
                            <h6 className="fw-bold mb-3 text-primary">Update Profile</h6>
                            <Form noValidate validated={validatedProfile} onSubmit={handleEmailUpdate}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label className="fw-medium small">Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={name}
                                        placeholder="Enter your name"
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        maxLength={100}
                                        isInvalid={validatedProfile ? !name : name.length > 50}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {name.length > 50 ? "Name must be within 50 characters." : "Name is required."}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label className="fw-medium small">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        placeholder="Enter your email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a valid email.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <div className="text-end">
                                    <Button
                                        type="submit"
                                        size="sm"
                                        style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                                        disabled={loadingProfile || name.length > 50}
                                    >
                                        {loadingProfile ? <Spinner animation="border" size="sm" /> : 'Update Profile'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Password Update Form */}
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h6 className="fw-bold mb-3 text-primary">Change Password</h6>
                            <Form noValidate validated={validatedPassword} onSubmit={handlePasswordUpdate}>
                                <Form.Group className="mb-3" controlId="currentPassword">
                                    <Form.Label className="fw-medium small">Current Password</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type={showPassword.current ? "text" : "password"}
                                            value={passwords.currentPassword}
                                            placeholder="Enter your current password"
                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                            required
                                        />
                                        <div className="position-absolute top-0 end-0 pe-3 d-flex gap-3 align-items-center text-secondary"
                                            onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                                            style={{ cursor: 'pointer', height: '38px' }}
                                            title={showPassword.current ? "Hide" : "Show"}
                                        >
                                            {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </div>
                                        <Form.Control.Feedback type="invalid">
                                            Current password is required.
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="newPassword">
                                    <Form.Label className="fw-medium small">New Password</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type={showPassword.new ? "text" : "password"}
                                            value={passwords.newPassword}
                                            placeholder="Enter your new password"
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            required
                                            style={{ paddingRight: '120px' }}
                                        />
                                        <div className="position-absolute top-0 end-0 pe-3 d-flex gap-3 align-items-center text-secondary"
                                            style={{ height: '38px' }}
                                        >
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
                                        <Form.Control.Feedback type="invalid">
                                            New password is required.
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>
                                <div className="text-end">
                                    <Button
                                        type="submit"
                                        size="sm"
                                        style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                                        disabled={loadingPassword}
                                    >
                                        {loadingPassword ? <Spinner animation="border" size="sm" /> : 'Update Password'}
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
