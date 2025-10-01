
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/journal`
import './form.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router'
import * as journalService from '../../services/journalService'

const JournalForm = (props) => {
    // props is {handleAddJournal}
    // if editing, we will also have journalId in the url params
    
    const { journalId } = useParams()
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
        marketSnapshot: { symbol: '' },
    });
    const [symbols, setSymbols] = useState([]);

    useEffect(() => {
        const fetchSymbols = async () => {
            try {
                // hit backend overview route for a list of tickers
                const res = await fetch("http://localhost:3000/api/overview?tickers=AAPL");
                const data = await res.json();
                setSymbols([data.Symbol]);
            } catch (err) {
                console.error("Error fetching symbols", err);
            }
        };
        fetchSymbols();
    }, [])

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = (evt) => {
        evt.preventDefault()
        const formattedData = {
            ...formData,
            timeOfDay: new Date(formData.timeOfDay),
            executedDay: new Date(formData.executedDay),
            shareSize: Number(formData.shareSize),
            entry: Number(formData.entry),
            exit: Number(formData.exit),
            fees: formData.fees ? Number(formData.fees) : 0
        }
        props.handleAddJournal(formattedData)
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
                    type='text'
                    name='shareSize'
                    id='shareSize-input'
                    value={formData.shareSize}
                    onChange={handleChange}
                />
                <label htmlFor='entry'>Entry:</label>
                <input
                    required
                    type='text'
                    name='entry'
                    id='entry-input'
                    value={formData.entry}
                    onChange={handleChange}
                />
                <label htmlFor='exit'>Exit:</label>
                <input
                    required
                    type='text'
                    name='exit'
                    id='exit-input'
                    value={formData.exit}
                    onChange={handleChange}
                />
                <label htmlFor='volume'>Volume:</label>
                <select
                    required
                    name="volume"
                    value={formData.volume}
                    onChange={handleChange}
                >
                    <option value="1m - 5m">1m - 5m</option>
                    <option value="10m - 20m">10m - 20m</option>
                    <option value="30m - 40m">30m - 40m</option>
                    <option value="50m - 70m">50m - 70m</option>
                    <option value="80m - 100m">80m - 100m</option>
                    <option value="120m - 150m">120m - 150m</option>
                    <option value="160m - 180m">160m - 180m</option>
                    <option value="200+m">200+m</option>
                </select>
                <label htmlFor='fees'>Fees:</label>
                <input
                    required
                    type='text'
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
                <label htmlFor="market-snapshot">Market Snapshot Symbol:</label>
                <select
                    required
                    name="marketSnapshot.symbol"
                    id="marketSnapshot-input"
                    value={formData.marketSnapshot.symbol}
                    onChange={(evt) =>
                        setFormData({
                            ...formData,
                            marketSnapshot: { ...formData.marketSnapshot, symbol: evt.target.value }
                        })
                    }
                >
                    <option value="">Select a symbol</option>
                    {symbols.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <button type='submit'>Create Entry!</button>
            </form>
        </main>
    );
};

export default JournalForm;
