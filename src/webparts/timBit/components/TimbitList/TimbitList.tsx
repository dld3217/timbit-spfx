import * as React from 'react';
import { ITimbit, ALL_CATEGORIES, ALL_FORMATS, FORMAT_LABELS } from '../../models/ITimbit';

interface ITimbitListProps {
  entries: ITimbit[];
  isAdmin: boolean;
}

const CAT_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  iot:           { bg: '#e8f4ff', color: '#0055a0', border: '#99c4f0' },
  security:      { bg: '#fff0f0', color: '#a00000', border: '#f0a0a0' },
  retail:        { bg: '#fff8e0', color: '#7a5000', border: '#e0c060' },
  healthcare:    { bg: '#e8fff4', color: '#006040', border: '#80d4b0' },
  hospitality:   { bg: '#f8eeff', color: '#600090', border: '#c890e0' },
  education:     { bg: '#fff4e8', color: '#8a3a00', border: '#e0a870' },
  manufacturing: { bg: '#f0f0ff', color: '#2020a0', border: '#a0a0e0' },
  sase:          { bg: '#fff0f6', color: '#900050', border: '#e890c0' },
  wifi:          { bg: '#e6faff', color: '#005070', border: '#80cce0' },
  location:      { bg: '#fffbe0', color: '#705000', border: '#e0d070' },
  campus:        { bg: '#eefff0', color: '#005020', border: '#80d090' },
  datacenter:    { bg: '#fff4e8', color: '#7a2a00', border: '#e0a070' },
  partner:       { bg: '#f4f4f4', color: '#303030', border: '#b0b0b0' },
  ai:            { bg: '#f2eeff', color: '#380090', border: '#b090e0' },
  '5g':          { bg: '#e6fff8', color: '#005050', border: '#80d4c8' }
};

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((p, i) =>
    regex.test(p) ? <mark key={i} style={{ background: 'rgba(1,169,130,0.20)', color: '#004030', borderRadius: 2, padding: '0 2px' }}>{p}</mark> : p
  );
}

const TimbitList: React.FC<ITimbitListProps> = ({ entries, isAdmin }) => {
  const [search, setSearch] = React.useState('');
  const [yearFrom, setYearFrom] = React.useState('');
  const [yearTo, setYearTo] = React.useState('');
  const [format, setFormat] = React.useState('');
  const [activeCats, setActiveCats] = React.useState<Set<string>>(new Set());
  const [openId, setOpenId] = React.useState<number | null>(null);

  const toggleCat = (cat: string) => {
    setActiveCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const clearAll = () => {
    setSearch(''); setYearFrom(''); setYearTo(''); setFormat(''); setActiveCats(new Set());
  };

  const hasFilters = search || yearFrom || yearTo || format || activeCats.size > 0;

  const filtered = entries.filter(e => {
    if (!isAdmin && !e.published) return false;
    const year = e.date.substring(0, 4);
    if (yearFrom && year < yearFrom) return false;
    if (yearTo && year > yearTo) return false;
    if (format && e.format !== format) return false;
    if (activeCats.size > 0 && !Array.from(activeCats).every((c: string) => e.categories.includes(c))) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !e.title.toLowerCase().includes(q) &&
        !e.body.toLowerCase().includes(q) &&
        !e.keywords.toLowerCase().includes(q) &&
        !e.categories.join(' ').toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const years = ['2018','2019','2020','2021','2022','2023','2024','2025','2026'];

  return (
    <div style={{ background: '#f0f2f5', minHeight: 400 }}>
      {/* FILTER BAR */}
      <div style={{ background: '#fff', borderBottom: '2px solid #d1d9e0', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: '#1a2332', border: '2px solid #1a2332', borderRadius: 6, padding: '10px 16px' }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700, color: '#a0b4c8', textTransform: 'uppercase', letterSpacing: '0.10em', paddingRight: 8, borderRight: '1px solid #3a4a5c' }}>Filters</span>

          {/* SEARCH */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by keyword, partner, topic…"
            style={{ flex: 1, minWidth: 180, maxWidth: 360, background: '#fff', border: '2px solid #3a4a5c', borderRadius: 4, color: '#000', fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 14, padding: '7px 12px', outline: 'none' }}
          />

          <div style={{ width: 1, height: 28, background: '#3a4a5c' }} />

          {/* YEAR */}
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700, color: '#a0b4c8', textTransform: 'uppercase' }}>Year</span>
          <select value={yearFrom} onChange={e => setYearFrom(e.target.value)} style={selectStyle}>
            <option value="">From: All</option>
            {years.map(y => <option key={y} value={y}>From: {y}</option>)}
          </select>
          <span style={{ color: '#a0b4c8', fontWeight: 700 }}>→</span>
          <select value={yearTo} onChange={e => setYearTo(e.target.value)} style={selectStyle}>
            <option value="">To: All</option>
            {years.map(y => <option key={y} value={y}>To: {y}</option>)}
          </select>

          <div style={{ width: 1, height: 28, background: '#3a4a5c' }} />

          {/* FORMAT */}
          <select value={format} onChange={e => setFormat(e.target.value)} style={selectStyle}>
            <option value="">All formats</option>
            {ALL_FORMATS.map(f => <option key={f} value={f}>{FORMAT_LABELS[f]}</option>)}
          </select>

          {/* COUNT */}
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, color: '#a0b4c8', marginLeft: 'auto' }}>
            <strong style={{ color: '#01a982' }}>{filtered.length}</strong> entries
          </span>

          {hasFilters && (
            <button onClick={clearAll} style={{ background: '#c0392b', border: 'none', borderRadius: 4, color: '#fff', fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 13, fontWeight: 700, padding: '8px 14px', cursor: 'pointer' }}>✕ Clear</button>
          )}
        </div>

        {/* CATEGORY CHIPS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 8, background: '#f5f7fa', border: '2px solid #1a2332', borderRadius: 6, padding: '10px 16px' }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700, color: '#1a2332', textTransform: 'uppercase', letterSpacing: '0.10em', paddingRight: 10, borderRight: '2px solid #1a2332', marginRight: 4 }}>Category</span>
          {ALL_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => toggleCat(cat)} style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 3,
              border: `2px solid ${activeCats.has(cat) ? '#01a982' : '#1a2332'}`,
              background: activeCats.has(cat) ? '#01a982' : '#fff',
              color: activeCats.has(cat) ? '#fff' : '#1a2332',
              cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* ENTRY LIST */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 64px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#627282' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📡</div>
            <p>No Tim·bits match your search. Try different keywords or clear the filters.</p>
          </div>
        ) : filtered.map(entry => (
          <div key={entry.id} style={{
            border: `1px solid ${openId === entry.id ? '#01a982' : '#d1d9e0'}`,
            borderRadius: 6, background: '#fff', marginBottom: 10, overflow: 'hidden',
            boxShadow: openId === entry.id ? '0 0 0 1px #01a982, 0 4px 16px rgba(1,169,130,0.10)' : undefined
          }}>
            {/* HEADER ROW */}
            <div onClick={() => setOpenId(openId === entry.id ? null : entry.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', cursor: 'pointer', userSelect: 'none' }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700, color: '#000', whiteSpace: 'nowrap', minWidth: 82 }}>{entry.date}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1a2332', flex: 1 }}>{highlight(entry.title, search)}</span>
              {isAdmin && !entry.published && (
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", background: '#fff8e0', color: '#7a5000', border: '1px solid #e0c060', borderRadius: 2, padding: '2px 6px', textTransform: 'uppercase' }}>Draft</span>
              )}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {entry.categories.map(cat => {
                  const c = CAT_COLORS[cat] || { bg: '#f4f4f4', color: '#303030', border: '#b0b0b0' };
                  return (
                    <span key={cat} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 2, background: c.bg, color: c.color, border: `1px solid ${c.border}`, textTransform: 'uppercase' }}>{cat}</span>
                  );
                })}
              </div>
              <span style={{ color: '#627282', fontSize: 13, marginLeft: 4, transform: openId === entry.id ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▾</span>
            </div>

            {/* BODY */}
            {openId === entry.id && (
              <div style={{ padding: '0 18px 16px', borderTop: '1px solid #e0e6ec' }}>
                <p style={{ fontSize: 13.5, color: '#2a3a4a', lineHeight: 1.65, padding: '14px 0 12px' }}>{highlight(entry.body, search)}</p>
                <a href={entry.link} target="_blank" rel="noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600,
                  color: '#006b52', textDecoration: 'none', border: '1px solid #01a982',
                  borderRadius: 3, padding: '5px 10px'
                }}>↗ View Resource</a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const selectStyle: React.CSSProperties = {
  background: '#fff', border: '2px solid #fff', borderRadius: 4, color: '#000',
  fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 13, fontWeight: 700, padding: '7px 10px', cursor: 'pointer'
};

export default TimbitList;
