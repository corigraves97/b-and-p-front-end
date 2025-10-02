// src/components/Dashboard/Dashboard.jsx
import { StyleSheet, Text, View } from 'react';
import'./dashboard.css';

import { useEffect, useContext } from 'react';

import { UserContext } from '../../contexts/UserContext';

import * as userService from '../../services/userService';

const Dashboard = () => {
  const { user } = useContext(UserContext);

 

  return (
    <body className="dashboard-body">
    <section className="dashboard-wrapper">
      <h1 className="dashboard-header">Dashboard</h1>
      <h2 className="dashboard-subheader"> Welcome to Bull & Paper.</h2>
      <p className="dashboard-p">Click on "Create A New Entry" to get started! </p>
      <div className="dashboard-cardsGrid">
        {/* Dashboard content goes here */}
      </div>
    </section>
    </body>
  );
};

export default Dashboard;

