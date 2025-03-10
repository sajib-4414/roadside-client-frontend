import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const loggedInUsername = JSON.parse(localStorage.getItem('user')).username;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          // Redirect to login if access token is not found
          setRedirectToLogin(true);
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/auth/users/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (username) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        // Redirect to login if access token is not found
        setRedirectToLogin(true);
        return;
      }
      await axios.delete(`${process.env.REACT_APP_API_HOST}/auth/users/${username}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Remove the deleted user from the list
      setUsers(prevUsers => prevUsers.filter(user => user.username !== username));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (redirectToLogin) {
    // If redirectToLogin is true, navigate to login page
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h2>Manage Users</h2>
      <ul className="list-group">
        {users.map(user => (
          <li key={user.username} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{user.username}</strong>
              <br />
              <span>{user.email}</span>
            </div>
            {user.username !== loggedInUsername && (
              <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(user.username)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageUsers;
