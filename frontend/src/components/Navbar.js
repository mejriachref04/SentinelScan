import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',         label: 'dashboard' },
  { to: '/history',  label: 'history'   },
  { to: '/schedule', label: 'schedule'  },
];

export default function Navbar({ user, onLogout }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [tick, setTick] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setTick(t => !t), 1000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2,'0')}${tick ? ':' : ' '}${String(now.getMinutes()).padStart(2,'0')}`;

  const logout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav style={{ borderBottom:'1px solid var(--border)', background:'rgba(8,11,15,0.94)', backdropFilter:'blur(12px)', position:'sticky', top:0, zIndex:100, padding:'0 2rem', height:'52px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'10px' }}>
        <span style={{ fontFamily:'var(--font-head)', fontSize:'17px', fontWeight:800, color:'#fff', letterSpacing:'-0.5px' }}>
          SENTINEL<span style={{ color:'var(--amber)' }}>SCAN</span>
        </span>
        <span style={{ fontSize:'10px', color:'var(--text-dim)', fontFamily:'var(--font-mono)', borderLeft:'1px solid var(--border)', paddingLeft:'10px' }}>v1</span>
      </Link>

      {user && (
        <div style={{ display:'flex', gap:'2px' }}>
          {NAV_LINKS.map(({ to, label }) => {
            const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
            return (
              <Link key={to} to={to} style={{ textDecoration:'none', padding:'5px 14px', fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.08em', color: active ? 'var(--amber)' : 'var(--text-dim)', background: active ? 'var(--amber-dim)' : 'transparent', borderRadius:'var(--radius)', border: active ? '1px solid rgba(245,166,35,0.2)' : '1px solid transparent', transition:'all 0.15s' }}>
                {active && <span style={{ marginRight:'4px', opacity:0.6 }}>&gt;</span>}
                {label}
              </Link>
            );
          })}
          {user.role === 'admin' && (
            <Link to="/admin/users" style={{ textDecoration:'none', padding:'5px 14px', fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.08em', color: location.pathname.startsWith('/admin') ? 'var(--amber)' : 'var(--text-dim)', background: location.pathname.startsWith('/admin') ? 'var(--amber-dim)' : 'transparent', border: location.pathname.startsWith('/admin') ? '1px solid rgba(245,166,35,0.2)' : '1px solid transparent', borderRadius:'var(--radius)', transition:'all 0.15s' }}>
              {location.pathname.startsWith('/admin') && <span style={{ marginRight:'4px', opacity:0.6 }}>&gt;</span>}
              admin
            </Link>
          )}
        </div>
      )}

      <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-mute)', letterSpacing:'0.1em' }}>{timeStr}</span>
        {user ? (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'4px 10px', border:'1px solid var(--border)', borderRadius:'var(--radius)', background:'var(--surface)' }}>
              <span style={{ fontSize:'10px', color:'var(--text-dim)', fontFamily:'var(--font-mono)' }}>{user.username}</span>
              <span style={{ fontSize:'9px', fontFamily:'var(--font-mono)', color: user.role === 'admin' ? 'var(--amber)' : 'var(--cyan)', background: user.role === 'admin' ? 'var(--amber-dim)' : 'var(--cyan-dim)', border:`1px solid ${user.role === 'admin' ? 'rgba(245,166,35,0.3)' : 'rgba(0,212,200,0.3)'}`, padding:'1px 5px', borderRadius:'2px', letterSpacing:'0.06em' }}>
                {user.role.toUpperCase()}
              </span>
            </div>
            <button onClick={logout} style={{ background:'none', border:'1px solid var(--border)', color:'var(--text-dim)', fontFamily:'var(--font-mono)', fontSize:'10px', padding:'4px 10px', borderRadius:'var(--radius)', cursor:'pointer', letterSpacing:'0.08em', transition:'all 0.15s' }}
              onMouseEnter={e=>{ e.target.style.color='var(--red)'; e.target.style.borderColor='var(--red)'; }}
              onMouseLeave={e=>{ e.target.style.color='var(--text-dim)'; e.target.style.borderColor='var(--border)'; }}>
              logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ textDecoration:'none', fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--bg)', background:'var(--amber)', padding:'5px 14px', borderRadius:'var(--radius)', letterSpacing:'0.08em', fontWeight:700 }}>sign_in</Link>
        )}
      </div>
    </nav>
  );
}