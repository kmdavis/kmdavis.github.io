'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const previews = path.join(root, 'previews');
const pages = [
  { route: '/resume/', dir: 'resume', paper: 'letter' },
  ...['agoda', 'clickup', 'customerio', 'grafana', 'hercules', 'linear', 'openai'].map(dir => ({ route: `/resume/${dir}/`, dir: `resume/${dir}`, paper: dir === 'agoda' ? 'a4' : 'letter' }))
];
const forbidden = /\b(?:TODO|TBD|lorem ipsum|placeholder)\b/i;

function mime(file) {
  return ({ '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' })[path.extname(file)] || 'application/octet-stream';
}
function server() {
  return http.createServer((req, res) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
    let target = path.resolve(root, `.${pathname}`);
    if (!target.startsWith(root + path.sep) && target !== root) { res.writeHead(403).end(); return; }
    if (pathname.endsWith('/')) target = path.join(target, 'index.html');
    fs.readFile(target, (error, bytes) => {
      if (error) { res.writeHead(404).end('Not found'); return; }
      res.writeHead(200, { 'content-type': mime(target) }); res.end(bytes);
    });
  });
}

(async () => {
  fs.mkdirSync(previews, { recursive: true });
  const web = server();
  await new Promise(resolve => web.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${web.address().port}`;
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const localLinks = [];
  try {
    for (const item of pages) {
      const htmlPath = path.join(root, item.dir, 'index.html');
      if (!fs.existsSync(htmlPath)) throw new Error(`Missing generated page: ${htmlPath}`);
      const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
      const response = await page.goto(base + item.route, { waitUntil: 'networkidle' });
      if (!response || !response.ok()) throw new Error(`Could not load ${item.route}`);
      const sheets = page.locator('article.sheet');
      if (await sheets.count() !== 2) throw new Error(`${item.route}: expected exactly two sheets`);
      const documentInfo = await page.evaluate(() => {
        const sheets = [...document.querySelectorAll('article.sheet')];
        const links = [...document.querySelectorAll('a[href], link[rel="alternate"], link[rel="describedby"]')].map(a => ({ href: a.href, text: a.innerText || '' }));
        return { title: document.title, canonical: document.querySelector('link[rel="canonical"]')?.href, text: sheets.map(el => el.innerText), headings: sheets.map(el => [...el.querySelectorAll('h1,h2,h3')].map(h => h.innerText)), boxes: sheets.map(el => {
          const r = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return { width: r.width, height: r.height, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, paddingTop: parseFloat(style.paddingTop), paddingRight: parseFloat(style.paddingRight), paddingBottom: parseFloat(style.paddingBottom), paddingLeft: parseFloat(style.paddingLeft) };
        }), links };
      });
      const text = documentInfo.text.join('\n');
      if (!/i\.am\.kevan\.davis@gmail\.com/i.test(text) || !/817[\s.-]*791[\s.-]*3542/.test(text)) throw new Error(`${item.route}: missing expected email or phone contact`);
      if (!text.includes('Denver, Colorado, USA')) throw new Error(`${item.route}: missing Denver location`);
      if (/promotion date|to be confirmed|approximately 2021|approx\.\s*2021/i.test(text)) throw new Error(`${item.route}: internal date note remains`);
      if (documentInfo.canonical !== `https://kmdavis.github.io${item.route}`) throw new Error(`${item.route}: incorrect canonical URL`);
      if (forbidden.test(text)) throw new Error(`${item.route}: editorial placeholder text detected`);
      for (const link of documentInfo.links) {
        const url = new URL(link.href);
        if (url.origin === base) localLinks.push({ route: item.route, url });
      }
      for (const box of documentInfo.boxes) {
        if (box.scrollHeight > box.clientHeight + 1) throw new Error(`${item.route}: content overflows a printable sheet`);
      }
      for (const size of ['letter', 'a4']) {
        await page.evaluate(paper => {
          document.body.classList.remove('paper-letter', 'paper-a4');
          document.body.classList.add(`paper-${paper}`);
          let rule = document.getElementById('verification-paper-size');
          if (!rule) { rule = document.createElement('style'); rule.id = 'verification-paper-size'; document.head.appendChild(rule); }
          rule.textContent = `@page { size: ${paper === 'letter' ? 'letter' : 'A4'}; margin: 0; }`;
        }, size);
        const geometry = await page.locator('article.sheet').evaluateAll(nodes => nodes.map(node => {
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          const children = [...node.children];
          const contentBottom = Math.max(rect.top, ...children.map(child => child.getBoundingClientRect().bottom)) - rect.top;
          return { width: rect.width, height: rect.height, scrollHeight: node.scrollHeight, clientHeight: node.clientHeight, contentBottom, padding: [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft].map(value => parseFloat(value)) };
        }));
        const expected = size === 'letter' ? [816, 1056] : [793.7, 1122.5];
        for (const box of geometry) {
          if (box.scrollHeight > box.clientHeight + 1 || box.contentBottom > box.height - box.padding[2] + 1) throw new Error(`${item.route} (${size}): content exceeds printable area`);
          if (Math.abs(box.width - expected[0]) > 2 || Math.abs(box.height - expected[1]) > 2) throw new Error(`${item.route} (${size}): sheet does not match paper dimensions`);
          if (box.padding.some(value => value < 36)) throw new Error(`${item.route} (${size}): content margin is below 0.375in`);
        }
        const outputPath = path.join(previews, `${item.dir.replaceAll('/', '-')}-${size}.png`);
        await page.screenshot({ path: outputPath, fullPage: true });
        await page.emulateMedia({ media: 'print' });
        const visibleControls = await page.locator('.resume-chat, .resume-back-to-top, .resume-controls, button, textarea, input').evaluateAll(nodes => nodes.filter(node => {
          const style = getComputedStyle(node);
          return style.display !== 'none' && style.visibility !== 'hidden' && node.getClientRects().length > 0;
        }).map(node => node.className || node.tagName));
        if (visibleControls.length) throw new Error(`${item.route} (${size}): print controls remain visible (${visibleControls.join(', ')})`);
        const pdf = await page.pdf({ format: size === 'letter' ? 'Letter' : 'A4', printBackground: true, preferCSSPageSize: false, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
        await page.emulateMedia({ media: 'screen' });
        const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const doc = await getDocument({ data: new Uint8Array(pdf), useSystemFonts: true }).promise;
        if (doc.numPages !== 2) throw new Error(`${item.route} (${size}): generated PDF has ${doc.numPages} pages, expected 2`);
        const extracted = [];
        for (let p = 1; p <= doc.numPages; p++) {
          const content = await (await doc.getPage(p)).getTextContent();
          extracted.push(content.items.map(item => item.str).join(' ').replace(/\s+/g, ' ').trim());
        }
        const normalized = value => value.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
        for (let p = 0; p < 2; p++) {
          let cursor = 0;
          for (const heading of documentInfo.headings[p]) {
            const position = normalized(extracted[p]).indexOf(normalized(heading), cursor);
            if (position < 0) throw new Error(`${item.route} (${size}) page ${p + 1}: extracted headings are missing or out of reading order`);
            cursor = position + normalized(heading).length;
          }
        }
        for (let p = 0; p < 2; p++) {
          const expected = normalized(documentInfo.text[p]);
          const actual = normalized(extracted[p]);
          const first = expected.split(' ').slice(0, 7).join(' ');
          const last = expected.split(' ').slice(-7).join(' ');
          if (!actual.includes(first) || !actual.includes(last)) throw new Error(`${item.route} (${size}) page ${p + 1}: selectable text missing or reading order/content differs; first=${JSON.stringify(first)} last=${JSON.stringify(last)} actual=${JSON.stringify(actual)}`);
        }
        if (/Ask me anything|Send|Message/i.test(extracted.join(' '))) throw new Error(`${item.route} (${size}): chat controls appear in printed PDF`);
        if (size === item.paper) {
          try {
            fs.writeFileSync(path.join(root, item.dir, 'resume.pdf'), pdf);
          } catch (error) {
            if (error.code !== 'EBUSY' && error.code !== 'EPERM') throw error;
            errors.push(`${item.route}: resume.pdf is locked; close it and retry`);
          }
        }
        await doc.destroy();
      }
      await page.setViewportSize({ width: 390, height: 844 });
      const mobile = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        width: document.documentElement.scrollWidth,
        content: [...document.querySelectorAll('.sheet, .sheet h1')].map(node => {
          const rect = node.getBoundingClientRect();
          return { left: rect.left, right: rect.right };
        }),
      }));
      if (mobile.width > mobile.viewport || mobile.content.some(rect => rect.left < 0 || rect.right > mobile.viewport)) {
        throw new Error(`${item.route}: mobile résumé content extends outside the viewport`);
      }
      await page.emulateMedia({ media: 'print' });
      const mobilePrint = await sheets.first().evaluate(node => ({ width: node.getBoundingClientRect().width, padding: parseFloat(getComputedStyle(node).paddingLeft) }));
      if (mobilePrint.width < 790 || mobilePrint.padding < 36) throw new Error(`${item.route}: mobile print does not retain paper geometry`);
      await page.close();
      console.log(`Verified ${item.route} (Letter and A4)`);
    }
    for (const { route, url } of localLinks) {
      const target = path.resolve(root, `.${url.pathname}`, url.pathname.endsWith('/') ? 'index.html' : '');
      if (!fs.existsSync(target)) errors.push(`${route}: broken local link ${url.href}`);
    }
    if (errors.length) throw new Error(errors.join('\n'));
  } finally {
    await browser.close();
    await new Promise(resolve => web.close(resolve));
  }
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
