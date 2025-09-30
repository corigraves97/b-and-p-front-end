
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/new`

import { useState, useEffect } from 'react';
import { useParams } from 'react-router'
import * as journalService from '../../services/journalService'

const JournalForm = (props) => {
    const { journalId } = useParams()
    console.log(journalId)
    const [formData, setFormData] = useState({
        symbol: '',
        side: '',
        timeOfDay: '',
        shareSize: '',
        entry: '',
        exit: '',
        volume: '',
        fees: '',
        executedDay: '',
        meta: '',
        notes: '',
        marketSnapshot: '',
    });

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        props.handleAddJournal(formData)
        // We'll update this function shortly...
    };
    useEffect(() => {
        const fetchJournal = async () => {
            const journalData = await journalService.show(journalId)
            setFormData(journalData)
        }
        if (journalId) fetchJournal()
        return () => setJournalData({ 
        symbol: '',
        side: '',
        timeOfDay: '',
        shareSize: '',
        entry: '',
        exit: '',
        volume: '',
        fees: '',
        executedDay: '',
        meta: '',
        notes: '',
        marketSnapshot: '',})
    }, [journalId])
    return (
        <main>
            <h1>{journalId ? 'Edit Entry' : 'New Entry' }</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor='symbol'>Symbol:</label>
                <input
                    required
                    type='text'
                    name='symbol'
                    id='symbol-input'
                    value={formData.title}
                    onChange={handleChange}
                />
                <label htmlFor='side'>Side:</label>
                <select
                    required
                    name='side'
                    id='side-input'
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value='Long'>Long</option>
                    <option value='Short'>Short</option>
                </select>
                <label htmlFor='timeOfDay'>Time Of Day:</label>
                <input
                    required
                    type='text'
                    name='timeOfDay'
                    id='tod-input'
                    value={formData.title}
                    onChange={handleChange}
                />
                <label htmlFor='shareSize'>Share Size:</label>
                <input
                    required
                    type='text'
                    name='shareSize'
                    id='shareSize-input'
                    value={formData.title}
                    onChange={handleChange}
                />
                <label htmlFor='entry'>Entry:</label>
                <input
                    required
                    type='text'
                    name='entry'
                    id='entry-input'
                    value={formData.title}
                    onChange={handleChange}
                />
                <label htmlFor='exit'>Exit:</label>
                <input
                    required
                    type='text'
                    name='exit'
                    id='exit-input'
                    value={formData.title}
                    onChange={handleChange}
                />
                <label htmlFor='side'>Volume:</label>
                <select
                    required
                    name='volume'
                    id='volume-input'
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value='1m-5m'>1m-5m</option>
                    <option value='10m-20m'>10m-20m</option>
                    <option value='30m-40m'>30m-40m</option>
                    <option value='50m-70m'>50m-70m</option>
                    <option value='80m-100m'>80m-100m</option>
                    <option value='120m-150m'>120m-150m</option>
                    <option value='160m-180m'>1m-5m</option>
                    <option value='200m+'>200m+</option>
                </select>
                <label htmlFor='fees'>Fees:</label>
                <input
                    required
                    type='text'
                    name='fees'
                    id='fees-input'
                    value={formData.title}
                    onChange={handleChange}
                />
                <label htmlFor='executedDay'>Executed Day:</label>
                <input
                    required
                    type='text'
                    name='executedDay'
                    id='executedDay-input'
                    value={formData.title}
                    onChange={handleChange}
                />
                <label htmlFor='meta'>Meta:</label>
                <input
                    required
                    type='text'
                    name='meta'
                    id='meta-input'
                    value={formData.title}
                    onChange={handleChange}
                />
                <label htmlFor='notes'>Exit:</label>
                <input
                    required
                    type='text'
                    name='notes'
                    id='notes-input'
                    value={formData.title}
                    onChange={handleChange}
                />
                <button type='submit'>Create Entry!</button>
            </form>
        </main>
    );
};

export default JournalForm;
