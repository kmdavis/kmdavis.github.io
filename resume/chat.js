(() => {
  const root = document.documentElement;
  const chat = document.createElement('section');
  chat.className = 'resume-chat';
  chat.innerHTML = '<button class="resume-chat-toggle" type="button" aria-expanded="false" aria-controls="resume-chat-panel">Ask about Kevan</button><div class="resume-chat-panel" id="resume-chat-panel" hidden><header><h2>Ask about my experience</h2><button class="resume-chat-close" type="button" aria-label="Close chat">×</button></header><div class="resume-chat-log" role="log" aria-live="polite" aria-relevant="additions text"><p class="resume-chat-intro">Ask this AI assistant about my experience and projects. Questions are sent to Google and may be used to improve its products. Please do not share sensitive information.</p></div><form><label for="resume-chat-input">Your question</label><textarea id="resume-chat-input" rows="2" maxlength="4000" required></textarea><button class="resume-chat-send" type="submit">Send</button></form></div>';
  document.body.append(chat);
  const top = document.createElement('button');
  top.className = 'resume-back-to-top'; top.type = 'button'; top.textContent = '↑';
  top.setAttribute('aria-label', 'Back to top'); document.body.append(top);
  const toggle = chat.querySelector('.resume-chat-toggle');
  const panel = chat.querySelector('.resume-chat-panel');
  const log = chat.querySelector('.resume-chat-log');
  const input = chat.querySelector('textarea');
  const form = chat.querySelector('form');
  const close = chat.querySelector('.resume-chat-close');
  const messages = [];
  function setOpen(open) { panel.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); if (open) input.focus(); }
  function appendMessage(role, text) {
    const item = document.createElement('p'); item.className = `resume-chat-message ${role}`;
    item.textContent = text; log.append(item); log.scrollTop = log.scrollHeight; return item;
  }
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  close.addEventListener('click', () => { setOpen(false); toggle.focus(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); toggle.focus(); } });
  top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => { top.classList.toggle('visible', window.scrollY > 300); }, { passive: true });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const content = input.value.trim(); if (!content) return;
    input.value = ''; appendMessage('user', content); messages.push({ role: 'user', content });
    const endpoint = root.dataset.chatEndpoint;
    if (!endpoint) { appendMessage('notice', 'Chat is not configured on this page yet.'); messages.pop(); return; }
    const send = form.querySelector('button'); send.disabled = true;
    const responseMessage = appendMessage('assistant', '');
    try {
      const recent = [];
      let length = 0;
      for (let i = messages.length - 1; i >= 0 && recent.length < 19; i--) {
        if (length + messages[i].content.length > 10000) break;
        recent.unshift(messages[i]);
        length += messages[i].content.length;
      }
      if (recent[0]?.role === 'assistant') recent.shift();
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: recent }) });
      if (!response.ok || !response.body) throw new Error('Chat request failed. Please try again.');
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let answer = '';
      while (true) { const { value, done } = await reader.read(); if (done) break; answer += decoder.decode(value, { stream: true }); responseMessage.textContent = answer; log.scrollTop = log.scrollHeight; }
      answer += decoder.decode();
      if (!answer.trim()) throw new Error('No response was returned. Please try again.');
      responseMessage.textContent = answer;
      messages.push({ role: 'assistant', content: answer });
    } catch (error) { responseMessage.textContent = error instanceof TypeError ? 'Unable to reach chat. Check your connection and try again.' : error.message; messages.pop(); }
    finally { send.disabled = false; input.focus(); }
  });
})();
