import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import ScanConsentModal from '../components/ScanConsentModal';
import API from '../api';

const SEV_COLOR = { Critical:'var(--red)', High:'var(--orange)', Medium:'var(--yellow)', Low:'var(--cyan)', Info:'var(--text-dim)' };
const SEV_ORDER = ['Critical','High','Medium','Low','Info'];

function safeHref(url) {
  try {
    const u = new URL(url);
    if (u.protocol === 'http:' || u.protocol === 'https:') return url;
  } catch {}
  return '#';
}

function RiskArc({ score }) {
  const r = 52, circ = 2 * Math.PI * r, fill = (score/100)*circ;
  const color = score>=70?'var(--red)':score>=50?'var(--orange)':score>=30?'var(--yellow)':'var(--cyan)';
  const label = score>=70?'CRITICAL':score>=50?'HIGH':score>=30?'MEDIUM':'LOW';
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--border)" strokeWidth="6"/>
        <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 64 64)" style={{ transition:'stroke-dasharray 0.6s ease' }}/>
        <text x="64" y="58" textAnchor="middle" fill="#fff" fontSize="20" fontFamily="'Syne',sans-serif" fontWeight="800">{score}</text>
        <text x="64" y="72" textAnchor="middle" fill="var(--text-dim)" fontSize="9" fontFamily="'Space Mono',monospace">/100</text>
      </svg>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'0.12em', color }}>{label} RISK</span>
    </div>
  );
}

function Badge({ children, color }) {
  return <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', fontWeight:700, letterSpacing:'0.06em', color, border:`1px solid ${color}33`, padding:'2px 8px', borderRadius:'2px' }}>{children}</span>;
}

function VulnCard({ vuln }) {
  const [open, setOpen] = useState(false);
  const sev = vuln.severity || 'Info';
  const color = SEV_COLOR[sev] || SEV_COLOR.Info;
  const ai = vuln.ai_analysis || {};
  return (
    <div style={{ background:'var(--panel)', border:'1px solid var(--border)', borderLeft:`3px solid ${color}`, borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
      <button onClick={() => setOpen(v=>!v)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', minWidth:0 }}>
          <span style={{ flexShrink:0, fontSize:'8px', fontWeight:700, letterSpacing:'0.1em', color, fontFamily:'var(--font-mono)', border:`1px solid ${color}44`, padding:'2px 6px', borderRadius:'2px' }}>{sev.toUpperCase()}</span>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:'12px', color:'#fff', fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:'var(--font-mono)' }}>{vuln.type}</div>
            <div style={{ fontSize:'10px', color:'var(--text-dim)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:'1px' }}>{vuln.url}</div>
          </div>
        </div>
        <span style={{ color:'var(--text-dim)', flexShrink:0, marginLeft:'8px', fontSize:'11px' }}>{open?'▲':'▼'}</span>
      </button>
      {open && (
        <div style={{ borderTop:'1px solid var(--border)', padding:'14px 16px', background:'var(--surface)', display:'flex', flexDirection:'column', gap:'12px' }}>
          {[['DESCRIPTION',vuln.description],['IMPACT',ai.impact],['EXPLANATION',ai.explanation],['REMEDIATION',ai.remediation||vuln.remediation]].filter(([,v])=>v).map(([label,val])=>(
            <div key={label}>
              <div style={{ fontSize:'9px', fontWeight:700, letterSpacing:'0.12em', color:'var(--text-dim)', marginBottom:'4px' }}>{label}</div>
              <div style={{ fontSize:'11px', color:'var(--text)', lineHeight:1.6, fontFamily:'var(--font-mono)', whiteSpace:'pre-line' }}>{val}</div>
            </div>
          ))}
          {(ai.owasp||ai.cwe) && <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>{ai.owasp&&<Badge color="var(--cyan)">{ai.owasp}</Badge>}{ai.cwe&&<Badge color="var(--text-dim)">{ai.cwe}</Badge>}</div>}
          {ai.references?.length>0 && (
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {ai.references.map((r,i) => (
                <a key={i} href={safeHref(r)} target="_blank" rel="noreferrer noopener"
                  style={{ fontSize:'9px', color:'var(--amber)', fontFamily:'var(--font-mono)', letterSpacing:'0.06em' }}>
                  [ref_{i+1}]
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { isConnected, scanLogs, scanProgress, activeScan, scanResults, scheduledScanNotice, dismissNotice, startScan } = useWebSocket();
  const [url,setUrl]=useState(''); const [report,setReport]=useState(null);
  const [showConsent,setShowConsent]=useState(false); const [pendingUrl,setPendingUrl]=useState('');
  const [downloading,setDownloading]=useState(false); const [filter,setFilter]=useState('All');

  useEffect(()=>{ const s=localStorage.getItem('scanReport'); if(s){try{setReport(JSON.parse(s))}catch{} localStorage.removeItem('scanReport');} },[]);
  useEffect(()=>{ if(scanResults) setReport({ url:scanResults.url, risk_score:scanResults.risk_score, results:scanResults.vulnerabilities, pages_scanned:scanResults.pages_scanned }); },[scanResults]);

  const requestScan=(e)=>{ e.preventDefault(); if(!url.trim()) return; setPendingUrl(url.trim()); setShowConsent(true); };
  const confirmScan=()=>{ setShowConsent(false); setReport(null); startScan(pendingUrl); setUrl(''); };
  const downloadPdf=async()=>{ if(!report) return; setDownloading(true); try{ const res=await API.post('/scan/report',report,{responseType:'blob'}); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([res.data],{type:'application/pdf'})); a.download='SentinelScan_Report.pdf'; a.click(); }catch{ alert('PDF generation failed.'); }finally{ setDownloading(false); } };

  const vulns=report?.results||[]; const filtered=filter==='All'?vulns:vulns.filter(v=>v.severity===filter);
  const counts=SEV_ORDER.reduce((a,s)=>({...a,[s]:vulns.filter(v=>v.severity===s).length}),{});
  const isScanning=!!activeScan;

  return (
    <div style={{ fontFamily:'var(--font-mono)', paddingBottom:'60px' }}>
      <ScanConsentModal isOpen={showConsent} onClose={()=>setShowConsent(false)} onConfirm={confirmScan} targetUrl={pendingUrl}/>

      {scheduledScanNotice && (
        <div style={{ marginBottom:'16px', padding:'10px 16px', background:'var(--cyan-dim)', border:'1px solid rgba(0,212,200,0.25)', borderLeft:'3px solid var(--cyan)', borderRadius:'var(--radius)', display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--cyan)' }}>
          <span>● Scheduled scan running for {scheduledScanNotice.url}</span>
          <button onClick={dismissNotice} style={{ background:'none', border:'none', color:'var(--cyan)', cursor:'pointer', fontSize:'13px' }}>✕</button>
        </div>
      )}

      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'28px' }}>
        <div>
          <p style={{ fontSize:'10px', letterSpacing:'0.14em', color:'var(--amber)', marginBottom:'6px' }}>{"//"} ACTIVE THREAT INTELLIGENCE</p>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'26px', fontWeight:800, color:'#fff', lineHeight:1 }}>DASHBOARD</h1>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', color:isConnected?'var(--green)':'var(--red)' }}>
          <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:isConnected?'var(--green)':'var(--red)', boxShadow:isConnected?'0 0 6px rgba(0,230,118,0.5)':'none' }}/>
          {isConnected?'LIVE':'OFFLINE'}
        </div>
      </div>

      <div style={{ background:'var(--panel)', border:'1px solid var(--border)', borderTop:'2px solid var(--amber)', borderRadius:'var(--radius-lg)', padding:'20px', marginBottom:'20px' }}>
        <form onSubmit={requestScan} style={{ display:'flex', gap:'8px' }}>
          <input type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://target.example.com" disabled={isScanning}
            style={{ flex:1, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'10px 14px', fontFamily:'var(--font-mono)', fontSize:'12px', color:'#fff', outline:'none', opacity:isScanning?0.5:1 }}/>
          <button type="submit" disabled={isScanning||!isConnected}
            style={{ background:(isScanning||!isConnected)?'var(--border)':'var(--amber)', color:(isScanning||!isConnected)?'var(--text-dim)':'var(--bg)', border:'none', borderRadius:'var(--radius)', fontFamily:'var(--font-mono)', fontSize:'11px', fontWeight:700, letterSpacing:'0.12em', padding:'10px 20px', cursor:(isScanning||!isConnected)?'not-allowed':'pointer', whiteSpace:'nowrap' }}>
            {isScanning?'SCANNING...':'RUN SCAN →'}
          </button>
        </form>
      </div>

      {isScanning && (
        <div style={{ background:'var(--panel)', border:'1px solid var(--border)', borderTop:'2px solid var(--cyan)', borderRadius:'var(--radius-lg)', padding:'16px 20px', marginBottom:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
            <span style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.12em', color:'var(--cyan)' }}>● SCANNING</span>
            <span style={{ fontSize:'11px', fontWeight:700, color:'#fff' }}>{scanProgress}%</span>
          </div>
          <div style={{ height:'3px', background:'var(--border)', borderRadius:'2px', overflow:'hidden', marginBottom:'12px' }}>
            <div style={{ height:'100%', width:`${scanProgress}%`, background:'var(--cyan)', borderRadius:'2px', transition:'width 0.4s ease', boxShadow:'0 0 8px rgba(0,212,200,0.4)' }}/>
          </div>
          <div style={{ maxHeight:'160px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'2px' }}>
            {scanLogs.slice(0,40).map((log,i)=>(
              <div key={i} style={{ fontSize:'10px', lineHeight:1.5, color:log.type==='error'?'var(--red)':log.type==='warning'?'var(--yellow)':log.type==='success'?'var(--green)':log.type==='ai'?'var(--amber)':'var(--text-dim)' }}>
                <span style={{ color:'var(--text-mute)', marginRight:'6px' }}>[{log.time}]</span>{log.msg}
              </div>
            ))}
          </div>
        </div>
      )}

      {report && !isScanning && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'auto 1fr 1fr 1fr 1fr', gap:'8px', marginBottom:'16px' }}>
            <div style={{ background:'var(--panel)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <RiskArc score={report.risk_score||0}/>
            </div>
            {SEV_ORDER.filter(s=>s!=='Info').map(s=>(
              <div key={s} style={{ background:'var(--panel)', border:'1px solid var(--border)', borderTop:`2px solid ${SEV_COLOR[s]}`, borderRadius:'var(--radius-lg)', padding:'14px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'4px' }}>
                <span style={{ fontFamily:'var(--font-head)', fontSize:'28px', fontWeight:800, color:SEV_COLOR[s], lineHeight:1 }}>{counts[s]||0}</span>
                <span style={{ fontSize:'9px', fontWeight:700, letterSpacing:'0.1em', color:'var(--text-dim)' }}>{s.toUpperCase()}</span>
              </div>
            ))}
          </div>

          <div style={{ background:'var(--panel)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'20px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px', flexWrap:'wrap', gap:'8px' }}>
              <div style={{ fontFamily:'var(--font-head)', fontSize:'14px', fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>
                FINDINGS <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', fontWeight:400, color:'var(--text-dim)', marginLeft:'8px' }}>{filtered.length}/{vulns.length}</span>
              </div>
              <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                {['All',...SEV_ORDER].map(s=>(
                  <button key={s} onClick={()=>setFilter(s)} style={{ background:filter===s?`${(SEV_COLOR[s]||'var(--amber)')}18`:'transparent', border:`1px solid ${filter===s?(SEV_COLOR[s]||'var(--amber)'):'var(--border)'}`, borderRadius:'var(--radius)', color:filter===s?(SEV_COLOR[s]||'var(--amber)'):'var(--text-dim)', fontFamily:'var(--font-mono)', fontSize:'9px', fontWeight:700, letterSpacing:'0.1em', padding:'4px 10px', cursor:'pointer' }}>
                    {s.toUpperCase()}{s!=='All'&&counts[s]?` (${counts[s]})` : ''}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              {filtered.length===0 ? <p style={{ color:'var(--text-mute)', fontSize:'11px', padding:'20px 0', textAlign:'center' }}>no findings for this filter</p> : filtered.map((v,i)=><VulnCard key={i} vuln={v}/>)}
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'12px' }}>
            <button onClick={downloadPdf} disabled={downloading} style={{ background:'transparent', border:`1px solid ${downloading?'var(--border)':'var(--amber)'}`, borderRadius:'var(--radius)', color:downloading?'var(--text-dim)':'var(--amber)', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', padding:'8px 16px', cursor:downloading?'wait':'pointer' }}>
              {downloading?'GENERATING...':'↓ EXPORT PDF'}
            </button>
          </div>
        </>
      )}

      {!report&&!isScanning&&(
        <div style={{ textAlign:'center', padding:'80px 20px', border:'1px dashed var(--border)', borderRadius:'var(--radius-lg)', marginTop:'8px' }}>
          <p style={{ fontSize:'28px', marginBottom:'12px', opacity:0.12 }}>⬡</p>
          <p style={{ color:'var(--text-mute)', fontSize:'10px', letterSpacing:'0.14em' }}>ENTER A TARGET URL ABOVE TO BEGIN</p>
        </div>
      )}
    </div>
  );
}