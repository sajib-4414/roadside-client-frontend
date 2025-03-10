import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, Navigate } from 'react-router-dom';

const BookingDetails = () => {
  const { id } = useParams();  // Get the booking ID from the URL
  const [booking, setBooking] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setRedirectToLogin(true);
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_USER_API_HOST}/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setBooking(response.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    fetchBookingDetails();
  }, [id]);

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  if (!booking) {
    return <div className="text-center my-5">Loading booking details...</div>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'QUEUED': return <span className="badge bg-secondary">🟤 Queued</span>;
      case 'CREATED': return <span className="badge bg-primary">🟦 Created</span>;
      case 'RESPONDER_ASSIGNED': return <span className="badge bg-warning text-dark">🟧 Responder Assigned</span>;
      case 'RESPONDER_ON_WAY': return <span className="badge bg-purple text-white">🟪 Responder On Way</span>;
      case 'RESPONDER_REACHED': return <span className="badge bg-success">🟩 Responder Reached</span>;
      case 'SERVICE_IN_PROGRESS': return <span className="badge bg-dark text-white">🔧 Service In Progress</span>;
      case 'SERVICE_DONE_AWAITING_PAYMENT': return <span className="badge bg-warning">💵 Awaiting Payment</span>;
      case 'COMPLETED': return <span className="badge bg-success">✅ Completed</span>;
      case 'CANCELLED': return <span className="badge bg-danger">❌ Cancelled</span>;
      default: return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  return (
    <div className="container mt-4">
      <h2>Booking Details</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">
            Booking ID: <strong>{booking.id}</strong>
          </h5>

          <div className="row">
            {/* ✅ Client Information */}
            <div className="col-md-6">
              <h6>Client Information</h6>
              <table className="table table-bordered table-sm">
                <tbody>
                  <tr><td><strong>Name:</strong></td><td>{booking.requestedBy.name}</td></tr>
                  <tr><td><strong>Email:</strong></td><td>{booking.requestedBy.email}</td></tr>
                  <tr><td><strong>Phone:</strong></td><td>{booking.requestedBy.phoneNo}</td></tr>
                  <tr><td><strong>Username:</strong></td><td>{booking.requestedBy.username}</td></tr>
                </tbody>
              </table>
            </div>

            {/* ✅ Booking Information */}
            <div className="col-md-6">
              <h6>Booking Information</h6>
              <table className="table table-bordered table-sm">
                <tbody>
                  <tr><td><strong>Priority:</strong></td><td>{booking.priority}</td></tr>
                  <tr><td><strong>Service Type:</strong></td><td>{booking.serviceType}</td></tr>
                  <tr><td><strong>Address:</strong></td><td>{booking.address}</td></tr>
                  <tr><td><strong>Status:</strong></td><td>{getStatusBadge(booking.status)}</td></tr>
                  <tr><td><strong>Date Created:</strong></td><td>{new Date(booking.dateCreated).toLocaleString()}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ✅ Description */}
          {booking.description && (
            <div className="mt-4">
              <h6>Description</h6>
              <p>{booking.description}</p>
            </div>
          )}

          <div className="mt-4">
            <Link to="/" className="btn btn-secondary">
              ⬅ Back to Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
