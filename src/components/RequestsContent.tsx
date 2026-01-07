import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  MapPin,
  Calendar,
  Briefcase,
  Cake,
  MessageSquare,
  ChevronRight,
  Copy,
  Plus
} from 'lucide-react'

interface RequestsContentProps {
}

const RequestsContent = ({}: RequestsContentProps) => {
  // Combine all requests into one array
  const allRequests = [
    {
      id: '1',
      name: 'Rahul Gupta',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      verified: true,
      badges: ['Premium Member', '95% Match'],
      occupation: 'Software Engineer at TCS',
      age: 28,
      location: 'Currently in Mumbai',
      moveInDate: 'Dec 15',
      message: "Hi Priya! I'm relocating to Pune for a new job at TCS and your room in Baner looks perfect. I'm a clean, responsible tenant with excellent references. I don't smoke, rarely have guests, and prefer a quiet environment for work. My budget aligns perfectly with your asking price. Would love to schedule a virtual tour this weekend if possible. Looking forward to hearing from you!",
      receivedTime: '2 hours ago',
      profileViews: 15,
      positiveReviews: 5,
      interestedIn: 'Spacious Room in Baner',
      status: 'pending'
    },
    {
      id: '2',
      name: 'Sneha Joshi',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      verified: true,
      badges: ['Female', '92% Match'],
      occupation: 'Marketing Manager at Wipro',
      age: 26,
      location: 'Currently in Bangalore',
      moveInDate: 'Jan 1',
      message: "Hello! I'm Sneha, moving to Pune for work. I'm particularly interested in your room as I value cleanliness and a peaceful environment. I work in marketing, have flexible hours, and am very respectful of shared spaces. I've been looking for a place with a female roommate preference. Can we arrange a video call to discuss further?",
      receivedTime: '4 hours ago',
      profileViews: 8,
      positiveReviews: 4,
      interestedIn: 'Spacious Room in Baner',
      status: 'pending'
    },
    {
      id: '3',
      name: 'Amit Patel',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      verified: false,
      badges: ['Male', '78% Match'],
      occupation: 'Product Manager',
      age: 30,
      location: 'Currently in Pune',
      moveInDate: 'ASAP',
      message: "Hi! I'm looking for a room in Baner area. I work in tech and maintain a clean, quiet lifestyle. Your listing caught my attention due to the great location and amenities. Would love to know more about the house rules and schedule a visit.",
      receivedTime: '6 hours ago',
      profileViews: 3,
      positiveReviews: 0,
      interestedIn: 'Modern Room in Hinjawadi',
      status: 'pending'
    },
    {
      id: '4',
      name: 'Kavya Singh',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      verified: false,
      badges: ['Female', '85% Match'],
      occupation: 'UI/UX Designer',
      age: 24,
      location: 'Currently in Delhi',
      moveInDate: 'Dec 20',
      message: "Hello Priya! I'm a designer moving to Pune for a new opportunity. I love your room setup and the location seems perfect for my commute. I'm tidy, respectful, and enjoy cooking. Looking for a friendly environment. Can we connect?",
      receivedTime: '8 hours ago',
      profileViews: 5,
      positiveReviews: 0,
      interestedIn: 'Spacious Room in Baner',
      status: 'pending'
    },
    {
      id: '5',
      name: 'Vikram Reddy',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      verified: false,
      badges: ['Male', 'Quick Move'],
      occupation: 'Business Analyst',
      age: 27,
      location: 'Currently in Hyderabad',
      moveInDate: 'This Week',
      message: "Hi! I need to move to Pune urgently for work. Your room seems ideal and I'm ready to move in immediately. I'm a working professional with steady income and can provide all necessary documents. Please let me know if we can fast-track this.",
      receivedTime: '12 hours ago',
      profileViews: 0,
      positiveReviews: 0,
      interestedIn: 'Modern Room in Hinjawadi',
      status: 'urgent',
      urgent: true
    }
  ]

  const responseTemplates = [
    {
      title: 'Acceptance Template',
      content: "Hi [Name]! Thank you for your interest in my room. Your profile looks great and I'd love to chat further. I've accepted your request - let's schedule a virtual tour this weekend. Looking forward to connecting!",
      icon: CheckCircle
    },
    {
      title: 'More Info Request',
      content: "Hi [Name]! Thanks for reaching out. I'd like to know more about your lifestyle preferences, work schedule, and any questions you have about the room. Could you share more details about yourself?",
      icon: MessageSquare
    },
    {
      title: 'Polite Rejection',
      content: "Hi [Name]! Thank you for your interest in my room listing. After reviewing all applications, I've decided to move forward with another candidate. I wish you the best in your room search!",
      icon: XCircle
    },
    {
      title: 'Schedule Visit',
      content: "Hi [Name]! Your profile looks promising. I'd like to arrange a visit to show you the room and discuss house rules. Are you available this weekend for a virtual or in-person tour?",
      icon: Calendar
    },
    {
      title: 'Room On Hold',
      content: "Hi [Name]! Thanks for your interest. The room is currently on hold pending another applicant's decision. I'll keep you updated and reach out if it becomes available again.",
      icon: Clock
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 px-8 py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_60%)]" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Contact Requests
              </h1>
              <p className="text-sm text-gray-700">
                Manage inquiries for your room listings and connect with potential roommates
              </p>
            </div>

            {/* Stats Cards - Inline */}
            <div className="flex flex-wrap gap-3 lg:flex-nowrap">
              {[
                { value: '12', label: 'New', icon: MessageSquare, color: 'from-blue-400 to-blue-500' },
                { value: '8', label: 'Accepted', icon: CheckCircle, color: 'from-green-400 to-green-500' },
                { value: '3', label: 'Pending', icon: Clock, color: 'from-yellow-400 to-yellow-500' },
                { value: '5', label: 'Rejected', icon: XCircle, color: 'from-red-400 to-red-500' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="relative bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-orange-200/50 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 group flex-1 min-w-[100px]"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <stat.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        {stat.value}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requests Section */}
      <section className="px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Requests</h2>

          <div className="space-y-4">
            {allRequests.map((request, index) => (
              <div
                key={request.id}
                className="relative bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 p-4 shadow-md hover:shadow-lg transition-all duration-300 group"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200">
                      <img src={request.profileImage} alt={request.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <h4 className="text-base font-semibold text-gray-900">{request.name}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-orange-500" />
                            {request.occupation}
                          </span>
                          <span className="flex items-center gap-1">
                            <Cake className="w-3.5 h-3.5 text-orange-500" />
                            {request.age} years old
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                            {request.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-orange-500" />
                            Move-in: {request.moveInDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3 italic">"{request.message}"</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        Received {request.receivedTime}
                      </span>
                      {request.urgent && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                          Urgent request
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all duration-300 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                      <button className="px-3 py-1.5 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Response Templates Section */}
      <section className="px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Quick Response Templates</h2>
          <p className="text-sm text-gray-600 mb-4">Save time with pre-written responses for common scenarios</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {responseTemplates.map((template, index) => (
              <div
                key={index}
                className="relative bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <template.icon className="w-4 h-4 text-white" />
                    </div>
                    <button className="p-1 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1.5 text-xs">{template.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">{template.content}</p>
                  <button className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                    Use This Template <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-orange-300/50 p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center justify-center h-full min-h-[140px] text-center">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1.5 text-xs">Create Custom</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">Create your own template for specific scenarios or frequently asked questions. Save time with personalized responses.</p>
                </div>
              </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default RequestsContent

