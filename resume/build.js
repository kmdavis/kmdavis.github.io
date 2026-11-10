// Regenerate the static pages after editing either Markdown source: node resume/build.js
const fs = require('fs');
const path = require('path');
const root = __dirname;

const chatEndpoint = process.env.RESUME_CHAT_ENDPOINT || 'https://chat-backend-iota-pearl.vercel.app/api/chat';
if (chatEndpoint && new URL(chatEndpoint).protocol !== 'https:') {
  throw new Error('RESUME_CHAT_ENDPOINT must use HTTPS');
}
const endpointAttribute = chatEndpoint
  ? ` data-chat-endpoint="${chatEndpoint.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')}"`
  : '';
function inline(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}
function render(text) {
  let list = false;
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    if (line.startsWith('- ')) {
      if (!list) { out.push('<ul>'); list = true; }
      out.push('<li>' + inline(line.slice(2)) + '</li>');
      continue;
    }
    if (list) { out.push('</ul>'); list = false; }
    const heading = /^(#{1,3}) (.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
    } else out.push('<p>' + inline(line) + '</p>');
  }
  if (list) out.push('</ul>');
  return out.join('\n');
}
function build(source, destination, fallback, prefix) {
  const text = fs.readFileSync(path.join(root, source), 'utf8');
  const split = text.indexOf('### Shopify | Senior Software Engineer');
  if (split < 0) throw new Error('Page break heading missing from ' + source);
  const pages = [text.slice(0, split), text.slice(split)];
  const html = `<!doctype html>
<html lang="en"${endpointAttribute}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Kevan Maxwell Davis | Resume</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="${prefix}style.css">
  <link rel="stylesheet" href="${prefix}chat.css">
  <script defer src="${prefix}scripts.js"></script>
  <script defer src="${prefix}chat.js"></script>
</head>
<body class="paper-${fallback}" data-paper-fallback="${fallback}">
  <main class="sheets flex flex-wrap justify-center gap-6 p-6 print:p-0 print:gap-0" aria-label="Resume">
${pages.map((page, i) => `    <article class="sheet" aria-label="Resume page ${i + 1}">\n${render(page)}\n    </article>`).join('\n')}
  </main>
</body>
</html>
`;
  fs.mkdirSync(path.dirname(path.join(root, destination)), { recursive: true });
  fs.writeFileSync(path.join(root, destination), html);
}
build('kevan_resume_master_v1.md', 'index.html', 'letter', '');
build('kevan_resume_agoda_v1.md', 'agoda/index.html', 'a4', '../');
