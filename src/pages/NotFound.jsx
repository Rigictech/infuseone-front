import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
            <h1 className="display-1 fw-bold text-muted mb-0">404</h1>
            <h2 className="mb-4 text-dark">Page Not Found</h2>
            <p className="text-muted mb-4" style={{ maxWidth: '400px' }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Button
                variant="primary"
                onClick={() => navigate('/')}
                className="d-flex align-items-center px-4 py-2"
                style={{ backgroundColor: '#003366', borderColor: '#003366' }}
            >
                <ArrowLeft size={18} className="me-2" />
                Back to Home
            </Button>
        </Container>
    );
};

export default NotFound;
