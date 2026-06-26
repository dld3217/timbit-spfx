import * as React from 'react';
import { SPFI } from '@pnp/sp';
import { ITimbit, ALL_CATEGORIES, ALL_FORMATS, FORMAT_LABELS } from '../../models/ITimbit';
import { createTimBit, updateTimBit, deleteTimBit } from '../../services/TimbitService';

interface ITimbitAdminProps {
  sp: SPFI;
  entries: ITimbit[];
  onSaved: () => void;
}

const EMPTY_FORM = (): Omit<ITimbit, 'id'> => ({
  title: '', date: '', weekOf: '', body: '', link: '',
  format: 'solution', categories: [], keywords: '', published: false
});

function getMondayOf(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().substring(0, 10).replace(/-/g, '/');
}

const TimbitAdmin: React.FC<ITimbitAdminProps> = ({ sp, entries, onSaved }) => {
  const [form, setForm] = React.useState<Omit<ITimbit, 'id'>>(EMPTY_FORM());
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  const set = (field: keyof Omit<ITimbit, 'id'>, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const toggleCat = (cat: string) => {
    set('categories', form.categories.includes(cat)
      ? form.categories.filter(c => c !== cat)
      : [...form.categories, cat]);
  };

  const handleDateChange = (val: string) => {
    set('date', val.replace(/-/g, '/'));
    set('weekOf', getMondayOf(val));
  };

  const handleEdit = (entry: ITimbit) => {
    setEditingId(entry.id);
    setForm({ title: entry.title, date: entry.date, weekOf: entry.weekOf, body: entry.body, link: entry.link, format: entry.format, categories: [...entry.categories], keywords: entry.keywords, published: entry.published });
    setError(''); setSuccessMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(EMPTY_FORM());
    setError(''); setSuccessMsg('');
  };

  const handleSave = async (publish: boolean) => {
    const errors: string[] = [];
    if (!form.title.trim()) errors.push('Title required');
    if (!form.date.trim()) errors.push('Date required');
    if (!form.body.trim()) errors.push('Body required');
    if (!form.link.trim()) errors.push('Link required');
    if (form.categories.length === 0) errors.push('At least one category required');
    if (errors.length > 0) { setError(errors.join(' · ')); return; }

    setSaving(true); setError(''); setSuccessMsg('');
    try {
      const data = { ...form, published: publish };
      if (editingId !== null) {
        await updateTimBit(sp, editingId, data);
      } else {
        await createTimBit(sp, data);
      }
      setSuccessMsg(publish ? 'Entry published!' : 'Draft saved.');
      setEditingId(null);
      setForm(EMPTY_FORM());
      onSaved();
    } catch (e: any) {
      setError('Save failed: ' + (e.message || String(e)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteTimBit(sp, id);
      onSaved();
    } catch (e: any) {
      alert('Delete failed: ' + (e.message || String(e)));
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 24px 64px', fontFamily: "'IBM Plex Sans',sans-serif" }}>

      {/* FORM */}
      <div style={{ background: '#fff', border: '1px solid #d1d9e0', borderRadius: 6, padding: '28px 32px', marginBottom: 24 }}>
        <div style={sectionLabel}>{editingId ? 'Edit Entry' : 'New Entry'}</div>

        {error && <div style={{ background: '#fff0f0', border: '2px solid #f0a0a0', borderRadius: 4, color: '#a00000', fontSize: 13, fontWeight: 600, padding: '10px 14px', marginBottom: 16 }}>{error}</div>}
        {successMsg && <div style={{ background: '#e8fff4', border: '2px solid #80d4b0', borderRadius: 4, color: '#006040', fontSize: 13, fontWeight: 600, padding: '10px 14px', marginBottom: 16 }}>{successMsg}</div>}

        <Field label="Date">
          <input type="date" style={inputStyle} onChange={e => handleDateChange(e.target.value)} value={form.date.replace(/\//g, '-')} />
        </Field>
        <Field label="Title">
          <input type="text" style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Tim·bit title" />
        </Field>
        <Field label="Body">
          <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} value={form.body} onChange={e => set('body', e.target.value)} placeholder="Summary paragraph…" />
        </Field>
        <Field label="Link">
          <input type="url" style={inputStyle} value={form.link} onChange={e => set('link', e.target.value)} placeholder="https://…" />
        </Field>
        <Field label="Keywords">
          <input type="text" style={inputStyle} value={form.keywords} onChange={e => set('keywords', e.target.value)} placeholder="space-separated search terms" />
        </Field>

        <Field label="Format">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_FORMATS.map(f => (
              <button key={f} onClick={() => set('format', f)} style={{
                ...chipStyle,
                background: form.format === f ? '#1a2332' : '#fff',
                border: `2px solid ${form.format === f ? '#1a2332' : '#d1d9e0'}`,
                color: form.format === f ? '#fff' : '#627282'
              }}>{FORMAT_LABELS[f]}</button>
            ))}
          </div>
        </Field>

        <Field label="Categories (pick all that apply)">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => toggleCat(cat)} style={{
                ...chipStyle,
                background: form.categories.includes(cat) ? '#01a982' : '#fff',
                border: `2px solid ${form.categories.includes(cat) ? '#01a982' : '#1a2332'}`,
                color: form.categories.includes(cat) ? '#fff' : '#1a2332'
              }}>{cat}</button>
            ))}
          </div>
        </Field>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button disabled={saving} onClick={() => handleSave(false)} style={{ ...btnStyle, background: '#627282', border: 'none' }}>
            {saving ? 'Saving…' : 'Save as Draft'}
          </button>
          <button disabled={saving} onClick={() => handleSave(true)} style={{ ...btnStyle, background: '#01a982', border: 'none' }}>
            {saving ? 'Publishing…' : '✓ Publish'}
          </button>
          {editingId !== null && (
            <button onClick={handleCancel} style={{ ...btnStyle, background: '#fff', border: '2px solid #d1d9e0', color: '#1a2332' }}>Cancel</button>
          )}
        </div>
      </div>

      {/* ENTRY LIST */}
      <div style={{ background: '#fff', border: '1px solid #d1d9e0', borderRadius: 6, padding: '28px 32px' }}>
        <div style={sectionLabel}>All Entries ({entries.length})</div>
        {entries.length === 0 ? (
          <p style={{ color: '#627282', fontSize: 14 }}>No entries yet.</p>
        ) : entries.map(entry => (
          <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid #f0f2f5' }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#627282', minWidth: 80 }}>{entry.date}</span>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#1a2332' }}>{entry.title}</span>
            {!entry.published && (
              <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", background: '#fff8e0', color: '#7a5000', border: '1px solid #e0c060', borderRadius: 2, padding: '2px 6px', textTransform: 'uppercase' }}>Draft</span>
            )}
            <button onClick={() => handleEdit(entry)} style={{ ...smallBtn, background: '#e8f4ff', color: '#0055a0', border: '1px solid #99c4f0' }}>Edit</button>
            <button onClick={() => handleDelete(entry.id, entry.title)} style={{ ...smallBtn, background: '#fff0f0', color: '#a00000', border: '1px solid #f0a0a0' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1a2332', marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

const sectionLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.10em', color: '#627282', marginBottom: 18, paddingBottom: 10, borderBottom: '2px solid #f0f2f5'
};

const inputStyle: React.CSSProperties = {
  width: '100%', border: '2px solid #d1d9e0', borderRadius: 4, fontFamily: "'IBM Plex Sans',sans-serif",
  fontSize: 14, color: '#1a2332', padding: '9px 12px', outline: 'none', boxSizing: 'border-box'
};

const chipStyle: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700, padding: '5px 11px',
  borderRadius: 3, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em'
};

const btnStyle: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 700, padding: '10px 20px',
  borderRadius: 4, cursor: 'pointer', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em'
};

const smallBtn: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700, padding: '4px 10px',
  borderRadius: 3, cursor: 'pointer', textTransform: 'uppercase'
};

export default TimbitAdmin;
