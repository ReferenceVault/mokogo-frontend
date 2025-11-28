import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AuthPhone from './pages/auth/AuthPhone'
import AuthOTP from './pages/auth/AuthOTP'
import AuthEmail from './pages/auth/AuthEmail'
import ListingWizard from './pages/listing/ListingWizard'
import Dashboard from './pages/Dashboard'
import RequestsList from './pages/requests/RequestsList'
import RequestDetail from './pages/requests/RequestDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/phone" element={<AuthPhone />} />
        <Route path="/auth/otp" element={<AuthOTP />} />
        <Route path="/auth/email" element={<AuthEmail />} />
        <Route path="/listing/wizard" element={<ListingWizard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/requests" element={<RequestsList />} />
        <Route path="/requests/:requestId" element={<RequestDetail />} />
      </Routes>
    </Router>
  )
}

export default App
