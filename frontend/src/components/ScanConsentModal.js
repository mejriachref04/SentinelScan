import React from 'react';

const TERMS = [
  { key:'ownership',  label:'OWNERSHIP',  text:'I own this target or hold explicit written authorisation to conduct security testing on it.' },
  { key:'legal',      label:'LEGAL',      text:'I understand that unauthorised scanning may breach computer-crime laws. I accept full legal responsibility for this action.' },
  { key:'impact',     label:'IMPACT',     text:'Scanning may generate significant traffic and could affect target performance. I accept these risks.' },
  { key:'data',       label:'DATA',       text:'Results will be stored on SentinelScan servers and used solely for security analysis purposes.' },
];

export default function ScanConsentModal({ isOpen, onClose, onConfirm, targetUrl }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:200,
      background:'rgba(0,0,0,0.82)', backdropFilter:'blur(6px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'20px',
    }}>
      <div className="fade-up" style={{
        background:'var(--panel)',
        border:'1px solid var(--border)',
        borderTop:'2px solid var(--amber)',
        borderRadius:'var(--radius-lg)',
        width:'100%', maxWidth:'480px',
        fontFamily:'var(--font-mono)',
      }}>
        <div style={{
          padding:'18px 24px',
          borderBottom:'1px solid var(--border)',
          display:'flex', alignItems:'center', gap:'10px',
        }}>
          <span style={{ fontSize:'18px' }}>⚠</span>
          <div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'15px', fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>
              SCAN AUTHORISATION
            </div>
            <div style={{ fontSize:'10px', color:'var(--text-dim)', letterSpacing:'0.1em', marginTop:'1px' }}>
              LEGAL CONSENT REQUIRED
            </div>
          </div>
        </div>

        <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ fontSize:'9px', color:'var(--text-dim)', letterSpacing:'0.12em', marginBottom:'5px' }}>TARGET</div>
          <div style={{
            background:'var(--surface)', border:'1px solid var(--border)',
            borderRadius:'var(--radius)', padding:'8px 12px',
            fontSize:'12px', color:'var(--amber)', wordBreak:'break-all',
          }}>
            {targetUrl}
          </div>
        </div>

        <div style={{ padding:'16px 24px', display:'flex', flexDirection:'column', gap:'10px' }}>
          {TERMS.map(({ key, label, text }) => (
            <div key={key} style={{ display:'flex', gap:'10px', alignItems:'flex-start' }}>
              <span style={{
                flexShrink:0, fontSize:'9px', fontWeight:700, letterSpacing:'0.1em',
                color:'var(--cyan)', marginTop:'2px',
              }}>
                [{label}]
              </span>
              <span style={{ fontSize:'11px', color:'var(--text-dim)', lineHeight:1.5 }}>{text}</span>
            </div>
          ))}
        </div>

        <div style={{
          margin:'0 24px 16px',
          padding:'10px 12px',
          background:'var(--red-dim)',
          border:'1px solid rgba(255,77,77,0.25)',
          borderLeft:'3px solid var(--red)',
          borderRadius:'var(--radius)',
          fontSize:'10px', color:'var(--red)', lineHeight:1.5,
        }}>
          WARNING: Scanning systems without authorisation is a criminal offence in most jurisdictions.
        </div>

        <div style={{
          padding:'16px 24px',
          borderTop:'1px solid var(--border)',
          display:'flex', gap:'10px',
        }}>
          <button onClick={onClose} style={{
            flex:1, padding:'11px',
            background:'transparent', border:'1px solid var(--border)',
            borderRadius:'var(--radius)',
            fontFamily:'var(--font-mono)', fontSize:'11px', fontWeight:700,
            color:'var(--text-dim)', letterSpacing:'0.1em', cursor:'pointer',
            transition:'all 0.15s',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--text-dim)'; e.currentTarget.style.color='#fff'; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-dim)'; }}
          >
            CANCEL
          </button>
          <button onClick={onConfirm} style={{
            flex:1, padding:'11px',
            background:'var(--amber)', border:'none',
            borderRadius:'var(--radius)',
            fontFamily:'var(--font-mono)', fontSize:'11px', fontWeight:700,
            color:'var(--bg)', letterSpacing:'0.1em', cursor:'pointer',
            transition:'all 0.15s',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.opacity='0.88'; }}
          onMouseLeave={e=>{ e.currentTarget.style.opacity='1'; }}
          >
            ACCEPT &amp; SCAN →
          </button>
        </div>
      </div>
    </div>
  );
}