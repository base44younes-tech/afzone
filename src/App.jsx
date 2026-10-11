import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Layout from '@/components/yguard/Layout';
import Dashboard from '@/pages/Dashboard';
import FullCheckup from '@/pages/FullCheckup';
import SiteHealth from '@/pages/SiteHealth';
import External from '@/pages/External';
import Performance from '@/pages/Performance';
import Database from '@/pages/Database';
import Cron from '@/pages/Cron';
import Pages from '@/pages/Pages';
import Critical from '@/pages/Critical';
import Uptime from '@/pages/Uptime';
import Infrastructure from '@/pages/Infrastructure';
import Alerts from '@/pages/Alerts';
import AlertRules from '@/pages/AlertRules';
import Channels from '@/pages/Channels';
import SectionPlaceholder from '@/pages/SectionPlaceholder';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/full-checkup" element={<FullCheckup />} />
                <Route path="/site-health" element={<SiteHealth />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/database" element={<Database />} />
                <Route path="/cron" element={<Cron />} />
                <Route path="/pages" element={<Pages />} />
                <Route path="/critical" element={<Critical />} />
                <Route path="/uptime" element={<Uptime />} />
                <Route path="/external" element={<External />} />
                <Route path="/infrastructure" element={<Infrastructure />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/alert-rules" element={<AlertRules />} />
                <Route path="/channels" element={<Channels />} />
                <Route path="/:section" element={<SectionPlaceholder />} />
              </Route>
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App