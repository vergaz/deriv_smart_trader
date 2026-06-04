import { Server } from 'socket.io';
import { TechnicalIndicators } from '../utils/TechnicalIndicators';

interface Market {
  symbol: string;
  name: string;
  type: string;
  currentPrice: number;
  trend: {
    direction: 'UP' | 'DOWN' | 'SIDEWAYS';
    strength: number;
    timeframe: string;
  };
  volatility: number;
  opportunityScore: number;
  patternConfidence: number;
  indicators: {
    rsi: number;
    macd: { value: number; signal: number; histogram: number };
    ema: { fast: number; slow: number };
    sma: number;
    bollinger: { upper: number; middle: number; lower: number };
    atr: number;
  };
  support: number[];
  resistance: number[];
  recommendedAction: 'BUY' | 'SELL' | 'HOLD';
}

export class MarketScannerService {
  private markets: Map<string, Market> = new Map();
  private indicators: TechnicalIndicators;
  private interval: NodeJS.Timeout | null = null;

  constructor(private io: Server) {
    this.indicators = new TechnicalIndicators();
  }

  async start() {
    // Simulate market data for now
    // In production, this would connect to Deriv API
    this.interval = setInterval(() => this.scanAllMarkets(), 5000);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }

  private async scanAllMarkets() {
    const symbols = this.getMarketSymbols();
    
    for (const marketInfo of symbols) {
      const marketData = this.generateSimulatedData(marketInfo.symbol);
      const analysis = this.analyzeMarket(marketData, marketInfo);
      
      this.markets.set(marketInfo.symbol, analysis);
      
      this.io.emit('marketUpdate', {
        symbol: marketInfo.symbol,
        data: analysis
      });
    }
  }

  private getMarketSymbols() {
    return [
      { symbol: 'R_10', name: 'Volatility 10 Index', type: 'volatility' },
      { symbol: 'R_25', name: 'Volatility 25 Index', type: 'volatility' },
      { symbol: 'R_50', name: 'Volatility 50 Index', type: 'volatility' },
      { symbol: 'R_75', name: 'Volatility 75 Index', type: 'volatility' },
      { symbol: 'R_100', name: 'Volatility 100 Index', type: 'volatility' },
      { symbol: '1HZ100V', name: 'Boom 1000 Index', type: 'synthetic' },
      { symbol: '1HZ150V', name: 'Boom 500 Index', type: 'synthetic' },
      { symbol: '1HZ300V', name: 'Crash 1000 Index', type: 'synthetic' },
      { symbol: '1HZ350V', name: 'Crash 500 Index', type: 'synthetic' },
      { symbol: 'frxEURUSD', name: 'EUR/USD', type: 'forex' },
      { symbol: 'frxGBPUSD', name: 'GBP/USD', type: 'forex' },
      { symbol: 'frxUSDJPY', name: 'USD/JPY', type: 'forex' },
      { symbol: 'frxXAUUSD', name: 'Gold', type: 'commodity' },
      { symbol: 'frxBCOUSD', name: 'Brent Oil', type: 'commodity' }
    ];
  }

  private generateSimulatedData(symbol: string) {
    const basePrice = this.getBasePrice(symbol);
    const data = [];
    let currentPrice = basePrice;
    
    for (let i = 0; i < 100; i++) {
      const change = (Math.random() - 0.5) * basePrice * 0.02;
      currentPrice += change;
      data.push({
        open: currentPrice - change * 0.5,
        high: currentPrice + Math.abs(change) * 0.7,
        low: currentPrice - Math.abs(change) * 0.7,
        close: currentPrice,
        timestamp: new Date(Date.now() - (100 - i) * 60000)
      });
    }
    
    return data;
  }

  private getBasePrice(symbol: string): number {
    const prices: Record<string, number> = {
      'R_10': 10000, 'R_25': 15000, 'R_50': 20000, 'R_75': 25000, 'R_100': 30000,
      '1HZ100V': 5000, '1HZ150V': 4500, '1HZ300V': 4000, '1HZ350V': 3500,
      'frxEURUSD': 1.08, 'frxGBPUSD': 1.25, 'frxUSDJPY': 150,
      'frxXAUUSD': 2000, 'frxBCOUSD': 85
    };
    return prices[symbol] || 100;
  }

  private analyzeMarket(data: any[], marketInfo: any): Market {
    const prices = data.map(d => d.close);
    const currentPrice = prices[prices.length - 1];
    
    const rsi = this.indicators.calculateRSI(prices);
    const macd = this.indicators.calculateMACD(prices);
    const emaFast = this.indicators.calculateEMA(prices, 9);
    const emaSlow = this.indicators.calculateEMA(prices, 21);
    const sma = this.indicators.calculateSMA(prices, 20);
    const bollinger = this.indicators.calculateBollingerBands(prices);
    const atr = this.indicators.calculateATR(data.map(d => d.high), data.map(d => d.low));
    
    const trendDirection = emaFast > emaSlow ? 'UP' : emaFast < emaSlow ? 'DOWN' : 'SIDEWAYS';
    const trendStrength = Math.abs(emaFast - emaSlow) / emaSlow * 100;
    
    const volatility = atr / currentPrice;
    
    let opportunityScore = 50;
    if (trendDirection === 'UP') opportunityScore += trendStrength * 0.3;
    if (rsi < 30 || rsi > 70) opportunityScore += 15;
    if (macd.histogram > 0 && macd.value > macd.signal) opportunityScore += 15;
    if (currentPrice < bollinger.lower) opportunityScore += 15;
    if (currentPrice > bollinger.upper) opportunityScore += 15;
    opportunityScore = Math.min(100, Math.max(0, opportunityScore));
    
    let recommendedAction: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    if (opportunityScore > 65 && trendDirection === 'UP') recommendedAction = 'BUY';
    else if (opportunityScore > 65 && trendDirection === 'DOWN') recommendedAction = 'SELL';
    
    return {
      symbol: marketInfo.symbol,
      name: marketInfo.name,
      type: marketInfo.type,
      currentPrice,
      trend: { direction: trendDirection, strength: Math.min(100, trendStrength), timeframe: '1h' },
      volatility,
      opportunityScore,
      patternConfidence: Math.random() * 40 + 30,
      indicators: { rsi, macd, ema: { fast: emaFast, slow: emaSlow }, sma, bollinger, atr },
      support: [currentPrice * 0.98, currentPrice * 0.96],
      resistance: [currentPrice * 1.02, currentPrice * 1.04],
      recommendedAction
    };
  }

  getMarkets(): Market[] {
    return Array.from(this.markets.values());
  }
}
