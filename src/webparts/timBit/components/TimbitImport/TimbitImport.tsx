import * as React from 'react';
import { SPFI } from '@pnp/sp';
import { createTimBit } from '../../services/TimbitService';
import { TimbitFormat } from '../../models/ITimbit';

interface ITimbitImportProps {
  sp: SPFI;
  existingTitles: Set<string>;
  onDone: () => void;
}

interface IParsedEntry {
  date: string;
  title: string;
  body: string;
  link: string;
  cats: string[];
  format: string;
  keywords: string;
}

function parseEntries(raw: string): IParsedEntry[] {
  const results: IParsedEntry[] = [];
  // Match each { ... } block
  const blockRe = /\{([^{}]+)\}/gs;
  let match: RegExpExecArray | null;
  while ((match = blockRe.exec(raw)) !== null) {
    const block = match[1];
    const get = (key: string): string => {
      const m = block.match(new RegExp(`${key}\\s*:\\s*"([^"]*)"`, 's'));
      return m ? m[1].trim() : '';
    };
    const getArr = (key: string): string[] => {
      const m = block.match(new RegExp(`${key}\\s*:\\s*\\[([^\\]]*)\\]`, 's'));
      if (!m) return [];
      return m[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
    };
    const date = get('date');
    const title = get('title');
    if (!date || !title) continue;
    results.push({
      date,
      title,
      body: get('body'),
      link: get('link'),
      cats: getArr('cats'),
      format: get('format') || 'solution',
      keywords: get('keywords'),
    });
  }
  return results;
}

const TimbitImport: React.FC<ITimbitImportProps> = ({ sp, existingTitles, onDone }) => {
  const [raw, setRaw]           = React.useState('');
  const [parsed, setParsed]     = React.useState<IParsedEntry[]>([]);
  const [parseError, setParseError] = React.useState('');
  const [importing, setImporting]   = React.useState(false);
  const [progress, setProgress]     = React.useState('');
  const [done, setDone]             = React.useState(false);

  const handleParse = (): void => {
    setParseError(''); setParsed([]); setDone(false);
    if (!raw.trim()) { setParseError('Paste the entries array first.'); return; }
    try {
      const entries = parseEntries(raw);
      if (entries.length === 0) { setParseError('No valid entries found — make sure you pasted the full entries array including the { } blocks.'); return; }
      setParsed(entries);
    } catch (e) {
      setParseError('Parse error: ' + String(e));
    }
  };

  const handleImport = async (): Promise<void> => {
    setImporting(true); setDone(false);
    let imported = 0; let skipped = 0;
    for (let i = 0; i < parsed.length; i++) {
      const e = parsed[i];
      setProgress(`Importing ${i + 1} of ${parsed.length}…`);
      if (existingTitles.has(e.title)) { skipped++; continue; }
      try {
        await createTimBit(sp, {
          title: e.title,
          date: e.date,
          weekOf: e.date,
          body: e.body,
          link: e.link,
          format: e.format as TimbitFormat,
          categories: e.cats,
          keywords: e.keywords,
          published: true,
        });
        imported++;
      } catch {
        skipped++;
      }
    }
    setProgress(`Done — ${imported} imported, ${skipped} skipped.`);
    setImporting(false);
    setDone(true);
    onDone();
  };

  const newCount = parsed.filter(e => !existingTitles.has(e.title)).length;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 24px 64px', fontFamily: "'IBM Plex Sans',sans-serif" }}>
      <div style={{ background: '#fff', border: '1px solid #d1d9e0', borderRadius: 6, padding: '28px 32px' }}>
        <div style={sectionLabel}>Bulk Import from History File</div>

        <p style={{ fontSize: 13, color: '#627282', marginBottom: 16 }}>
          Open <strong>timbit-history (9).html</strong> in a text editor, find the <code>const entries = [</code> line,
          and paste everything from the first <code>{'{'}</code> to the last <code>{'}'}</code> below.
        </p>

        <textarea
          rows={12}
          style={{ width: '100%', border: '2px solid #d1d9e0', borderRadius: 4, fontSize: 12, padding: '10px 12px', fontFamily: 'monospace', boxSizing: 'border-box', resize: 'vertical' }}
          placeholder="Paste entries array content here..."
          value={raw}
          onChange={e => { setRaw(e.target.value); setParsed([]); setDone(false); }}
        />

        {parseError && <div style={{ color: '#a00000', fontSize: 13, marginTop: 8 }}>{parseError}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center' }}>
          <button onClick={handleParse} disabled={importing} style={{ ...btnStyle, background: '#1a2332' }}>
            Preview ({parsed.length > 0 ? `${parsed.length} found` : '?'})
          </button>
          {parsed.length > 0 && !done && (
            <button onClick={handleImport} disabled={importing} style={{ ...btnStyle, background: '#01a982' }}>
              {importing ? progress : `Import ${newCount} New Entries`}
            </button>
          )}
          {done && <span style={{ fontSize: 13, color: '#006040', fontWeight: 600 }}>{progress}</span>}
        </div>

        {parsed.length > 0 && (
          <div style={{ marginTop: 20, borderTop: '2px solid #f0f2f5', paddingTop: 16 }}>
            <div style={{ fontSize: 12, color: '#627282', marginBottom: 10 }}>
              <strong>{parsed.length}</strong> entries parsed &nbsp;·&nbsp;
              <strong style={{ color: '#01a982' }}>{newCount}</strong> new &nbsp;·&nbsp;
              <strong style={{ color: '#888' }}>{parsed.length - newCount}</strong> already exist (will skip)
            </div>
            <div style={{ maxHeight: 300, overflowY: 'auto', fontSize: 12, border: '1px solid #eee', borderRadius: 4 }}>
              {parsed.map((e, i) => (
                <div key={i} style={{ padding: '6px 10px', borderBottom: '1px solid #f5f5f5', background: existingTitles.has(e.title) ? '#fafafa' : '#fff', color: existingTitles.has(e.title) ? '#aaa' : '#1a2332' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#627282', marginRight: 10 }}>{e.date}</span>
                  {existingTitles.has(e.title) && <span style={{ fontSize: 10, color: '#aaa', marginRight: 6 }}>[skip]</span>}
                  {e.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const sectionLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.10em', color: '#627282', marginBottom: 18, paddingBottom: 10, borderBottom: '2px solid #f0f2f5'
};

const btnStyle: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 700, padding: '10px 20px',
  borderRadius: 4, cursor: 'pointer', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', border: 'none'
};

export default TimbitImport;
