import { Socket } from 'socket.io-client';

interface DashboardProps {
  socket: Socket | null;
}

export default function Dashboard({ socket }: DashboardProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="text-gray-400 text-sm">Account Balance</div>
          <div className="text-3xl font-bold text-green-500">$10,000</div>
          <div className="text-xs text-gray-500 mt-1">Demo Account</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="text-gray-400 text-sm">Today's P/L</div>
          <div className="text-3xl font-bold text-blue-500">+$245</div>
          <div className="text-xs text-gray-500">+2.45%</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="text-gray-400 text-sm">Win Rate</div>
          <div className="text-3xl font-bold text-purple-500">68%</div>
          <div className="text-xs text-gray-500">Last 30 days</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="text-gray-400 text-sm">Active Signals</div>
          <div className="text-3xl font-bold text-yellow-500">3</div>
          <div className="text-xs text-gray-500">High confidence</div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3">System Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Market Scanner</span>
            <span className="text-green-500">● Active</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Deriv API</span>
            <span className="text-green-500">● Connected</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Auto-Trading</span>
            <span className="text-yellow-500">○ Disabled</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Pattern Recognition</span>
            <span className="text-green-500">● Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
