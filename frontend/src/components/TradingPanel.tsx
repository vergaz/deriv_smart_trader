import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

interface Trade {
  id: string;
  market: string;
  direction: 'BUY' | 'SELL';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  confidence: number;
  timestamp: Date;
}

interface TradingPanelProps {
  socket: Socket | null;
}

export default function TradingPanel({ socket }: TradingPanelProps) {
  const [autoTradingEnabled, setAutoTradingEnabled] = useState(false);
  const [activeTrades, setActiveTrades] = useState<Trade[]>([]);
  const [paperTrading, setPaperTrading] = useState(true);
  const [settings, setSettings] = useState({
    confidenceThreshold: 70,
    stakeAmount: 10,
    riskPercent: 2,
    maxOpenPositions: 5,
    dailyLossLimit: 100,
    maxDrawdown: 20
  });

  useEffect(() => {
    if (!socket) return;

    socket.on('tradeExecuted', (trade: Trade) => {
      setActiveTrades(prev => [trade, ...prev]);
      toast.success(`${trade.direction} ${trade.market} @ ${trade.entry}`);
    });

    socket.on('autoTradingStatus', ({ enabled }: { enabled: boolean }) => {
      setAutoTradingEnabled(enabled);
      toast(enabled ? 'Auto-trading enabled' : 'Auto-trading disabled');
    });

    socket.on('tradingPaused', ({ reason }: { reason: string }) => {
      toast.error(`Trading paused: ${reason}`);
      setAutoTradingEnabled(false);
    });

    return () => {
      socket.off('tradeExecuted');
      socket.off('autoTradingStatus');
      socket.off('tradingPaused');
    };
  }, [socket]);

  const toggleAutoTrading = async () => {
    try {
      const response = await fetch('/api/trading/auto-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !autoTradingEnabled })
      });
      
      if (response.ok) {
        setAutoTradingEnabled(!autoTradingEnabled);
      } else {
        toast.error('Failed to toggle auto-trading');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const updateSettings = async () => {
    try {
      await fetch('/api/trading/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      toast.success('Settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Trading Mode</h3>
            <p className="text-sm text-gray-400">Paper trading simulates without real money</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPaperTrading(true)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                paperTrading ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              📝 Paper Trading
            </button>
            <button
              onClick={() => setPaperTrading(false)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                !paperTrading ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              💰 Real Trading
            </button>
          </div>
        </div>
        {!paperTrading && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
            ⚠️ Real trading will use your connected Deriv account. Ensure you have tested your strategy in paper mode first.
          </div>
        )}
      </div>

      {/* Auto-Trading Control */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold">Auto-Trading</h3>
            <p className="text-sm text-gray-400">Let AI trade for you based on market analysis</p>
          </div>
          <button
            onClick={toggleAutoTrading}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              autoTradingEnabled
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {autoTradingEnabled ? 'Disable Auto-Trading' : 'Enable Auto-Trading'}
          </button>
        </div>
        
        {autoTradingEnabled && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400">✅ Auto-trading is active. AI is scanning for opportunities.</p>
            <p className="text-xs text-green-400/70 mt-1">Threshold: {settings.confidenceThreshold}% | Max positions: {settings.maxOpenPositions}</p>
          </div>
        )}
      </div>

      {/* Trading Settings */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Risk Management Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Confidence Threshold (%)</label>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={settings.confidenceThreshold}
              onChange={(e) => setSettings({...settings, confidenceThreshold: parseInt(e.target.value)})}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50% (More trades)</span>
              <span className="font-bold text-blue-400">{settings.confidenceThreshold}%</span>
              <span>95% (Safer)</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Stake Amount ($)</label>
            <input
              type="number"
              value={settings.stakeAmount}
              onChange={(e) => setSettings({...settings, stakeAmount: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600"
              min="1"
              step="1"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Risk per Trade (%)</label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={settings.riskPercent}
              onChange={(e) => setSettings({...settings, riskPercent: parseFloat(e.target.value)})}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1% (Conservative)</span>
              <span className="font-bold text-blue-400">{settings.riskPercent}%</span>
              <span>10% (Aggressive)</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Max Open Positions</label>
            <input
              type="number"
              value={settings.maxOpenPositions}
              onChange={(e) => setSettings({...settings, maxOpenPositions: parseInt(e.target.value)})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600"
              min="1"
              max="10"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Daily Loss Limit ($)</label>
            <input
              type="number"
              value={settings.dailyLossLimit}
              onChange={(e) => setSettings({...settings, dailyLossLimit: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600"
              min="10"
              step="10"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Max Drawdown (%)</label>
            <input
              type="number"
              value={settings.maxDrawdown}
              onChange={(e) => setSettings({...settings, maxDrawdown: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600"
              min="5"
              max="50"
              step="5"
            />
          </div>
        </div>
        
        <button
          onClick={updateSettings}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
        >
          Save Settings
        </button>
      </div>

      {/* Active Trades */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Active / Recent Trades</h3>
        
        <div className="space-y-3">
          {activeTrades.slice(0, 5).map(trade => (
            <div key={trade.id} className="bg-gray-750 rounded-lg p-4 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${trade.direction === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${trade.direction === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.direction}
                    </span>
                    <span className="font-mono text-sm">{trade.market}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    Entry: ${trade.entry.toFixed(4)} | SL: ${trade.stopLoss.toFixed(4)} | TP: ${trade.takeProfit.toFixed(4)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Risk/Reward</div>
                <div className="font-bold">1:{trade.riskReward.toFixed(1)}</div>
                <div className="text-xs text-gray-500">{new Date(trade.timestamp).toLocaleTimeString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Confidence</div>
                <div className="font-bold">{Math.round(trade.confidence)}%</div>
              </div>
            </div>
          ))}
          
          {activeTrades.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No active trades. Enable auto-trading or wait for signals.
            </div>
          )}
        </div>
      </div>

      {/* Emergency Stop Button */}
      <div className="bg-red-900/20 rounded-xl p-4 border border-red-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-red-400">Emergency Stop</h4>
            <p className="text-sm text-gray-400">Immediately close all positions and pause trading</p>
          </div>
          <button
            onClick={() => {
              setAutoTradingEnabled(false);
              toast.error('Emergency stop activated');
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold"
          >
            STOP ALL
          </button>
        </div>
      </div>
    </div>
  );
}
