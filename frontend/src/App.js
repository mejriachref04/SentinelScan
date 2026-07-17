import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar    from './components/Navbar';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import History   from './pages/History';
import AdminUsers from './pages/AdminUsers';
import Schedule  from './pages/Schedule';
import { WebSocketProvider } from './context/WebSocketContext';

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
  });

  const handleLogin = useCallback((userData) => {
    setUser(userData);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <Router>
      <WebSocketProvider user={user}>
        <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--text)' }}>
          <Navbar user={user} onLogout={handleLogout} />
          <main style={{ maxWidth:'1040px', margin:'0 auto', padding:'32px 24px' }}>
            <Routes>
              <Route path="/login"       element={!user ? <Login onLogin={handleLogin} />    : <Navigate to="/" />} />
              <Route path="/register"    element={!user ? <Register /> : <Navigate to="/" />} />
              <Route path="/"            element={user  ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/dashboard"   element={user  ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/history"     element={user  ? <History />   : <Navigate to="/login" />} />
              <Route path="/schedule"    element={user  ? <Schedule />  : <Navigate to="/login" />} />
              <Route path="/admin/users" element={user && user.role === 'admin' ? <AdminUsers /> : <Navigate to="/" />} />
              <Route path="*"            element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </WebSocketProvider>
    </Router>
  );
}