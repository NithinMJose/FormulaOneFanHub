import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EditDeliveryCompany.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const EditDeliveryCompany = () => {
    const { uniqueName } = useParams();
    const [deliveryCompany, setDeliveryCompany] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        companyName: '',
        contactNumber: '',
        address: '',
        imageFile: null
    });

    useEffect(() => {
        console.log('uniqueName:', uniqueName);
        const fetchDeliveryCompany = async () => {
            try {
                const response = await fetch(`https://localhost:7092/api/DeliveryCompany/GetDeliveryCompanyViaUniqueName?uniqueName=${uniqueName}`);
                if (response.ok) {
                    const data = await response.json();
                    setDeliveryCompany(data);
                    setFormData({
                        email: data.email,
                        companyName: data.companyName,
                        contactNumber: data.contactNumber,
                        address: data.address,
                        imagePath: data.imagePath
                    });
                } else {
                    console.error('Failed to fetch delivery company:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching delivery company:', error);
            }
        };

        fetchDeliveryCompany();
    }, [uniqueName]);

    const handleChange = (e) => {
        if (e.target.name === 'imageFile') {
            setFormData({
                ...formData,
                imageFile: e.target.files[0]
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('email', formData.email);
            formDataToSend.append('companyName', formData.companyName);
            formDataToSend.append('contactNumber', formData.contactNumber);
            formDataToSend.append('address', formData.address);

            if (formData.imageFile) {
                formDataToSend.append('imageFile', formData.imageFile);
            } else {
                const blob = await fetch(`https://localhost:7092/images/${deliveryCompany.imagePath}`).then(res => res.blob());
                formDataToSend.append('imageFile', blob, deliveryCompany.imagePath);
            }

            console.log('formDataToSend:', formDataToSend);

            const response = await fetch(`https://localhost:7092/api/DeliveryCompany/UpdateDeliveryCompany/${deliveryCompany.deliveryCompanyId}`, {
                method: 'PUT',
                body: formDataToSend
            });
            if (response.ok) {
                toast.success('Delivery company updated successfully');
                navigate('/DeliveryCompanyList');
            } else {
                console.error('Failed to update delivery company:', response.statusText);
                toast.error('Failed to update delivery company');
            }
        } catch (error) {
            console.error('Error updating delivery company:', error);
            toast.error('Error updating delivery company');
        }
    };

    if (!deliveryCompany) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-delivery-company">
            <h2>Edit Delivery Company</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Company Name</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Contact Number</label>
                    <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div className="current-image">
                    <h3>Current Logo</h3>
                    <img src={`https://localhost:7092/images/${deliveryCompany.imagePath}`} alt="Current" className='CurrentImage' />
                </div>
                <div className="form-group">
                    <label>Upload New Logo</label>
                    <input type="file" name="imageFile" accept="image/*" onChange={handleChange} />
                    {formData.imageFile && (
                        <img src={URL.createObjectURL(formData.imageFile)} alt="Selected" className="selectedImage" />
                    )}
                </div>

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditDeliveryCompany;
