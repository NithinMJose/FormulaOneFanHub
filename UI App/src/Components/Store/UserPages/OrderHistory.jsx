import React, { useState, useEffect } from 'react';
import UserNavbar from '../../LoginSignup/UserNavbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import './OrderHistory.css';
import Footer from '../../LoginSignup/Footer';
import jwt_decode from 'jwt-decode';
import { margin } from '@mui/system';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // State to track expanded order
  const [expandedOrderDetails, setExpandedOrderDetails] = useState(null); // State to store expanded order details
  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const userId = decoded.userId;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Order/GetOrdersByUserId/${userId}`);
        const data = await response.json();
        // Sort orders by order date in descending order
        data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    fetchOrders();
  }, []);
  

  // Function to handle click on the "+" symbol
  const handleExpand = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null); // Collapse if already expanded
    } else {
      setExpandedOrderId(orderId); // Expand if not already expanded
      try {
        const response = await fetch(`https://localhost:7092/api/Order/HelloWorld/${orderId}`);
        const data = await response.json();
        setExpandedOrderDetails(data.orderItems); // Store order details
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="order-history-container">
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', textAlign: 'center', margin: '20px 0' }}>Order History</Typography>
        <div className="order-items-container">
          {orders.map(order => (
            <Paper elevation={3} className="order-item" key={order.orderId}>
              <div className="order-item-content">
                <div className="left-container">
                  <div>
                    <Typography variant="body1">Order Date: {new Date(order.orderDate).toLocaleDateString()}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle1">Number of Items: {order.orderedItem.length}</Typography>
                  </div>               
                </div>
                <div className="center-container">
                  <div>
                    <Typography variant="body1">Total Amount: ₹{order.orderTotalAmount}</Typography>
                  </div>
                  <div>
                    <Typography variant="body1">Order Status: {order.orderStatus}</Typography>
                  </div>
                </div>
                <div className="right-container">
                  {/* Toggle button */}
                  <button className="expand-button" onClick={() => handleExpand(order.orderId)}>
                    {expandedOrderId === order.orderId ? '-' : '+'}
                  </button>
                </div>
              </div>
              {/* Display order ID and product details when expanded */}
              {
                expandedOrderId === order.orderId && (
                  <div>
  <Typography variant="body1" className="expanded-text">
    ORDER ID IS {order.orderId}
  </Typography>
  {/* Display product details */}
  <div className='HHHHH'>
  {expandedOrderDetails &&
    expandedOrderDetails.map((item, index) => (
      <React.Fragment key={item.productId}>
        <Paper elevation={3} className="productDetails">
      <div className="product-content">
        {/* First part for the image */}
        <div className="product-image-container">
          <img src={`https://localhost:7092/images/${item.productImagePath}`} alt="Product" className="product-image" />
        </div>
        {/* Second part for displaying product name, unit price, and quantity */}
        <div className="product-info-container">
          <Typography variant="body1" className="expanded-text">
            Product Name: {item.productName}
          </Typography>
          <Typography variant="body1" className="expanded-text">
            Unit Price: {item.price}
          </Typography>
          <Typography variant="body1" className="expanded-text">
            Quantity: {item.quantity}
          </Typography>
        </div>
        {/* Third part for displaying the final price */}
        <div className="final-price-container">
          <Typography variant="body1" className="expanded-text">
            Final Price: {item.finalPrice}
          </Typography>
        </div>
      </div>
      </Paper>
      {/* Add horizontal line except for the last item */}
      {index !== expandedOrderDetails.length - 1 && <hr className="separator" />}
    </React.Fragment>
  ))}
</div>

</div>

                

                )
              }
            </Paper>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;
