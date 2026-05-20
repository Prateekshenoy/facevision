import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/',         label: 'Dashboard',  icon: '⬡', desc: 'Overview' },
  { to: '/upload',   label: 'Upload',     icon: '↑', desc: 'Add Images' },
  { to: '/clusters', label: 'Clusters',   icon: '◈', desc: 'Group Faces' },
  { to: '/search',   label: 'Search',     icon: '⊙', desc: 'Find Identity' },
];

export default function Sidebar() {
  const [faceswapHovered, setFaceswapHovered] = useState(false);

  return (
    <aside style={{
      width: 220, minHeight: '100vh', flexShrink: 0,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--bg-border)',
      display: 'flex', flexDirection: 'column',
      padding: '1.5rem 0',
      position: 'sticky', top: 0,
    }}>

      {/* Logo */}
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: '1.2rem', color: 'var(--cyan)', letterSpacing: '-0.02em',
        }}>
          FACE<span style={{ color: 'var(--text-primary)' }}>VISION</span>
        </div>
        <div style={{
          fontSize: '0.62rem', color: 'var(--text-muted)',
          marginTop: '0.15rem', letterSpacing: '0.12em',
        }}>
          IDENTITY · CLUSTER · SEARCH
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1 }}>
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.65rem 1.5rem',
              color: isActive ? 'var(--cyan)' : 'var(--text-secondary)',
              background: isActive ? 'var(--cyan-glow)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--cyan)' : '2px solid transparent',
              textDecoration: 'none',
              fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em',
              fontFamily: 'var(--font-mono)',
              transition: 'var(--transition)',
            })}
          >
            <span style={{ fontSize: '1rem', opacity: 0.85 }}>{icon}</span>
            {label}
          </NavLink>
        ))}

        {/* Divider before FaceSwap */}
        <div style={{
          margin: '0.75rem 1.5rem',
          borderTop: '1px solid var(--bg-border)',
          opacity: 0.5,
        }} />

        {/* FaceSwap — external tool link */}
        <a
          href="http://localhost:8002"
          target="_blank"
          rel="noreferrer"
          onMouseEnter={() => setFaceswapHovered(true)}
          onMouseLeave={() => setFaceswapHovered(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.65rem 1.5rem',
            color: faceswapHovered ? 'var(--cyan)' : 'var(--text-secondary)',
            background: faceswapHovered ? 'var(--cyan-glow)' : 'transparent',
            borderLeft: faceswapHovered ? '2px solid var(--cyan)' : '2px solid transparent',
            textDecoration: 'none',
            fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em',
            fontFamily: 'var(--font-mono)',
            transition: 'var(--transition)',
            position: 'relative',
          }}
        >
          <span style={{ fontSize: '1rem', opacity: 0.85 }}>⇄</span>
          FaceSwap
          {/* "External" badge */}
          <span style={{
            marginLeft: 'auto',
            fontSize: '0.5rem',
            letterSpacing: '0.08em',
            color: faceswapHovered ? 'var(--cyan)' : 'var(--text-muted)',
            opacity: 0.7,
            border: `1px solid ${faceswapHovered ? 'var(--cyan)' : 'var(--text-muted)'}`,
            padding: '0.1rem 0.3rem',
            borderRadius: '2px',
            transition: 'var(--transition)',
          }}>
            EXT
          </span>
        </a>
      </nav>

      {/* Footer */}
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--bg-border)',
        fontSize: '0.62rem', color: 'var(--text-muted)', lineHeight: 1.8,
      }}>
        <div>BlazeFace · MediaPipe</div>
        <div>ArcFace · InsightFace</div>
        <div>DBSCAN Clustering</div>
      </div>
    </aside>
  );
}