(() => {
  // Keep the reader on the same section when switching language.
  document.querySelectorAll('.lg').forEach((a) => a.addEventListener('click', () => {
    const base = a.getAttribute('href').split('#')[0];
    a.setAttribute('href', base + location.hash);
  }));

  // Close the mobile menu after outside clicks or Escape.
  const menu = document.querySelector('.mnav');
  if (menu) {
    document.addEventListener('click', (ev) => { if (menu.open && !menu.contains(ev.target)) menu.open = false; });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); } });
  }

  // Reference filters are an enhancement: the full table is present without JavaScript.
  const q = document.getElementById('q');
  if (!q) return;
  const rg = document.getElementById('rg');
  const cnt = document.getElementById('cnt');
  const none = document.getElementById('none');
  const rows = [...document.querySelectorAll('.refs tbody tr')];
  document.querySelector('.filters').hidden = false;
  const apply = () => {
    const term = q.value.trim().toLowerCase();
    let shown = 0;
    rows.forEach((r) => {
      const ok = (!rg.value || r.dataset.r === rg.value) && (!term || r.dataset.q.includes(term));
      r.hidden = !ok;
      if (ok) shown += 1;
    });
    cnt.textContent = `${cnt.dataset.a} ${shown} ${cnt.dataset.b} ${rows.length}`;
    none.hidden = shown !== 0;
  };
  q.addEventListener('input', apply);
  rg.addEventListener('change', apply);
  apply();
})();
