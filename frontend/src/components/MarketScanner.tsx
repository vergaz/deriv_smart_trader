import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

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
  recommendedAction: 'BUY' | 'SELL' | 'HOLD';
}

interface MarketScannerProps {
  socket: Socket | null;
}

export default function MarketScanner({ socket }: MarketScannerProps) {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket) return;

    socket.on('marketUpdate', (data: { symbol: string; data: Market }) => {
      setMarkets(prev => {
        const index = prev.findIndex(m => m.symbol === data.symbol);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = data.data;
          return updated;
        }
        return [...prev, data.data];
      });
      setLoading(false);
    });

    return () => {
      socket.off('marketUpdate');
    };
  }, [socket]);

  const getFilteredMarkets = () => {
    let filtered = [...markets];
    
    if (filter !== 'all') {
      filtered = filtered.filter(m => m.type === filter);
    }
    
    if (sortBy === 'score') {
      filtered.sort((a, b) => b.opportunityScore - a.opportunityScore);
    } else if (sortBy === 'trend') {
      filtered.sort((a, b) => b.trend.strength - a.trend.strength);
    } else if (sortBy === 'volatility') {
      filtered.sort((a, b) => b.volatility - a.volatility);
    }
    
    return filtered;
  };

  const getActionColor = (action: string) => {
    switch(action) {
      case 'BUY': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'SELL': return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    }
  };

  const getTrendIcon = (direction: string) => {
    switch(direction) {
      case 'UP': return '📈';
      case 'DOWN': return '📉';
      default: return '➡️';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Market Scanner</h2>
        
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 text-sm"
          >
            <option value="all">All Markets</option>
            <option value="volatility">Volatility Indices</option>
            <option value="synthetic">Synthetic Indices</option>
            <option value="forex">Forex</option>
            <option value="commodity">Commodities</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 text-sm"
          >
            <option value="score">Sort by Opportunity Score</option>
            <option value="trend">Sort by Trend Strength</option>
            <option value="volatility">Sort by Volatility</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Markets Tracked</div>
          <div className="text-2xl font-bold">{markets.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Buy Signals</div>
          <div className="text-2xl font-bold text-green-500">
            {markets.filter(m => m.recommendedAction === 'BUY').length}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Sell Signals</div>
          <div className="text-2xl font-bold text-red-500">
            {markets.filter(m => m.recommendedAction === 'SELL').length}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Avg Opportunity</div>
          <div className="text-2xl font-bold">
            {Math.round(markets.reduce((acc, m) => acc + m.opportunityScore, 0) / (markets.length || 1))}%
          </div>
        </div>
      </div>

      {/* Markets Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="animate-pulse">Scanning markets for opportunities...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {getFilteredMarkets().map(market => (
            <div key={market.symbol} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{market.name}</h3>
                  <p className="text-sm text-gray-500">{market.symbol}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getActionColor(market.recommendedAction)}`}>
                  {market.recommendedAction}
                </span>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold font-mono">
                    ${market.currentPrice.toFixed(market.currentPrice < 1 ? 4 : 2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-400">{getTrendIcon(market.trend.direction)}</span>
                    <span className="text-sm text-gray-300">{market.trend.direction}</span>
                    <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${market.trend.direction === 'UP' ? 'bg-green-500' : market.trend.direction === 'DOWN' ? 'bg-red-500' : 'bg-yellow-500'}`}
                        style={{ width: `${market.trend.strength}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{Math.round(market.trend.strength)}%</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">Opportunity</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${market.opportunityScore}%` }}
                        />
                      </div>
                      <span className={`font-bold text-sm ${getScoreColor(market.opportunityScore)}`}>
                        {Math.round(market.opportunityScore)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Pattern Confidence</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${market.patternConfidence}%` }}
                        />
                      </div>
                      <span className={`font-bold text-sm ${getScoreColor(market.patternConfidence)}`}>
                        {Math.round(market.patternConfidence)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Volatility badge */}
              <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between text-xs text-gray-500">
                <span>Volatility: {(market.volatility * 100).toFixed(1)}%</span>
                <span>Type: {market.type.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {markets.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No market data available. Check connection.
        </div>
      )}
    </div>
  );
}
