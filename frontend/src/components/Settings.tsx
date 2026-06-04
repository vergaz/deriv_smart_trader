export default function Settings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Deriv Account Connection</h3>
        <button className="px-4 py-2 bg-blue-600 rounded-lg">Connect Deriv Account</button>
        <p className="text-xs text-gray-500 mt-2">Securely connect your Deriv account via OAuth</p>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span>Browser Notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span>Email Alerts</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4" />
            <span>Trade Execution Sounds</span>
          </label>
        </div>
      </div>
    </div>
  );
}
