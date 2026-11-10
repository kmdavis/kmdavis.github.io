(() => {
  const fallback = document.body.dataset.paperFallback;
  let paper = fallback;
  try {
    // A language without an explicit region cannot reliably identify paper preference.
    const region = new Intl.Locale(navigator.language).region;
    if (region && /^[A-Z]{2}$/.test(region)) {
      paper = ['US', 'CA', 'MX', 'PH', 'BZ', 'CR', 'GT', 'NI', 'PA', 'SV'].includes(region)
        ? 'letter' : 'a4';
    }
  } catch (_) {
    // Invalid or unavailable locale: retain this resume's fallback.
  }
  document.body.classList.remove('paper-letter', 'paper-a4');
  document.body.classList.add(`paper-${paper}`);
  const printSize = document.createElement('style');
  printSize.textContent = `@page { size: ${paper === 'letter' ? 'letter' : 'A4'}; margin: 0; }`;
  document.head.appendChild(printSize);
})();
