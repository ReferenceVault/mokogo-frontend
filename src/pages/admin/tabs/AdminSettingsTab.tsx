import { AlertTriangle } from 'lucide-react'

export function AdminSettingsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Configure marketplace rules and system behavior</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Discard Changes
          </button>
          <button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-orange-500/30">
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Verification Rules</h2>
        <p className="text-sm text-gray-600 mb-6">Control mandatory verification across the platform</p>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">Email verification required</p>
              <p className="text-xs text-gray-600">Users must verify email before accessing core features</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">Phone verification required</p>
              <p className="text-xs text-gray-600">Users must verify phone number before contacting or listing</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
            </label>
          </div>
        </div>
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">Applies to all users (seekers + listers)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Moderation & Auto-Flag Rules</h2>
        <p className="text-sm text-gray-600 mb-6">Automatically surface risky behavior without manual review</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reports to flag a listing</label>
            <input type="number" defaultValue="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reports to flag a user</label>
            <input type="number" defaultValue="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time window (hours)</label>
            <input type="number" defaultValue="24" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-orange-900">Reports within this window trigger auto-flag. When thresholds are met, listings or users are automatically flagged and appear in the Requests tab.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Rate Limits</h2>
        <p className="text-sm text-gray-600 mb-6">Prevent abuse and spam</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max listings per user</label>
            <input type="number" defaultValue="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max contact requests per day</label>
            <input type="number" defaultValue="10" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max reports per user per day</label>
            <input type="number" defaultValue="5" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">Rate limits apply across the platform and reset daily</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">City Availability</h2>
        <p className="text-sm text-gray-600 mb-6">Control geographic rollout</p>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-700">City Name</div>
            <div className="text-sm font-medium text-gray-700 text-right">Status</div>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="grid grid-cols-2 gap-4 py-4 items-center">
              <div className="text-sm text-gray-900">Pune</div>
              <div className="flex justify-end">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4 items-center">
              <div className="text-sm text-gray-900">Bangalore</div>
              <div className="flex justify-end">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4 items-center">
              <div className="text-sm text-gray-900">Mumbai</div>
              <div className="flex justify-end">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4 items-center">
              <div className="text-sm text-gray-900">Delhi</div>
              <div className="flex justify-end">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">Disabled cities: No new listings, no new searches. Existing data remains hidden.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Audit & Change Log</h2>
        <p className="text-sm text-gray-600 mb-6">Transparency & accountability (Read-only)</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Setting Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Change</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Changed By</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900">Phone verification</td>
                <td className="px-4 py-3 text-sm text-gray-900">OFF → ON</td>
                <td className="px-4 py-3 text-sm text-gray-600">admin@mokogo.com</td>
                <td className="px-4 py-3 text-sm text-gray-600">2024-01-15 14:30:22</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900">Pune city</td>
                <td className="px-4 py-3 text-sm text-gray-900">Disabled → Enabled</td>
                <td className="px-4 py-3 text-sm text-gray-600">founder@mokogo.com</td>
                <td className="px-4 py-3 text-sm text-gray-600">2024-01-12 09:15:45</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900">Max listings per user</td>
                <td className="px-4 py-3 text-sm text-gray-900">3 → 1</td>
                <td className="px-4 py-3 text-sm text-gray-600">admin@mokogo.com</td>
                <td className="px-4 py-3 text-sm text-gray-600">2024-01-10 16:45:12</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">Changes made here affect the entire platform. Please review carefully before applying.</p>
        </div>
      </div>
    </div>
  )
}
