import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';

const TodoDashBoard = () => {
  const [bookings, setBookings] = useState([]);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          // If access token is not found, set redirectToLogin to true
          setRedirectToLogin(true);
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_USER_API_HOST}/bookings/my-bookings`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);


  if (redirectToLogin) {
    // If redirectToLogin is true, redirect to login page
    return <Navigate to="/login" />
  }
  const getServiceTypeBadge = (serviceType) => {
    switch (serviceType) {
      case 'TOWING':
        return <span className="badge text-dark bg-primary">🚗 Towing</span>;
      case 'BATTERY':
        return <span className="badge bg-success text-dark ">🔋 Battery</span>;
      case 'FUEL':
        return <span className="badge bg-warning text-dark ">⛽ Fuel Delivery</span>;
      case 'TIRE':
        return <span className="badge bg-dark text-white text-dark ">🛞 Tire Change</span>;
      case 'LOCK':
        return <span className="badge bg-info text-dark text-dark ">🔓 Lockout</span>;
      case 'MINOR_REPAIR':
        return <span className="badge text-dark bg-purple">🔧 Minor Repair</span>;
      default:
        return <span className="badge bg-secondary text-dark ">Unknown</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'NOW':
        return <span className="badge bg-danger">🚨 Now</span>;
      case 'NEXT_BUSINESS_DAY':
        return <span className="badge bg-warning">🏢 Next Business Day</span>;
      case 'NEXT_DAY':
        return <span className="badge bg-primary">📅 Next Day</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'QUEUED':
        return <span className="badge bg-secondary">🟤 Queued</span>;
      case 'CREATED':
        return <span className="badge bg-primary">🟦 Created</span>;
      case 'RESPONDER_ASSIGNED':
        return <span className="badge bg-warning text-dark">🟧 Responder Assigned</span>;
      case 'RESPONDER_ON_WAY':
        return <span className="badge bg-purple text-white">🟪 Responder On Way</span>;
      case 'RESPONDER_REACHED':
        return <span className="badge bg-success">🟩 Responder Reached</span>;
      case 'SERVICE_IN_PROGRESS':
        return <span className="badge bg-dark text-white">🔧 Service In Progress</span>;
      case 'SERVICE_DONE_AWAITING_PAYMENT':
        return <span className="badge bg-warning">💵 Awaiting Payment</span>;
      case 'COMPLETED':
        return <span className="badge bg-success">✅ Completed</span>;
      case 'CANCELLED':
        return <span className="badge bg-danger">❌ Cancelled</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  return (
    <div>
      <h2>My Bookings</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Booking ID</th>
            <th>Client Name</th>
            <th>Date Created</th>
            <th>Status</th>
            <th>Vehicle</th>
            <th>Priority</th>
            <th>Address</th>
            <th>Service Type</th>
           
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={booking.id}>
              <td>{index + 1}</td>
              <td><Link to={`/bookings/${booking.id}`}>{booking.bookingId}</Link></td>
              <td>{booking.requestedBy?.name}</td>
              <td>{new Date(booking.dateCreated).toLocaleString()}</td>
              <td>{getStatusBadge(booking.status)}</td>
              <td>{booking.vehicle?.make} {booking.vehicle?.model}</td>
              <td>{getPriorityBadge(booking.priority)}</td>
              <td>{booking.address}</td>
              <td>{getServiceTypeBadge(booking.serviceType)}</td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TodoDashBoard;
