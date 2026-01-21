import React, { useState } from 'react';
import { Edit, Trash2, Plus, Search, ChevronDown, ChevronLeft, ChevronRight, PenLine, Lock, Unlock } from 'lucide-react';
import '../styles/UserManagement.css';

const UserManagement = () => {
    // Mock data matching the screenshot
    const [users] = useState([
        { id: 1, no: 1, initials: 'DD', bgColor: '#dbeafe', textColor: '#1e40af', username: 'dsilvers', name: 'DR DAVID SILVERS', email: 'INFO@GARDENSNEUROLOGY.COM', phone: '5617992831', status: 'Active' },
        { id: 2, no: 2, initials: 'WO', bgColor: '#dbeafe', textColor: '#1e40af', username: 'CrisitonG', name: 'Winston Ortiz', email: 'cgrimes@tnc-neuro.com', phone: '8508788121', status: 'Inactive' },
        { id: 3, no: 3, initials: 'AP', bgColor: '#dbeafe', textColor: '#1e40af', username: 'Info@infuseone.com', name: 'Dr Anand Patel', email: 'Info@infuseone.com', phone: '5613374055', status: 'Active' },
        { id: 4, no: 4, initials: 'RD', bgColor: '#e0e7ff', textColor: '#3730a3', username: 'RRR DEV', name: 'Test RRR Provider', email: 'rrr@example.com', phone: '6456789678', status: 'Active' },
        { id: 5, no: 5, initials: 'TU', bgColor: '#dbeafe', textColor: '#1e40af', username: 'Test User', name: 'Test provider', email: 'test@example.com', phone: '9737143247', status: 'Active' },
        { id: 6, no: 8, initials: 'TR', bgColor: '#dbeafe', textColor: '#1e40af', username: 'Test Rigic', name: 'Test Rigic Provider', email: 'tech@rigicglobalsolutions.com', phone: '4528369595', status: 'Active' },
        { id: 7, no: 7, initials: 'AP', bgColor: '#fae8ff', textColor: '#86198f', username: 'Anand Patel', name: 'Provider Anand', email: 'anand@infuseone.com', phone: '1234567891', status: 'Active' },
    ]);

    return (
        <div className="user-management">
            <h2 className="page-header-title">User List</h2>

            <div className="user-controls-container">
                <div className="controls-left">
                    <div className="search-wrapper">
                        <input type="text" placeholder="Search..." className="search-input" />
                    </div>
                    <div className="filter-wrapper">
                        <button className="filter-btn">
                            Filter Status... <ChevronDown size={14} />
                        </button>
                    </div>
                </div>
                <button className="btn btn-add-user">
                    + Add New User
                </button>
            </div>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>No</th>
                                <th style={{ width: '120px' }}>Profile Image</th>
                                <th>Username</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.no}</td>
                                    <td>
                                        <div
                                            className="table-avatar-initials"
                                            style={{ backgroundColor: user.bgColor, color: user.textColor }}
                                        >
                                            {user.initials}
                                        </div>
                                    </td>
                                    <td>{user.username}</td>
                                    <td>
                                        <div className="user-name-cell">
                                            {user.name}
                                        </div>
                                    </td>
                                    <td className="email-cell">{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        <span className={`status-pill ${user.status.toLowerCase()}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-icon edit" title="Edit">
                                                <PenLine size={16} />
                                            </button>
                                            <button className="action-icon reset" title="Lock/Unlock">
                                                <Unlock size={16} />
                                            </button>
                                            <button className="action-icon delete" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-container">
                    <div className="pagination">
                        <button className="page-btn disabled" disabled><ChevronLeft size={16} /></button>
                        <button className="page-btn active">1</button>
                        <button className="page-btn"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            <div className="footer-copyright">
                2026 © Infuse One | All Rights Reserved.
            </div>
        </div>
    );
};

export default UserManagement;
