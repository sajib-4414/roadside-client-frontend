import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';

const BookingDetails = () => {
  const { id } = useParams();  // Get the booking ID from the URL
  const [booking, setBooking] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);


  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setRedirectToLogin(true);
      return;
    }

    // const url = `${process.env.REACT_APP_USER_API_HOST}/bookings/booking-id/${id}`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const eventSource = new EventSource(`${process.env.REACT_APP_USER_API_HOST}/cqrs/booking-subscription-query/${id}/stream`, config);

    eventSource.onmessage = (event) => {
      console.log('new event received with updated booking............')
      const updatedBooking = JSON.parse(event.data);
      setBooking(updatedBooking);
    };

    return () => {
      eventSource.close();
    };
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
      case 'RESERVED_WAITING': return <span className="badge bg-primary">🟦 Waiting for responder to accept</span>;
      case 'RESPONDER_ASSIGNED': return <span className="badge bg-warning text-dark">🟧 Responder Assigned</span>;
      case 'RESPONDER_ON_WAY': return <span className="badge bg-purple text-white">🟪 Responder On Way</span>;
      case 'RESPONDER_REACHED': return <span className="badge bg-success">🟩 Responder Reached</span>;
      case 'SERVICE_IN_PROGRESS': return <span className="badge bg-dark text-white">🔧 Service In Progress</span>;
      case 'SERVICE_DONE_AWAITING_PAYMENT': return <span className="badge bg-warning">💵 Awaiting Payment</span>;
      case 'COMPLETED': return <span className="badge bg-success">✅ Completed</span>;
      case 'CANCELLED': return <span className="badge bg-danger">❌ Cancelled</span>;
      case 'RESPONDER_DID_NOT_ACCEPT': return <span className="badge bg-danger">❌ All Responders are busy</span>;
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
                  <tr><td><strong>Name:</strong></td><td>{booking.requestedBy?.name}</td></tr>
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

          {/* ✅ Booking Status Progress Message */}
          <div className="mt-4">
            {(booking.status === 'QUEUED' || 
              booking.status === 'CREATED' || 
              booking.status === 'RESERVED_WAITING' || 
              booking.status === 'SERVICE_IN_PROGRESS' || 
              booking.status === 'SERVICE_DONE_AWAITING_PAYMENT') && (
              <>
                <div className="progress mb-2">
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated bg-info" 
                    role="progressbar" 
                    style={{ width: '100%' }} 
                  />
                </div>
                <p className="text-info fw-semibold">
                  {booking.status === 'QUEUED' && '🕒 We are processing your request...'}
                  {booking.status === 'CREATED' && '🔍 Looking for a responder...'}
                  {booking.status === 'RESERVED_WAITING' && '🔍 Looking for the responder to accept'}
                  {booking.status === 'SERVICE_IN_PROGRESS' && '🔧 Service is in progress...'}
                  {booking.status === 'SERVICE_DONE_AWAITING_PAYMENT' && '💵 Waiting for your payment...'}
                </p>
              </>
            )}

            {booking.status === 'RESPONDER_ASSIGNED' && (
              <p className="text-warning fw-semibold">🕓 Rider found, Waiting for responder to be on the way...</p>
            )}

            {booking.status === 'RESPONDER_REACHED' && (
              <p className="text-success fw-semibold">🚗 Responder has reached. They will start working on your vehicle shortly.</p>
            )}

            {booking.status === 'COMPLETED' && (
              <p className="text-success fw-semibold">✅ Service is completed. Thank you for using our service!</p>
            )}

            {(booking.status === 'CANCELLED' || booking.status === 'RESPONDER_DID_NOT_ACCEPT' ||![
              'QUEUED', 'CREATED', 'RESERVED_WAITING','RESPONDER_ASSIGNED', 'RESPONDER_REACHED', 
              'SERVICE_IN_PROGRESS', 'SERVICE_DONE_AWAITING_PAYMENT', 'COMPLETED'
            ].includes(booking.status)) && (
              <p className="text-danger fw-semibold">❌ Sorry, your request cannot be processed. All responders are currently busy. Please try creating another request.</p>
            )}
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
