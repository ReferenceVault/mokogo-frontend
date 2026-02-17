import { MessageSquare, Flag } from 'lucide-react'

interface AdminRequestsTabProps {
  onSetActiveView: (view: string) => void
}

export function AdminRequestsTab({ onSetActiveView }: AdminRequestsTabProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Contact Requests</h1>
        <p className="text-sm text-gray-600">Contact requests are seeker-to-lister connection requests. Use the Reports tab to review user-submitted reports.</p>
      </div>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Contact request management is available in the Overview stats.</p>
        <button
          onClick={() => onSetActiveView('reports')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
        >
          Go to Reports
          <Flag className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
