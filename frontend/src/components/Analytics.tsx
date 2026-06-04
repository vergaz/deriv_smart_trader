import { Socket } from 'socket.io-client';

interface AnalyticsProps {
  socket: Socket | null;
}

export default function Analytics({ socket }: AnalyticsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Performance Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="text-gray-400 text-sm">Total Trades</div>
          <div className="text-3xl font-bold">142</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="text-gray-400 text-sm">Winning Trades</div>
          <div className="text-3xl font-bold text-green-500">96</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="text-gray-400 text-sm">Losing Trades</div>
          <div className="text-3xl font-bold text-red-500">46</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="text-gray-400 text-sm">Win Rate</div>
          <div className="text-3xl font-bold">67.6%</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="text-gray-400 text-sm">Profit Factor</div>
          <div className="text-3xl font-bold">1.82</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="text-gray-400 text-sm">Max Drawdown</div>
          <div className="text-3xl font-bold text-red-400">12.5%</div>
        </div>
      </div>
    </div>
  );
}
