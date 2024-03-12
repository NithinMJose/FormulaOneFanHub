import React, { useState, useEffect } from 'react';
import UserNavbar from '../../LoginSignup/UserNavbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import './OrderHistory.css';
import Footer from '../../LoginSignup/Footer';
import jwt_decode from 'jwt-decode';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const userId = decoded.userId;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Order/GetOrdersByUserId/${userId}`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <UserNavbar />
      <div className="order-history-container">
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', textAlign: 'center', margin: '20px 0' }}>Order History</Typography>
        <div className="order-items-container">
          {orders.map(order => (
            <Paper elevation={3} className="order-item" key={order.orderId}>
              <div className="order-item-content">
                {/* Left container for number and date */}
                <div className="left-container">
                  <div>
                    <Typography variant="body1">Order Date: {new Date(order.orderDate).toLocaleDateString()}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle1">Number of Items: {order.orderedItem.length}</Typography>
                  </div>               
                </div>
                {/* Center container for status and price */}

                <div className="center-container">
                  <div>
                    <Typography variant="body1">Total Amount: ₹{order.orderTotalAmount}</Typography>
                  </div>
                  <div>
                    <Typography variant="body1">Order Status: {order.orderStatus}</Typography>
                  </div>
                </div>
                {/* Right container for "+" symbol */}
                <div className="right-container">
                  <Typography variant="body1">+</Typography>
                </div>
              </div>
            </Paper>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;
