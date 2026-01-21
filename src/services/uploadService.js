const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const FILE_TYPES = ['Report', 'Handbook', 'Analysis', 'Summary', 'Invoice', 'Guide', 'Policy', 'Agreement'];

// Generate 45 dummy uploads
const MOCK_UPLOADS = Array.from({ length: 45 }, (_, i) => {
    const type = FILE_TYPES[i % FILE_TYPES.length];
    const date = new Date();
    date.setDate(date.getDate() - i);

    return {
        id: i + 1,
        name: `${type} - Q${(i % 4) + 1} 202${4 + (i % 2)}`,
        fileName: `${type.toLowerCase()}_v${i + 1}.pdf`,
        fileSize: `${(Math.random() * 5 + 0.5).toFixed(2)} MB`,
        uploadDate: date.toISOString().split('T')[0]
    };
});

export const uploadService = {
    getUploads: async () => {
        await delay(500);
        return [...MOCK_UPLOADS];
    },

    uploadFile: async (formData) => {
        await delay(800);
        const file = formData.get('file');
        const name = formData.get('name');

        const newUpload = {
            id: Date.now(),
            name: name,
            fileName: file.name,
            fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            uploadDate: new Date().toISOString().split('T')[0]
        };
        MOCK_UPLOADS.unshift(newUpload);
        return newUpload;
    },

    updateUpload: async (id, formData) => {
        await delay(500);
        const index = MOCK_UPLOADS.findIndex(u => u.id === id);
        if (index !== -1) {
            const name = formData.get('name');
            const file = formData.get('file');

            const updatedUpload = {
                ...MOCK_UPLOADS[index],
                name: name
            };

            if (file) {
                updatedUpload.fileName = file.name;
                updatedUpload.fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                updatedUpload.uploadDate = new Date().toISOString().split('T')[0];
            }

            MOCK_UPLOADS[index] = updatedUpload;
            return updatedUpload;
        }
        throw new Error('Upload not found');
    },

    deleteUpload: async (id) => {
        await delay(500);
        const index = MOCK_UPLOADS.findIndex(u => u.id === id);
        if (index !== -1) {
            MOCK_UPLOADS.splice(index, 1);
            return true;
        }
        throw new Error('Upload not found');
    },

    downloadFile: async (fileName) => {
        await delay(500);
        alert(`Downloading ${fileName}... (Mock Action)`);
        return true;
    }
};
