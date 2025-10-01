import './form.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'

import * as journalService from '../../services/journalService'

import { Alert, Typography } from '@mui/material'

const DEFAULT_SIDE = 'long'
const DEFAULT_VOLUME = '1m-5m'

const JournalForm = (props) => {
   
// this is used to determine if we are editing an existing journal or creating a new one
  const { journalId } = useParams()

// this state is used to calculate and display profit/loss
  const [profitLoss, setProfitLoss] = useState(0);


// this state holds the market snapshot data fetched from the backend
const [marketSnapshot, setMarketSnapshot] = useState({
    timestamp: '',
    symbol: '',
    overview: {},
    shares: [],
    news: { feed: [] },
});

// this effect fetches market snapshot data when the component mounts or when journalId changes
useEffect(() => {
    const fetchMarketSnapshot = async () => {
        try {
            const response = await journalService.show(journalId)
            if (!response) return

            const snapshot = response.marketSnapshot || {}
            const normalizedSymbol = (snapshot.symbol || response.symbol || '').toUpperCase()
            const sharesData = snapshot.sharesData || snapshot.shares || []
            const newsFeed = Array.isArray(snapshot.news?.feed)
                ? snapshot.news.feed
                : Array.isArray(snapshot.newsContext)
                    ? snapshot.newsContext
                    : []

            setMarketSnapshot({
                timestamp: snapshot.timestamp || '',
                symbol: normalizedSymbol,
                overview: snapshot.overview || {},
                shares: sharesData,
                news: { feed: newsFeed },
            })

            setFormData({
                userId: response.userId || '',
                // Ensure symbol is always uppercase
                symbol: normalizedSymbol,
                side: response.side || DEFAULT_SIDE,
                timeOfDay: response.timeOfDay || '',
                shareSize: response.shareSize || '',
                entry: response.entry || '',
                exit: response.exit || '',
                volume: response.volume || DEFAULT_VOLUME,
                fees: response.fees || '',
                executedDay: response.executedDay || '',
                meta: response.meta || '',
                notes: response.notes || '',
            })
        } catch (error) {
            console.error('Error fetching market snapshot:', error);
        }
    };

    if (journalId) {
        fetchMarketSnapshot();
    }
}, [journalId]); // Fetch market snapshot when journalId changes

/* here is the journalSchema from the backend

    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true, uppercase: true,},
    side: { type: String, enum: ['long', 'short'], required: true },
    timeOfDay: { type: Date, required: true, },
    shareSize: { type: Number, required: true },
    entry: { type: Number, required: true },
    exit: { type: Number, required: true },
    volume: {
      type: String,
      enum: [
        '1m-5m',
        '10m-20m',
        '30m-40m',
        '50m-70m',
        '80m-100m',
        '120m-150m',
        '160m-180m',
        '200m+',
      ],
      required: true,
    },
    fees: { type: Number, default: 0 },
    executedDay: { type: Date, required: true,},
    meta: String,
    notes: String,
    marketSnapshot: [marketSnapshotSchema]
  },
  { timestamps: true }*/


// this function holds trade data from the form
// it is combined with market snapshot data to create the payload for the backend by handleSubmit
const [tradeData, setTradeData] = useState({
    userId: '',
    side: DEFAULT_SIDE,
    timeOfDay: '',
    shareSize: '',
    entry: '',
    exit: '',
    volume: DEFAULT_VOLUME,
    fees: '',
    executedDay: '',
    meta: '',
    notes: '',
});


 

// this state holds the form data different from the trade data
// it is initialized with empty strings for each field
// tradedata vs formdata: formdata is used to populate the form inputs
// tradedata is used to create the payload for the backend

    // props is {handleAddJournal}
    // if editing, we will also have journalId in the url params

    // const { journalId } = useParams()
    const [marketView, setMarketView] = useState(null)
    //console.log(journalId)
    const [formData, setFormData] = useState({
        userId: '',
        symbol: '',
        side: DEFAULT_SIDE,
        timeOfDay: '',
        shareSize: '',
        entry: '',
        exit: '',
        volume: DEFAULT_VOLUME,
        fees: '',
        executedDay: '',
        meta: '',
        notes: '',
    });

    
    // whenever formData changes, update tradeData
// this ensures tradeData is always in sync with formData
useEffect(() => {
    setTradeData((prev) => ({
        ...prev,
        ...formData,
    }));
}, [formData]);



// Calculate profit/loss whenever relevant form fields change
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


// this function handles changes to the form inputs
// it updates the formData state with the new values
// it also updates the marketSnapshot state with the symbol in uppercase

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
        const { name, value } = evt.target
        const nextValue = name === 'symbol' ? value.toUpperCase() : value

        setFormData({ ...formData, [name]: nextValue });
        // save market snapshot data to state
        setMarketSnapshot((prev) => ({
            ...prev,
            symbol: name === 'symbol' ? nextValue : prev.symbol,
        }));
    };

    // this function handles form submission
    // it calls either handleAddJournal or handleUpdateJournal
    // depending on whether we are creating a new journal or editing an existing one
    // it also adds the market snapshot data to the formData before calling the parent function

    const handleSubmit = async (evt) => {
        evt.preventDefault()

        const payload = createPayload()

        if (journalId && props.handleUpdateJournal) {
            await props.handleUpdateJournal(journalId, payload)
        } else if (props.handleAddJournal) {
            await props.handleAddJournal(payload)
        }
    };

    const createPayload = () => {
        const basePayload = { ...tradeData };

        if (!marketSnapshot || !marketSnapshot.symbol) {
            console.warn('Market snapshot data is missing or incomplete');
            return basePayload;
        }

        const snapshotPayload = {
            timestamp: marketSnapshot.timestamp || new Date().toISOString(),
            symbol: marketSnapshot.symbol,
            overview: marketSnapshot.overview || {},
            shares: Array.isArray(marketSnapshot.shares) ? marketSnapshot.shares : [],
            news: Array.isArray(marketSnapshot.news?.feed)
                ? marketSnapshot.news.feed.slice(0, 3)
                : [],
        };

        const payload = {
            ...basePayload,
            marketSnapshot: [snapshotPayload],
        };
        console.log('Payload to be sent to backend:', payload);
        return payload;

        // The following code is unreachable and redundant due to the return above.
        // If you need to use this logic, refactor and move it outside or above the return statement.
        // const timeString = formData.timeOfDay; // "05:00"
        // const isoString = new Date(`2001-01-01T${timeString}:00Z`).toISOString();
        // const altPayload = { ...formData, timeOfDay: isoString };
        // if(journalId){
        //     props.handleUpdateJournal(journalId, altPayload);
        // }else {
        //     props.handleAddJournal(altPayload)
        // }
    }
  
    
    return (
        <main>
            <h1>{journalId ? 'Edit Entry' : 'New Entry'}</h1>
            <form onSubmit={handleSubmit} className="journal-form">
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
                    id='side-select'
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
                    type='number'
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
                    type='number'
                    name='entry'
                    id='entry-input'
                    value={formData.entry}
                    onChange={handleChange}
                    placeholder='e.g. 145.32'

                />
                <label htmlFor='exit'>Exit:</label>
                <input
                    required
                    type='number'
                    name='exit'
                    id='exit-input'
                    value={formData.exit}
                    onChange={handleChange}
                    placeholder='e.g. 152.75'
                />
                <label htmlFor='volume'>Volume:</label>

                <select 
                    required
                    name="volume" 
                    value={formData.volume} 
                    id='volume-select'
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
                />
                {/* P/L Display */}
                {profitLoss !== 0 && (
                    <Alert 
                        severity={profitLoss >= 0 ? 'success' : 'error'}
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Typography variant="h6">
                            Net P/L: ${profitLoss.toFixed(2)}
                        </Typography>
                    </Alert>
                )}
                <button type='submit'>{journalId ? 'Update Entry!' : 'Create Entry!'}</button>

            </form>
        </main>     
    );
}


export default JournalForm;
