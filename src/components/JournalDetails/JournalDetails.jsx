import { useParams, Link as RouterLink } from 'react-router'
import { useState, useEffect, useContext } from 'react'
import * as journalService from '../../services/journalService'
import { UserContext } from '../../contexts/UserContext'

import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

const JournalDetails = (props) => {
  const { journalId } = useParams()
  const { user } = useContext(UserContext)
  const [journal, setJournal] = useState(null)

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const data = await journalService.show(journalId)
        console.log("Fetched journal:", data)
        setJournal(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchJournal()
  }, [journalId])

  if (!journal) return <main>No Journal Entries</main>

  return (
    <main className="journal-details-page">
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={10}
          sx={{
            borderRadius: 4,
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 6 },
            background:
              'linear-gradient(135deg, rgba(30,64,175,0.85) 0%, rgba(15,118,110,0.8) 35%, rgba(8,47,73,0.9) 100%)',
            color: '#f8fafc',
          }}
        >
          <Stack spacing={4}>
            {/* Header */}
            <Stack spacing={1.5}>
              <Typography variant="overline" sx={{ letterSpacing: 4, color: 'rgba(226, 232, 240, 0.7)' }}>
                trade journal
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {journal.symbol}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label={journal.side?.toUpperCase()}
                  sx={{
                    backgroundColor: journal.side === 'long'
                      ? 'rgba(34,197,94,0.25)'
                      : 'rgba(239,68,68,0.25)',
                    color: '#f8fafc',
                  }}
                />
                <Chip label={`Volume • ${journal.volume}`} sx={{ backgroundColor: 'rgba(148,163,184,0.25)', color: '#e2e8f0' }} />
              </Stack>
            </Stack>

            <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.35)' }} />

            {/* Trade details */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Time of Day</Typography>
                <Typography variant="body1">{journal.timeOfDay || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Share Size</Typography>
                <Typography variant="body1">{journal.shareSize}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Fees</Typography>
                <Typography variant="body1">${journal.fees}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Entry Price</Typography>
                <Typography variant="body1">${journal.entry}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Exit Price</Typography>
                <Typography variant="body1">${journal.exit}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Meta</Typography>
                <Typography variant="body1">{journal.meta || '—'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Notes</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {journal.notes || '—'}
                </Typography>
              </Grid>
            </Grid>

            {/* Actions */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                component={RouterLink}
                to={`/journal/${journalId}/edit`}
                sx={{
                  background: 'linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)',
                  borderRadius: 999,
                  px: 3,
                }}
              >
                Edit Entry
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => props.handleDeleteJournal(journalId)}
                sx={{ borderRadius: 999, px: 3 }}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </main>
  )
}

export default JournalDetails