import React, { useState, useEffect } from 'react';
import UserNavbar from '../../LoginSignup/UserNavbar';
import Typography from '@mui/material/Typography';
import './OrderHistory.css';
import Footer from '../../LoginSignup/Footer';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [orderTimeFilter, setOrderTimeFilter] = useState('');
  const token = localStorage.getItem("jwtToken");
  const decoded = jwt_decode(token);
  const userId = decoded.userId;
  const navigate = useNavigate();


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://localhost:7092/api/Order/GetFullOrdersByUserId/${userId}`);
        const data = await response.json();
        data.sort((a, b) => sortBy === 'date' ? new Date(b.orderDate) - new Date(a.orderDate) : b.orderTotalAmount - a.orderTotalAmount);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    fetchOrders();
  }, [userId, sortBy]);

  const handleShowDetails = (order) => {
    console.log('Show details for order:', order.uniqueId);
    navigate(`/OrderDetails/${order.uniqueId}`);
  };

  const filterOrderByTime = (filter, orderDate) => {
    const today = new Date();
    const orderDateObj = new Date(orderDate);
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    switch (filter) {
      case 'today':
        return orderDateObj.getFullYear() === year && orderDateObj.getMonth() === month && orderDateObj.getDate() === day;
      case 'yesterday':
        const yesterday = new Date(year, month, day - 1);
        return orderDateObj.toDateString() === yesterday.toDateString();
      case 'lastWeek':
        const lastWeek = new Date(year, month, day - 7);
        return orderDateObj >= lastWeek && orderDateObj <= today;
      case 'lastMonth':
        const lastMonth = new Date(year, month - 1, day);
        return orderDateObj >= lastMonth && orderDateObj <= today;
      case 'lastYear':
        const lastYear = new Date(year - 1, month, day);
        return orderDateObj >= lastYear && orderDateObj <= today;
      case 'allTime':
        return true;
      default:
        return orderDateObj.getFullYear() === parseInt(filter);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderItems &&
    order.orderItems.some(item =>
      item.productName && item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teamName && item.teamName.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (orderStatusFilter === '' || order.orderStatus === orderStatusFilter || (orderStatusFilter === 'Cancelled' && (order.orderStatus === 'Cancelled' || order.orderStatus === 'CancelledByUser'))) &&
    (orderTimeFilter === '' || filterOrderByTime(orderTimeFilter, order.orderDate))
  );

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <UserNavbar />
      <div className="order-history-container">
        <div className="sidebar">
          <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', textAlign: 'center', margin: '20px 0' }}>Sidebar</Typography>
          <div className="search-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Product or Team"
              className="search-input"
            />
          </div>
          <div className="filters-container">
            <Typography variant="subtitle1" style={{ fontWeight: 'bold', margin: '10px 0' }}>Filters:</Typography>
            <div className="filter-options">
              <div className="filter-option">
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>Order Status:</Typography>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All</option>
                  <option value="InShipping">In Shipping</option>
                  <option value="Delivered">Delivered</option>
                  <option value="WrongAddress">Wrong Address</option>
                  <option value="CancelledByUser">Cancelled By User</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
              <div className="filter-option">
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>Order Time:</Typography>
                <select
                  value={orderTimeFilter}
                  onChange={(e) => setOrderTimeFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="lastWeek">Last Week</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="lastYear">Last Year</option>
                  {Array.from({ length: new Date().getFullYear() - 2023 + 1 }, (_, i) => 2023 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="sort-by-container">
            <Typography variant="subtitle1" style={{ fontWeight: 'bold', margin: '10px 0' }}>Sort By:</Typography>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-by-select"
            >
              <option value="date">Date</option>
              <option value="totalPrice">Total Price</option>
            </select>
          </div>
        </div>
        <div className="main-content">
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', textAlign: 'center', margin: '20px 0' }}>Order History</Typography>
          <div className="order-items-container">
            {filteredOrders.map((order, index) => (
              <div className="order-item" key={order.orderId}>
                <div className="order-item-content">
                  <div className="sl-no-container">
                    <Typography variant="body1">{index + 1}</Typography>
                  </div>
                  <div className="left-container">
                    <div>
                      <Typography variant="body1">Order Date: {new Date(order.orderDate).toLocaleDateString()}</Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle1">Number of Items: {order.orderItems ? order.orderItems.length : 0}</Typography>
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
                  <div className="show-details-container">
                    <button onClick={() => handleShowDetails(order)} className="show-details-button">Show Details</button>
                  </div>
                </div>
                <div className="expanded-order-details">
                  <div className="expanded-order-items">
                    {order.orderItems &&
                      order.orderItems.map((item, index) => (
                        <div className="productDetails" key={index}>
                          <div className="product-content">
                            <div className="product-image-container">
                              <img src={`https://localhost:7092/images/${item.productImagePath}`} alt="Product" className="product-image" />
                            </div>
                            <div className="product-info-container">
                              {/* Additional product info can be displayed here if needed */}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                {index !== filteredOrders.length - 1 && <hr className="order-separator" />}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;
