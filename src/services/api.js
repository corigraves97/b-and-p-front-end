import axios from 'axios';

class BullPaperAPI {
  constructor(baseURL = 'http://localhost:3000') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response) {
          // Server responded with a status other than 2xx
          const errMsg = error.response.data?.message || `HTTP ${error.response.status}`;
          throw new Error(errMsg);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error('No response from server. Please try again later.');
        } else {
          // Something happened in setting up the request
          throw new Error(`Request error: ${error.message}`);
        }
        throw error;
      }
    );
  }

  // Market Data Endpoints
  async getOverview(symbol) {
    return this.client.get(`/api/overview?tickers=${symbol.toUpperCase()}`);
  }

  async getNews(symbol) {
    return this.client.get(`/api/news?tickers=${symbol.toUpperCase()}`);
  }

  async getShares(symbol) {
    return this.client.get(`/api/shares?tickers=${symbol.toUpperCase()}`);
  }

  // Trading Endpoints
  async saveTrade(tradeData) {
    return this.client.post('/api/shares', tradeData);
  }

  async getSavedTrades() {
    return this.client.get('/api/savedShares');
  }

  async deleteTrade(tradeId) {
    return this.client.delete(`/api/shares/${tradeId}`);
  }

  // Journal Endpoints (with auth)
  async getJournalEntries(token) {
    return this.client.get('/journal/', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Correlated Data Methods
  async getCompleteStockProfile(symbol) {
    try {
      const [overview, news, shares] = await Promise.allSettled([
        this.getOverview(symbol),
        this.getNews(symbol),
        this.getShares(symbol)
      ]);

      return {
        symbol: symbol.toUpperCase(),
        overview: overview.status === 'fulfilled' ? overview.value : null,
        news: news.status === 'fulfilled' ? news.value : null,
        shares: shares.status === 'fulfilled' ? shares.value : null,
        timestamp: new Date().toISOString(),
        errors: {
          overview: overview.status === 'rejected' ? overview.reason.message : null,
          news: news.status === 'rejected' ? news.reason.message : null,
          shares: shares.status === 'rejected' ? shares.reason.message : null,
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch complete profile for ${symbol}: ${error.message}`);
    }
  }

  async saveTradeWithMarketSnapshot(tradeData) {
    // Fetch current market data for the symbol
    const marketSnapshot = await this.getCompleteStockProfile(tradeData.symbol);
    
    // Combine trade data with market snapshot
    const payload = {
      ...tradeData,
      marketSnapshot: {
        timestamp: marketSnapshot.timestamp,
        symbol: marketSnapshot.symbol,
        overview: marketSnapshot.overview,
        sharesData: marketSnapshot.shares,
        newsContext: marketSnapshot.news?.feed?.slice(0, 3) // Latest 3 news items
      }
    };

    return this.saveTrade(payload);
  }
}

export default new BullPaperAPI();