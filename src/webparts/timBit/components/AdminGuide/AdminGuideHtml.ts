export const ADMIN_GUIDE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Tim·bit Admin Guide</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f2f5; color: #1a2332; font-size: 14px; line-height: 1.6; }
  .top-bar { background: #1a2332; padding: 14px 24px; display: flex; align-items: center; gap: 12px; }
  .top-bar .logo { font-family: 'Courier New', monospace; font-size: 18px; font-weight: 700; color: #01a982; }
  .top-bar .sub  { font-family: 'Courier New', monospace; font-size: 12px; color: #627282; margin-left: 6px; }
  .top-bar .badge { margin-left: auto; font-family: 'Courier New', monospace; font-size: 11px; color: #a0b4c8; background: #0d1620; padding: 4px 10px; border-radius: 3px; }
  .layout { display: flex; min-height: 100vh; }
  .sidebar { width: 200px; background: #fff; border-right: 2px solid #d1d9e0; padding: 20px 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
  .sidebar h3 { font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700; color: #627282; text-transform: uppercase; letter-spacing: 0.10em; padding: 0 16px 8px; border-bottom: 1px solid #e0e6ec; margin-bottom: 8px; }
  .sidebar a { display: block; padding: 6px 16px; font-size: 12px; color: #2a3a4a; text-decoration: none; border-left: 3px solid transparent; }
  .sidebar a:hover { background: #f0f2f5; border-left-color: #01a982; color: #01a982; }
  .sidebar .gap { height: 12px; }
  .content { flex: 1; padding: 28px 36px 80px; }
  h1 { font-size: 22px; font-weight: 700; color: #1a2332; margin-bottom: 4px; }
  h2 { font-size: 16px; font-weight: 700; color: #1a2332; margin: 36px 0 10px; padding-bottom: 8px; border-bottom: 2px solid #01a982; }
  h3 { font-size: 13px; font-weight: 700; color: #1a2332; margin: 20px 0 6px; }
  p  { margin-bottom: 10px; color: #2a3a4a; font-size: 13px; }
  ul, ol { margin: 0 0 12px 18px; color: #2a3a4a; font-size: 13px; }
  li { margin-bottom: 4px; }
  code { font-family: 'Courier New', monospace; font-size: 11px; background: #f0f2f5; border: 1px solid #d1d9e0; border-radius: 3px; padding: 1px 5px; }
  .intro { background: #1a2332; color: #a0b4c8; border-radius: 6px; padding: 14px 18px; margin-bottom: 28px; font-size: 13px; line-height: 1.7; }
  .intro strong { color: #01a982; }
  .shot { background: #fff; border: 2px dashed #b0c0d0; border-radius: 6px; padding: 28px 16px; text-align: center; margin: 12px 0 20px; color: #8a9bb0; }
  .shot .icon { font-size: 28px; margin-bottom: 6px; }
  .shot .lbl { font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
  .shot .desc { font-size: 12px; margin-top: 3px; }
  .step { display: flex; gap: 12px; margin-bottom: 10px; align-items: flex-start; }
  .step-n { min-width: 24px; height: 24px; background: #01a982; color: #fff; border-radius: 50%; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .note { background: #fff8e0; border-left: 4px solid #e0c060; border-radius: 0 4px 4px 0; padding: 9px 12px; margin: 10px 0 18px; font-size: 12px; color: #5a4000; }
  .tip  { background: #f0faf6; border-left: 4px solid #01a982; border-radius: 0 4px 4px 0; padding: 9px 12px; margin: 10px 0 18px; font-size: 12px; color: #004030; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 20px; font-size: 12px; }
  th { background: #1a2332; color: #fff; padding: 7px 10px; text-align: left; font-family: 'Courier New', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; }
  td { padding: 7px 10px; border-bottom: 1px solid #e0e6ec; vertical-align: top; }
  tr:nth-child(even) td { background: #f8f9fb; }
  .req { color: #a00000; font-weight: 700; }
  .tag { display: inline-block; font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 2px; text-transform: uppercase; margin: 2px; background: #e8fff4; color: #006040; border: 1px solid #80d4b0; }
  hr { border: none; border-top: 1px solid #d1d9e0; margin: 28px 0; }
  .foot { font-family: 'Courier New', monospace; font-size: 10px; color: #8a9bb0; margin-top: 40px; padding-top: 12px; border-top: 1px solid #d1d9e0; }
</style>
</head>
<body>
<div class="top-bar">
  <span class="logo">Tim·bit</span>
  <span class="sub">/ HPE Networking — Admin Guide</span>
  <span class="badge">Admins Only</span>
</div>
<div class="layout">
  <nav class="sidebar">
    <h3>Contents</h3>
    <a href="#overview">Overview</a>
    <a href="#access">Admin Access</a>
    <div class="gap"></div>
    <h3>Weekly Workflow</h3>
    <a href="#add">Adding an Entry</a>
    <a href="#publish">Publishing</a>
    <a href="#email">Generating Email</a>
    <a href="#send">Sending Email</a>
    <div class="gap"></div>
    <h3>Tools</h3>
    <a href="#import">Import History</a>
    <a href="#pane">Property Pane</a>
    <div class="gap"></div>
    <h3>Reference</h3>
    <a href="#fields">Field Reference</a>
    <a href="#cats">Categories</a>
    <a href="#formats">Formats</a>
    <a href="#trouble">Troubleshooting</a>
  </nav>
  <main class="content">

    <h1>Tim·bit History — Admin Guide</h1>
    <p style="color:#627282;margin-bottom:18px;font-size:12px;">Last updated: July 2026 &nbsp;·&nbsp; Questions? Contact Dennis Dodd</p>

    <div class="intro">
      <strong>What is Tim·bit?</strong> A weekly HPE Networking sales enablement archive maintained by Tim Vanevenhoven. Each week Tim publishes 2–3 bite-sized resources — videos, case studies, blog posts, solutions — that SEs and TMs can share with customers. As an admin, your job is to add those entries, publish them, and send the weekly email.
    </div>

    <h2 id="overview">Overview</h2>
    <p>The Tim·bit History web part lives on the <strong>EnterpriseSalesTeamHome</strong> SharePoint site. It has two views:</p>
    <ul>
      <li><strong>Public archive</strong> — visible to all site members; shows published entries with a "This Week" highlight section at top, search, and filters</li>
      <li><strong>Admin view</strong> — only visible to users in the Admin Emails property; adds a dark nav bar with Add/Edit Entries, Generate Email, Import History, and Admin Guide tabs</li>
    </ul>

    <div class="shot"><div class="icon">🖼️</div><div class="lbl">Screenshot placeholder</div><div class="desc">Full page showing the public archive with "This Week" section highlighted at top</div></div>

    <h2 id="access">Admin Access</h2>
    <p>Admin access is controlled by the <strong>Admin Emails</strong> field in the web part property pane.</p>
    <div class="step"><div class="step-n">1</div><div>Navigate to the Tim-Bits page on EnterpriseSalesTeamHome</div></div>
    <div class="step"><div class="step-n">2</div><div>Click <strong>Edit</strong> on the page (top right)</div></div>
    <div class="step"><div class="step-n">3</div><div>Click the web part → click the two parallel lines icon to open the property pane</div></div>
    <div class="step"><div class="step-n">4</div><div>Under <strong>Admin Access</strong>, add the email address (comma-separated)</div></div>
    <div class="step"><div class="step-n">5</div><div>Click <strong>Republish</strong></div></div>
    <div class="note">Admin emails must match the user's HPE login email exactly (not case-sensitive).</div>

    <h2 id="add">Adding an Entry</h2>
    <p>Click <strong>Add / Edit Entries</strong> in the admin nav bar to open the entry form.</p>
    <div class="shot"><div class="icon">🖼️</div><div class="lbl">Screenshot placeholder</div><div class="desc">Add/Edit Entries tab showing the entry form</div></div>
    <table>
      <thead><tr><th>Field</th><th>Required</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td><strong>Title</strong></td><td class="req">Yes</td><td>Short headline for the Tim·bit</td></tr>
        <tr><td><strong>Date</strong></td><td class="req">Yes</td><td>YYYY/MM/DD — date the resource was published</td></tr>
        <tr><td><strong>Week Of</strong></td><td class="req">Yes</td><td>YYYY/MM/DD of the Monday of the week — groups entries for the weekly email</td></tr>
        <tr><td><strong>Format</strong></td><td class="req">Yes</td><td>Type of resource — see Formats section</td></tr>
        <tr><td><strong>Categories</strong></td><td class="req">Yes</td><td>One or more vertical/topic tags — see Categories section</td></tr>
        <tr><td><strong>Body</strong></td><td class="req">Yes</td><td>2–4 sentence summary focused on the sales angle</td></tr>
        <tr><td><strong>Link</strong></td><td class="req">Yes</td><td>Full URL to the resource</td></tr>
        <tr><td><strong>Keywords</strong></td><td>No</td><td>Space-separated search terms (partner names, product codes, acronyms)</td></tr>
        <tr><td><strong>Published</strong></td><td>—</td><td>Toggle On to make visible to all users; Off saves as draft</td></tr>
      </tbody>
    </table>
    <div class="tip">Keep the Body field focused on <em>why</em> an SE would share this with a customer. What problem does it solve?</div>

    <h2 id="publish">Publishing Entries</h2>
    <p>New entries are saved as <strong>drafts</strong> by default. Drafts show a yellow "Draft" badge to admins but are hidden from regular users.</p>
    <p>To publish: open the entry in <strong>Add / Edit Entries</strong>, toggle <strong>Published</strong> to On, click Save. The entry immediately appears in the public archive.</p>
    <div class="note">The "This Week" highlighted section at the top of the archive automatically shows all entries from the most recent <strong>Week Of</strong> date. Make sure all entries for the week share the same Week Of value.</div>

    <h2 id="email">Generating the Weekly Email</h2>
    <p>Click <strong>Generate Email</strong> in the admin nav bar. The tab loads all published entries from the latest Week Of date and renders a preview of the formatted HTML email.</p>
    <div class="shot"><div class="icon">🖼️</div><div class="lbl">Screenshot placeholder</div><div class="desc">Generate Email tab showing compose fields and email preview below</div></div>
    <p>The compose fields are pre-filled:</p>
    <ul>
      <li><strong>To</strong> — distribution list email (set in property pane)</li>
      <li><strong>CC</strong> — optional, blank by default</li>
      <li><strong>BCC</strong> — Tim typically puts the DL here and himself in To: to suppress recipient visibility</li>
      <li><strong>Subject</strong> — auto-generated as <code>Tim·bit — Week of YYYY/MM/DD</code></li>
    </ul>

    <h2 id="send">Sending the Weekly Email</h2>
    <div class="step"><div class="step-n">1</div><div>Confirm the correct entries appear in the preview (current week only)</div></div>
    <div class="step"><div class="step-n">2</div><div>Verify the <strong>To</strong> or <strong>BCC</strong> field has the distribution list address</div></div>
    <div class="step"><div class="step-n">3</div><div>Click <strong>✉ Send</strong> — you will see "Email queued — it will be sent shortly!"</div></div>
    <div class="step"><div class="step-n">4</div><div>Email is delivered within 1–2 minutes via Power Automate</div></div>
    <div class="tip">How it works: Send writes the email details to a SharePoint list (TimBitEmailQueue). The Power Automate flow "HPEN Tim·bit — Send Weekly Email" watches that list and sends the formatted HTML email automatically.</div>
    <div class="shot"><div class="icon">🖼️</div><div class="lbl">Screenshot placeholder</div><div class="desc">Generate Email tab after clicking Send — "Email queued" confirmation</div></div>

    <h2 id="import">Import History</h2>
    <p>The <strong>Import History</strong> tab bulk-imports entries from the standalone HTML Tim·bit history file. Primarily used for one-time migration — unlikely to be needed again after initial setup.</p>
    <div class="step"><div class="step-n">1</div><div>Open <code>timbit-history.html</code> in a text editor</div></div>
    <div class="step"><div class="step-n">2</div><div>Find <code>const entries = [</code> and copy everything from the first <code>{</code> to the last <code>}</code></div></div>
    <div class="step"><div class="step-n">3</div><div>Paste into the text area and click <strong>Preview</strong></div></div>
    <div class="step"><div class="step-n">4</div><div>Click <strong>Import</strong> — entries already in the system (matched by title) are skipped automatically</div></div>

    <h2 id="pane">Property Pane Settings</h2>
    <p>Access via page Edit mode → click web part → two parallel lines icon.</p>
    <table>
      <thead><tr><th>Setting</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><strong>Admin Emails</strong></td><td>Comma-separated HPE emails with admin access</td></tr>
        <tr><td><strong>Distribution List Email</strong></td><td>Pre-populates the To field in Generate Email; Tim's PDL address</td></tr>
      </tbody>
    </table>

    <hr>

    <h2 id="fields">Field Reference</h2>
    <h3 id="cats">Categories</h3>
    <p>Select all that apply. Used for filtering in the archive.</p>
    <div style="margin-bottom:14px;">
      <span class="tag">AI</span><span class="tag">WiFi</span><span class="tag">IoT</span><span class="tag">Security</span><span class="tag">SASE</span><span class="tag">5G</span><span class="tag">Campus</span><span class="tag">Datacenter</span><span class="tag">Location</span><span class="tag">Partner</span><span class="tag">Retail</span><span class="tag">Healthcare</span><span class="tag">Hospitality</span><span class="tag">Education</span><span class="tag">Manufacturing</span>
    </div>

    <h3 id="formats">Formats</h3>
    <table>
      <thead><tr><th>Value</th><th>Label</th><th>When to use</th></tr></thead>
      <tbody>
        <tr><td><code>solution</code></td><td>Solution Brief</td><td>Product overviews, data sheets</td></tr>
        <tr><td><code>video</code></td><td>Video</td><td>Demo videos, product walkthroughs, webinar recordings</td></tr>
        <tr><td><code>blog</code></td><td>Blog / Article</td><td>Written articles, thought leadership, how-to posts</td></tr>
        <tr><td><code>case-study</code></td><td>Case Study</td><td>Customer win stories, deployment examples</td></tr>
        <tr><td><code>infographic</code></td><td>Infographic</td><td>Visual one-pagers, comparison charts</td></tr>
        <tr><td><code>ebook</code></td><td>eBook / Guide</td><td>Long-form guides, whitepapers, playbooks</td></tr>
        <tr><td><code>webinar</code></td><td>Webinar</td><td>Upcoming or recorded live sessions</td></tr>
        <tr><td><code>audio</code></td><td>Podcast / Audio</td><td>Podcast episodes, audio content</td></tr>
      </tbody>
    </table>

    <h2 id="trouble">Troubleshooting</h2>
    <h3>Changes not showing after save</h3>
    <p>Hard refresh: <code>Ctrl+Shift+Delete</code> → clear cached images and files → <code>Ctrl+Shift+R</code>.</p>
    <h3>Email preview shows "No published entries found"</h3>
    <p>Make sure at least one entry for the current week is published and that all entries share the same <strong>Week Of</strong> date.</p>
    <h3>"Failed to queue email" error on Send</h3>
    <p>Check that the flow <strong>HPEN Tim·bit — Send Weekly Email</strong> is turned On in Power Automate (flow.microsoft.com).</p>
    <h3>Admin nav bar not visible</h3>
    <p>Your email is not in the Admin Emails property pane field. Ask an existing admin to add you.</p>
    <h3>Entry appears in archive but not in "This Week" section</h3>
    <p>The <strong>Week Of</strong> field on the entry doesn't match the most recent week. Update it to match the other entries for the week.</p>

    <div class="foot">Tim·bit History SPFx v1.0.6.0 &nbsp;·&nbsp; Developed by Dennis Dodd &nbsp;·&nbsp; HPE Networking Sales Engineering — TOLA SEM</div>
  </main>
</div>
</body>
</html>`;
