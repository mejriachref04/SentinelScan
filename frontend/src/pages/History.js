import React, { useEffect, useState } from 'react';
import API from '../api';
import ScanDiff from '../components/ScanDiff';

const riskColor = (s) =>
  s >= 70 ? 'var(--red)' : s >= 50 ? 'var(--orange)' : s >= 30 ? 'var(--yellow)' : 'var(--green)';

function rowOpacity(compareMode, selected, history, itemId, itemUrl) {
  if (!compareMode || selected.length === 0) return 1;
  const first = history.find(x => x.id === selected[0]);
  if (!first) return 1;
  return first.url === itemUrl ? 1 : 0.3;
}

export default function History() {
  const [history,     setHistory]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [diffLoading, setDiffLoading] = useState(false);
  const [autoDiff,    setAutoDiff]    = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selected,    setSelected]    = useState([]);
  const [compareDiff, setCompareDiff] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/scan/history')
      .then(r => setHistory(r.data))
      .catch(() => setError('Failed to load scan history.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAutoDiff = async (id) => {
    if (autoDiff?.scanId === id) { setAutoDiff(null); return; }
    setDiffLoading(true);
    setError('');
    try {
      const r = await API.get(`/scan/diff/${id}`);
      setAutoDiff({ scanId: id, data: r.data });
    } catch (err) {
      if (err.response?.status === 404) setError('No previous scan found for this URL.');
      else setError('Failed to load diff.');
    } finally { setDiffLoading(false); }
  };

  const toggleSelect = (id) => {
    setSelected(p => {
      if (p.includes(id)) return p.filter(x => x !== id);
      if (p.length >= 2)  return [p[1], id];
      return [...p, id];
    });
    setCompareDiff(null);
  };

  const handleCompare = async () => {
    if (selected.length !== 2) return;
    const scanA = history.find(x => x.id === selected[0]);
    const scanB = history.find(x => x.id === selected[1]);
    if (scanA && scanB && scanA.url !== scanB.url) {
      setError('You can only compare scans of the same website. Selected scans target different URLs.');
      return;
    }
    setDiffLoading(true);
    setError('');
    try {
      const r = await API.get(`/scan/diff/${selected[0]}/${selected[1]}`);
      setCompareDiff(r.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Compare failed.');
    } finally { setDiffLoading(false); }
  };

  const exitCompare = () => { setCompareMode(false); setSelected([]); setCompareDiff(null); };

  return (
    <div style={{ padding:'0 0 60px', fontFamily:'var(--font-mono)' }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'28px' }}>
        <div>
          <p style={{ fontSize:'10px', letterSpacing:'0.14em', color:'var(--amber)', marginBottom:'6px' }}>{"//"} HISTORICAL INTELLIGENCE LOGS</p>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'26px', fontWeight:800, color:'#fff', lineHeight:1 }}>SCAN ARCHIVE</h1>
        </div>
        <button onClick={() => compareMode ? exitCompare() : setCompareMode(true)} style={{ background: compareMode ? 'var(--red-dim)' : 'transparent', border:`1px solid ${compareMode ? 'rgba(255,77,77,0.4)' : 'var(--border)'}`, borderRadius:'var(--radius)', color: compareMode ? 'var(--red)' : 'var(--text-dim)', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', padding:'8px 14px', cursor:'pointer', transition:'all 0.15s' }}>
          {compareMode ? '✕ EXIT COMPARE' : '⇄ COMPARE MODE'}
        </button>
      </div>

      {error && (
        <div style={{ marginBottom:'16px', padding:'10px 14px', background:'var(--red-dim)', border:'1px solid rgba(255,77,77,0.3)', borderLeft:'3px solid var(--red)', borderRadius:'var(--radius)', fontSize:'11px', color:'var(--red)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>ERR: {error}</span>
          <button onClick={() => setError('')} style={{ background:'none', border:'none', color:'var(--red)', cursor:'pointer', fontSize:'13px' }}>✕</button>
        </div>
      )}

      {compareMode && (
        <div style={{ marginBottom:'16px', padding:'12px 16px', background:'var(--cyan-dim)', border:'1px solid rgba(0,212,200,0.25)', borderLeft:'3px solid var(--cyan)', borderRadius:'var(--radius)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:'11px', color:'var(--cyan)' }}>
            select 2 scans to compare <span style={{ opacity:0.6 }}>({selected.length}/2)</span>
          </span>
          {selected.length === 2 && (
            <button onClick={handleCompare} disabled={diffLoading} style={{ background:'var(--cyan)', color:'var(--bg)', border:'none', borderRadius:'var(--radius)', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', padding:'6px 14px', cursor:'pointer' }}>
              {diffLoading ? 'COMPARING...' : 'RUN DIFF →'}
            </button>
          )}
        </div>
      )}

      {compareDiff && <div style={{ marginBottom:'16px' }}><ScanDiff diff={compareDiff} /></div>}

      {loading ? (
        <p style={{ color:'var(--text-dim)', fontSize:'11px' }}>loading archive...</p>
      ) : history.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', border:'1px dashed var(--border)', borderRadius:'var(--radius-lg)' }}>
          <p style={{ color:'var(--text-mute)', fontSize:'10px', letterSpacing:'0.14em' }}>NO RECORDS FOUND</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          {history.map((item) => {
            const sel  = selected.includes(item.id);
            const open = autoDiff?.scanId === item.id;
            const rc   = riskColor(item.risk_score);

            return (
              <div key={item.id}>
                <div
                  onClick={() => compareMode && toggleSelect(item.id)}
                  style={{
                    background: sel ? 'rgba(0,212,200,0.05)' : 'var(--panel)',
                    border:`1px solid ${sel ? 'var(--cyan)' : 'var(--border)'}`,
                    borderLeft:`3px solid ${rc}`,
                    borderRadius:'var(--radius-lg)',
                    padding:'14px 18px',
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    cursor: compareMode ? 'pointer' : 'default',
                    transition:'border-color 0.15s',
                    opacity: rowOpacity(compareMode, selected, history, item.id, item.url),
                  }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:'14px', minWidth:0 }}>
                    {compareMode && (
                      <div style={{ width:'16px', height:'16px', flexShrink:0, border:`1px solid ${sel ? 'var(--cyan)' : 'var(--border)'}`, borderRadius:'2px', background: sel ? 'var(--cyan)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {sel && <span style={{ fontSize:'9px', color:'var(--bg)', fontWeight:700 }}>{selected.indexOf(item.id)+1}</span>}
                      </div>
                    )}
                    <div style={{ flexShrink:0, width:'36px', height:'36px', borderRadius:'50%', border:`1px solid ${rc}44`, background:`${rc}10`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontFamily:'var(--font-head)', fontSize:'12px', fontWeight:800, color:rc }}>{item.risk_score}</span>
                    </div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:'12px', color:'#fff', fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.url}</div>
                      <div style={{ fontSize:'10px', color:'var(--text-dim)', marginTop:'2px' }}>
                        {item.timestamp} &nbsp;·&nbsp; {item.results.length} finding{item.results.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {!compareMode && (
                    <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
                      <Btn active={open} onClick={() => handleAutoDiff(item.id)} disabled={diffLoading && !open}>
                        {open ? 'HIDE DIFF' : 'VS PREV'}
                      </Btn>
                      <Btn accent="var(--amber)" onClick={() => {
                        localStorage.setItem('scanReport', JSON.stringify(item));
                        window.location.href = '/dashboard';
                      }}>VIEW →</Btn>
                    </div>
                  )}
                </div>

                {open && autoDiff?.data && (
                  <div style={{ marginTop:'4px', marginLeft:'22px' }}>
                    <ScanDiff diff={autoDiff.data} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Btn({ children, onClick, disabled, active, accent }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: active ? 'var(--cyan-dim)' : 'transparent', border:`1px solid ${active ? 'var(--cyan)' : 'var(--border)'}`, borderRadius:'var(--radius)', color: active ? 'var(--cyan)' : accent || 'var(--text-dim)', fontFamily:'var(--font-mono)', fontSize:'9px', fontWeight:700, letterSpacing:'0.1em', padding:'6px 10px', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.4 : 1, transition:'all 0.15s' }}>
      {children}
    </button>
  );
}