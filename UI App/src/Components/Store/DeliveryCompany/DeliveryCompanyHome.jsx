import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import Footer from '../../LoginSignup/Footer'; // Adjust the path as needed
import './DeliveryCompanyHome.css'; // Make sure to create this CSS file
import jwt_decode from 'jwt-decode';
import DeliveryCompanyNavbar from './DeliveryCompanyNavbar'; // Adjust this import based on your actual navbar component for delivery companies
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const DeliveryCompanyHome = () => {
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            toast.error('Unauthorized access. Please log in.');
            window.location.replace('/SignIn');
            return;
        }

        const decodedToken = jwt_decode(token);
        const role = decodedToken.Role;
        var deliveryCompanyId = decodedToken.DeliveryCompanyId;
        var deliveryCompanyId = parseInt(deliveryCompanyId);
        console.log('Delivery Company ID: ', deliveryCompanyId);
        if (role !== 'DeliveryCompany') {
            toast.error('Unauthorized access. Please log in as a delivery company.');
            window.location.replace('/SignIn');
        }
    }, []);

    return (
        <div>
            <DeliveryCompanyNavbar />
            {/* Adjust spacing as needed */}
            <br /><br /><br /><br />
            <div className="container-fluid">
                <div className="row">
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div className="delivery-company-home-content">
                            <h1>Hello Delivery Company</h1>
                            <h1>Welcome Back!</h1>
                            {/* Add any additional content specific to the delivery company home */}
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DeliveryCompanyHome;
