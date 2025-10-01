import axios from 'axios'
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/journal`
import './form.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router'

import * as journalService from '../../services/journalService'

import { Alert, Grid, Typography } from '@mui/material';

const JournalForm = (props) => {
    // props is {handleAddJournal}
    // if editing, we will also have journalId in the url params
   
    const saveTrade = async (journalId, journalFormData) => {
    await journalService.update(journalId, journalFormData)
  }

  const { journalId } = useParams()
  const [profitLoss, setProfitLoss] = useState(0);
  const [formData, setFormData] = useState({
        symbol: '',
        side: 'long',
        timeOfDay: '',
        shareSize: '',
        entry: '',
        exit: '',
        volume: '1m-5m',
        fees: '',
        executedDay: '',
        meta: '',
        notes: '',
    });
    

    useEffect(() => {
  try { 
    axios.get('http://localhost:3000/api/shares')
  } catch (err) {
    console.log(err)
  }

  const fetchJournal = async () => {
    if (journalId) {
      try {
        const journalData = await journalService.show(journalId)
        setFormData(journalData)
      } catch (err) {
        console.log("Error fetching journal:", err)
      }
    }
  }

  fetchJournal()
}, [journalId]) 


     useEffect(() => {
    const entry = parseFloat(formData.entry);
    const exit = parseFloat(formData.exit);
    const shareSize = parseInt(formData.shareSize);
    const fees = parseFloat(formData.fees) || 0;

    if (
      !isNaN(entry) &&
      !isNaN(exit) &&
      !isNaN(shareSize) &&
      shareSize > 0 &&
      formData.side
    ) {
      let profit;
      if (formData.side === 'long') {
        profit = (exit - entry) * shareSize;
      } else if (formData.side === 'short') {
        profit = (entry - exit) * shareSize;
      } else {
        setProfitLoss(0);
        return;
      }
      setProfitLoss(profit - fees);
    } else {
      setProfitLoss(0);
    }
  }, [formData.entry, formData.exit, formData.shareSize, formData.fees, formData.side]);

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = (evt) => {
        evt.preventDefault()
        if(journalId){
            console.log(formData)
            props.handleUpdateJournal(journalId, formData);
        }else {
        props.handleAddJournal(formData)
        }
        
        
        
    }
    return (
        <main>
            <h1>{journalId ? 'Edit Entry' : 'New Entry'}</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor='symbol'>Symbol:</label>
                <input
                    required
                    type='text'
                    name='symbol'
                    id='symbol-input'
                    value={formData.symbol}
                    onChange={handleChange}
                />
                <label htmlFor='side'>Side:</label>
                <select
                    required
                    name="side"
                    value={formData.side}
                    onChange={handleChange}
                >
                    <option value="long">Long</option>
                    <option value="short">Short</option>
                </select>
                <label htmlFor='timeOfDay'>Time Of Day:</label>
                <input
                    required
                    type='text'
                    name='timeOfDay'
                    id='tod-input'
                    value={formData.timeOfDay}
                    onChange={handleChange}
                />
                <label htmlFor='shareSize'>Share Size:</label>
                <input
                    required
                    type='number'
                    name='shareSize'
                    id='shareSize-input'
                    value={formData.shareSize}
                    onChange={handleChange}
                />
                <label htmlFor='entry'>Entry:</label>
                <input
                    required
                    type='number'
                    name='entry'
                    id='entry-input'
                    value={formData.entry}
                    onChange={handleChange}
                />
                <label htmlFor='exit'>Exit:</label>
                <input
                    required
                    type='number'
                    name='exit'
                    id='exit-input'
                    value={formData.exit}
                    onChange={handleChange}
                />
                <label htmlFor='volume'>Volume:</label>
                <select 
                name="volume" 
                value={formData.volume} 
                onChange={handleChange}>
                    <option value="1m-5m">1m-5m</option>
                    <option value="10m-20m">10m-20m</option>
                    <option value="30m-40m">30m-40m</option>
                    <option value="50m-70m">50m-70m</option>
                    <option value="80m-100m">80m-100m</option>
                    <option value="120m-150m">120m-150m</option>
                    <option value="160m-180m">160m-180m</option>
                    <option value="200m+">200m+</option>
                </select>
                <label htmlFor='fees'>Fees:</label>
                <input
                    required
                    type='number'
                    name='fees'
                    id='fees-input'
                    value={formData.fees}
                    onChange={handleChange}
                />
                <label htmlFor='executedDay'>Executed Day:</label>
                <input
                    required
                    type='text'
                    name='executedDay'
                    id='executedDay-input'
                    value={formData.executedDay}
                    onChange={handleChange}
                />
                <label htmlFor='meta'>Meta:</label>
                <input
                    required
                    type='text'
                    name='meta'
                    id='meta-input'
                    value={formData.meta}
                    onChange={handleChange}
                />
                <label htmlFor='notes'>Notes:</label>
                <textarea
                    required
                    type='text'
                    name='notes'
                    id='notes-input'
                    value={formData.notes}
                    onChange={handleChange}
                />
                        {/* P/L Display */}
                  {profitLoss !== 0 && (
             
                      <Alert 
                        severity={profitLoss >= 0 ? 'success' : 'error'}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Typography variant="h6">
                          {profitLoss >= 0 ? '' : ''} Net P/L: ${profitLoss.toFixed(2)}
                        </Typography>
                      </Alert>
                  )}
                <button type='submit'>{journalId ? 'Update Entry!' : 'Create Entry!'}</button>
            </form>
        </main>
    );
};

export default JournalForm;
