import React, { useState, useEffect, useMemo } from 'react';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon,
    List, ListOrdered, Undo, Redo, Save
} from 'lucide-react';
import infoService from '../services/infoService';
import toast from 'react-hot-toast';
import '../styles/InfoManager.css';


const defaultContent = `
    <p>Important Information: This platform is designed to provide a secure, reliable, and user-friendly environment for managing your account, accessing services, and performing essential operations efficiently. By using this system, you agree to follow all applicable terms, conditions, and policies associated with its use. Your account credentials, including your email address and password, are strictly confidential and must not be shared with any unauthorized person.</p>
    <p>You are responsible for maintaining the security of your login details and for all activities performed under your account. It is strongly recommended to use a strong password containing a combination of uppercase and lowercase letters, numbers, and special characters, and to update it periodically to reduce the risk of unauthorized access.</p>
    <p>In case you suspect any suspicious activity, data breach, or unauthorized login attempt, you should immediately change your password and inform the system administrator or support team.</p>
    <p>All personal information provided within this platform is handled in accordance with data protection and privacy regulations. The system may collect and store certain user data such as name, email address, profile image, login history, and activity logs solely for operational, security, and service improvement purposes. This data will not be shared with third parties without proper authorization, except where required by law or for compliance with legal obligations.</p>
`;

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="editor-toolbar">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
                title="Italic"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`toolbar-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
                title="Underline"
            >
                <UnderlineIcon size={18} />
            </button>

            <div className="toolbar-divider"></div>

            <button
                onClick={setLink}
                className={`toolbar-btn ${editor.isActive('link') ? 'is-active' : ''}`}
                title="Link"
            >
                <LinkIcon size={18} />
            </button>

            <div className="toolbar-divider"></div>

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`toolbar-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
                title="Bullet List"
            >
                <List size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`toolbar-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
                title="Ordered List"
            >
                <ListOrdered size={18} />
            </button>


            <div className="toolbar-divider"></div>

            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="toolbar-btn"
                title="Undo"
            >
                <Undo size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="toolbar-btn"
                title="Redo"
            >
                <Redo size={18} />
            </button>
        </div>
    );
};

const InfoManager = () => {
    const [infoId, setInfoId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [, forceUpdate] = useState(0); // For toolbar updates

    // Role check
    const role = localStorage.getItem('role');
    const isAdmin = role == 'Admin';

    const extensions = useMemo(() => [
        StarterKit,
        Underline,
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                class: 'editor-link',
            },
        }),
        Placeholder.configure({
            placeholder: 'Jot something down...',
        }),
    ], []);

    const editor = useEditor({
        editable: isAdmin,
        extensions,
        content: '',
        onTransaction: () => {
            forceUpdate(n => n + 1);
        },
    }, [extensions]);

    useEffect(() => {
        fetchInfo();
    }, [editor]); // Depend on editor to set content when ready

    const fetchInfo = async () => {
        if (!editor) return;

        try {
            setLoading(true);
            const response = await infoService.index();
            const data = response.data.important_info.data;
            const infoList = Array.isArray(data) ? data : (data || []);

            if (infoList && infoList.length > 0) {
                const info = infoList[0];
                setInfoId(info.id);
                if (editor.isEmpty) {
                    editor.commands.setContent(info.content || info.text || '');
                }
            } else {
                // No data found, populate with default and store it
                if (editor.isEmpty) {
                    editor.commands.setContent(defaultContent);
                }

                // Call store API logic
                try {
                    const storeResponse = await infoService.store({ content: defaultContent });
                    const storeData = storeResponse.data;
                    if (storeData) {
                        // Adjust based on typical Laravel response, e.g. { data: { id: ... } } or just { id: ... }
                        if (storeData.id) {
                            setInfoId(storeData.id);
                        } else if (storeData.data && storeData.data.id) {
                            setInfoId(storeData.data.id);
                        }
                    }
                } catch (storeErr) {
                    console.error("Failed to auto-seed default content:", storeErr);
                }
            }
        } catch (error) {
            console.error("Failed to fetch info:", error);
            // Don't set error status here as it might just be empty, which is fine (we'll create new)
        } finally {
            setLoading(false);
        }
    };


    const handleSave = async () => {
        if (!editor) return;

        if (editor.isEmpty) {
            toast.error('Content cannot be empty.');
            return;
        }

        const content = editor.getHTML();
        setSaving(true);

        try {
            if (infoId) {
                await infoService.update(infoId, { content });
            } else {
                const response = await infoService.store({ content });
                // If store returns the created object, update infoId
                if (response.data && response.data.id) {
                    setInfoId(response.data.id);
                } else if (response.data && response.data.data && response.data.data.id) {
                    setInfoId(response.data.data.id);
                }
            }
            toast.success('Information saved successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save information.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container fluid className="py-4">

            <Card className="border-0 shadow-sm" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {isAdmin && (
                    <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Info Manager</h5>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={saving || loading}
                            style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                        >
                            {saving ? <Spinner animation="border" size="sm" className="me-2" /> : <Save size={18} className="me-2" />}
                            Save Changes
                        </Button>
                    </Card.Header>
                )}
                <Card.Body className="p-0 d-flex flex-column" style={{ flexGrow: 1, overflow: 'hidden' }}>
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <div className="info-editor-container h-100 border-0 rounded-0">
                            {isAdmin && <MenuBar editor={editor} />}
                            <EditorContent editor={editor} className="flex-grow-1 overflow-auto" />
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default InfoManager;
