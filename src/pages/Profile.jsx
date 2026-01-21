import React, { useState } from 'react';
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
        <div className="profile-card">
            <div className="profile-header-bg"></div>
            <div className="profile-content">
                <div className="profile-avatar-large">
                    {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>

                <div className="profile-info">
                    <h2 className="profile-name">{profile.name}</h2>
                    <p className="profile-role">{profile.role}</p>
                </div>

                <hr style={{ borderColor: 'var(--border-color)', margin: '0 0 20px 0' }} />

                <form className="profile-form">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            value={profile.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={profile.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Role</label>
                        <input
                            type="text"
                            name="role"
                            className="form-input"
                            value={profile.role}
                            readOnly
                            disabled
                            style={{ backgroundColor: '#f1f5f9' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Bio</label>
                        <textarea
                            name="bio"
                            className="form-input"
                            rows="3"
                            value={profile.bio}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </form>

                <div className="profile-actions">
                    <button className="btn btn-outline">Cancel</button>
                    <button className="btn btn-primary">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
