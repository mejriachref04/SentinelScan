import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
      navigate('/');
    } catch {
      setError('credentials not recognised');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '88vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="fade-up" style={{ width:'100%', maxWidth:'400px' }}>
        <div style={{ marginBottom:'32px' }}>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--amber)', letterSpacing:'0.15em', marginBottom:'8px' }}>
            {"//"} SENTINEL SCAN — AUTH MODULE
          </p>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'28px', fontWeight:800, color:'#fff', lineHeight:1.1 }}>
            ACCESS<br/><span style={{ color:'var(--amber)' }}>TERMINAL</span>
          </h1>
        </div>

        <div style={{ background:'var(--panel)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'28px' }}>
          {error && (
            <div style={{ marginBottom:'20px', padding:'10px 14px', background:'var(--red-dim)', border:'1px solid rgba(255,77,77,0.3)', borderLeft:'3px solid var(--red)', borderRadius:'var(--radius)', fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--red)' }}>
              ERR: {error}
            </div>
          )}
          <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
            <Field label="email_address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@domain.com" />
            <Field label="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="············" />
            <button type="submit" disabled={loading} style={{ marginTop:'4px', background: loading ? 'var(--border)' : 'var(--amber)', color: loading ? 'var(--text-dim)' : 'var(--bg)', border:'none', borderRadius:'var(--radius)', fontFamily:'var(--font-mono)', fontSize:'12px', fontWeight:700, letterSpacing:'0.12em', padding:'12px', cursor: loading ? 'wait' : 'pointer', transition:'all 0.15s' }}>
              {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE →'}
            </button>
          </form>
        </div>

        <p style={{ marginTop:'16px', textAlign:'center', fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-dim)' }}>
          no account?{' '}
          <Link to="/register" style={{ color:'var(--cyan)', textDecoration:'none' }}>register_here</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display:'block', fontFamily:'var(--font-mono)', fontSize:'10px', letterSpacing:'0.12em', color: focused ? 'var(--amber)' : 'var(--text-dim)', marginBottom:'6px', transition:'color 0.15s' }}>
        {label}
        {focused && <span className="blink" style={{ marginLeft:'4px', color:'var(--amber)' }}>_</span>}
      </label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} required
        style={{ width:'100%', background:'var(--surface)', border:`1px solid ${focused ? 'var(--amber)' : 'var(--border)'}`, borderRadius:'var(--radius)', padding:'10px 12px', fontFamily:'var(--font-mono)', fontSize:'12px', color:'#fff', outline:'none', transition:'border-color 0.15s' }}
      />
    </div>
  );
}