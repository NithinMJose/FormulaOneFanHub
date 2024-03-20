// ListShippingOrders.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListPendingOrders.css';
import jwt_decode from 'jwt-decode';
import { Modal, Button } from 'react-bootstrap';
import DeliveryCompanyNavbar from './DeliveryCompanyNavbar';
import Footer from '../../LoginSignup/Footer';

const ListShippingOrders = () => {
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
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
                const response = await axios.get(`https://localhost:7092/api/Order/GetShippingOrderDetailsForDeliveryCompany/${deliveryCompanyId}`);
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
        setModalTitle('Delivered');
        setModalMessage('Successfully delivered the item?');
    }

    const handleWrongAddress = (orderId) => {
        setCurrentOrderId(orderId);
        setShowModal(true);
        setModalTitle('Wrong Address');
        setModalMessage('Are you sure the delivery address is wrong?');
    };

    const handleReturned = (orderId) => {
        setCurrentOrderId(orderId);
        setShowModal(true);
        setModalTitle('Returned');
        setModalMessage('Are you sure you want to mark the order as returned?');
    };

    const handleConfirmAction = async () => {
        try {
            if (modalTitle === 'Delivered') {
                await axios.put(`https://localhost:7092/api/Order/UpdateOrderStatusToDelivered/${currentOrderId}`);
            } else if (modalTitle === 'Wrong Address') {
                await axios.put(`https://localhost:7092/api/Order/UpdateOrderStatusToWrongAddress/${currentOrderId}`);
            } else if (modalTitle === 'Returned') {
                await axios.put(`https://localhost:7092/api/Order/UpdateOrderStatusToReturned/${currentOrderId}`);
            }
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

    return (
        <>
            <DeliveryCompanyNavbar />
            <div className='container'>
                <h2 className='headings'> Pending Orders </h2>
                <div className="orders-container">
                    {orders.map((order) => (
                        <div className="order" key={order.orderId}>
                            <div className="order-details">
                                <h3>{order.name}</h3>
                                <div>Email: {order.email}</div>
                                <div>Phone: {order.phoneNumber}</div>
                                <div>Address: {order.address}</div>
                                <br />
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
                            <div className="button-group">
                                <Button variant="success" onClick={() => handleAccept(order.orderId)}>Delivered</Button>
                                <Button variant="warning" onClick={() => handleWrongAddress(order.orderId)}>Wrong Address</Button>
                                <Button variant="danger" onClick={() => handleReturned(order.orderId)}>Returned</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleConfirmAction}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ListShippingOrders;
