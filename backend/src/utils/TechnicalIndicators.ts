export class TechnicalIndicators {
  calculateRSI(prices: number[], period: number = 14): number {
    let gains = 0, losses = 0;
    
    for (let i = prices.length - period; i < prices.length - 1; i++) {
      const change = prices[i + 1] - prices[i];
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
    let em
