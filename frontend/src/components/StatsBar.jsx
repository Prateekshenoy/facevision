import React, { useEffect, useState } from 'react';
import { fetchStats } from '../utils/api';

function StatItem({ label, value, color = 'var(--text-primary)' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '0.2rem',
      padding: '0.75rem 1.25rem',
      borderRight: '1px solid var(--bg-border)',
    }}>
      <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 700 }}>
        {label}
      </span>
      <span style={{ fontSize: '1.4rem', fontWeight: 700, color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
        {value ?? '—'}
      </span>
    </div>
  );
}

export default function StatsBar() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = () => fetchStats().then(r => setStats(r.data)).catch(() => {});
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      background: 'var(--bg-surface)',
      border: '1px solid var(--bg-border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      marginBottom: '1.5rem',
    }}>
      <StatItem label="TOTAL IMAGES"   value={stats?.total_images}   />
      <StatItem label="PROCESSED"      value={stats?.processed}      color="var(--green)" />
      <StatItem label="PENDING"        value={stats?.pending}        color="var(--amber)" />
      <StatItem label="FAILED"         value={stats?.failed}         color="var(--red)"   />
      <StatItem label="FACES DETECTED" value={stats?.total_faces}    color="var(--cyan)"  />
      <StatItem label="CLUSTERS"       value={stats?.total_clusters} color="var(--cyan)"  />
    </div>
  );
}
