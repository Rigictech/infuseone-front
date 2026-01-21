import React, { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';

const importantInfoData = [
    "Important Information: This platform is designed to provide a secure, reliable, and user-friendly environment for managing your account, accessing services, and performing essential operations efficiently. By using this system, you agree to follow all applicable terms, conditions, and policies associated with its use. Your account credentials, including your email address and password, are strictly confidential and must not be shared with any unauthorized person.",
    "You are responsible for maintaining the security of your login details and for all activities performed under your account. It is strongly recommended to use a strong password containing a combination of uppercase and lowercase letters, numbers, and special characters, and to update it periodically to reduce the risk of unauthorized access.",
    "In case you suspect any suspicious activity, data breach, or unauthorized login attempt, you should immediately change your password and inform the system administrator or support team.",
    "All personal information provided within this platform is handled in accordance with data protection and privacy regulations. The system may collect and store certain user data such as name, email address, profile image, login history, and activity logs solely for operational, security, and service improvement purposes. This data will not be shared with third parties without proper authorization, except where required by law or for compliance with legal obligations.",

];

const InfoManager = () => {
    return (
        <Container fluid className="py-4" style={{ height: '85vh' }}>
            <Card className="border-0 shadow-sm" style={{ height: '100%' }}>
                <Card.Header className="bg-white border-bottom-0 py-3">
                </Card.Header>
                <Card.Body style={{ overflowY: 'auto' }}>
                    {importantInfoData.map((paragraph, index) => (
                        <p key={index} className="text-dark mb-3" style={{ lineHeight: '1.6', textAlign: 'justify' }}>
                            {paragraph}
                        </p>
                    ))}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default InfoManager;
