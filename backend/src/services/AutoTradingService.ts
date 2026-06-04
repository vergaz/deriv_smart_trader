import { Server } from 'socket.io';
import { MarketScannerService } from './MarketScannerService';
import { RiskManagementService } from './RiskManagementService';

export class AutoTradingService {
  private isActive = false;
  private interval: NodeJS.Timeout | null = null;

  constructor(
    private marketScanner: MarketScannerService,
    private riskManagement: RiskManagementService,
    private io: Server
  ) {}

  start() {
    this.interval = setInterval(async () => {
      if (!this.isActive) return;
      
      const canTrade = await this.riskManagement.checkRiskLimits();
      if (!canTrade) {
        await this.pause('Risk limits exceeded');
        return;
      }
      
      const markets = this.marketScanner.getMarkets();
      const bestOpportunity = markets
        .filter(m => m.opportunityScore > 70 && m.recommendedAction !== 'HOLD')
        .sort((a, b) => b.opportunityScore - a.opportunityScore)[0];
      
      if (bestOpportunity) {
        this.executeTrade(bestOpportunity);
      }
    }, 30000);
  }

  async enable() {
    this.isActive = true;
    this.io.emit('autoTradingStatus', { enabled: true });
  }

  async disable() {
    this.isActive = false;
    this.io.emit('autoTradingStatus', { enabled: false });
  }

  private async executeTrade(market: any) {
    const trade = {
      id: Math.random().toString(36).substr(2, 9),
      market: market.symbol,
      direction: market.recommendedAction,
      entry: market.currentPrice,
      stopLoss: market.recommendedAction === 'BUY' ? market.currentPrice * 0.98 : market.currentPrice * 1.02,
      takeProfit: market.recommendedAction === 'BUY' ? market.currentPrice * 1.02 : market.currentPrice * 0.98,
      riskReward: 1.5,
      confidence: market.opportunityScore,
      timestamp: new Date()
    };
    
    this.io.emit('tradeExecuted', trade);
  }

  private async pause(reason: string) {
    this.isActive = false;
    this.io.emit('tradingPaused', { reason });
  }

  getStatus() {
    return { enabled: this.isActive };
  }
}
