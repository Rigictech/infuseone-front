import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import userService from '../services/userService';

const UserContext = createContext(null);

const bumpVersion = () => Date.now();

export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Ensure we have at least the basic structure if parsing succeeds
                return {
                    name: parsed.name || '',
                    email: parsed.email || '',
                    role: parsed.role || '',
                    profile_image: parsed.profile_image || parsed.avatar || null,
                    avatarVersion: bumpVersion(),
                };
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
            }
        }
        return {
            name: '',
            email: '',
            role: '',
            profile_image: null,
            avatarVersion: bumpVersion(),
        };
    });

    const refreshUser = useCallback(async () => {
        const res = await userService.showProfile();
        const data = res?.data?.data || {};

        setUserProfile(prev => ({
            ...prev,
            // keep prev values if API doesn't return them
            name: data.name ?? prev.name,
            email: data.email ?? prev.email,
            role: data.role ?? prev.role,
            profile_image: data.profile_image ?? prev.profile_image,
            avatarVersion: bumpVersion(),
        }));
    }, []);

    useEffect(() => {
        // initial load for TopBar
        refreshUser().catch(() => { });
    }, [refreshUser]);

    const updateUserAfterSuccess = useCallback((patch = {}) => {
        // Call this ONLY after successful API update
        setUserProfile(prev => ({
            ...prev,
            ...patch,
            avatarVersion: bumpVersion(),
        }));
    }, []);

    const getAvatarSrc = useCallback((baseUrl) => {
        if (!userProfile.profile_image) return null;
        // cache bust
        return `${baseUrl}${userProfile.profile_image}?v=${userProfile.avatarVersion}`;
    }, [userProfile.profile_image, userProfile.avatarVersion]);

    return (
        <UserContext.Provider
            value={{
                userProfile,
                setUserProfile,
                refreshUser,
                updateUserAfterSuccess,
                getAvatarSrc,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
};
