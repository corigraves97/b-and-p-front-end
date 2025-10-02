// src/components/Dashboard/Dashboard.jsx
import { StyleSheet, Text, View } from 'react';
import'./dashboard.css';

import { useEffect, useContext } from 'react';

import { UserContext } from '../../contexts/UserContext';

import * as userService from '../../services/userService';
import { useState } from 'react';



const Dashboard = () => {

  /* sudocode */
  // fetch other users in the community
  // display their usernames and number of journal entries
  // fetch current user's journal entries
  // display some analytics on the dashboard (number of trades, win rate, etc)
  
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
    <body className="dashboard-body">
    <section className="dashboard-wrapper">
      <h1 className="dashboard-header">Community Dashboard</h1>
      <div className="dashboard-cardsGrid">
        {/*community users go here */}
        <> {communityUsers.map(user => (
          <div key={user.id} className="dashboard-card">
            <h3>{user.username}</h3> 
          </div>
        ))} </>
      </div>


        {error && <p className="dashboard-error" role="alert">{error}</p>}

    </section>
    </body>
  );
};

export default Dashboard;

