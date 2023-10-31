import React, { useState } from 'react';
import './AddF1History.css'; // Make sure to replace with your actual stylesheet
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';
import AdminNavbar from './AdminNavbar';

const AddF1History = () => {
    const [heading, setHeading] = useState('');
    const [paragraph, setParagraph] = useState('');
    const [loading, setLoading] = useState(false);

    const [headingError, setHeadingError] = useState('');
    const [paragraphError, setParagraphError] = useState('');

    const validateForm = () => {
        validateField(heading, setHeadingError, 'Heading');
        validateField(paragraph, setParagraphError, 'Paragraph');
    };

    const handleSave = async () => {
        validateForm();
    
        if (!headingError && !paragraphError) {
            setLoading(true);
            try {
                const data = {
                    heading: heading,
                    paragraph: paragraph,
                };
    
                const response = await fetch('https://localhost:7092/api/F1History/CreateF1History', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
    
                if (response.status === 201) {
                    toast.success('F1 History added successfully');
                    // Additional logic or navigation can be added here
                } else {
                    const errorData = await response.json();
                    console.error('F1 History creation failed:', errorData);
                    toast.error('F1 History creation failed');
                }
            } catch (error) {
                console.error('F1 History creation failed:', error);
                toast.error('F1 History creation failed');
            } finally {
                setLoading(false);
            }
        }
    };
    
    

    const validateField = (field, setError, fieldName) => {
        if (!field) {
            setError(`${fieldName}: This field is required`);
        } else {
            setError('');
        }
    };

    return (
        <div>
            <AdminNavbar />
            <br />
            <br />
            <div className='add-driver-container'>
                <div className='add-driver-panel'>
                    <div className='add-driver-header'>
                        <div className='add-driver-text'>Add F1 History</div>
                        <div className='add-driver-underline'></div>
                    </div>
                    <div className='add-driver-inputs'>
                        <div className='add-driver-input'>
                            <input
                                type='text'
                                placeholder='Heading'
                                value={heading}
                                onChange={(e) => setHeading(e.target.value)}
                                required
                            />
                        </div>
                        {headingError && <div className='add-driver-error-box'>{headingError}</div>}
                        <div className='add-driver-input'>
                            <textarea
                                placeholder='Paragraph'
                                value={paragraph}
                                onChange={(e) => setParagraph(e.target.value)}
                                required
                                rows={Math.max(Math.ceil(paragraph.split('\n').length), 1)}
                            />
                        </div>
                        {paragraphError && <div className='add-driver-error-box'>{paragraphError}</div>}
                    </div>
                    <div className='add-driver-submit-container'>
                        <button
                            className='add-driver-submit'
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add F1 History'}
                        </button>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <Footer />
        </div>
    );
};

export default AddF1History;