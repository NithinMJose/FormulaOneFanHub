// OrderDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './OrderDetails.css';
import UserNavbar from '../../LoginSignup/UserNavbar';

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const { uniqueId } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Order/GetOrderByUniqueName/${uniqueId}`);
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [uniqueId]);

  return (
    <>
      <UserNavbar />
      <br />
      <br />
      <br />
      <br />
      <div className="mainContainer">
        <h1 className='mainHeading'>Order Details</h1>
        {order ? (
          <div className="orderDetailsWrapper">
            <div className="leftContainer">
              <h2>Order Information</h2>
              {/* <p><strong>Order ID:</strong> {order.orderId}</p> */}
              {/* <p><strong>Unique ID:</strong> {order.uniqueId}</p> */}
              <p><strong>Order ID :</strong> {order.orderIdRazor}</p>
              <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
              <p><strong>User Information:</strong></p>
              <ul>
                <li><strong>Name:</strong> {order.name}</li>
                <li><strong>Email:</strong> {order.email}</li>
                <li><strong>Phone Number:</strong> {order.phoneNumber}</li>
                <li><strong>Address:</strong> {order.address}</li>
              </ul>
              <p><strong>Order Status:</strong> {order.orderStatus}</p>
              <p><strong>Shipping Date:</strong> {new Date(order.shippingDate).toLocaleString()}</p>
              {/* <p><strong>Payment Information:</strong></p> 
            <ul>
              {/* <li><strong>Payment Number:</strong> {order.paymentNumberRazor}</li> 
              <li><strong>Payment Date:</strong> {new Date(order.paymentDate).toLocaleString()}</li>
            </ul> */}
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              <p><strong>Order Total Amount:</strong> ₹{order.orderTotalAmount}</p>
            </div>
            <div className="rightContainer">
              <h2>Ordered Items</h2>
              {order.orderItems.map(item => (
                <div key={item.orderedItemId} className="ordered-item">
                  <div className='firstColumn'>
                    <img className="productImage" src={`https://localhost:7092/images/${item.productImagePath}`} alt={item.productName} />
                  </div>
                  <div className='secondColumn'>
                    <p className='productName'><strong></strong> {item.productName}</p>
                    <div className='secondContents'>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Price:</strong> ₹ {item.price}</p>
                      <p><strong>Discount:</strong> ₹ {item.discountPrice}</p>
                    </div>
                  </div>
                  <div className='thirdColumn'>
                    <p className='finalPrice'><strong>Final Price:</strong> ₹{item.finalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <br />
      </div>
    </>
  );
};

export default OrderDetails;
