import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({
    show,
    onHide,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    confirmVariant = "danger",
    icon: Icon = AlertTriangle
}) => {
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
                    <div className={`bg-${confirmVariant} bg-opacity-10 p-3 rounded-circle d-inline-flex`}>
                        <Icon size={32} className={`text-${confirmVariant}`} />
                    </div>
                </div>
                <h5 className="mb-2">{title}</h5>
                <p className="text-muted mb-0">
                    {message}
                </p>
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-center pb-4">
                <Button
                    variant="light"
                    onClick={onHide}
                    className="px-4 fw-medium"
                >
                    Cancel
                </Button>
                <Button
                    variant={confirmVariant}
                    onClick={onConfirm}
                    className="px-4 fw-medium d-flex align-items-center"
                    style={confirmVariant === 'danger' ? { backgroundColor: '#dc3545', borderColor: '#dc3545' } : {}}
                >
                    {confirmText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
