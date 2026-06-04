import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Dashboard from '../components/Dashboard';
import MarketScanner from '../components/MarketScanner';
import TradingPanel from '../components/TradingPanel';
import Analytics from '../components/Analytics';
import Settings from '../components/Settings';
import Auth from '../components/Auth';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }

    // Connect WebSocket
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    if (socket) socket.disconnect();
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'scanner', name: 'Market Scanner', icon: '🔍' },
    { id: 'trading', name: 'Trading', icon: '💰' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-10">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-blue-500">Deriv Smart Trader Pro</h1>
          <p className="text-xs text-gray-500 mt-1">AI-Powered Trading</p>
        </div>

        <nav className="p-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left p-3 rounded-lg mb-2 transition flex items-center gap-3 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-700 text-gray-300 flex items-center gap-3"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-6">
        {activeTab === 'dashboard' && <Dashboard socket={socket} />}
        {activeTab === 'scanner' && <MarketScanner socket={socket} />}
        {activeTab === 'trading' && <TradingPanel socket={socket} />}
        {activeTab === 'analytics' && <Analytics socket={socket} />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}
