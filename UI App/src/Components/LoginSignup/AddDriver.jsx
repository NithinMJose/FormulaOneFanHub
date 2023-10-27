import React, { useState } from 'react';
import './AddDriver.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';

const AddDriver = () => {
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [nameError, setNameError] = useState('');
    const [dobError, setDobError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [imageFileError, setImageFileError] = useState('');

    const validateForm = () => {
        validateField(name, setNameError, 'Name');
        validateField(dob, setDobError, 'Date of Birth');
        validateField(description, setDescriptionError, 'Description');
        validateField(imageFile, setImageFileError, 'Image File');
    };

    const handleSave = async () => {
        validateForm();

        if (!nameError && !dobError && !descriptionError && !imageFileError) {
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('dob', dob);
                formData.append('description', description);
                formData.append('imageFile', imageFile);

                const response = await fetch('https://localhost:7092/api/Driver/CreateDriver', {
                    method: 'POST',
                    body: formData,
                });

                if (response.status === 201) {
                    toast.success('Driver added successfully');
                    // Additional logic or navigation can be added here
                } else {
                    const errorData = await response.json();
                    console.error('Driver creation failed:', errorData);
                    toast.error('Driver creation failed');
                }
            } catch (error) {
                console.error('Driver creation failed:', error);
                toast.error('Driver creation failed');
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
            <HomeNavbar />
            <br />
            <br />
            <div className='add-driver-container'>
                <div className='add-driver-panel'>
                    <div className='add-driver-header'>
                        <div className='add-driver-text'>Add Driver</div>
                        <div className='add-driver-underline'></div>
                    </div>
                    <div className='add-driver-inputs'>
                        <div className='add-driver-input'>
                            <input
                                type='text'
                                placeholder='Name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        {nameError && <div className='add-driver-error-box'>{nameError}</div>}
                        <div className='add-driver-input'>
                            <input
                                type='date'
                                placeholder='Date of Birth'
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                required
                            />
                        </div>
                        {dobError && <div className='add-driver-error-box'>{dobError}</div>}
                        <div className='add-driver-input'>
                            <textarea
                                placeholder='Description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={Math.max(Math.ceil(description.split('\n').length), 1)}
                            />
                        </div>
                        {descriptionError && <div className='add-driver-error-box'>{descriptionError}</div>}
                        <div className='add-driver-input'>
                            <input
                                type='file'
                                accept='image/*'
                                onChange={(e) => setImageFile(e.target.files[0])}
                                required
                            />
                        </div>
                        {imageFileError && <div className='add-driver-error-box'>{imageFileError}</div>}
                    </div>
                    <div className='add-driver-submit-container'>
                        <div className='add-driver-submit' onClick={handleSave} disabled={loading}>
                            {loading ? 'Adding...' : 'Add Driver'}
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <Footer />
        </div>
    );
};

export default AddDriver;
