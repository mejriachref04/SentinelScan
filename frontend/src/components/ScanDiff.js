import React, { useState } from 'react';

const SEV_COLOR = {
  Critical: 'var(--red)',
  High:     'var(--orange)',
  Medium:   'var(--yellow)',
  Low:      'var(--cyan)',
  Info:     'var(--text-dim)',
};

function VulnList({ vulns, emptyMsg }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? vulns : vulns.slice(0, 3);

  if (!vulns.length) return (
    <p style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-mute)', padding:'6px 0', fontStyle:'italic' }}>
      {emptyMsg}
    </p>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
      {visible.map((v, i) => (
        <div key={i} style={{
          display:'flex', gap:'10px', alignItems:'flex-start',
          padding:'8px 10px',
          background:'var(--surface)',
          border:`1px solid ${SEV_COLOR[v.severity] || 'var(--border)'}22`,
          borderLeft:`2px solid ${SEV_COLOR[v.severity] || 'var(--border)'}`,
          borderRadius:'var(--radius)',
          fontFamily:'var(--font-mono)',
        }}>
          <span style={{ fontSize:'9px', fontWeight:700, letterSpacing:'0.08em', color: SEV_COLOR[v.severity] || 'var(--text-dim)', flexShrink:0, marginTop:'1px' }}>
            {(v.severity || 'INFO').toUpperCase()}
          </span>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:'11px', color:'#fff', fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.type}</div>
            <div style={{ fontSize:'10px', color:'var(--text-dim)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:'2px' }}>{v.url}</div>
          </div>
        </div>
      ))}
      {vulns.length > 3 && (
        <button onClick={() => setExpanded(x => !x)} style={{
          background:'none', border:'none', cursor:'pointer',
          fontFamily:'var(--font-mono)', fontSize:'10px',
          color:'var(--text-dim)', textAlign:'left', padding:'4px 0',
          letterSpacing:'0.06em',
        }}>
          {expanded ? '▲ show less' : `▼ +${vulns.length - 3} more`}
        </button>
      )}
    </div>
  );
}

export default function ScanDiff({ diff }) {
  if (!diff) return null;

  const { summary, risk_delta, current_risk, previous_risk,
          current_timestamp, previous_timestamp, fixed, new: newVulns, persisted } = diff;

  const improved = risk_delta < 0;
  const worse    = risk_delta > 0;

  const deltaColor = improved ? 'var(--green)' : worse ? 'var(--red)' : 'var(--text-dim)';
  const deltaSign  = risk_delta > 0 ? `+${risk_delta}` : risk_delta;

  return (
    <div style={{
      background:'var(--panel)', border:'1px solid var(--border)',
      borderTop:`2px solid ${deltaColor}`,
      borderRadius:'var(--radius-lg)', padding:'20px',
      fontFamily:'var(--font-mono)',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
        <div>
          <div style={{ fontSize:'10px', letterSpacing:'0.14em', color:'var(--text-dim)', marginBottom:'2px' }}>SCAN DIFF</div>
          <div style={{ fontSize:'10px', color:'var(--text-mute)' }}>
            {previous_timestamp} → {current_timestamp}
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontFamily:'var(--font-head)', fontSize:'22px', fontWeight:800, color: deltaColor }}>
            {deltaSign}
          </div>
          <div style={{ fontSize:'9px', color:'var(--text-dim)', letterSpacing:'0.08em' }}>
            {previous_risk} → {current_risk}
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'20px' }}>
        {[
          { count: summary.fixed_count,     label:'FIXED',      color:'var(--green)' },
          { count: summary.new_count,       label:'NEW',        color:'var(--red)'   },
          { count: summary.persisted_count, label:'PERSISTING', color:'var(--text-dim)' },
        ].map(({ count, label, color }) => (
          <div key={label} style={{
            textAlign:'center', padding:'12px 8px',
            background:'var(--surface)', border:`1px solid ${color}22`,
            borderTop:`2px solid ${color}`,
            borderRadius:'var(--radius)',
          }}>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'24px', fontWeight:800, color, lineHeight:1 }}>{count}</div>
            <div style={{ fontSize:'9px', letterSpacing:'0.1em', color:'var(--text-dim)', marginTop:'4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {summary.fixed_count > 0 && (
        <Section title="FIXED" accent="var(--green)">
          <VulnList vulns={fixed} emptyMsg="none" />
        </Section>
      )}
      {summary.new_count > 0 && (
        <Section title="NEW VULNERABILITIES" accent="var(--red)">
          <VulnList vulns={newVulns} emptyMsg="none" />
        </Section>
      )}
      {summary.persisted_count > 0 && (
        <Section title="STILL PRESENT" accent="var(--text-dim)">
          <VulnList vulns={persisted} emptyMsg="none" />
        </Section>
      )}
    </div>
  );
}

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom:'16px' }}>
      <div style={{
        fontSize:'9px', fontWeight:700, letterSpacing:'0.14em',
        color: accent, marginBottom:'8px',
        display:'flex', alignItems:'center', gap:'6px',
      }}>
        <span style={{ display:'inline-block', width:'16px', height:'1px', background: accent }} />
        {title}
      </div>
      {children}
    </div>
  );
}