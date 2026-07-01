import * as React from 'react';
import { SPFI } from '@pnp/sp';
import { ITimbit, FORMAT_LABELS } from '../../models/ITimbit';
import { getLatestWeekTimBits } from '../../services/TimbitService';

interface ITimbitEmailPreviewProps {
  sp: SPFI;
  distributionList: string;
}

function buildEmailHtml(entries: ITimbit[]): string {
  const items = entries.map(e => `
    <tr>
      <td style="padding:0 0 32px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-bottom:6px;">
              <span style="font-family:'IBM Plex Mono',Courier,monospace;font-size:11px;font-weight:700;color:#627282;letter-spacing:0.08em;text-transform:uppercase;">${e.date} &nbsp;·&nbsp; ${FORMAT_LABELS[e.format] || e.format}</span>
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

      <!-- HEADER -->
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

      <!-- BODY -->
      <tr>
        <td style="background:#ffffff;padding:32px 32px 0 32px;border-left:1px solid #d1d9e0;border-right:1px solid #d1d9e0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${items}
          </table>
        </td>
      </tr>

      <!-- FOOTER -->
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

const TimbitEmailPreview: React.FC<ITimbitEmailPreviewProps> = ({ sp, distributionList }) => {
  const [entries, setEntries] = React.useState<ITimbit[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [htmlOutput, setHtmlOutput] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [copiedHtml, setCopiedHtml] = React.useState(false);
  React.useEffect(() => {
    getLatestWeekTimBits(sp).then(data => {
      setEntries(data);
      setHtmlOutput(buildEmailHtml(data));
      setLoading(false);
    });
  }, [sp]);

  const copyHtml = () => {
    navigator.clipboard.writeText(htmlOutput).then(() => {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    });
  };

  const copyTo = () => {
    navigator.clipboard.writeText(distributionList).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#627282' }}>Loading latest entries…</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px 64px', fontFamily: "'IBM Plex Sans',sans-serif" }}>

      {/* INFO BAR */}
      <div style={{ background: '#1a2332', borderRadius: 6, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700, color: '#a0b4c8', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
          This week: <strong style={{ color: '#01a982' }}>{entries.length}</strong> {entries.length === 1 ? 'entry' : 'entries'}
          {entries[0] && <span style={{ color: '#627282', fontWeight: 400 }}> &nbsp;·&nbsp; Week of {entries[0].weekOf}</span>}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          {distributionList && (
            <button onClick={copyTo} style={{ ...actionBtn, background: copiedHtml ? '#006b52' : '#3a4a5c' }}>
              {copied ? '✓ Copied!' : `Copy To: ${distributionList}`}
            </button>
          )}
          <button onClick={copyHtml} style={{ ...actionBtn, background: copiedHtml ? '#006b52' : '#01a982' }}>
            {copiedHtml ? '✓ Copied!' : 'Copy Email HTML'}
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #d1d9e0', borderRadius: 6, padding: 48, textAlign: 'center', color: '#627282' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>📭</div>
          <p>No published entries found. Publish some entries first.</p>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 13, color: '#627282', marginBottom: 12 }}>
            Preview below. Click <strong>Copy Email HTML</strong>, then paste into Outlook using <strong>Paste Special → HTML</strong> (or paste into a new email body in Outlook on the web).
          </p>
          <iframe
            title="Email Preview"
            srcDoc={htmlOutput}
            style={{ width: '100%', height: 600, border: '2px solid #d1d9e0', borderRadius: 6, background: '#fff' }}
          />
          <div style={{ marginTop: 12 }}>
            <details>
              <summary style={{ fontSize: 12, color: '#627282', cursor: 'pointer', fontFamily: "'IBM Plex Mono',monospace" }}>Show raw HTML</summary>
              <textarea readOnly value={htmlOutput} style={{ width: '100%', height: 200, fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, marginTop: 8, border: '1px solid #d1d9e0', borderRadius: 4, padding: 10, boxSizing: 'border-box' }} />
            </details>
          </div>
        </>
      )}
    </div>
  );
};

const actionBtn: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 700, padding: '8px 16px',
  borderRadius: 4, border: 'none', color: '#fff', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em'
};

export default TimbitEmailPreview;
