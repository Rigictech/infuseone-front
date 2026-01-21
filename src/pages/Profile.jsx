import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import '../styles/Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState({
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'Administrator',
        bio: 'Software Engineer and Admin Panel Manager.'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Container fluid className="py-4">
            <h2 className="text-primary fw-bold mb-4">User Profile</h2>
            <Row className="justify-content-center">
                <Col md={10} lg={8} xl={6}>
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <div style={{ height: '100px', backgroundColor: '#003366' }}></div>
                        <Card.Body className="pt-0 relative">
                            <div className="d-flex flex-column align-items-center" style={{ marginTop: '-50px' }}>
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center border border-4 border-white shadow-sm"
                                    style={{ width: '100px', height: '100px', backgroundColor: '#e0e7ff', color: '#003366', fontSize: '32px', fontWeight: 'bold' }}
                                >
                                    {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                                <h3 className="mt-3 fw-bold">{profile.name}</h3>
                                <p className="text-muted">{profile.role}</p>
                            </div>

                            <hr className="my-4" />

                            <Form>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label className="fw-medium">Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label className="fw-medium">Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="role">
                                    <Form.Label className="fw-medium">Role</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="role"
                                        value={profile.role}
                                        readOnly
                                        disabled
                                        className="bg-light"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="bio">
                                    <Form.Label className="fw-medium">Bio</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="bio"
                                        value={profile.bio}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-end gap-2">
                                    <Button variant="outline-secondary">Cancel</Button>
                                    <Button
                                        variant="primary"
                                        style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                                    >
                                        Save Changes
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
