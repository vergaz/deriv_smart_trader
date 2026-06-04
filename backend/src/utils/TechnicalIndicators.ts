@'
export class TechnicalIndicators {
  calculateRSI(prices: number[], period: number = 14): number {
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1];
      if (change >= 0) gains += change;
      else losses -= change;
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  calculateMACD(prices: number[]) {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macdLine = ema12 - ema26;
    const signalLine = this.calculateEMA([macdLine], 9);
    const histogram = macdLine - signalLine;
    return { value: macdLine, signal: signalLine, histogram };
  }

  calculateEMA(prices: number[], period: number): number {
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }
    return ema;
  }

  calculateSMA(prices: number[], period: number): number {
    const slice = prices.slice(-period);
    const sum = slice.reduce((a, b) => a + b, 0);
    return sum / period;
  }

  calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2) {
    const sma = this.calculateSMA(prices, period);
    const squaredDiffs = prices.slice(-period).map(p => Math.pow(p - sma, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
    const standardDeviation = Math.sqrt(variance);
    return {
      upper: sma + (standardDeviation * stdDev),
      middle: sma,
      lower: sma - (standardDeviation * stdDev)
    };
  }

  calculateATR(highs: number[], lows: number[], period: number = 14): number {
    const trueRanges = [];
    for (let i = 1; i < highs.length; i++) {
      const highLow = highs[i] - lows[i];
      const highClose = Math.abs(highs[i] - lows[i - 1]);
      const lowClose = Math.abs(lows[i] - highs[i - 1]);
      trueRanges.push(Math.max(highLow, highClose, lowClose));
    }
    const atr = trueRanges.slice(-period).reduce((a, b) => a + b, 0) / period;
    return atr;
  }

  calculateAll(data: any[]) {
    const prices = data.map(d => d.close);
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    const currentPrice = prices[prices.length - 1];
    return {
      rsi: this.calculateRSI(prices),
      macd: this.calculateMACD(prices),
      ema: {
        fast: this.calculateEMA(prices, 9),
        slow: this.calculateEMA(prices, 21)
      },
      sma: this.calculateSMA(prices, 20),
      bollinger: this.calculateBollingerBands(prices),
      atr: this.calculateATR(highs, lows),
      currentPrice
    };
  }
}
'@ | Out-File -FilePath C:\Users\George\deriv_smart_trader\backend\src\utils\TechnicalIndicators.ts -Encoding utf8
