import axios from 'axios'
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/journal`
import './form.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router'
import * as journalService from '../../services/journalService'

const JournalForm = (props) => {
    // props is {handleAddJournal}
    // if editing, we will also have journalId in the url params

    const { journalId } = useParams()
    const [marketView, setMarketView] = useState(null)
    //console.log(journalId)
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
    })
    useEffect(() => {
        const fetchJournal = async () => {
            if (journalId) {
                try {
                    const journalData = await journalService.show(journalId)
                    setFormData(journalData)
                } catch (err) {
                    console.log("Error fetching journal:", err)
                }
            } else {
                setFormData({
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
                })
            }
        }
        fetchJournal()
    }, [journalId])

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = (evt) => {
        evt.preventDefault()
         const timeString = formData.timeOfDay; // "05:00"
         const isoString = new Date(`2001-01-01T${timeString}:00Z`).toISOString();
         const payload = { ...formData, timeOfDay: isoString };
        if(journalId){
            props.handleUpdateJournal(journalId, payload);
        }else {
        props.handleAddJournal(payload)
        }



    }
    return (
        <main>
            <h1>{journalId ? 'Edit Entry' : 'New Entry'}</h1>
            <form onSubmit={handleSubmit}>
               <label htmlFor='symbol'>
                    Symbol:
                    <a 
                    href="https://www.investopedia.com/terms/s/stocksymbol.asp" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ marginLeft: '6px', fontSize: '0.9em', color: 'black' }}
                    >
                    &#9432;
                    </a>
                </label>
                <input
                    required
                    type='text'
                    name='symbol'
                    id='symbol-input'
                    value={formData.symbol}
                    onChange={handleChange}
                    placeholder="Enter stock symbol"
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
                type="time"
                name="timeOfDay"
                id="tod-input"
                value={formData.timeOfDay}
                onChange={handleChange}
                />
                <label htmlFor='shareSize'>Share Size:</label>
                <input
                    required
                    type='text'
                    name='shareSize'
                    id='shareSize-input'
                    value={formData.shareSize}
                    onChange={handleChange}
                    placeholder='e.g. 100'
                />
                <label htmlFor='entry'>Entry:
                <a 
                    href="https://www.investopedia.com/terms/e/entry-point.asp" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ marginLeft: '6px', fontSize: '0.9em', color: 'black' }}
                >
                    &#9432;
                </a>
                </label>
                <input
                    required
                    type='text'
                    name='entry'
                    id='entry-input'
                    value={formData.entry}
                    onChange={handleChange}
                    placeholder='e.g. 145.32'

                />
                <label htmlFor='exit'>Exit:</label>
                <input
                    required
                    type='text'
                    name='exit'
                    id='exit-input'
                    value={formData.exit}
                    onChange={handleChange}
                    placeholder='e.g. 152.75'
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
                <label htmlFor='fees'>
                    Fees:
                    <a 
                        href="https://www.investopedia.com/terms/b/brokerage-fee.asp"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: '6px', fontSize: '0.9em', color: 'black' }}
                    >
                        &#9432;
                    </a>
                    </label>
                    <input
                    required
                    type='number'
                    step='0.01'
                    name='fees'
                    id='fees-input'
                    value={formData.fees}
                    onChange={handleChange}
                    placeholder="e.g. 5.95"
                    />
                <label htmlFor='executedDay'>Executed Day:</label>
                <input
                required
                type="date"
                name="executedDay"
                id="executedDay-input"
                value={formData.executedDay}
                onChange={handleChange}
                />
            <label htmlFor='meta'>
                Meta:
                <a
                    href="https://www.investopedia.com/trading/trading-strategy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: '6px', fontSize: '0.9em', color: 'black' }}
                >
                    &#9432;
                </a>
                </label>
                <input
                required
                type='text'
                name='meta'
                id='meta-input'
                value={formData.meta}
                onChange={handleChange}
                placeholder="e.g. Breakout strategy, swing trade"
                />
                <label htmlFor='notes'>
                Notes:
                </label>
                <textarea
                required
                name='notes'
                id='notes-input'
                value={formData.notes}
                onChange={handleChange}
                placeholder="Thoughts?"
                rows={4}
                style={{ width: '100%' }}
                />
                <button type='submit'>
                    {journalId ? 'Update Entry!' : 'Create Entry!'}
                    </button>
            </form>
        </main>
    );
};

export default JournalForm;
