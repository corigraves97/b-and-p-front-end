import { Container, Paper, Stack, Typography, Button, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router'

const Landing = () => {
  return (
    <main>
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)',
          color: '#f8fafc',
          px: 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            maxWidth: 800,
            textAlign: 'center',
            background:
              'linear-gradient(135deg, rgba(15,118,110,0.85) 0%, rgba(30,64,175,0.85) 100%)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Stack spacing={3}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                fontFamily: 'serif',
              }}
            >
              Welcome to Bull & Paper
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                color: 'rgba(241,245,249,0.9)',
                fontFamily: 'cursive',
              }}
            >
              Your Personal Trading Diary
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: 'rgba(226,232,240,0.9)', lineHeight: 1.6 }}
            >
              Designed for traders who want to track, reflect and grow. Log your trades, capture insights, and refine your strategy with
              every entry. Track your journey through the markets with clarity
              and confidence.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, pt: 2 }}>
              <Button
                variant="contained"
                component={RouterLink}
                to="/sign-up"
                sx={{
                  px: 4,
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)',
                }}
              >
                Sign Up
              </Button>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/sign-in"
                sx={{
                  px: 4,
                  borderRadius: 999,
                  color: '#f8fafc',
                  borderColor: 'rgba(255,255,255,0.4)',
                }}
              >
                Log In
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </main>
  )
}

export default Landing