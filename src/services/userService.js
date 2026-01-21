// Mock data to simulate Backend Database
const MOCK_USERS = [
    { id: 1, no: 1, initials: 'DD', bgColor: '#dbeafe', textColor: '#1e40af', name: 'DR DAVID SILVERS', email: 'INFO@GARDENSNEUROLOGY.COM', phone: '5617992831', status: 'Active' },
    { id: 2, no: 2, initials: 'WO', bgColor: '#dbeafe', textColor: '#1e40af', name: 'Winston Ortiz', email: 'cgrimes@tnc-neuro.com', phone: '8508788121', status: 'Inactive' },
    { id: 3, no: 3, initials: 'AP', bgColor: '#dbeafe', textColor: '#1e40af', name: 'Dr Anand Patel', email: 'Info@infuseone.com', phone: '5613374055', status: 'Active' },
    { id: 4, no: 4, initials: 'RD', bgColor: '#e0e7ff', textColor: '#3730a3', name: 'Test RRR Provider', email: 'rrr@example.com', phone: '6456789678', status: 'Active' },
    { id: 5, no: 5, initials: 'TU', bgColor: '#dbeafe', textColor: '#1e40af', name: 'Test provider', email: 'test@example.com', phone: '9737143247', status: 'Active' },
    { id: 6, no: 8, initials: 'TR', bgColor: '#dbeafe', textColor: '#1e40af', name: 'Test Rigic Provider', email: 'tech@rigicglobalsolutions.com', phone: '4528369595', status: 'Active' },
    { id: 7, no: 7, initials: 'AP', bgColor: '#fae8ff', textColor: '#86198f', name: 'Provider Anand', email: 'anand@infuseone.com', phone: '1234567891', status: 'Active' },
];

/**
 * Simulate network delay
 * @param {number} ms 
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
    /**
     * Fetch all users
     */
    getUsers: async () => {
        await delay(800);
        return [...MOCK_USERS]; // Return copy
    },

    /**
     * Create a new user
     * @param {Object} userData 
     */
    createUser: async (userData) => {
        await delay(800);
        const newUser = {
            id: Date.now(),
            no: MOCK_USERS.length + 1,
            initials: userData.name.substring(0, 2).toUpperCase(),
            bgColor: '#e0e7ff', // Default mock color
            textColor: '#3730a3',
            status: 'Active',
            ...userData
        };
        MOCK_USERS.push(newUser);
        return newUser;
    },

    /**
     * Update an existing user
     * @param {number} id 
     * @param {Object} userData 
     */
    updateUser: async (id, userData) => {
        await delay(800);
        const index = MOCK_USERS.findIndex(u => u.id === id);
        if (index !== -1) {
            MOCK_USERS[index] = { ...MOCK_USERS[index], ...userData };
            return MOCK_USERS[index];
        }
        throw new Error('User not found');
    },

    /**
     * Delete a user
     * @param {number} id 
     */
    deleteUser: async (id) => {
        await delay(800);
        const index = MOCK_USERS.findIndex(u => u.id === id);
        if (index !== -1) {
            MOCK_USERS.splice(index, 1);
            return true;
        }
        throw new Error('User not found');
    }
};
