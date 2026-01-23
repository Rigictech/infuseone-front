import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { LogOut } from 'lucide-react';

const LogoutConfirmationModal = ({ show, onHide, onConfirm, loading = false }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            keyboard={false}
            contentClassName="border-0 shadow-lg"
        >
            <Modal.Body className="text-center py-4">
                <div className="mb-3">
                    <div className="bg-danger bg-opacity-10 p-3 rounded-circle d-inline-flex">
                        <LogOut size={32} className="text-danger" />
                    </div>
                </div>
                <p className="text-muted mb-0">
                    Are you sure you want to log out?
                </p>
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-center pb-4">
                <Button
                    variant="light"
                    onClick={onHide}
                    className="px-4 fw-medium"
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    onClick={onConfirm}
                    className="px-4 fw-medium d-flex align-items-center"
                    style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                    disabled={loading}
                >
                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : (
                        <>
                            <LogOut size={18} className="me-2" />
                            Logout
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LogoutConfirmationModal;
