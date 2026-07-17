import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminUsers() {
  const [users,        setUsers]        = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [scans,        setScans]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [scansLoading, setScansLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/admin/users')
      .then(r => setUsers(r.data))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const del = (id) => {
    if (!window.confirm('Permanently delete this user?')) return;
    API.delete(`/admin/users/${id}`)
      .then(() => setUsers(u => u.filter(x => x.id !== id)))
      .catch(() => setError('Delete failed.'));
  };

  const suspend = (id) => {
    API.post(`/admin/users/${id}/suspend`)
      .then(() => setUsers(u => u.map(x => x.id === id ? { ...x, suspended: true } : x)))
      .catch(() => setError('Suspend failed.'));
  };

  const unsuspend = (id) => {
    API.post(`/admin/users/${id}/unsuspend`)
      .then(() => setUsers(u => u.map(x => x.id === id ? { ...x, suspended: false } : x)))
      .catch(() => setError('Unsuspend failed.'));
  };

  const viewScans = (user) => {
    setSelectedUser(user); setScans([]); setScansLoading(true);
    API.get(`/admin/users/${user.id}/scans`)
      .then(r => setScans(r.data))
      .catch(() => setError('Failed to load scans.'))
      .finally(() => setScansLoading(false));
  };

  return (
    <div style={{ paddingBottom:'60px', fontFamily:'var(--font-mono)' }}>
      <div style={{ marginBottom:'28px' }}>
        <p style={{ fontSize:'10px', letterSpacing:'0.14em', color:'var(--red)', marginBottom:'6px' }}>{"//"} RESTRICTED — ADMIN ONLY</p>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:'26px', fontWeight:800, color:'#fff', lineHeight:1 }}>USER MANAGEMENT</h1>
      </div>

      {error && (
        <div style={{ marginBottom:'16px', padding:'10px 14px', background:'var(--red-dim)', border:'1px solid rgba(255,77,77,0.3)', borderLeft:'3px solid var(--red)', borderRadius:'var(--radius)', fontSize:'11px', color:'var(--red)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>ERR: {error}</span>
          <button onClick={() => setError('')} style={{ background:'none', border:'none', color:'var(--red)', cursor:'pointer', fontSize:'13px' }}>✕</button>
        </div>
      )}

      <div style={{ background:'var(--panel)', border:'1px solid var(--border)', borderTop:'2px solid var(--red)', borderRadius:'var(--radius-lg)', overflow:'hidden', marginBottom:'20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 80px 80px 130px', gap:'12px', padding:'10px 16px', borderBottom:'1px solid var(--border)', background:'var(--surface)' }}>
          {['USERNAME','EMAIL','ROLE','STATUS','ACTIONS'].map(h => (
            <span key={h} style={{ fontSize:'9px', fontWeight:700, letterSpacing:'0.12em', color:'var(--text-dim)' }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <p style={{ padding:'20px 16px', color:'var(--text-dim)', fontSize:'11px' }}>loading users...</p>
        ) : users.length === 0 ? (
          <p style={{ padding:'20px 16px', color:'var(--text-mute)', fontSize:'11px' }}>no users found</p>
        ) : (
          users.map((u, i) => (
            <div key={u.id} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 80px 80px 130px', gap:'12px', padding:'12px 16px', alignItems:'center', borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none', background: selectedUser?.id === u.id ? 'rgba(0,212,200,0.04)' : 'transparent', transition:'background 0.15s' }}>
              <span style={{ fontSize:'12px', color:'#fff', fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.username}</span>
              <span style={{ fontSize:'10px', color:'var(--text-dim)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</span>
              <span style={{ fontSize:'9px', fontWeight:700, letterSpacing:'0.08em', color: u.role === 'admin' ? 'var(--amber)' : 'var(--cyan)' }}>{u.role.toUpperCase()}</span>
              <span style={{ fontSize:'9px', fontWeight:700, letterSpacing:'0.08em', color: u.suspended ? 'var(--red)' : 'var(--green)' }}>{u.suspended ? 'SUSPENDED' : 'ACTIVE'}</span>
              <div style={{ display:'flex', gap:'4px' }}>
                <SmBtn color="var(--cyan)" onClick={() => viewScans(u)}>SCANS</SmBtn>
                {u.suspended
                  ? <SmBtn color="var(--green)" onClick={() => unsuspend(u.id)}>RESTORE</SmBtn>
                  : <SmBtn color="var(--yellow)" onClick={() => suspend(u.id)}>SUSPEND</SmBtn>
                }
                <SmBtn color="var(--red)" onClick={() => del(u.id)}>✕</SmBtn>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedUser && (
        <div className="fade-up" style={{ background:'var(--panel)', border:'1px solid var(--border)', borderTop:'2px solid var(--cyan)', borderRadius:'var(--radius-lg)', padding:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
            <div>
              <div style={{ fontSize:'9px', letterSpacing:'0.12em', color:'var(--cyan)', marginBottom:'3px' }}>SCAN HISTORY</div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:'16px', fontWeight:800, color:'#fff' }}>{selectedUser.username}</div>
            </div>
            <button onClick={() => setSelectedUser(null)} style={{ background:'none', border:'1px solid var(--border)', borderRadius:'var(--radius)', color:'var(--text-dim)', fontFamily:'var(--font-mono)', fontSize:'10px', padding:'5px 10px', cursor:'pointer' }}>✕ CLOSE</button>
          </div>

          {scansLoading ? (
            <p style={{ color:'var(--text-dim)', fontSize:'11px' }}>loading scans...</p>
          ) : scans.length === 0 ? (
            <p style={{ color:'var(--text-mute)', fontSize:'11px' }}>no scans recorded</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              {scans.map(sc => {
                const rc = sc.risk_score >= 70 ? 'var(--red)' : sc.risk_score >= 50 ? 'var(--orange)' : sc.risk_score >= 30 ? 'var(--yellow)' : 'var(--green)';
                return (
                  <div key={sc.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', background:'var(--surface)', border:`1px solid var(--border)`, borderLeft:`2px solid ${rc}`, borderRadius:'var(--radius)' }}>
                    <div style={{ width:'32px', height:'32px', flexShrink:0, borderRadius:'50%', border:`1px solid ${rc}44`, background:`${rc}10`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontFamily:'var(--font-head)', fontSize:'11px', fontWeight:800, color:rc }}>{sc.risk_score}</span>
                    </div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:'11px', color:'#fff', fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{sc.url}</div>
                      <div style={{ fontSize:'10px', color:'var(--text-dim)', marginTop:'1px' }}>{sc.timestamp} &nbsp;·&nbsp; {sc.results.length} findings</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SmBtn({ children, color, onClick }) {
  return (
    <button onClick={onClick} style={{ background:'transparent', border:`1px solid ${color}33`, borderRadius:'var(--radius)', color, fontFamily:'var(--font-mono)', fontSize:'8px', fontWeight:700, letterSpacing:'0.08em', padding:'3px 7px', cursor:'pointer', transition:'all 0.15s', whiteSpace:'nowrap' }}
      onMouseEnter={e=>{ e.currentTarget.style.background=`${color}15`; e.currentTarget.style.borderColor=color; }}
      onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor=`${color}33`; }}>
      {children}
    </button>
  );
}