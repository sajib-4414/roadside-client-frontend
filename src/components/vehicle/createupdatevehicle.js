import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';

const CreateUpdateVehicles = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ make: '', model: '',trim:'',year: '', plate:''});
  const [errors, setErrors] = useState({});
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (id) {
      // Fetch existing Todo data if editing
      axios.get(`${process.env.REACT_APP_USER_API_HOST}/vehicles/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => {
          setFormData(response.data);
        })
        .catch(error => {
          console.error('Error fetching Todo data for edit:', error);
        });
    }
  }, [id, accessToken]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    const newErrors = {};
    if (!formData.make) newErrors.make = 'make is required';
    if (!formData.model) newErrors.model = 'model is required';
    if (!formData.plate) newErrors.plate = 'plate is required';
    if (!formData.year) newErrors.year = 'year is required';
    if (!formData.trim) newErrors.trim = 'trim is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // If the Form is valid, make Axios call
      const requestMethod = id ? 'put' : 'post';
      console.log("reading the api host", process.env.REACT_APP_USER_API_HOST)
      const apiUrl = id ? `${process.env.REACT_APP_USER_API_HOST}/vehicles/${id}/` : `${process.env.REACT_APP_USER_API_HOST}/clients/vehicles`;
      
      axios[requestMethod](apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => {
          // Handle successful todo creation/update
          console.log('Vehicle saved:', response.data);
          window.alert('vehicle saved')
          // Redirect to root domain
          window.location = "/profile";
        })
        .catch(error => {
          // Handle todo creation/update error
          console.error('Vehicle save error:', error);
        });
    }
  };
  

  if (!accessToken) {
    // If accessToken is not present, redirect to login
    return <Navigate to="/login" />
  }

  return (
    <div>
      <h2>{id ? 'Edit Vehicle' : 'Create Vehicle'}</h2>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
  <label htmlFor="makeInput">Make</label>
  <input
    type="text"
    className="form-control"
    id="makeInput"
    placeholder="Enter make"
    value={formData.make}
    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
  />
  {errors.make && <div className="text-danger">{errors.make}</div>}
</div>

<div className="form-group">
  <label htmlFor="modelInput">Model</label>
  <input
    type="text"
    className="form-control"
    id="modelInput"
    placeholder="Enter model"
    value={formData.model}
    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
  />
  {errors.model && <div className="text-danger">{errors.model}</div>}
</div>

<div className="form-group">
  <label htmlFor="trimInput">Trim</label>
  <input
    type="text"
    className="form-control"
    id="trimInput"
    placeholder="Enter trim"
    value={formData.trim}
    onChange={(e) => setFormData({ ...formData, trim: e.target.value })}
  />
  {errors.trim && <div className="text-danger">{errors.trim}</div>}
</div>

<div className="form-group">
  <label htmlFor="yearInput">Year</label>
  <input
    type="number"
    className="form-control"
    id="yearInput"
    placeholder="Enter year"
    value={formData.year}
    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
  />
  {errors.year && <div className="text-danger">{errors.year}</div>}
</div>

<div className="form-group">
  <label htmlFor="plateInput">Plate</label>
  <input
    type="text"
    className="form-control"
    id="plateInput"
    placeholder="Enter plate"
    value={formData.plate}
    onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
  />
  {errors.plate && <div className="text-danger">{errors.plate}</div>}
</div>
       
        <button type="submit" className="btn btn-primary">{id ? 'Update' : 'Create'} Vehicle</button>
      </form>
    </div>
  );
}

export default CreateUpdateVehicles;
