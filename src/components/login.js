import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    const newErrors = {};
    if (!formData.username) newErrors.email = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Form is valid, make Axios call
      axios.post(`${process.env.REACT_APP_USER_API_HOST}/auth/authenticate`, formData)
        .then(response => {
          // Handle successful login
          console.log(response.data);
          
          // Store user data and tokens in localStorage
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('accessToken', response.data.token);
          // localStorage.setItem('refreshToken', response.data.token.refresh);
  
          
          
          
          window.location = "/";
        })
        .catch(error => {
          // Handle login error
          console.error('Login error:', error);
          const newErrors = {};
          newErrors.apierror = 'Invalid credentials';
          setErrors(newErrors)
        });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Username</label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>

        {errors.apierror && <div className="text-danger">{errors.apierror}</div>}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default Login;
