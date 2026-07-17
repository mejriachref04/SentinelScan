import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Register() {
  const [form,    setForm]    = useState({ username:'', email:'', password:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'88vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="fade-up" style={{ width:'100%', maxWidth:'400px' }}>

        <div style={{ marginBottom:'32px' }}>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--cyan)', letterSpacing:'0.15em', marginBottom:'8px' }}>
            // SENTINEL SCAN — NEW USER
          </p>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'28px', fontWeight:800, color:'#fff', lineHeight:1.1 }}>
            CREATE<br/>
            <span style={{ color:'var(--cyan)' }}>ACCOUNT</span>
          </h1>
        </div>

        <div style={{
          background:'var(--panel)', border:'1px solid var(--border)',
          borderRadius:'var(--radius-lg)', padding:'28px',
        }}>
          {error && (
            <div style={{
              marginBottom:'20px', padding:'10px 14px',
              background:'var(--red-dim)', border:'1px solid rgba(255,77,77,0.3)',
              borderLeft:'3px solid var(--red)', borderRadius:'var(--radius)',
              fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--red)',
            }}>
              ERR: {error}
            </div>
          )}

          <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
            <Field label="username"      type="text"     value={form.username} onChange={set('username')} placeholder="handle" accent="var(--cyan)" />
            <Field label="email_address" type="email"    value={form.email}    onChange={set('email')}    placeholder="user@domain.com" accent="var(--cyan)" />
            <Field label="password"      type="password" value={form.password} onChange={set('password')} placeholder="············" accent="var(--cyan)" />

            <button type="submit" disabled={loading} style={{
              marginTop:'4px',
              background: loading ? 'var(--border)' : 'var(--cyan)',
              color: loading ? 'var(--text-dim)' : 'var(--bg)',
              border:'none', borderRadius:'var(--radius)',
              fontFamily:'var(--font-mono)', fontSize:'12px',
              fontWeight:700, letterSpacing:'0.12em',
              padding:'12px', cursor: loading ? 'wait' : 'pointer',
              transition:'all 0.15s',
            }}>
              {loading ? 'CREATING...' : 'CREATE_ACCOUNT →'}
            </button>
          </form>
        </div>

        <p style={{
          marginTop:'16px', textAlign:'center',
          fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-dim)',
        }}>
          already registered?{' '}
          <Link to="/login" style={{ color:'var(--amber)', textDecoration:'none' }}>
            login_here
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, accent = 'var(--amber)' }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        display:'block', fontFamily:'var(--font-mono)', fontSize:'10px',
        letterSpacing:'0.12em',
        color: focused ? accent : 'var(--text-dim)',
        marginBottom:'6px', transition:'color 0.15s',
      }}>
        {label}
        {focused && <span className="blink" style={{ marginLeft:'4px', color: accent }}>_</span>}
      </label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} required
        style={{
          width:'100%', background:'var(--surface)',
          border:`1px solid ${focused ? accent : 'var(--border)'}`,
          borderRadius:'var(--radius)', padding:'10px 12px',
          fontFamily:'var(--font-mono)', fontSize:'12px', color:'#fff',
          outline:'none', transition:'border-color 0.15s',
        }}
      />
    </div>
  );
}