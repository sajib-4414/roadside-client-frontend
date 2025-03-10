import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';

const CreateUpdateTodo = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [errors, setErrors] = useState({});
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (id) {
      // Fetch existing Todo data if editing
      axios.get(`${process.env.REACT_APP_API_HOST}/todos/${id}`, {
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
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // If the Form is valid, make Axios call
      const requestMethod = id ? 'put' : 'post';
      console.log("reading the api host", process.env.REACT_APP_API_HOST)
      const apiUrl = id ? `${process.env.REACT_APP_API_HOST}/todos/${id}/` : `${process.env.REACT_APP_API_HOST}/todos/`;
      
      axios[requestMethod](apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => {
          // Handle successful todo creation/update
          console.log('Todo saved:', response.data);
          // Redirect to root domain
          window.location = "/";
        })
        .catch(error => {
          // Handle todo creation/update error
          console.error('Todo save error:', error);
        });
    }
  };
  

  if (!accessToken) {
    // If accessToken is not present, redirect to login
    return <Navigate to="/login" />
  }

  return (
    <div>
      <h2>{id ? 'Edit Todo' : 'Create Todo'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titleInput">Title</label>
          <input
            type="text"
            className="form-control"
            id="titleInput"
            placeholder="Enter title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          {errors.title && <div className="text-danger">{errors.title}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="descriptionInput">Description</label>
          <input
            type="text"
            className="form-control"
            id="descriptionInput"
            placeholder="Enter description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          {errors.description && <div className="text-danger">{errors.description}</div>}
        </div>
        <button type="submit" className="btn btn-primary">{id ? 'Update' : 'Create'} Todo</button>
      </form>
    </div>
  );
}

export default CreateUpdateTodo;
