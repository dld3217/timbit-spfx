import * as React from 'react';
import { SPFI } from '@pnp/sp';
import { ITimbit, FORMAT_LABELS } from '../../models/ITimbit';
import { getLatestWeekTimBits } from '../../services/TimbitService';

interface ITimbitEmailPreviewProps {
  sp: SPFI;
  distributionList: string;
  sendFlowUrl: string;
}

function buildEmailHtml(entries: ITimbit[]): string {
  const items = entries.map(e => `
    <tr>
      <td style="padding:0 0 32px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-bottom:6px;">
              <span style="font-family:'IBM Plex Mono',Courier,monospace;font-size:13px;font-weight:700;color:#2a3a4a;letter-spacing:0.08em;text-transform:uppercase;">${e.date} &nbsp;·&nbsp; ${FORMAT_LABELS[e.format] || e.format}</span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:10px;">
              <span style="font-family:'IBM Plex Sans',Arial,sans-serif;font-size:17px;font-weight:700;color:#1a2332;line-height:1.3;">${e.title}</span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:14px;">
              <span style="font-family:'IBM Plex Sans',Arial,sans-serif;font-size:14px;color:#2a3a4a;line-height:1.65;">${e.body}</span>
            </td>
          </tr>
          <tr>
            <td>
              <a href="${e.link}" style="display:inline-block;background:#01a982;color:#ffffff;font-family:'IBM Plex Mono',Courier,monospace;font-size:12px;font-weight:700;text-decoration:none;padding:9px 18px;border-radius:4px;letter-spacing:0.06em;text-transform:uppercase;">View Resource ↗</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr><td style="border-bottom:1px solid #e0e6ec;padding-bottom:32px;"></td></tr>
    <tr><td style="padding-top:0;"></td></tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:'IBM Plex Sans',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f2f5;">
  <tr><td align="center" style="padding:32px 16px;">
    <table width="620" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;width:100%;">
      <tr>
        <td style="background:#1a2332;border-radius:6px 6px 0 0;padding:24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <span style="font-family:'IBM Plex Mono',Courier,monospace;font-size:22px;font-weight:700;color:#01a982;letter-spacing:-0.5px;">Tim·bit</span>
                <span style="font-family:'IBM Plex Mono',Courier,monospace;font-size:22px;font-weight:400;color:#627282;"> / HPE Networking</span>
              </td>
            </tr>
            <tr>
              <td style="padding-top:6px;">
                <span style="font-family:'IBM Plex Sans',Arial,sans-serif;font-size:12px;color:#a0b4c8;font-style:italic;">a small and particularly interesting item of information — for HPE Networking sales</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background:#ffffff;padding:32px 32px 0 32px;border-left:1px solid #d1d9e0;border-right:1px solid #d1d9e0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${items}
          </table>
        </td>
      </tr>
      <tr>
        <td style="background:#ffffff;border:1px solid #d1d9e0;border-top:none;border-radius:0 0 6px 6px;padding:20px 32px;text-align:center;">
          <span style="font-family:'IBM Plex Mono',Courier,monospace;font-size:11px;color:#8a9bb0;">HPE Networking Sales — Business Development Team &nbsp;·&nbsp; For sales partnership questions, contact the BD team</span>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

const fieldLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.06em', color: '#627282',
  marginBottom: 4, display: 'block'
};
const fieldInput: React.CSSProperties = {
  width: '100%', border: '1px solid #d1d9e0', borderRadius: 4,
  fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 13, color: '#1a2332',
  padding: '8px 10px', boxSizing: 'border-box'
};

const TimbitEmailPreview: React.FC<ITimbitEmailPreviewProps> = ({ sp, distributionList, sendFlowUrl }) => {
  const [entries, setEntries]   = React.useState<ITimbit[]>([]);
  const [loading, setLoading]   = React.useState(true);
  const [htmlOutput, setHtmlOutput] = React.useState('');
  const [to, setTo]             = React.useState('');
  const [cc, setCc]             = React.useState('');
  const [subject, setSubject]   = React.useState('');
  const [sending, setSending]   = React.useState(false);
  const [sendMsg, setSendMsg]   = React.useState('');

  React.useEffect(() => {
    getLatestWeekTimBits(sp).then(data => {
      setEntries(data);
      setHtmlOutput(buildEmailHtml(data));
      setTo(distributionList || '');
      setSubject(data[0] ? `Tim·bit — Week of ${data[0].weekOf}` : 'Tim·bit — HPE Networking');
      setLoading(false);
    });
  }, [sp, distributionList]);

  const handleSend = async (): Promise<void> => {
    if (!sendFlowUrl) { setSendMsg('No flow URL configured — add it in the web part property pane.'); return; }
    if (!to.trim())   { setSendMsg('Please enter a To address.'); return; }
    setSending(true); setSendMsg('');
    try {
      const resp = await fetch(sendFlowUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: to.trim(), cc: cc.trim(), subject: subject.trim(), body: htmlOutput })
      });
      if (resp.ok || resp.status === 202) {
        setSendMsg('Email sent successfully!');
      } else {
        setSendMsg(`Send failed (${resp.status}). Check the flow URL.`);
      }
    } catch (e) {
      setSendMsg('Send failed: ' + String(e));
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#627282' }}>Loading latest entries…</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px 64px', fontFamily: "'IBM Plex Sans',sans-serif" }}>

      {/* COMPOSE HEADER */}
      <div style={{ background: '#fff', border: '1px solid #d1d9e0', borderRadius: 6, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 12 }}>
          <div>
            <label style={fieldLabel}>To</label>
            <input style={fieldInput} value={to} onChange={e => setTo(e.target.value)} placeholder="distribution list or email" />
          </div>
          <div>
            <label style={fieldLabel}>CC</label>
            <input style={fieldInput} value={cc} onChange={e => setCc(e.target.value)} placeholder="optional" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={fieldLabel}>Subject</label>
            <input style={fieldInput} value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleSend}
            disabled={sending}
            style={{
              background: sending ? '#627282' : '#01a982', color: '#fff', border: 'none',
              borderRadius: 4, padding: '10px 28px', fontFamily: "'IBM Plex Mono',monospace",
              fontSize: 13, fontWeight: 700, cursor: sending ? 'default' : 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.06em'
            }}>
            {sending ? 'Sending…' : '✉ Send'}
          </button>
          <span style={{ fontSize: 11, color: '#627282', fontFamily: "'IBM Plex Mono',monospace" }}>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}{entries[0] ? ` · Week of ${entries[0].weekOf}` : ''}
          </span>
          {sendMsg && <span style={{ fontSize: 13, fontWeight: 600, color: sendMsg.includes('success') ? '#01a982' : '#d13438' }}>{sendMsg}</span>}
        </div>
      </div>

      {/* PREVIEW */}
      {entries.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #d1d9e0', borderRadius: 6, padding: 48, textAlign: 'center', color: '#627282' }}>
          <p>No published entries found for the latest week. Publish some entries first.</p>
        </div>
      ) : (
        <iframe
          title="Email Preview"
          srcDoc={htmlOutput}
          style={{ width: '100%', height: 700, border: '1px solid #d1d9e0', borderRadius: 6, background: '#fff' }}
        />
      )}
    </div>
  );
};

export default TimbitEmailPreview;
