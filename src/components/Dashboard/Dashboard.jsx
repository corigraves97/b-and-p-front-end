// src/components/Dashboard/Dashboard.jsx
import { StyleSheet, Text, View } from 'react';
import'./dashboard.css';

import { useEffect, useContext } from 'react';

import { UserContext } from '../../contexts/UserContext';

import * as userService from '../../services/userService';
import { useState } from 'react';



const Dashboard = () => {

  
  const { user } = useContext(UserContext);
  const [communityUsers, setCommunityUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCommunityUsers = async () => {
      try {
        const users = await userService.index();
        setCommunityUsers(users);

      } catch (err) {
        setError(err.message);
      }
    };

    fetchCommunityUsers();
  }, []);





  return (
    <main className="dashboard-body">
    <section className="dashboard-wrapper">
      <h1 className="dashboard-header">Community Dashboard</h1>
      <div className="dashboard-cardsGrid">
        <> {communityUsers.map(user => (
          <div key={user.id} className="dashboard-card">
            <h3>{user.username}</h3> 
          </div>
        ))} </>
      </div>


        {error && <p className="dashboard-error" role="alert">{error}</p>}

    </section>
    </main>
  );
};

export default Dashboard;

