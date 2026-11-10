// Regenerate every static resume page after editing its canonical Markdown: node resume/build.js
const fs = require('fs');
const path = require('path');
const root = __dirname;

const chatEndpoint = process.env.RESUME_CHAT_ENDPOINT || 'https://chat-backend-iota-pearl.vercel.app/api/chat';
if (chatEndpoint && new URL(chatEndpoint).protocol !== 'https:') {
  throw new Error('RESUME_CHAT_ENDPOINT must use HTTPS');
}
const endpointAttribute = chatEndpoint
  ? ` data-chat-endpoint="${escapeAttribute(chatEndpoint)}"`
  : '';
const pages = [
  { directory: '', fallback: 'letter', prefix: '' },
  { directory: 'agoda', fallback: 'a4', prefix: '../' },
  { directory: 'clickup', fallback: 'letter', prefix: '../' },
  { directory: 'customerio', fallback: 'letter', prefix: '../' },
  { directory: 'grafana', fallback: 'letter', prefix: '../' },
  { directory: 'openai', fallback: 'letter', prefix: '../' },
];

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
function inline(text) {
  const tokens = [];
  const hold = (html) => `\u0000${tokens.push(html) - 1}\u0000`;
  text = text.replace(/\\([\\`*_{}[\]()#+\-.!>])/g, (_, char) => hold(escapeAttribute(char)));
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|tel:[^\s)]+)\)/g,
    (_, label, href) => hold(`<a href="${escapeAttribute(href)}">${inline(label)}</a>`));
  text = escapeAttribute(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>');
  return text.replace(/\u0000(\d+)\u0000/g, (_, index) => tokens[index]);
}
function render(markdown) {
  const out = [];
  let list = null;
  let paragraph = [];
  const flushParagraph = () => {
    if (paragraph.length) out.push(`<p>${inline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (list) out.push(`</${list}>`);
    list = null;
  };
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.trim()) { flushParagraph(); closeList(); continue; }
    const item = /^\s*(?:[-*+]\s+|\d+\.\s+)(.*)$/.exec(line);
    if (item) {
      flushParagraph();
      const type = /^\s*\d+\./.test(line) ? 'ol' : 'ul';
      if (list !== type) { closeList(); out.push(`<${type}>`); list = type; }
      out.push(`<li>${inline(item[1])}</li>`);
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph(); closeList();
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
    } else paragraph.push(line.trim());
  }
  flushParagraph(); closeList();
  return out.join('\n');
}
function build(page) {
  const directory = path.join(root, page.directory);
  const markdownPath = path.join(directory, 'index.md');
  const markdown = fs.readFileSync(markdownPath, 'utf8');
  const markers = [...markdown.matchAll(/^<!--[ \t]*pagebreak[ \t]*-->[ \t]*$/gm)];
  if (markers.length !== 1) throw new Error(`${markdownPath} must contain exactly one standalone <!-- pagebreak --> marker`);
  const marker = markers[0];
  const content = [markdown.slice(0, marker.index), markdown.slice(marker.index + marker[0].length)];
  const name = (/^#\s+(.+)$/m.exec(content[0]) || [null, 'Resume'])[1].trim();
  const role = (/^\*\*(.+?)\*\*$/m.exec(content[0]) || [null, 'Professional Resume'])[1].trim();
  const title = `${name} | ${role} Resume`;
  const description = `${name} — ${role}. Professional experience, technical skills, education, and selected accomplishments.`;
  const sitePath = page.directory ? `/resume/${page.directory}/` : '/resume/';
  const canonical = `https://kmdavis.github.io${sitePath}`;
  const prefix = page.prefix;
  const html = `<!doctype html>
<html lang="en"${endpointAttribute}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeAttribute(title)}</title>
  <meta name="description" content="${escapeAttribute(description)}">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${escapeAttribute(title)}">
  <meta property="og:description" content="${escapeAttribute(description)}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeAttribute(title)}">
  <meta name="twitter:description" content="${escapeAttribute(description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" type="text/markdown" title="Markdown résumé" href="./index.md">
  <link rel="alternate" type="application/pdf" title="PDF résumé" href="./resume.pdf">
  <link rel="describedby" type="text/markdown" href="/resume/llms.txt">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="${prefix}style.css">
  <link rel="stylesheet" href="${prefix}chat.css">
  <script defer src="${prefix}scripts.js"></script>
  <script defer src="${prefix}chat.js"></script>
</head>
<body class="paper-${page.fallback}" data-paper-fallback="${page.fallback}">
  <nav class="resume-controls flex flex-wrap justify-center gap-4 px-4 pt-3 font-sans text-sm font-semibold max-[720px]:justify-start print:hidden" aria-label="Resume formats"><a href="./resume.pdf">Download PDF</a><a href="./index.md">View Markdown</a></nav>
  <main class="sheets flex flex-wrap justify-center gap-6 p-6 print:p-0 print:gap-0" aria-label="Resume" aria-describedby="resume-description">
    <p id="resume-description" class="sr-only">${escapeAttribute(description)}</p>
${content.map((part, i) => `    <article class="sheet" aria-label="Resume page ${i + 1}">\n${render(part)}\n    </article>`).join('\n')}
  </main>
</body>
</html>
`;
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), html);
}
pages.forEach(build);
