import React, { useEffect, useState } from 'react';
import API from '../api';

const INTERVALS = [
  { v: 6,   l: '6h'   },
  { v: 12,  l: '12h'  },
  { v: 24,  l: '24h'  },
  { v: 48,  l: '2 days' },
  { v: 168, l: '1 week' },
];

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');

  const [form, setForm] = useState({
    url: '', schedule_type: 'interval', interval_hours: 24, daily_time: '02:00',
  });

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value || e }));

  useEffect(() => {
    API.get('/schedule')
      .then(r => setSchedules(r.data))
      .catch(() => setError('failed to load schedules'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.url.trim()) { setError('URL is required'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        url: form.url.trim(),
        schedule_type: form.schedule_type,
        ...(form.schedule_type === 'interval' ? { interval_hours: Number(form.interval_hours) } : {}),
        ...(form.schedule_type === 'daily'    ? { daily_time: form.daily_time } : {}),
      };
      const r = await API.post('/schedule', payload);
      setSchedules(p => [r.data, ...p]);
      setShowForm(false);
      setForm({ url:'', schedule_type:'interval', interval_hours:24, daily_time:'02:00' });
    } catch (err) {
      setError(err.response?.data?.msg || 'failed to create');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this schedule?')) return;
    try { await API.delete(`/schedule/${id}`); setSchedules(p => p.filter(s => s.id !== id)); }
    catch { setError('delete failed'); }
  };

  const handleToggle = async (id) => {
    try { const r = await API.post(`/schedule/${id}/toggle`); setSchedules(p => p.map(s => s.id === id ? r.data : s)); }
    catch { setError('toggle failed'); }
  };

  const fmt = (ts) => {
    if (!ts) return '—';
    return new Date(ts + ' UTC').toLocaleString();
  };

  return (
    <div style={{ paddingBottom:'60px', fontFamily:'var(--font-mono)' }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'28px' }}>
        <div>
          <p style={{ fontSize:'10px', letterSpacing:'0.14em', color:'var(--cyan)', marginBottom:'6px' }}>
          </p>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'26px', fontWeight:800, color:'#fff', lineHeight:1 }}>
            SCHEDULES
          </h1>
        </div>
        <button onClick={() => { setShowForm(v => !v); setError(''); }} style={{
          background: showForm ? 'var(--amber-dim)' : 'var(--amber)',
          color: showForm ? 'var(--amber)' : 'var(--bg)',
          border:`1px solid ${showForm ? 'rgba(245,166,35,0.4)' : 'transparent'}`,
          borderRadius:'var(--radius)',
          fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700,
          letterSpacing:'0.1em', padding:'8px 14px', cursor:'pointer',
        }}>
          {showForm ? '✕ CANCEL' : '+ NEW SCHEDULE'}
        </button>
      </div>

      {error && (
        <div style={{
          marginBottom:'16px', padding:'10px 14px',
          background:'var(--red-dim)', border:'1px solid rgba(255,77,77,0.3)',
          borderLeft:'3px solid var(--red)', borderRadius:'var(--radius)',
          fontSize:'11px', color:'var(--red)',
        }}>
          ERR: {error}
        </div>
      )}

      {showForm && (
        <div className="fade-up" style={{
          marginBottom:'20px', padding:'20px',
          background:'var(--panel)', border:'1px solid var(--border)',
          borderTop:'2px solid var(--amber)', borderRadius:'var(--radius-lg)',
        }}>
          <div style={{ fontSize:'9px', letterSpacing:'0.14em', color:'var(--amber)', marginBottom:'16px', fontWeight:700 }}>
            NEW SCHEDULED SCAN
          </div>

          <div style={{ marginBottom:'14px' }}>
            <label style={{ display:'block', fontSize:'9px', letterSpacing:'0.12em', color:'var(--text-dim)', marginBottom:'5px' }}>TARGET URL</label>
            <input type="url" value={form.url} onChange={f('url')} placeholder="https://example.com"
              style={{
                width:'100%', background:'var(--surface)',
                border:'1px solid var(--border)', borderRadius:'var(--radius)',
                padding:'9px 12px', fontFamily:'var(--font-mono)', fontSize:'12px',
                color:'#fff', outline:'none',
              }}
            />
          </div>

          <div style={{ marginBottom:'14px' }}>
            <label style={{ display:'block', fontSize:'9px', letterSpacing:'0.12em', color:'var(--text-dim)', marginBottom:'5px' }}>SCHEDULE TYPE</label>
            <div style={{ display:'flex', gap:'6px' }}>
              {['interval','daily'].map(t => (
                <button key={t} onClick={() => setForm(p => ({ ...p, schedule_type: t }))} style={{
                  flex:1, padding:'8px',
                  background: form.schedule_type === t ? 'var(--amber-dim)' : 'var(--surface)',
                  border:`1px solid ${form.schedule_type === t ? 'rgba(245,166,35,0.4)' : 'var(--border)'}`,
                  borderRadius:'var(--radius)',
                  fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700,
                  letterSpacing:'0.08em',
                  color: form.schedule_type === t ? 'var(--amber)' : 'var(--text-dim)',
                  cursor:'pointer',
                }}>
                  {t === 'interval' ? '⏱ INTERVAL' : '🕐 DAILY'}
                </button>
              ))}
            </div>
          </div>

          {form.schedule_type === 'interval' && (
            <div style={{ marginBottom:'14px' }}>
              <label style={{ display:'block', fontSize:'9px', letterSpacing:'0.12em', color:'var(--text-dim)', marginBottom:'5px' }}>REPEAT EVERY</label>
              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                {INTERVALS.map(({ v, l }) => (
                  <button key={v} onClick={() => setForm(p => ({ ...p, interval_hours: v }))} style={{
                    padding:'6px 12px',
                    background: form.interval_hours === v ? 'var(--amber-dim)' : 'var(--surface)',
                    border:`1px solid ${form.interval_hours === v ? 'rgba(245,166,35,0.4)' : 'var(--border)'}`,
                    borderRadius:'var(--radius)',
                    fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700,
                    color: form.interval_hours === v ? 'var(--amber)' : 'var(--text-dim)',
                    cursor:'pointer',
                  }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {form.schedule_type === 'daily' && (
            <div style={{ marginBottom:'14px' }}>
              <label style={{ display:'block', fontSize:'9px', letterSpacing:'0.12em', color:'var(--text-dim)', marginBottom:'5px' }}>RUN AT (UTC)</label>
              <input type="time" value={form.daily_time} onChange={f('daily_time')}
                style={{
                  background:'var(--surface)', border:'1px solid var(--border)',
                  borderRadius:'var(--radius)', padding:'9px 12px',
                  fontFamily:'var(--font-mono)', fontSize:'12px', color:'#fff', outline:'none',
                }}
              />
            </div>
          )}

          <button onClick={handleCreate} disabled={saving} style={{
            width:'100%', marginTop:'4px',
            background: saving ? 'var(--border)' : 'var(--amber)',
            color: saving ? 'var(--text-dim)' : 'var(--bg)',
            border:'none', borderRadius:'var(--radius)',
            fontFamily:'var(--font-mono)', fontSize:'11px', fontWeight:700,
            letterSpacing:'0.12em', padding:'11px', cursor: saving ? 'wait' : 'pointer',
          }}>
            {saving ? 'SAVING...' : 'CREATE SCHEDULE →'}
          </button>
        </div>
      )}

      {loading ? (
        <p style={{ color:'var(--text-dim)', fontSize:'11px' }}>loading schedules...</p>
      ) : schedules.length === 0 ? (
        <div style={{
          textAlign:'center', padding:'60px 20px',
          border:'1px dashed var(--border)', borderRadius:'var(--radius-lg)',
        }}>
          <p style={{ color:'var(--text-mute)', fontSize:'10px', letterSpacing:'0.14em' }}>NO SCHEDULES CONFIGURED</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          {schedules.map(s => (
            <div key={s.id} style={{
              background:'var(--panel)',
              border:`1px solid ${s.is_active ? 'var(--border)' : 'var(--border)'}`,
              borderLeft:`3px solid ${s.is_active ? 'var(--green)' : 'var(--border-hi)'}`,
              borderRadius:'var(--radius-lg)', padding:'14px 18px',
              opacity: s.is_active ? 1 : 0.55,
              display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', minWidth:0 }}>
                <div style={{
                  width:'7px', height:'7px', borderRadius:'50%', flexShrink:0,
                  background: s.is_active ? 'var(--green)' : 'var(--text-mute)',
                  boxShadow: s.is_active ? '0 0 6px rgba(0,230,118,0.5)' : 'none',
                }} />
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:'12px', color:'#fff', fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {s.url}
                  </div>
                  <div style={{ display:'flex', gap:'10px', marginTop:'3px', flexWrap:'wrap' }}>
                    <Tag color="var(--cyan)">
                      {s.schedule_type === 'interval' ? `every ${s.interval_hours}h` : `daily ${s.daily_time} UTC`}
                    </Tag>
                    <Tag color={s.is_active ? 'var(--green)' : 'var(--text-dim)'}>
                      {s.is_active ? 'active' : 'paused'}
                    </Tag>
                  </div>
                  <div style={{ fontSize:'10px', color:'var(--text-mute)', marginTop:'4px' }}>
                    last: {fmt(s.last_run)} &nbsp;·&nbsp; next: {s.is_active ? fmt(s.next_run) : 'paused'}
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
                <IconBtn title={s.is_active ? 'pause' : 'resume'}
                  color={s.is_active ? 'var(--yellow)' : 'var(--green)'}
                  onClick={() => handleToggle(s.id)}>
                  {s.is_active ? '⏸' : '▶'}
                </IconBtn>
                <IconBtn title="delete" color="var(--red)" onClick={() => handleDelete(s.id)}>✕</IconBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Tag({ children, color }) {
  return (
    <span style={{
      fontFamily:'var(--font-mono)', fontSize:'9px', fontWeight:700,
      letterSpacing:'0.08em', color,
      border:`1px solid ${color}33`,
      padding:'1px 6px', borderRadius:'2px',
    }}>
      {children}
    </span>
  );
}

function IconBtn({ children, color, onClick, title }) {
  return (
    <button title={title} onClick={onClick} style={{
      width:'28px', height:'28px',
      background:'transparent',
      border:`1px solid ${color}33`,
      borderRadius:'var(--radius)',
      color, fontFamily:'var(--font-mono)',
      fontSize:'12px', cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center',
      transition:'all 0.15s',
    }}
    onMouseEnter={e=>{ e.currentTarget.style.background=`${color}15`; e.currentTarget.style.borderColor=color; }}
    onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor=`${color}33`; }}
    >
      {children}
    </button>
  );
}