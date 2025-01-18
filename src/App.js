import React, { useState, useEffect } from 'react';
import Dropdown from './components/Dropdown';
import Plot from './components/Plot';
import LoadingSpinner from './components/LoadingSpinner';
import { fetchFutureContractPrices, fetchHistoricalPrices } from './api/binance';
import { Button, Container, Typography, MenuItem, Select, FormControl, InputLabel, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

const App = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [futurePrices, setFuturePrices] = useState({ perpetual: 0, quarterly: 0, biquarterly: 0 });
  const [historicalPrices, setHistoricalPrices] = useState([]);
  const [selectedDays, setSelectedDays] = useState(7);
  const [selectedFrequency, setSelectedFrequency] = useState('1d');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpread, setIsSpread] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const handleCryptoChange = (event) => {
    setSelectedCrypto(event.target.value);
  };

  const handleDaysChange = (event) => {
    setSelectedDays(event.target.value);
    fetchAndSetHistoricalPrices(event.target.value, selectedFrequency);
  };

  const handleFrequencyChange = (event) => {
    setSelectedFrequency(event.target.value);
    fetchAndSetHistoricalPrices(selectedDays, event.target.value);
  };

  const fetchPrices = async () => {
    setIsLoading(true);
    const prices = await fetchFutureContractPrices(selectedCrypto);
    setFuturePrices(prices);
    setLastRefreshed(new Date().toLocaleString());
    setIsLoading(false);
  };

  const computeSpread = (prices) => {
    const { perpetual, quarterly, biquarterly } = prices;
    return {
      perpetualQuarterly: {
        value: perpetual - quarterly,
        percentage: ((perpetual - quarterly) / perpetual) * 100,
      },
      perpetualBiquarterly: {
        value: perpetual - biquarterly,
        percentage: ((perpetual - biquarterly) / perpetual) * 100,
      },
      quarterlyBiquarterly: {
        value: quarterly - biquarterly,
        percentage: ((quarterly - biquarterly) / quarterly) * 100,
      },
    };
  };

  const fetchAndSetHistoricalPrices = async (days, frequency) => {
    setIsLoading(true);
    const prices = await fetchHistoricalPrices(selectedCrypto, days, frequency);
    setHistoricalPrices(prices);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPrices();
    fetchAndSetHistoricalPrices(selectedDays, selectedFrequency);
  }, [selectedCrypto, selectedDays, selectedFrequency]);

  const formatPrice = (price) => {
    return `$${Number(price).toFixed(2)}`;
  };

  const formatChange = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(2);
  };

  return (
    <Container className="main-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" className="heading">Binance Futures Price Comparison</Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="primary" onClick={() => { fetchPrices(); fetchAndSetHistoricalPrices(selectedDays, selectedFrequency); }}>
            <RefreshIcon />
          </IconButton>
          {lastRefreshed && <Typography variant="body2" className="last-refreshed">Last refreshed: {lastRefreshed}</Typography>}
        </div>
      </div>
      <FormControl className="dropdown">
        <InputLabel>Cryptocurrency</InputLabel>
        <Select value={selectedCrypto} onChange={handleCryptoChange}>
          <MenuItem value="BTC">BTC</MenuItem>
          <MenuItem value="ETH">ETH</MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={3} direction="row">
        <Grid item xs={12} md={6}>
          <div className="table-container">
            <Typography variant="h5" className="heading">Future Contract Prices</Typography>
            <TableContainer component={Paper}>
              <Table className="table">
                <TableHead className="table-header">
                  <TableRow className="table-row">
                    <TableCell className="table-cell">Contract Type</TableCell>
                    <TableCell className="table-cell">Price</TableCell>
                    <TableCell className="table-cell">Change (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className="table-row">
                    <TableCell className="table-cell">Perpetual</TableCell>
                    <TableCell className="table-cell">{formatPrice(futurePrices.perpetual)}</TableCell>
                    <TableCell className="table-cell">-</TableCell>
                  </TableRow>
                  <TableRow className="table-row">
                    <TableCell className="table-cell">Quarterly</TableCell>
                    <TableCell className="table-cell">{formatPrice(futurePrices.quarterly)}</TableCell>
                    <TableCell className="table-cell">{formatChange(futurePrices.quarterly, futurePrices.perpetual)}%</TableCell>
                  </TableRow>
                  <TableRow className="table-row">
                    <TableCell className="table-cell">Biquarterly</TableCell>
                    <TableCell className="table-cell">{formatPrice(futurePrices.biquarterly)}</TableCell>
                    <TableCell className="table-cell">{formatChange(futurePrices.biquarterly, futurePrices.perpetual)}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="table-container">
            <Typography variant="h5" className="heading">Spread</Typography>
            <TableContainer component={Paper}>
              <Table className="table">
                <TableHead className="table-header">
                  <TableRow className="table-row">
                    <TableCell className="table-cell">Spread Type</TableCell>
                    <TableCell className="table-cell">Value</TableCell>
                    <TableCell className="table-cell">Percentage (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className="table-row">
                    <TableCell className="table-cell">Perpetual - Quarterly</TableCell>
                    <TableCell className="table-cell">{formatPrice(computeSpread(futurePrices).perpetualQuarterly.value)}</TableCell>
                    <TableCell className="table-cell">{computeSpread(futurePrices).perpetualQuarterly.percentage.toFixed(2)}%</TableCell>
                  </TableRow>
                  <TableRow className="table-row">
                    <TableCell className="table-cell">Perpetual - Biquarterly</TableCell>
                    <TableCell className="table-cell">{formatPrice(computeSpread(futurePrices).perpetualBiquarterly.value)}</TableCell>
                    <TableCell className="table-cell">{computeSpread(futurePrices).perpetualBiquarterly.percentage.toFixed(2)}%</TableCell>
                  </TableRow>
                  <TableRow className="table-row">
                    <TableCell className="table-cell">Quarterly - Biquarterly</TableCell>
                    <TableCell className="table-cell">{formatPrice(computeSpread(futurePrices).quarterlyBiquarterly.value)}</TableCell>
                    <TableCell className="table-cell">{computeSpread(futurePrices).quarterlyBiquarterly.percentage.toFixed(2)}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>
      </Grid>
      <FormControl className="dropdown">
        <InputLabel>Days</InputLabel>
        <Select value={selectedDays} onChange={handleDaysChange}>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={14}>14</MenuItem>
          <MenuItem value={30}>30</MenuItem>
          <MenuItem value={90}>90</MenuItem>
        </Select>
      </FormControl>
      <FormControl className="dropdown">
        <InputLabel>Frequency</InputLabel>
        <Select value={selectedFrequency} onChange={handleFrequencyChange}>
          <MenuItem value="1h">1h</MenuItem>
          <MenuItem value="6h">6h</MenuItem>
          <MenuItem value="1d">1d</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={() => setIsSpread(!isSpread)}>
        {isSpread ? 'Show Prices' : 'Show Spread %'}
      </Button>
      {isLoading ? <LoadingSpinner /> : <Plot historicalPrices={historicalPrices} selectedCrypto={selectedCrypto} isSpread={isSpread} />}
    </Container>
  );
};

export default App;
