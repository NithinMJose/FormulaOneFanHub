import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListPendingOrders.css';
import jwt_decode from 'jwt-decode';
import { Modal, Button } from 'react-bootstrap';
import DeliveryCompanyNavbar from './DeliveryCompanyNavbar';
import Footer from '../../LoginSignup/Footer';

const ListPendingOrders = () => {
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        if (!token) {
            console.log('No token found');
            return;
        }

        const decodedToken = jwt_decode(token);
        const role = decodedToken.Role;
        const deliveryCompanyId = parseInt(decodedToken.DeliveryCompanyId);

        const fetchOrders = async () => {
            try {
                const response = await axios.get(`https://localhost:7092/api/Order/GetOrderDetailsForDeliveryCompany/${deliveryCompanyId}`);
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        };

        if (role === 'DeliveryCompany') {
            fetchOrders();
        }
    }, [token]);

    const handleAccept = (orderId) => {
        setCurrentOrderId(orderId);
        setShowModal(true);
    }

    const confirmAcceptOrder = async () => {
        try {
            await axios.put(`https://localhost:7092/api/Order/UpdateOrderStatusToInShipping/${currentOrderId}`);
            setOrders(orders.filter(order => order.orderId !== currentOrderId));
            setShowModal(false);
        } catch (error) {
            console.error("Failed to update order status", error);
            setShowModal(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const isPastAcceptTime = (shippingDate) => {
        const shippingDateTime = new Date(shippingDate);
        const currentTime = new Date();
        // Assuming acceptance time is 1pm
        const acceptanceTime = new Date(shippingDateTime.getFullYear(), shippingDateTime.getMonth(), shippingDateTime.getDate(), 13, 0, 0);
        return currentTime > acceptanceTime;
    };

    // Function to format date in desired format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <>
            <DeliveryCompanyNavbar />
            <br /><br /><br /><br />
            <p className='HeadingsPending'> Pending Orders </p>
            <p className='SubHeadingsPending'> No. of Pending Orders: {orders.length} </p>
            <div className="orders-container">
                {orders.map((order) => (
                    <div key={order.orderId} className={`order ${isPastAcceptTime(order.shippingDate) ? 'need-to-accept-soon' : ''}`}>
                        <div className="order-details">
                            <h3>{order.name}</h3>
                            <div>Email: {order.email}</div>
                            <div>Phone: {order.phoneNumber}</div>
                            <div>Address: {order.address}</div>
                            <div>Order Date: {formatDate(order.orderDate)}</div>
                            <br />
                            <button className="btn btn-primary" onClick={() => handleAccept(order.orderId)}>Accept Order</button>
                        </div>
                        <div className="order-items">
                            <h4>Items:</h4>
                            <ul>
                                {order.orderItems.map((item) => (
                                    <li key={item.orderedItemId}>
                                        {item.productName}
                                        <p> Quantity: {item.quantity} </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Accept Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to accept the products from the store?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        No
                    </Button>
                    <Button variant="primary" onClick={confirmAcceptOrder}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ListPendingOrders;
