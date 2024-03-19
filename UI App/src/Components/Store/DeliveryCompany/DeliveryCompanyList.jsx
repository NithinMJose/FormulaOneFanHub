import React, { useEffect, useState } from 'react';
import './DeliveryCompanyList.css';
import AdminNavbar from '../../LoginSignup/AdminNavbar';
import Footer from '../../LoginSignup/Footer';
import { useNavigate } from 'react-router-dom';

const DeliveryCompanyList = () => {
    const [deliveryCompanies, setDeliveryCompanies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeliveryCompanies = async () => {
            try {
                const response = await fetch('https://localhost:7092/api/DeliveryCompany/GetDeliveryCompanies');
                if (response.ok) {
                    const data = await response.json();
                    setDeliveryCompanies(data);
                } else {
                    console.error('Failed to fetch delivery companies:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching delivery companies:', error);
            }
        };

        fetchDeliveryCompanies();
    }, []);

    const handleEdit = (uniqueName) => {
        // Handle edit action for the given companyId
        console.log('Edit button clicked for company:', uniqueName);
        navigate(`/EditDeliveryCompany/${uniqueName}`);
    };

    return (
        <div className='FullPage'>
            <AdminNavbar />
            <br />
            <br />
            <br />
            <br />
            <div className="delivery-company-list">
                <h2>Delivery Companies</h2>
                <ul className="company-list">
                    {deliveryCompanies.map((company) => (
                        <li key={company.deliveryCompanyId} className="company-card">
                            <img src={`https://localhost:7092/images/${company.imagePath}`} alt={company.companyName} />
                            <div className="company-details">
                                <h3>{company.companyName}</h3>
                                <p><strong>Email:</strong> {company.email}</p>
                                <p><strong>Contact Number:</strong> {company.contactNumber}</p>
                                <p><strong>Address:</strong> {company.address}</p>
                                <button onClick={() => handleEdit(company.uniqueName)}>Edit</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <Footer />
        </div>
    );
};

export default DeliveryCompanyList;
