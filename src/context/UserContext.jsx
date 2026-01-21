import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState({
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'Administrator',
        avatar: null // URL or base64 string
    });

    const updateProfileImage = (newAvatar) => {
        setUserProfile(prev => ({ ...prev, avatar: newAvatar }));
    };

    const updateProfileData = (data) => {
        setUserProfile(prev => ({ ...prev, ...data }));
    };

    return (
        <UserContext.Provider value={{ userProfile, updateProfileImage, updateProfileData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
