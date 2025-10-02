import { Text, View } from 'react';

import { useEffect, useContext } from 'react';

import { UserContext } from '../../contexts/UserContext';

import { useState } from 'react';

import React from 'react';
import './journaldash.css'
 
import * as journalService from '../../services/journalService';


const JournalDashboard = (props) => {
  const { user } = useContext(UserContext);
  const [journalData, setJournalData] = useState([]);
 const journal = journalData || [props.journalData];
 
  useEffect(() => {
    const fetchJournals = async () => {
      if (user) {
        const data = await journalService.index();
        setJournalData(data);
      }
    };
    fetchJournals();
  }, [user]);
  
 

  return (
    <body className="dashboard-body">
      <header className="dashboard-header">
        <h1 className="dashboard-title">{user.username}'s Trading Journal </h1>
        <p className="dashboard-subtitle">Track your trades, analyze performance, and gain insights.</p>
      </header>
      <main className="dashboard-main">
        <section className="journal-list-section">
          <ul className="journal-list">
            {journal.length > 0 ? (
              journal.map((journal) => (
                <li key={journal.id} className="journal-item">
                  <h2 className="journal-entry-title">{journal.symbol}</h2>
                  <p className="journal-entry-outcome">{(journal.side)}</p>
                  <p className="journal-entry-outcome">{journal.timeOfDay}</p>
                  <p className="journal-entry-outcome">Share Size: {journal.shareSize}</p>
                  <p className="journal-entry-outcome">Entry: ${journal.entry}</p>
                  <p className="journal-entry-outcome">Exit: ${journal.exit}</p>
                  <p className="journal-entry-outcome">Volume: {journal.volume}</p> 
                  <p className="journal-entry-outcome">Fees: {journal.fees}</p>
                  <p className="journal-entry-outcome">Date: {journal.executedDay}</p>
                  <p className="journal-entry-outcome">Notes: {journal.notes}</p>
                  <p className="journal-entry-market">Market Snapshot: {journal.marketSnapshot}</p>
                </li>
              ))
            ) : (
              <p className="no-journals-message">You have no journal entries yet. Start by creating a new entry!</p>
            )}
          </ul>
        </section>
        <section className="analytics-section">
          <h2 className="analytics-title">Analytics Overview</h2>
          <p className="analytics-description">Coming soon: Visualize your trading performance with charts and graphs.</p>
        
        </section>
      </main>
    </body>
  );
};

export default JournalDashboard;