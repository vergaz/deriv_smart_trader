export class RiskManagementService {
  private dailyLoss = 0;
  private consecutiveLosses = 0;
  private sessionStart = Date.now();
  private dailyLossLimit = 100;
  private maxConsecutiveLosses = 3;

  async checkRiskLimits(): Promise<boolean> {
    // Reset daily limit at midnight
    if (Date.now() - this.sessionStart > 24 * 60 * 60 * 1000) {
      this.dailyLoss = 0;
      this.sessionStart = Date.now();
    }
    
    if (this.dailyLoss >= this.dailyLossLimit) return false;
    if (this.consecutiveLosses >= this.maxConsecutiveLosses) return false;
    
    return true;
  }

  recordLoss(amount: number) {
    this.dailyLoss += amount;
    this.consecutiveLosses++;
  }

  recordWin() {
    this.consecutiveLosses = 0;
  }

  reset() {
    this.dailyLoss = 0;
    this.consecutiveLosses = 0;
    this.sessionStart = Date.now();
  }
}
