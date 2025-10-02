import { useContext, useEffect, useState } from 'react';

import { UserContext } from '../../contexts/UserContext';

import './journaldash.css';

import * as journalService from '../../services/journalService';

const JournalDashboard = () => {
  const { user } = useContext(UserContext);
  const [journalData, setJournalData] = useState([]);

  useEffect(() => {
    const fetchJournals = async () => {
      if (!user) return;
      try {
        const data = await journalService.index();
        setJournalData(data);
      } catch (error) {
        console.error('Failed to load journals:', error);
      }
    };

    fetchJournals();
  }, [user]);

  useEffect(() => {
    const snapshots = journalData.flatMap((entry) => entry.marketSnapshot || []);
  }, [journalData]);

  const journals = journalData || [];

  return (
    <main className="analytics-body">
      <header className="analytics-header">
        <h1 className="analytics-title">{user.username}'s Trading Journal </h1>
        <p className="analytics-subtitle">Track your trades, analyze performance, and gain insights.</p>
      </header>
      <section className="analytics-main">
        <section className="journal-list-section">
          <ul className="journal-list">
            {journals.length > 0 ? (
              journals.map((journal) => {
                const overview = journal.marketSnapshot?.overview ?? [];

                return (
                  <li key={journal._id || journal.id} className="journal-item">
                    <h2 className="journal-entry-title">{journal.symbol}</h2>
                    <p className="journal-entry-outcome">{journal.side}</p>
                    <p className="journal-entry-outcome">{journal.timeOfDay}</p>
                    <p className="journal-entry-outcome">Share Size: {journal.shareSize}</p>
                    <p className="journal-entry-outcome">Entry: ${journal.entry}</p>
                    <p className="journal-entry-outcome">Exit: ${journal.exit}</p>
                    <p className="journal-entry-outcome">Volume: {journal.volume}</p>
                    <p className="journal-entry-outcome">Fees: {journal.fees}</p>
                    <p className="journal-entry-outcome">Date: {journal.executedDay}</p>
                    <p className="journal-entry-outcome">Notes: {journal.notes}</p>

                    <ul className="market">
                      {overview.length ? (
                        overview.map((item, idx) => (
                          <li key={item.name ?? idx}>
                            <p>Exchange: {item.exchange}</p>
                            <p>EPS: {item.eps}</p>
                            <p>Volume: {item.volume}</p>
                            <p>50 Day MA: {item.fiftyDayMovingAverage}</p>
                            <p>52 Week High: {item.fiftyTwoWeekHigh}</p>
<p>52 Week Low: {item.fiftyTwoWeekLow}</p>
<p>industry: {item.industry}</p>
<p>marketCap: {item.marketCap}</p>
<p>percentInsiders: {item.percentInsiders}</p>
<p>percentInstitutions: {item.percentInstitutions}</p>
<p>sector: {item.sector}</p>
<p>sharesOutstanding: {item.sharesOutstanding}</p>
<p>200 Day MA: {item.twoHundredDayMovingAverage}</p>
          </li>


                        ))
                      ) : (
                        <li>No overview yet</li>
                      )}
                    </ul>
                  </li>
                );
              })

            ) : (
              <p className="no-journals-message">You have no journal entries yet. Start by creating a new entry!</p>
            )}
          </ul>
        </section>
      </section>

      <section className="analytics1-section">
        <h2 className="analytics1-title">Analytics Overview</h2>
        <p className="analytics-description">Coming soon: Visualize your trading performance with charts and graphs.</p>
      </section>
      
      <section className="analytics1-section">
        <h2 className="analytics1-title">Performance Metrics</h2>
        <p className="analytics1-description">Coming soon: Key metrics to evaluate your trading success.</p>
      </section>
    </main>
  );
};

export default JournalDashboard;