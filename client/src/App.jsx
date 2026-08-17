import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import './App.css'
import Hero from './pages/Hero';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import Settings from './pages/Settings';
import OTPVerification from './pages/OTPVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Split off the editor: it pulls Monaco and XTerm, which would otherwise ship
// to every visitor of the marketing page.
const Editor = lazy(() => import('./pages/Editor'));

function App() {
  return (
     <Router>
      <Routes>
        <Route path="/" element={<Hero/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/editor/:projectId"
          element={
            <Suspense fallback={<div style={{ height: '100vh', background: 'var(--surface-page)' }} />}>
              <Editor />
            </Suspense>
          }
        />
        <Route path="/account" element={<Account />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/otp-verify" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  )
}

export default App
