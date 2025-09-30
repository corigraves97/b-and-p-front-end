import { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, TextField,
  Button, Select, MenuItem, FormControl, InputLabel,
  Alert, Box, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import api from '../../services/api';

const Testing = () => {

  // Dummy saveTrade function (replace with your actual API call)
  const saveTrade = async () => {
    // Example: return await api.saveTrade(tradeData);
    // For now, simulate a successful save with a delay
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
  };

  const [formData, setFormData] = useState({
    symbol: '',
    side: '',
    shareSize: '',
    entry: '',
    exit: '',
    volume: '',
    fees: '5.99',
    timeOfDay: new Date().toISOString().slice(0, 16),
    strategyTag: '',
    notes: ''
  });

  const [marketPreview, setMarketPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [profitLoss, setProfitLoss] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');


  // Calculate P/L in real-time
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

  const handleInputChange = (e) => {
    console.log('Input changed:', e.target.name, e.target.value); // Debug log
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const previewMarketData = async () => {
    if (!formData.symbol) {
      setMessage('Please enter a stock symbol first');
      return;
    }

    try {
      const profile = await api.getCompleteStockProfile(formData.symbol);
      setMarketPreview(profile);
      setShowPreview(true);
    } catch (error) {
      setMessage(`Error fetching market data: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Convert form data to API format
      const tradeData = {
        symbol: formData.symbol.toUpperCase(),
        side: formData.side,
        shareSize: parseInt(formData.shareSize),
        entry: parseFloat(formData.entry),
        exit: parseFloat(formData.exit),
        volume: formData.volume,
        fees: parseFloat(formData.fees) || 0,
        timeOfDay: new Date(formData.timeOfDay).toISOString(),
        meta: { strategyTag: formData.strategyTag },
        notes: formData.notes
      };

      await saveTrade(tradeData);
      
      setMessage(`✅ Trade saved successfully! Market snapshot captured for ${tradeData.symbol}`);
      console.log('Trade data saved:', tradeData);

      // Optionally, you can also save the marketPreview data with the trade here
      // await api.saveMarketDataWithTrade(tradeId, marketPreview);
      
      // Reset form
      setFormData({
        symbol: '',
        side: '',
        shareSize: '',
        entry: '',
        exit: '',
        volume: '',
        fees: '5.99',
        timeOfDay: new Date().toISOString().slice(0, 16),
        executedDay: new Date().toISOString().split('T')[0],
        strategyTag: '',
        notes: ''
      });
      setProfitLoss(0);
      
    } catch (error) {
      setMessage(`❌ Error saving trade: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        💼 Trading Entry Form
      </Typography>

      <Grid container spacing={3}>
        {/* Trading Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Basic Trade Info */}
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Stock Symbol"
                      name="symbol"
                      value={formData.symbol}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Trade Side</InputLabel>
                      <Select
                        name="side"
                        value={formData.side}
                        onChange={handleInputChange}
                        label="Trade Side"
                      >
                        <MenuItem value="long">Long</MenuItem>
                        <MenuItem value="short">Short</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Prices & Size */}
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Entry Price"
                      name="entry"
                      type="number"
                      step="0.01"
                      value={formData.entry}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Exit Price"
                      name="exit"
                      type="number"
                      step="0.01"
                      value={formData.exit}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Share Size"
                      name="shareSize"
                      type="number"
                      value={formData.shareSize}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>

                  {/* Volume & Fees */}
                  <Grid item xs={8}>
                    <FormControl fullWidth required>
                      <InputLabel>Volume Range</InputLabel>
                      <Select
                        name="volume"
                        value={formData.volume}
                        onChange={handleInputChange}
                        label="Volume Range"
                      >
                        <MenuItem value="1m - 5m">1M - 5M</MenuItem>
                        <MenuItem value="10m - 20m">10M - 20M</MenuItem>
                        <MenuItem value="30m - 40m">30M - 40M</MenuItem>
                        <MenuItem value="50m - 70m">50M - 70M</MenuItem>
                        <MenuItem value="80m - 100m">80M - 100M</MenuItem>
                        <MenuItem value="120m - 150m">120M - 150M</MenuItem>
                        <MenuItem value="160m - 180m">160M - 180M</MenuItem>
                        <MenuItem value="200+m">200M+</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Fees"
                      name="fees"
                      type="number"
                      step="0.01"
                      value={formData.fees}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {/* Dates */}
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Time of Day"
                      name="timeOfDay"
                      type="datetime-local"
                      value={formData.timeOfDay}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
             

                  {/* Strategy & Notes */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Strategy Tag"
                      name="strategyTag"
                      value={formData.strategyTag}
                      onChange={handleInputChange}
                      placeholder="swing_trade, breakout, etc."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Trade Notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Enter analysis, emotions, market conditions..."
                    />
                  </Grid>

                  {/* P/L Display */}
                  {profitLoss !== 0 && (
                    <Grid item xs={12}>
                      <Alert 
                        severity={profitLoss >= 0 ? 'success' : 'error'}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Typography variant="h6">
                          {profitLoss >= 0 ? '📈' : '📉'} Net P/L: ${profitLoss.toFixed(2)}
                        </Typography>
                      </Alert>
                    </Grid>
                  )}

                  {/* Action Buttons */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={previewMarketData}
                        disabled={!formData.symbol}
                      >
                        📊 Preview Market Data
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={saving}
                        sx={{ flexGrow: 1 }}
                      >
                        {saving ? '💾 Saving...' : '💾 Save Trade with Market Snapshot'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>

              {message && (
                <Alert severity={message.includes('✅') ? 'success' : 'error'} sx={{ mt: 2 }}>
                  {message}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Market Data Preview Dialog */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>📊 Market Snapshot Preview - {formData.symbol}</DialogTitle>
        <DialogContent>
          {marketPreview && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                This market data will be automatically saved with your trade for future correlation analysis.
              </Alert>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify(marketPreview, null, 2)}
              </pre>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};


export default Testing;