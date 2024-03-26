import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './OrderDetails.css';
import UserNavbar from '../../LoginSignup/UserNavbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';


const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const { uniqueId } = useParams();
  const navigate = useNavigate();

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

  const generateInvoicePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');

    doc.setFillColor(200, 200, 200);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 25, 'F');

    doc.setTextColor(0, 0, 0);
    doc.text('INVOICE', 10, 10, 'left');
    doc.setFontSize(10);
    doc.text('Thank you for shopping with us!', 10, 15, 'left');
    doc.text('Please find the invoice details below:', 10, 20, 'left');

    doc.setFontSize(10);
    doc.text(`Order ID: ${order.orderIdRazor}`, 10, 30);
    doc.text(`Order Date: ${new Date(order.orderDate).toLocaleString()}`, 10, 35);
    doc.text(`User Information:`, 10, 40);
    doc.text(`Name: ${order.name}`, 13, 45);
    doc.text(`Email: ${order.email}`, 13, 50);
    doc.text(`Phone Number: ${order.phoneNumber}`, 13, 55);
    doc.text(`Address: ${order.address}`, 13, 60);

    doc.autoTable({
      head: [['Product Name', 'Quantity', 'Price', 'Discount', 'Final Price']],
      body: order.orderItems.map(item => [
        item.productName,
        item.quantity,
        item.price,
        item.discountPrice,
        item.finalPrice
      ]),
      styles: { fontSize: 10 },
      margin: { top: 70, left: 10, right: 10 }
    });

    const totalAmount = order.orderItems.reduce((acc, item) => acc + item.finalPrice, 0);
    doc.text('Total Amount: ' + totalAmount, 10, doc.autoTable.previous.finalY + 10);

    doc.setFillColor(200, 200, 200);
    doc.rect(0, doc.internal.pageSize.getHeight() - 25, doc.internal.pageSize.getWidth(), 25, 'F');

    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text('Formuala One Fan Hub', 10, 280, 'left');
    doc.text('Contact: +91 1234567890', 10, 285, 'left');
    doc.text('Email:nithinjoseman@gmail.com', 10, 290, 'left');
    doc.text('Address: 123, XYZ Street, ABC City, DEF State, India', 10, 295, 'left');

    doc.save(`Invoice_${order.orderIdRazor}.pdf`);
  };

  const handleCancelOrder = async () => {
    setShowModal(true); // Show the modal
  };

  const confirmCancelOrder = async () => {
    try {
      console.log(`Cancelling order with ID ${order.orderId}...`);
      const response = await fetch(`https://localhost:7092/api/Order/UpdateOrderStatusToCancelledByUser/${order.orderId}`, {
        method: 'PUT'
      });
      if (response.ok) {
        console.log(`Order with ID ${order.orderIdRazor} status updated to 'CancelledByUser'.`);
        window.location.reload();
      } else {
        console.error('Failed to update order status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setShowModal(false); // Hide the modal after the operation
    }
  };

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
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              <p><strong>Order Total Amount:</strong> ₹{order.orderTotalAmount}</p>
              <button className="PdfButton" onClick={generateInvoicePDF}>Download Invoice</button>
              {(order.orderStatus === 'Ordered' || order.orderStatus === 'InShipping') && (
                <button className="CancelButton" onClick={handleCancelOrder}>Cancel Order</button>
              )}
            </div>
            <div className="rightContainer">
              <h2>Ordered Items</h2>
              {order.orderItems.map(item => (
                <div key={item.orderedItemId} className="ordered-item">
                  <div className='firstColumn'>
                    <img
                      className="productImage"
                      src={`https://localhost:7092/images/${item.productImagePath}`}
                      alt={item.productName}
                      onClick={() => navigate(`/ProductDetails/${item.uniqueName}`)}
                    />
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

              <p><strong>Order Total Amount:</strong> ₹{order.orderTotalAmount}</p>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <br />
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Confirm Cancellation</h2>
            <p>Are you sure you want to cancel this order?</p>
            <button onClick={confirmCancelOrder}>Yes, Cancel Order</button>
            <button onClick={() => setShowModal(false)}>No, Go Back</button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetails;
