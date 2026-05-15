import React from 'react';

/* ── Button ──────────────────────────────────────────────── */
export function Button({ children, variant = 'primary', size = 'md', disabled, onClick, className = '', ...rest }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.05em',
    transition: 'var(--transition)', borderRadius: 'var(--radius-sm)',
    opacity: disabled ? 0.45 : 1,
  };
  const sizes = {
    sm: { padding: '0.3rem 0.75rem', fontSize: '0.7rem' },
    md: { padding: '0.55rem 1.2rem', fontSize: '0.78rem' },
    lg: { padding: '0.75rem 1.6rem', fontSize: '0.88rem' },
  };
  const variants = {
    primary: {
      background: 'var(--cyan)', color: '#000',
      boxShadow: '0 0 18px rgba(0,229,255,0.25)',
    },
    ghost: {
      background: 'transparent', color: 'var(--cyan)',
      border: '1px solid var(--cyan)',
    },
    danger: {
      background: 'transparent', color: 'var(--red)',
      border: '1px solid var(--red)',
    },
    subtle: {
      background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
      border: '1px solid var(--bg-border)',
    },
  };
  return (
    <button
      style={{ ...base, ...sizes[size], ...variants[variant] }}
      disabled={disabled}
      onClick={onClick}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ── Badge ───────────────────────────────────────────────── */
export function Badge({ children, color = 'cyan' }) {
  const colors = {
    cyan:  { bg: 'rgba(0,229,255,0.1)',  text: 'var(--cyan)',  border: 'rgba(0,229,255,0.3)'  },
    green: { bg: 'rgba(0,255,157,0.1)',  text: 'var(--green)', border: 'rgba(0,255,157,0.3)'  },
    amber: { bg: 'rgba(255,179,0,0.1)',  text: 'var(--amber)', border: 'rgba(255,179,0,0.3)'  },
    red:   { bg: 'rgba(255,68,68,0.1)',  text: 'var(--red)',   border: 'rgba(255,68,68,0.3)'  },
    muted: { bg: 'var(--bg-elevated)',   text: 'var(--text-secondary)', border: 'var(--bg-border)' },
  };
  const c = colors[color] || colors.muted;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '0.15rem 0.5rem',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      fontFamily: 'var(--font-mono)',
    }}>
      {children}
    </span>
  );
}

/* ── Status Badge ────────────────────────────────────────── */
export function StatusBadge({ status }) {
  const map = {
    done:       { label: 'DONE',       color: 'green' },
    processing: { label: 'PROCESSING', color: 'cyan'  },
    pending:    { label: 'PENDING',    color: 'amber' },
    failed:     { label: 'FAILED',     color: 'red'   },
  };
  const cfg = map[status] || { label: status.toUpperCase(), color: 'muted' };
  return <Badge color={cfg.color}>{cfg.label}</Badge>;
}

/* ── Card ────────────────────────────────────────────────── */
export function Card({ children, style = {}, className = '' }) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--bg-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Spinner ─────────────────────────────────────────────── */
export function Spinner({ size = 20, color = 'var(--cyan)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5"
        strokeDasharray="40 20" strokeLinecap="round" />
    </svg>
  );
}

/* ── Empty State ─────────────────────────────────────────── */
export function EmptyState({ icon, title, description }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '0.75rem', padding: '3rem 1rem',
      color: 'var(--text-muted)', textAlign: 'center',
    }}>
      <div style={{ fontSize: '2.5rem', opacity: 0.4 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-secondary)' }}>{title}</div>
      {description && <div style={{ fontSize: '0.78rem', maxWidth: 300 }}>{description}</div>}
    </div>
  );
}

/* ── Image Thumbnail ─────────────────────────────────────── */
export function Thumb({ src, alt = '', size = 56, style = {} }) {
  const [err, setErr] = React.useState(false);
  if (!src || err) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 'var(--radius-sm)',
        background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', fontSize: size * 0.35,
        flexShrink: 0, ...style,
      }}>🖼</div>
    );
  }
  return (
    <img
      src={src} alt={alt}
      onError={() => setErr(true)}
      style={{
        width: size, height: size, objectFit: 'cover',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--bg-border)',
        flexShrink: 0, ...style,
      }}
    />
  );
}

/* ── Section Header ──────────────────────────────────────── */
export function SectionHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.35rem', color: 'var(--text-primary)', lineHeight: 1 }}>
          {title}
        </h2>
        {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: '0.5rem' }}>{actions}</div>}
    </div>
  );
}
