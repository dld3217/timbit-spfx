import * as React from 'react';
import { SPFI } from '@pnp/sp';
import { ITimbit } from '../models/ITimbit';

import { getPublishedTimBits, getAllTimBits } from '../services/TimbitService';

const VERSION = '1.0.2.0';
import TimbitList from './TimbitList/TimbitList';
import TimbitAdmin from './TimbitAdmin/TimbitAdmin';
import TimbitEmailPreview from './TimbitEmailPreview/TimbitEmailPreview';
import TimbitImport from './TimbitImport/TimbitImport';

export interface ITimBitAppProps {
  sp: SPFI;
  isAdmin: boolean;
  distributionList: string;
}

type View = 'list' | 'admin' | 'email' | 'import';

const TimBitApp: React.FC<ITimBitAppProps> = ({ sp, isAdmin, distributionList }) => {
  const [entries, setEntries] = React.useState<ITimbit[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<View>('list');

  const loadEntries = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = isAdmin ? await getAllTimBits(sp) : await getPublishedTimBits(sp);
      setEntries(data);
    } finally {
      setLoading(false);
    }
  }, [sp, isAdmin]);

  React.useEffect(() => { loadEntries(); }, [loadEntries]);

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", minHeight: 400 }}>
      {isAdmin && (
        <div style={{
          background: '#1a2332',
          padding: '10px 24px',
          display: 'flex',
          gap: 12,
          alignItems: 'center'
        }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            color: '#01a982',
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
            marginRight: 8
          }}>Admin</span>
          <NavBtn active={view === 'list'} onClick={() => setView('list')}>Archive</NavBtn>
          <NavBtn active={view === 'admin'} onClick={() => setView('admin')}>Add / Edit Entries</NavBtn>
          <NavBtn active={view === 'email'} onClick={() => setView('email')}>Generate Email</NavBtn>
          <NavBtn active={view === 'import'} onClick={() => setView('import')}>Import History</NavBtn>
          <span style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 700, color: '#a0b4c8', letterSpacing: '0.08em' }}>v{VERSION}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#627282' }}>Loading…</div>
      ) : view === 'list' ? (
        <TimbitList entries={entries} isAdmin={isAdmin} />
      ) : view === 'admin' ? (
        <TimbitAdmin sp={sp} entries={entries} onSaved={loadEntries} />
      ) : view === 'email' ? (
        <TimbitEmailPreview sp={sp} distributionList={distributionList} />
      ) : (
        <TimbitImport sp={sp} existingTitles={new Set(entries.map(e => e.title))} onDone={loadEntries} />
      )}
    </div>
  );
};

const NavBtn: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    background: active ? '#01a982' : 'transparent',
    border: `2px solid ${active ? '#01a982' : '#3a4a5c'}`,
    borderRadius: 4,
    color: active ? '#fff' : '#a0b4c8',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    fontWeight: 700,
    padding: '6px 14px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    transition: 'all 0.15s'
  }}>{children}</button>
);

export default TimBitApp;


