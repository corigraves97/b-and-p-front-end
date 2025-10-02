import './form.css'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import * as journalService from '../../services/journalService'

import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Grid,
    Link,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'

const DEFAULT_SIDE = 'long'
const DEFAULT_VOLUME = '1m-5m'

const EMPTY_FORM = {
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
}

const EMPTY_SNAPSHOT = {
    timestamp: '',
    symbol: '',
    overview: {},
    shares: [],
    news: { feed: [] },
}

const VOLUME_OPTIONS = [
    { value: '1m-5m', label: '1m - 5m' },
    { value: '10m-20m', label: '10m - 20m' },
    { value: '30m-40m', label: '30m - 40m' },
    { value: '50m-70m', label: '50m - 70m' },
    { value: '80m-100m', label: '80m - 100m' },
    { value: '120m-150m', label: '120m - 150m' },
    { value: '160m-180m', label: '160m - 180m' },
    { value: '200m+', label: '200m+' },
]

const INFO_LINKS = {
    symbol: {
        href: 'https://www.investopedia.com/terms/s/stocksymbol.asp',
        label: 'What is a stock symbol?',
    },
    entry: {
        href: 'https://www.investopedia.com/terms/e/entry-point.asp',
        label: 'Understanding entry points',
    },
    fees: {
        href: 'https://www.investopedia.com/terms/b/brokerage-fee.asp',
        label: 'Brokerage fees explained',
    },
    meta: {
        href: 'https://www.investopedia.com/trading/trading-strategy/',
        label: 'Explore trading strategies',
    },
}

const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: 'rgba(15, 23, 42, 0.23)',
        backdropFilter: 'blur(12px)',
        color: 'rgba(226, 232, 240, 0.7)',
        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.35)' },
        '&:hover fieldset': { borderColor: '#38bdf8' },
        '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(226, 232, 240, 0.7)' },
    '& .MuiInputLabel-root.Mui-focused': {  color: 'rgba(226, 232, 240, 0.7)' },
    '& .MuiFormHelperText-root': { color: 'rgba(226, 232, 240, 0.7)' },
}

const formatLocalTimestamp = (timestamp) => {
    if (!timestamp) return '—'
    try {
        const value = new Date(timestamp)
        if (Number.isNaN(value.getTime())) return '—'
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(value)
    } catch (error) {
        console.error('Failed to format timestamp', error)
        return '—'
    }
}

const toStringValue = (value) => {
    if (value === null || value === undefined) return ''
    return value.toString()
}

const JournalForm = (props) => {
    const { journalId } = useParams()

        const [profitLoss, setProfitLoss] = useState(0)
        const [marketSnapshot, setMarketSnapshot] = useState({ ...EMPTY_SNAPSHOT })
        const [tradeData, setTradeData] = useState({ ...EMPTY_FORM })
        const [formData, setFormData] = useState({ ...EMPTY_FORM })

        useEffect(() => {
            setTradeData((prev) => ({
                ...prev,
                ...formData,
            }))
        }, [formData])

        useEffect(() => {
            let ignore = false

            const hydrateJournal = async () => {
                if (!journalId) {
                    if (!ignore) {
                        setFormData({ ...EMPTY_FORM })
                        setMarketSnapshot({ ...EMPTY_SNAPSHOT })
                    }
                    return
                }

                try {
                    const response = await journalService.show(journalId)
                    if (!response || ignore) return

                    const snapshotSource = Array.isArray(response.marketSnapshot)
                        ? response.marketSnapshot[0] || {}
                        : response.marketSnapshot || {}

                    const normalizedSymbol = (snapshotSource.symbol || response.symbol || '').toUpperCase()

                    setMarketSnapshot({
                        timestamp: snapshotSource.timestamp || '',
                        symbol: normalizedSymbol,
                        overview: snapshotSource.overview || {},
                        shares: snapshotSource.sharesData || snapshotSource.shares || [],
                        news: {
                            feed: Array.isArray(snapshotSource.news?.feed)
                                ? snapshotSource.news.feed
                                : Array.isArray(snapshotSource.newsContext)
                                    ? snapshotSource.newsContext
                                    : Array.isArray(snapshotSource.news)
                                        ? snapshotSource.news
                                        : [],
                        },
                    })

                    setFormData({
                        userId: response.userId || '',
                        symbol: normalizedSymbol,
                        side: response.side || DEFAULT_SIDE,
                        timeOfDay: response.timeOfDay
                            ? new Date(response.timeOfDay).toISOString().substring(11, 16)
                            : '',
                        shareSize: toStringValue(response.shareSize),
                        entry: toStringValue(response.entry),
                        exit: toStringValue(response.exit),
                        volume: response.volume || DEFAULT_VOLUME,
                        fees: toStringValue(response.fees),
                        executedDay: response.executedDay
                            ? new Date(response.executedDay).toISOString().substring(0, 10)
                            : '',
                        meta: response.meta || '',
                        notes: response.notes || '',
                    })
                } catch (error) {
                    console.error('Error fetching journal:', error)
                }
            }

            hydrateJournal()

            return () => {
                ignore = true
            }
        }, [journalId])

        useEffect(() => {
            const entry = parseFloat(formData.entry)
            const exit = parseFloat(formData.exit)
            const shareSize = parseInt(formData.shareSize, 10)
            const fees = parseFloat(formData.fees) || 0

            if (
                !Number.isNaN(entry) &&
                !Number.isNaN(exit) &&
                !Number.isNaN(shareSize) &&
                shareSize > 0 &&
                formData.side
            ) {
                const profit =
                    formData.side === 'long'
                        ? (exit - entry) * shareSize
                        : (entry - exit) * shareSize

                setProfitLoss(profit - fees)
            } else {
                setProfitLoss(0)
            }
        }, [formData.entry, formData.exit, formData.shareSize, formData.fees, formData.side])

        const handleChange = (event) => {
            const { name, value } = event.target
            const nextValue = name === 'symbol' ? value.toUpperCase() : value

            setFormData((prev) => ({ ...prev, [name]: nextValue }))
            if (name === 'symbol') {
                setMarketSnapshot((prev) => ({ ...prev, symbol: nextValue }))
            }
        }

        const buildSnapshotPayload = () => {
            if (!marketSnapshot || !marketSnapshot.symbol) return null

            const newsFeed = Array.isArray(marketSnapshot.news?.feed)
                ? marketSnapshot.news.feed.slice(0, 3)
                : []

            const sharesData = Array.isArray(marketSnapshot.shares)
                ? marketSnapshot.shares
                : []

            return {
                timestamp: marketSnapshot.timestamp || new Date().toISOString(),
                symbol: marketSnapshot.symbol,
                overview: marketSnapshot.overview || {},
                shares: sharesData,
                sharesData,
                news: newsFeed,
                newsContext: newsFeed,
            }
        }

        const createPayload = () => {
            const snapshotPayload = buildSnapshotPayload()

            const payload = {
                ...tradeData,
                timeOfDay: formData.timeOfDay,
                executedDay: formData.executedDay,
            }

            if (snapshotPayload) {
                payload.marketSnapshot = [snapshotPayload]
            }

            return payload
        }

        const handleSubmit = async (event) => {
            event.preventDefault()

            const payload = createPayload()

            if (journalId && props.handleUpdateJournal) {
                await props.handleUpdateJournal(journalId, payload)
            } else if (props.handleAddJournal) {
                await props.handleAddJournal(payload)
            }
        }

        const helperLink = (key) => {
            const info = INFO_LINKS[key]
            if (!info) return null

            return (
                <Tooltip title={info.label} arrow placement="top">
                    <Link
                        href={info.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{
                            fontSize: '0.7rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'rgba(226, 232, 240, 0.75)',
                        }}
                    >
                        Learn more
                    </Link>
                </Tooltip>
            )
        }

        const newsHighlights = Array.isArray(marketSnapshot.news?.feed)
            ? marketSnapshot.news.feed.slice(0, 3)
            : []

        const shareDataCount = Array.isArray(marketSnapshot.shares)
            ? marketSnapshot.shares.length
            : 0

        const profitLabel =
            profitLoss === 0
                ? 'Net P/L $0.00'
                : `Net P/L ${profitLoss > 0 ? '+' : '-'}$${Math.abs(profitLoss).toFixed(2)}`

        const profitChipStyles =
            profitLoss === 0
                ? {
                        backgroundColor: 'rgba(148, 163, 184, 0.2)',
                        color: '#e2e8f0',
                        borderColor: 'rgba(148, 163, 184, 0.35)',
                    }
                : profitLoss > 0
                ? {
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        color: '#bbf7d0',
                        borderColor: 'rgba(34, 197, 94, 0.35)',
                    }
                : {
                        backgroundColor: 'rgba(248, 113, 113, 0.15)',
                        color: '#fecaca',
                        borderColor: 'rgba(248, 113, 113, 0.35)',
                    }

        return (
            <main className="journal-form-page">
                <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
                    <Paper
                        elevation={10}
                        sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: 4,
                            px: { xs: 3, md: 6 },
                            py: { xs: 4, md: 6 },
                            background:
                                'linear-gradient(135deg, rgba(30,64,175,0.85) 0%, rgba(15,118,110,0.8) 35%, rgba(8,47,73,0.9) 100%)',
                            color: '#031930ff',
                            boxShadow: '0 40px 80px rgba(15, 23, 42, 0.45)',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                background:
                                    'radial-gradient(800px circle at -10% -15%, rgba(56, 189, 248, 0.25), transparent 50%), radial-gradient(600px circle at 120% -10%, rgba(99, 102, 241, 0.22), transparent 55%)',
                                pointerEvents: 'none',
                            }}
                        />
                        <Stack spacing={5} sx={{ position: 'relative' }}>
                            <Stack spacing={1.5}>
                                <Typography
                                    variant="overline"
                                    sx={{ letterSpacing: 4, color: 'rgba(226, 232, 240, 0.7)' }}
                                >
                                    trade journal
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                    {journalId ? 'Edit Entry' : 'New Entry'}
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.76)' }}>
                                    Capture the full story of your trade and keep your edge sharp.
                                </Typography>
                            </Stack>

                            <Grid container spacing={{ xs: 3, md: 4 }}>
                                <Grid item xs={12} md={7}>
                                    <Box component="form" onSubmit={handleSubmit} className="journal-form">
                                        <Stack spacing={3.5}>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    Trade details
                                                </Typography>
                                                <Chip
                                                    label={profitLabel}
                                                    variant="outlined"
                                                    sx={{
                                                        ...profitChipStyles,
                                                        borderRadius: 999,
                                                        fontWeight: 600,
                                                        px: 1.5,
                                                    }}
                                                />
                                            </Stack>
                                            <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.3)' }} />

                                            <Grid container spacing={2.5}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        required
                                                        label="Symbol"
                                                        name="symbol"
                                                        value={formData.symbol}
                                                        onChange={handleChange}
                                                        placeholder="AAPL"
                                                        sx={textFieldStyles}
                                                        helperText={helperLink('symbol')}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        select
                                                        required
                                                        label="Side"
                                                        name="side"
                                                        value={formData.side}
                                                        onChange={handleChange}
                                                        sx={textFieldStyles}
                                                    >
                                                        <MenuItem value="long">Long</MenuItem>
                                                        <MenuItem value="short">Short</MenuItem>
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        required
                                                        type="time"
                                                        label="Time of day"
                                                        name="timeOfDay"
                                                        value={formData.timeOfDay}
                                                        onChange={handleChange}
                                                        sx={textFieldStyles}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        required
                                                        type="number"
                                                        label="Share size"
                                                        name="shareSize"
                                                        value={formData.shareSize}
                                                        onChange={handleChange}
                                                        placeholder="e.g. 100"
                                                        sx={textFieldStyles}
                                                        inputProps={{ min: 0, step: 1 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        required
                                                        type="number"
                                                        label="Entry price"
                                                        name="entry"
                                                        value={formData.entry}
                                                        onChange={handleChange}
                                                        placeholder="e.g. 145.32"
                                                        sx={textFieldStyles}
                                                        inputProps={{ step: '0.01' }}
                                                        helperText={helperLink('entry')}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        required
                                                        type="number"
                                                        label="Exit price"
                                                        name="exit"
                                                        value={formData.exit}
                                                        onChange={handleChange}
                                                        placeholder="e.g. 152.75"
                                                        sx={textFieldStyles}
                                                        inputProps={{ step: '0.01' }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        select
                                                        required
                                                        label="Volume"
                                                        name="volume"
                                                        value={formData.volume}
                                                        onChange={handleChange}
                                                        sx={textFieldStyles}
                                                    >
                                                        {VOLUME_OPTIONS.map((option) => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        required
                                                        type="number"
                                                        label="Fees"
                                                        name="fees"
                                                        value={formData.fees}
                                                        onChange={handleChange}
                                                        placeholder="e.g. 5.95"
                                                        sx={textFieldStyles}
                                                        inputProps={{ step: '0.01', min: 0 }}
                                                        helperText={helperLink('fees')}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        required
                                                        type="date"
                                                        label="Executed day"
                                                        name="executedDay"
                                                        value={formData.executedDay}
                                                        onChange={handleChange}
                                                        sx={textFieldStyles}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        required
                                                        label="Meta"
                                                        name="meta"
                                                        value={formData.meta}
                                                        onChange={handleChange}
                                                        placeholder="Breakout strategy, swing trade"
                                                        sx={textFieldStyles}
                                                        helperText={helperLink('meta')}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        required
                                                        label="Notes"
                                                        name="notes"
                                                        value={formData.notes}
                                                        onChange={handleChange}
                                                        placeholder="What made this trade stand out?"
                                                        multiline
                                                        rows={4}
                                                        sx={textFieldStyles}
                                                    />
                                                </Grid>
                                            </Grid>

                                            <Stack spacing={2.5} alignItems="center">
                                                <Button
                                                    type="submit"
                                                    size="large"
                                                    variant="contained"
                                
                                                    sx={{
                                                        borderRadius: 999,
                                                        px: 4,
                                                        py: 1.5,
                                                        fontWeight: 600,
                                                        textTransform: 'none',
                                                        background: 'linear-gradient(90deg, #38bff898 0%, #6365f1c9 100%)',
                                                        boxShadow: '0 20px 20px rgba(5, 15, 19, 0.35)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(90deg, #0ea5e9 0%, #4f46e5 100%)',
                                                            boxShadow: '0 30px 55px rgba(99, 102, 241, 0.4)',
                                                        },
                                                    }}
                                                >
                                                    {journalId ? 'Update entry' : 'Create entry'}
                                                </Button>

                                      
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={5}>
                                    <Stack
                                        spacing={3}
                                        sx={{
                                            p: { xs: 3, md: 4 },
                                            borderRadius: 3,
                                            backgroundColor: 'rgba(15, 23, 42, 0.45)',
                                            border: '1px solid rgba(148, 163, 184, 0.35)',
                                            backdropFilter: 'blur(18px)',
                                            alignItems: 'center',
                                            justifyContent: 'center',

                                        }}
                                    >
                                        <Stack spacing={1}>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                Market snapshot
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.75)' }}>
                                                {marketSnapshot.symbol
                                                    ? 'Market data is currently available.'
                                                    : 'Snapshot data will display after the entry is saved with a linked symbol.'}
                                            </Typography>
                                        </Stack>
                                        <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.3)' }} />

                                        <Stack spacing={2}>
                                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                                {marketSnapshot.symbol ? (
                                                    <>
                                                        <Chip
                                                            label={`Symbol • ${marketSnapshot.symbol}`}
                                                            sx={{
                                                                backgroundColor: 'rgba(56, 189, 248, 0.18)',
                                                                color: '#bae6fd',
                                                                borderRadius: 999,
                                                            }}
                                                        />
                                                        <Chip
                                                            label={`Updated • ${formatLocalTimestamp(marketSnapshot.timestamp)}`}
                                                            sx={{
                                                                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                                                                color: '#c7d2fe',
                                                                borderRadius: 999,
                                                            }}
                                                        />
                                                    </>
                                                ) : (
                                                    <Chip
                                                        label="No snapshot yet"
                                                        sx={{
                                                            backgroundColor: 'rgba(148, 163, 184, 0.18)',
                                                            color: '#e2e8f0',
                                                            borderRadius: 999,
                                                        }}
                                                    />
                                                )}
                                            </Stack>

                                            {marketSnapshot.symbol && (
                                                <Stack spacing={2.5} >
                                                    {marketSnapshot.overview &&
                                                        Object.keys(marketSnapshot.overview).length > 0 && (
                                                            <Box>
                                                                <Typography
                                                                    variant="subtitle2"
                                                                    sx={{ opacity: 0.85, mb: 0.5 }}
                                                                >
                                                                    Overview
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{ color: 'rgba(226, 232, 240, 0.75)' }}
                                                                >
                                                                    {marketSnapshot.overview.summary ||
                                                                        'Snapshot metadata captured.'}
                                                                </Typography>
                                                            </Box>
                                                        )}

                                                    <Box>
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{ opacity: 0.85, mb: 0.5 }}
                                                        >
                                                            Share data points
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: 'rgba(226, 232, 240, 0.75)' }}
                                                        >
                                                            {shareDataCount > 0
                                                                ? `${shareDataCount} data point${shareDataCount > 1 ? 's' : ''} available`
                                                                : 'Share metrics will populate with your next sync.'}
                                                        </Typography>
                                                    </Box>

                                                    <Box>
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{ opacity: 0.85, mb: 0.5 }}
                                                        >
                                                            Top headlines
                                                        </Typography>
                                                        <Stack spacing={1.25}>
                                                            {newsHighlights.length > 0 ? (
                                                                newsHighlights.map((item, index) => {
                                                                    const title = typeof item === 'string'
                                                                        ? item
                                                                        : item?.title || item?.headline || item?.summary || 'Market insight'
                                                                    const url =
                                                                        typeof item === 'object' ? item?.url || item?.link : null

                                                                    return (
                                                                        <Typography
                                                                            key={`${marketSnapshot.symbol}-news-${index}`}
                                                                            variant="body2"
                                                                            sx={{
                                                                                display: 'flex',
                                                                                gap: 1,
                                                                                color: 'rgba(226, 232, 240, 0.8)',
                                                                            }}
                                                                        >
                                                                            <Box
                                                                                component="span"
                                                                                sx={{
                                                                                    fontWeight: 700,
                                                                                    color: 'rgba(148, 163, 184, 0.9)',
                                                                                }}
                                                                            >
                                                                                {index + 1}.
                                                                            </Box>
                                                                            {url ? (
                                                                                <Link
                                                                                    href={url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    underline="hover"
                                                                                    sx={{ color: '#f8fafc' }}
                                                                                >
                                                                                    {title}
                                                                                </Link>
                                                                            ) : (
                                                                                title
                                                                            )}
                                                                        </Typography>
                                                                    )
                                                                })
                                                            ) : (
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{ color: 'rgba(226, 232, 240, 0.65)' }}
                                                                >
                                                                    Save an entry to surface live headlines related to your symbol.
                                                                </Typography>
                                                            )}

                                                        </Stack>
                                                    </Box>
                                                </Stack>
                                            )}
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Paper>
                </Container>
            </main>
        )
    }

export default JournalForm
