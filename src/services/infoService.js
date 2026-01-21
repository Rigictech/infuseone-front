// Mock data for Info Paragraphs
const MOCK_INFO = [
    { id: 1, text: 'Welcome to the Infuse One Admin Panel. Here you can manage users, update form URLs, and configure system settings.' },
    { id: 2, text: 'Please ensure all user data is handled in compliance with HIPAA regulations. Do not share credentials.' },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const infoService = {
    getAll: async () => {
        await delay(600);
        return [...MOCK_INFO];
    },

    create: async (text) => {
        await delay(600);
        const newInfo = { id: Date.now(), text };
        MOCK_INFO.push(newInfo);
        return newInfo;
    },

    update: async (id, text) => {
        await delay(600);
        const index = MOCK_INFO.findIndex(i => i.id === id);
        if (index !== -1) {
            MOCK_INFO[index] = { ...MOCK_INFO[index], text };
            return MOCK_INFO[index];
        }
        throw new Error('Info not found');
    },

    delete: async (id) => {
        await delay(600);
        const index = MOCK_INFO.findIndex(i => i.id === id);
        if (index !== -1) {
            MOCK_INFO.splice(index, 1);
            return true;
        }
        throw new Error('Info not found');
    }
};
