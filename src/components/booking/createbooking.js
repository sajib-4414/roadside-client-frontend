import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateBooking = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicleId: '',
    vehicle: {
      make: '',
      model: '',
      trim: '',
      year: '',
      plate: ''
    },
    detailDescription: '',
    priority: 'NOW',
    address: '',
    serviceType: 'TOWING'
  });
  const [formErrors, setFormErrors] = useState({});
  const [useExistingVehicle, setUseExistingVehicle] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_USER_API_HOST}/clients/profile`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setVehicles(response.data.clientVehicles);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!formData.detailDescription.trim()) errors.detailDescription = 'Description is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (useExistingVehicle && !formData.vehicleId) errors.vehicleId = 'Please select a vehicle';

    if (!useExistingVehicle) {
      if (!formData.vehicle.make.trim()) errors.make = 'Make is required';
      if (!formData.vehicle.model.trim()) errors.model = 'Model is required';
      if (!formData.vehicle.trim.trim()) errors.trim = 'Trim is required';
      if (!formData.vehicle.year) errors.year = 'Year is required';
      if (!formData.vehicle.plate.trim()) errors.plate = 'Plate is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const accessToken = localStorage.getItem('accessToken');
    const payload = useExistingVehicle
      ? { ...formData, vehicle: null }
      : { ...formData, vehicleId: null };

    try {
      await axios.post(`${process.env.REACT_APP_USER_API_HOST}/bookings/`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      navigate('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Booking</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Vehicle</label>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              checked={useExistingVehicle}
              onChange={() => setUseExistingVehicle(true)}
            />
            <label className="form-check-label">Use Existing Vehicle</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              checked={!useExistingVehicle}
              onChange={() => setUseExistingVehicle(false)}
            />
            <label className="form-check-label">Create New Vehicle</label>
          </div>
        </div>

        {useExistingVehicle ? (
          <div className="form-group">
            <label>Vehicle</label>
            <select
              className="form-control"
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} - {vehicle.plate}
                </option>
              ))}
            </select>
            {formErrors.vehicleId && <div className="text-danger">{formErrors.vehicleId}</div>}
          </div>
        ) : (
          <div>
            <h5>New Vehicle Details</h5>
            {['make', 'model', 'trim', 'year', 'plate'].map(field => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.vehicle[field]}
                  onChange={(e) => setFormData({
                    ...formData,
                    vehicle: { ...formData.vehicle, [field]: e.target.value }
                  })}
                />
                {formErrors[field] && <div className="text-danger">{formErrors[field]}</div>}
              </div>
            ))}
          </div>
        )}

        <div className="form-group">
          <label>Detail Description</label>
          <textarea
            className="form-control"
            value={formData.detailDescription}
            onChange={(e) => setFormData({ ...formData, detailDescription: e.target.value })}
          />
          {formErrors.detailDescription && <div className="text-danger">{formErrors.detailDescription}</div>}
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            className="form-control"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          {formErrors.address && <div className="text-danger">{formErrors.address}</div>}
        </div>

        <button type="submit" className="btn btn-primary">Create Booking</button>
      </form>
    </div>
  );
};

export default CreateBooking;
