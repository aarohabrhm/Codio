import { useEffect,useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import './App.css'
import Hero from './pages/Hero';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import OTPVerification from './pages/OTPVerification';

function App() {
  const [msg,setMsg] = useState('')
    useEffect(() => {
        fetch('http://localhost:8000')
            .then(res => res.json())
            .then(data => setMsg(data.message))
            .catch(err => console.error(err));
    }, []);

  return (
     <Router>
      <Routes>
        <Route path="/" element={<Hero/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/otp-verify" element={<OTPVerification />} />"
      </Routes>
    </Router>
  )
}

export default App
