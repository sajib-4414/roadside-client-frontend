import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';

const ProfileVehicleDashBoard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [profile, setMyProfile] = useState([]);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          // If access token is not found, set redirectToLogin to true
          setRedirectToLogin(true);
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_USER_API_HOST}/clients/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMyProfile(response.data)
        setVehicles(response.data.clientVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleDeleteVehicle = async (id) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        // If access token is not found, set redirectToLogin to true
        setRedirectToLogin(true);
        return;
      }
      await axios.delete(`${process.env.REACT_APP_USER_API_HOST}/profile/vehicles/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Remove the vehicle from the UI
      setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== id));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  if (redirectToLogin) {
    // If redirectToLogin is true, redirect to login page
    return <Navigate to="/login" />
  }

  return (
    <div>
      <h3>My profile</h3>
      <div>
        <ul>
           <strong>Name</strong> <span>{profile.name}</span>
        </ul>
        <ul>
        <strong>Email</strong> <span>{profile.email}</span>
        </ul>
        <ul>
        <strong>Username</strong> <span>{profile.username}</span>
        </ul>
        <ul>
        <strong>phoneNo</strong> <span>{profile.phoneNo}</span>
        </ul>

       
      </div>
     
      {vehicles.length ==0 && 
            <h3>You have no vehicles</h3>
        }
        <button >
            <Link className='btn btn-primary' to={`/vehicles`}>Add vehicle</Link>
        </button>
      <ul className="list-group">
        
        {vehicles.map(vehicle => (
          <li key={vehicle.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{vehicle.make} {vehicle.model}</strong>
              <br />
              <span>{vehicle.trim} ({vehicle.year})</span>
              <br />
              <span>Plate: {vehicle.plate}</span>
            </div>
            <div>
              <Link to={`/vehicles/${vehicle.id}`} className="btn btn-sm btn-primary mr-2" style={{ marginRight: '10px' }}>
                Edit
              </Link>
              <button className="btn btn-sm btn-danger" onClick={() => handleDeleteVehicle(vehicle.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileVehicleDashBoard;
