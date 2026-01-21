const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate dummy data helpers
const generateUrls = (type, count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `${type === 'formstack' ? 'Form' : 'Website'} Link ${i + 1} - ${type === 'formstack' ? 'Survey' : 'Portal'}`,
        url: `https://${type === 'formstack' ? 'formstack' : 'example'}.com/link-${i + 1}`,
        type: type
    }));
};

const MOCK_FORMSTACK_URLS = generateUrls('formstack', 40);
const MOCK_WEBSITE_URLS = generateUrls('website', 35);

export const urlService = {
    getUrls: async (type) => {
        await delay(500);
        return type === 'formstack' ? [...MOCK_FORMSTACK_URLS] : [...MOCK_WEBSITE_URLS];
    },

    createUrl: async (type, data) => {
        await delay(500);
        const newUrl = { ...data, id: Date.now(), type };
        if (type === 'formstack') MOCK_FORMSTACK_URLS.unshift(newUrl);
        else MOCK_WEBSITE_URLS.unshift(newUrl);
        return newUrl;
    },

    updateUrl: async (type, id, data) => {
        await delay(500);
        const list = type === 'formstack' ? MOCK_FORMSTACK_URLS : MOCK_WEBSITE_URLS;
        const index = list.findIndex(u => u.id === id);
        if (index !== -1) {
            list[index] = { ...list[index], ...data };
            return list[index];
        }
        throw new Error('URL not found');
    },

    deleteUrl: async (type, id) => {
        await delay(500);
        const list = type === 'formstack' ? MOCK_FORMSTACK_URLS : MOCK_WEBSITE_URLS;
        const index = list.findIndex(u => u.id === id);
        if (index !== -1) {
            list.splice(index, 1);
            return true;
        }
        throw new Error('URL not found');
    }
};
