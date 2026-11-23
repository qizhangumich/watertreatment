import { mkdirSync, rmSync, writeFileSync, copyFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { modules, waterQuality, power, membraneGrades, references, contact, site } from './content/data.mjs';
import en from './content/en.mjs';
import ar from './content/ar.mjs';
import zh from './content/zh.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const L = { en, ar, zh };
const e = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const n = (v) => Number(v).toLocaleString('en-US');
const ltr = (s) => `<bdi dir="ltr">${e(s)}</bdi>`;
const FAM = ['sea', 'reclaim', 'biomax', 'ultra'];

/* ---------- Diagrams: original vector drawings, labels localized ---------- */
function shell(x, y, w, h) {
  let ribs = '';
  for (let i = x + 14; i < x + w - 6; i += 14) ribs += `<path d="M${i} ${y + 4}V${y + h - 4}" class="rib"/>`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="box"/>${ribs}<path d="M${x} ${y + 8}H${x + w}M${x} ${y + h - 8}H${x + w}" class="line"/>`;
}
const arrow = (x1, y1, x2, y2, c = 'flow') => `<path d="M${x1} ${y1}L${x2} ${y2}" class="${c}" marker-end="url(#a-${c})"/>`;
const label = (x, y, s, a = 'middle', c = 'lb') => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}">${e(s)}</text>`;
const defs = `<defs><marker id="a-flow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" class="mk"/></marker><marker id="a-waste" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" class="mk2"/></marker></defs>`;
const vessels = (x, y, c, w = 26, h = 70, gap = 8) => Array.from({ length: c }, (_, i) => `<rect x="${x + i * (w + gap)}" y="${y}" width="${w}" height="${h}" rx="12" class="vessel"/>`).join('');
const tubes = (x, y, w, c, gap = 15) => Array.from({ length: c }, (_, i) => `<rect x="${x}" y="${y + i * gap}" width="${w}" height="9" rx="4.5" class="tube"/>`).join('');
const cassette = (x, y, w, h) => { let f = ''; for (let i = x + 5; i < x + w - 2; i += 5) f += `<path d="M${i} ${y + 7}V${y + h - 7}" class="fiber"/>`; return `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="cass"/>${f}`; };

let uid = 0;
const uniq = (svg) => { uid += 1; return svg.replace(/a-(flow|waste)/g, `a-$1-${uid}`); };

function diagram(fam, t) {
  const f = t.families[fam];
  const X = 150, Y = 58, W = 540, H = 150;
  const div = (x) => `<path d="M${x} ${Y + 8}V${Y + H - 8}" class="line"/>`;
  let body = '', flows = '';
  if (fam === 'sea') {
    body = `${div(X + 86)}<rect x="${X + 24}" y="${Y + 40}" width="40" height="88" class="vessel2"/>${vessels(X + 104, Y + 52, 4)}${div(X + 258)}${tubes(X + 274, Y + 28, 248, 6)}`;
    body += label(X + 43, Y + H + 26, f.labels[0]) + label(X + 172, Y + H + 26, f.labels[1]) + label(X + 400, Y + H + 26, f.labels[2]);
    flows = arrow(30, Y + 60, X - 6, Y + 60) + label(30, Y + 48, f.flows[0], 'start') + arrow(X + W + 6, Y + 45, 810, Y + 45) + label(810, Y + 33, f.flows[1], 'end') + arrow(X + W + 6, Y + 105, 810, Y + 105, 'waste') + label(810, Y + 93, f.flows[2], 'end');
  } else if (fam === 'reclaim') {
    body = `${cassette(X + 18, Y + 24, 92, 108)}${cassette(X + 122, Y + 24, 92, 108)}${div(X + 232)}${vessels(X + 250, Y + 18, 3, 22, 40, 8)}${tubes(X + 250, Y + 72, 272, 4)}`;
    body += label(X + 116, Y + H + 26, f.labels[0]) + label(X + 386, Y + H + 26, f.labels[1]);
    flows = arrow(30, Y + 50, X - 6, Y + 50) + label(30, Y + 38, f.flows[0], 'start') + arrow(X - 6, Y + 112, 30, Y + 112, 'waste') + label(30, Y + 100, f.flows[1], 'start') + arrow(X + W + 6, Y + 45, 810, Y + 45) + label(810, Y + 33, f.flows[2], 'end') + arrow(X + W + 6, Y + 105, 810, Y + 105, 'waste') + label(810, Y + 93, f.flows[3], 'end');
  } else if (fam === 'biomax') {
    let media = ''; for (let x = X + 16; x < X + 90; x += 11) media += `<path d="M${x} ${Y + 26}V${Y + 104}" class="fiber"/>`;
    let media2 = ''; for (let x = X + 122; x < X + 268; x += 11) media2 += `<path d="M${x} ${Y + 26}V${Y + 104}" class="fiber"/>`;
    let air = ''; for (let x = X + 130; x < X + 268; x += 28) air += `<circle cx="${x}" cy="${Y + 122}" r="3.5" class="tube"/>`;
    body = `${media}${div(X + 104)}${media2}${air}${div(X + 284)}${cassette(X + 302, Y + 30, 76, 96)}${div(X + 396)}<rect x="${X + 490}" y="${Y + 36}" width="34" height="92" class="vessel2"/><circle cx="${X + 430}" cy="${Y + 110}" r="15" class="tube"/><circle cx="${X + 468}" cy="${Y + 110}" r="11" class="tube"/><rect x="${X + 416}" y="${Y + 40}" width="56" height="10" rx="5" class="tube"/>`;
    body += label(X + 52, Y + H + 26, f.labels[0]) + label(X + 194, Y + H + 26, f.labels[1]) + label(X + 340, Y + H + 26, f.labels[2]) + label(X + 468, Y + H + 26, f.labels[3]);
    flows = arrow(30, Y + 60, X - 6, Y + 60) + label(30, Y + 48, f.flows[0], 'start') + arrow(X + W + 6, Y + 45, 810, Y + 45) + label(810, Y + 33, f.flows[1], 'end') + arrow(X + W + 6, Y + 105, 810, Y + 105, 'waste') + label(810, Y + 93, f.flows[2], 'end') + `<path d="M${X + 340} ${Y - 2}V${Y - 22}H${X + 60}V${Y - 4}" class="waste" marker-end="url(#a-waste)"/>` + label(X + 200, Y - 30, f.flows[3]);
  } else {
    body = `${cassette(X + 16, Y + 26, 92, 110)}${cassette(X + 122, Y + 26, 92, 110)}${cassette(X + 228, Y + 26, 92, 110)}${div(X + 340)}<circle cx="${X + 400}" cy="${Y + 100}" r="17" class="tube"/><rect x="${X + 452}" y="${Y + 40}" width="46" height="88" class="vessel2"/>`;
    body += `<path d="M${X + 16} ${Y + 14}H${X + 320}" class="drive"/><path d="M${X + 130} ${Y - 16}H${X + 210}M${X + 130} ${Y - 16}l8 -5M${X + 130} ${Y - 16}l8 5M${X + 210} ${Y - 16}l-8 -5M${X + 210} ${Y - 16}l-8 5" class="drive"/>`;
    body += label(X + 168, Y + H + 26, f.labels[0]) + label(X + 440, Y + H + 26, f.labels[1]) + label(X + 168, Y - 26, f.flows[2]);
    flows = arrow(30, Y + 70, X - 6, Y + 70) + label(30, Y + 58, f.flows[0], 'start') + arrow(X + W + 6, Y + 70, 810, Y + 70) + label(810, Y + 58, f.flows[1], 'end');
  }
  return uniq(`<svg class="dg" viewBox="0 0 840 250" dir="ltr" role="img" aria-label="${e(`${f.name}: ${f.labels.join(', ')}`)}">${defs}${shell(X, Y, W, H)}${body}${flows}</svg>`);
}

function scaleFig(m, t) {
  const [l, , h] = m.dims, VW = 13000, VH = 4500, g = 3950, x = 300, y = g - h;
  let ribs = '';
  for (let i = x + 240; i < x + l - 100; i += 240) ribs += `<path d="M${i} ${y + 80}V${g - 80}" class="rib s"/>`;
  return `<figure class="scale-fig"><svg viewBox="0 0 ${VW} ${VH}" dir="ltr" role="img" aria-label="${e(`${m.model}: ${n(l)} × ${n(h)} mm`)}"><path d="M0 ${g}H${VW}" class="line s"/><rect x="${x}" y="${y}" width="${l}" height="${h}" class="box s fam-${m.family}"/>${ribs}</svg><figcaption><b>${e(m.model)}</b><span>${ltr(`${m.cap} m³/d`)}${m.units > 1 ? ` · ${ltr(`× ${m.units}`)}` : ''}</span></figcaption></figure>`;
}

function ptfeDiagram(t) {
  const p = t.productsPage;
  let a = '', b = '', dots = '';
  for (let i = 0; i < 16; i++) a += `<path d="M${72 + i * 8} 62V206" class="fiber"/>`;
  for (let i = 0; i < 16; i++) b += `<path d="M${492 + i * 8} 62C${482 + i * 8} 110 ${506 + i * 8} 160 ${492 + i * 8} 206" class="fiber"/>`;
  [[60, 190], [90, 160], [125, 180], [170, 150], [205, 185], [70, 120], [150, 105], [195, 95], [110, 85], [215, 130]].forEach(([x, y]) => { dots += `<circle cx="${x}" cy="${y}" r="4" class="bubble"/>`; });
  return uniq(`<svg class="dg" viewBox="0 0 760 270" dir="ltr" role="img" aria-label="${e(`${p.ptfeOld} / ${p.ptfeNew}`)}">${defs}<rect x="62" y="50" width="136" height="12" class="cass"/><rect x="62" y="206" width="136" height="12" class="cass"/>${a}${dots}<path d="M40 236H220" class="drive"/><rect x="482" y="50" width="136" height="12" class="cass"/><rect x="482" y="206" width="136" height="12" class="cass"/>${b}<path d="M440 28H660M550 28V50" class="drive"/><path d="M505 134H595M505 134l9 -6M505 134l9 6M595 134l-9 -6M595 134l-9 6" class="drive"/>${arrow(310, 134, 410, 134)}${label(130, 258, p.ptfeOld)}${label(550, 258, p.ptfeNew)}</svg>`);
}

/* ---------- Components ---------- */
const table = (cols, rows, cls = '') => `<div class="tw" tabindex="0" role="region" aria-label="${e(cols.filter(Boolean).join(', '))}"><table class="${cls}"><thead><tr>${cols.map((c) => `<th scope="col">${e(c)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
const head = (eb, title, lead = '', id = '') => `<header class="sec-h"${id ? ` id="${id}"` : ''}><p class="eb">${e(eb)}</p><h2>${e(title)}</h2>${lead ? `<p class="lead-s">${e(lead)}</p>` : ''}</header>`;
const pageHead = (eb, h1, lead) => `<section class="ph"><div class="wrap"><p class="eb">${e(eb)}</p><h1>${e(h1)}</h1><p class="lead">${e(lead)}</p></div></section>`;
const link = (depth, lang, slug, hash = '') => `${'../'.repeat(depth)}${lang}/${slug ? `${slug}/` : ''}${hash ? `#${hash}` : ''}`;
const contactBtn = (t) => (contact.email ? `<a class="btn" href="mailto:${e(contact.email)}">${e(t.common.contact)}</a>` : '');
const refName = (r, lang) => (lang === 'zh' && r.zh ? r.zh : r.name);

function specTable(fam, t) {
  const c = t.containerized;
  const rows = modules.filter((m) => m.family === fam).map((m) => {
    const area = ((m.dims[0] * m.dims[1] * m.units) / 1e6).toFixed(1);
    const sec = m.run ? ((m.run * 24) / m.capMax).toFixed(2) : '—';
    return [ltr(m.model), ltr(m.cap), ltr(m.dims.map(n).join(' × ')), m.units, area, ltr(m.inst), m.run ?? '—', sec, ltr(m.empty) + (m.flagWeight ? '†' : ''), ltr(m.full) + (m.flagWeight ? '†' : '')];
  });
  return table(c.specCols, rows, 'num');
}
const wqTable = (fam, t) => table(t.containerized.wqCols, waterQuality[fam].map(([p, u, a, b]) => [e(t.containerized.params[p]), ltr(u || '—'), ltr(a), ltr(b)]), 'num');

/* ---------- Pages ---------- */
const P = {
  '': (t, lang, d) => {
    const h = t.home;
    const featured = references.filter((r) => r.feature).sort((a, b) => b.cap - a.cap).slice(0, 6);
    return `<section class="hero"><div class="wrap hero-g"><div><p class="eb">${e(h.eyebrow)}</p><h1>${e(h.h1)}</h1><p class="lead">${e(h.lead)}</p><p class="cta"><a class="btn" href="${link(d, lang, 'containerized')}">${e(h.cta1)}</a><a class="btn ghost" href="${link(d, lang, 'references')}">${e(h.cta2)}</a></p></div><div class="hero-dg">${diagram('sea', t)}</div></div></section>
<section class="figs"><div class="wrap"><dl>${h.figures.map(([a, b]) => `<div><dt>${ltr(a)}</dt><dd>${e(b)}</dd></div>`).join('')}</dl><p class="fine">${e(h.figNote)}</p></div></section>
<section class="sec"><div class="wrap">${head(h.modelsEyebrow, h.modelsTitle)}<div class="two">${[h.modelA, h.modelB].map(([a, b, c], i) => `<article class="model"><p class="tag">${e(a)}</p><h3>${e(b)}</h3><p>${e(c)}</p><a class="more" href="${link(d, lang, i ? 'containerized' : 'solutions')}">${e(t.common.explore)}</a></article>`).join('')}</div></div></section>
<section class="sec tint"><div class="wrap">${head(h.appsEyebrow, h.appsTitle)}<ol class="tiles">${t.apps.map((a, i) => `<li><a href="${link(d, lang, 'applications', a.id)}"><span class="no">${ltr(String(i + 1).padStart(2, '0'))}</span><h3>${e(a.title)}</h3><p>${e(a.short)}</p></a></li>`).join('')}</ol></div></section>
<section class="sec dark"><div class="wrap split"><div>${head(h.moduleEyebrow, h.moduleTitle, h.moduleBody)}<a class="btn light" href="${link(d, lang, 'containerized', 'thousand')}">${e(t.common.viewSpecs)}</a></div><div>${diagram('reclaim', t)}</div></div></section>
<section class="sec"><div class="wrap">${head(h.refsEyebrow, h.refsTitle, h.refsNote)}<ul class="ref-list">${featured.map((r) => `<li><b>${e(refName(r, lang))}</b><span>${e(t.refs.countries[r.c])}</span><span class="cap">${ltr(n(r.cap))} ${e(t.common.m3d)}</span></li>`).join('')}</ul><a class="more" href="${link(d, lang, 'references')}">${e(t.common.viewRefs)}</a></div></section>`;
  },
  applications: (t, lang, d) => `${pageHead(t.appsPage.eyebrow, t.appsPage.h1, t.appsPage.lead)}<section class="sec"><div class="wrap">${t.apps.map((a, i) => `<article class="app" id="${a.id}"><div><span class="no">${ltr(String(i + 1).padStart(2, '0'))}</span><h2>${e(a.title)}</h2></div><dl><div><dt>${e(t.common.problem)}</dt><dd>${e(a.problem)}</dd></div><div><dt>${e(t.common.technology)}</dt><dd>${e(a.tech)}</dd></div><div><dt>${e(t.common.products)}</dt><dd>${e(a.products)}</dd></div><div><dt>${e(t.common.fit)}</dt><dd>${e(a.fit)}</dd></div></dl></article>`).join('')}</div></section>`,
  solutions: (t) => { const s = t.solutions; return `${pageHead(s.eyebrow, s.h1, s.lead)}<section class="sec"><div class="wrap" id="compare">${table(s.cols, s.rows.map((r) => r.map(e)), 'cmp')}</div></section><section class="sec tint" id="roles"><div class="wrap">${head(s.eyebrow, s.roleTitle, s.roleLead)}<ul class="roles">${s.roles.map(([a, b, c], i) => `<li class="${i > 2 ? 'no-claim' : ''}"><h3>${e(a)}</h3><p>${e(b)}</p><span>${e(c)}</span></li>`).join('')}</ul></div></section>`; },
  products: (t, lang, d) => {
    const p = t.productsPage;
    return `${pageHead(p.eyebrow, p.h1, p.lead)}<section class="sec"><div class="wrap"><ul class="tax">${p.tax.map(([a, b, c]) => `<li><a href="#${c}"><h2>${e(a)}</h2><p>${e(b)}</p></a></li>`).join('')}</ul></div></section>
<section class="sec tint" id="membranes"><div class="wrap split"><div>${head(p.eyebrow, p.membranesTitle, p.membranesBody)}<p class="fine">${e(p.membranesNote)}</p></div><ul class="grades">${membraneGrades.map((g) => `<li>${ltr(g)}</li>`).join('')}</ul></div></section>
<section class="sec" id="ultra"><div class="wrap split"><div>${head(p.eyebrow, p.ptfeTitle, p.ptfeBody)}<ul class="ticks">${p.ptfePoints.map((x) => `<li>${e(x)}</li>`).join('')}</ul></div><div class="panel" tabindex="0">${ptfeDiagram(t)}</div></div></section>
<section class="sec tint" id="families"><div class="wrap">${head(p.eyebrow, p.familiesTitle)}<div id="biomax"></div>${FAM.map((f) => { const x = t.families[f]; return `<article class="fam"><div><p class="tag">${e(x.type)}</p><h3>${ltr(x.name)}</h3><p>${e(x.desc)}</p><ul class="ticks">${x.stated.map((s) => `<li>${e(s)}</li>`).join('')}</ul><a class="more" href="${link(d, lang, 'containerized', `spec-${f}`)}">${e(t.common.viewSpecs)}</a></div><div class="panel" tabindex="0">${diagram(f, t)}</div></article>`; }).join('')}<p class="callout">${e(p.scope)}</p></div></section>`;
  },
  containerized: (t) => {
    const c = t.containerized;
    return `${pageHead(c.eyebrow, c.h1, c.lead)}<section class="sec"><div class="wrap">${head(c.eyebrow, c.whyTitle)}<ul class="four">${c.why.map(([a, b]) => `<li><h3>${e(a)}</h3><p>${e(b)}</p></li>`).join('')}</ul></div></section>
<section class="sec tint" id="scale"><div class="wrap">${head(c.eyebrow, c.scaleTitle, c.scaleBody)}<div class="scale">${modules.map((m) => scaleFig(m, t)).join('')}</div><p class="fine">${e(c.cnNote)}</p></div></section>
<section class="sec dark" id="thousand"><div class="wrap">${head(c.eyebrow, c.thousandTitle, c.thousandBody)}${table(c.thousandCols, c.thousandRows.map((r) => r.map((x, i) => (i === 0 ? ltr(x) : e(x)))))}<p class="fine">${e(c.thousandNote)}</p></div></section>
<section class="sec" id="specs"><div class="wrap">${head(c.eyebrow, c.specTitle, t.common.sourceNote)}${FAM.map((f) => `<article class="spec" id="spec-${f}"><h3>${ltr(t.families[f].name)} <small>${e(t.families[f].type)}</small></h3><div class="panel" tabindex="0">${diagram(f, t)}</div>${specTable(f, t)}<h4>${e(c.wqTitle)}</h4>${wqTable(f, t)}</article>`).join('')}<p class="fine">${e(c.specNote)}</p><h3 class="mt">${e(c.powerTitle)}</h3>${table(c.powerCols, power.map(([a, b, f]) => [ltr(a), ltr(b), ltr(f), '3']), 'num')}</div></section>
<section class="sec tint" id="installation"><div class="wrap">${head(c.eyebrow, c.installTitle)}<ul class="four">${c.install.map(([a, b]) => `<li><h3>${e(a)}</h3><p>${e(b)}</p></li>`).join('')}</ul></div></section>`;
  },
  references: (t, lang) => {
    const r = t.refs;
    const sorted = [...references].sort((a, b) => b.cap - a.cap);
    const rows = sorted.map((x) => {
      const vals = [e(refName(x, lang)), e(r.countries[x.c]), e(x.client || '—'), e(r.sectors[x.s]), `${e(r.product)} ${x.model === '—' ? '' : ltr(x.model ?? t.common.tbd)}`, e(r.role), ltr(n(x.cap)), ltr(x.year), e(r.status)];
      return `<tr data-r="${x.r}" data-q="${e(`${x.name} ${x.zh || ''} ${x.client || ''} ${x.model || ''} ${r.countries[x.c]}`.toLowerCase())}">${vals.map((v, i) => (i === 0 ? `<th scope="row">${v}</th>` : `<td data-l="${e(r.cols[i])}">${v}</td>`)).join('')}</tr>`;
    }).join('');
    return `${pageHead(r.eyebrow, r.h1, r.lead)}<section class="sec-t"><div class="wrap"><aside class="attr"><h2>${e(r.attrTitle)}</h2><p>${e(r.attr)}</p></aside></div></section>
<section class="sec" id="cases"><div class="wrap">${head(r.caseEyebrow, r.caseTitle)}<div class="cases">${r.cases.map((c) => `<article><p class="tag">${e(c.tag)}</p><h3>${e(c.title)}</h3><dl>${c.facts.map(([a, b]) => `<div><dt>${e(a)}</dt><dd>${e(b)}</dd></div>`).join('')}</dl><p>${e(c.body)}</p></article>`).join('')}</div></div></section>
<section class="sec tint" id="matrix"><div class="wrap">${head(r.eyebrow, r.tableTitle)}<div class="filters" hidden><label>${e(r.search)}<input id="q" type="search"></label><label>${e(r.region)}<select id="rg"><option value="">${e(r.all)}</option>${Object.entries(r.regions).map(([k, v]) => `<option value="${k}">${e(v)}</option>`).join('')}</select></label><p id="cnt" aria-live="polite" data-a="${e(r.showing)}" data-b="${e(r.of)}"></p></div><div class="tw rw" tabindex="0" role="region" aria-label="${e(r.tableTitle)}"><table class="refs"><thead><tr>${r.cols.map((c) => `<th scope="col">${e(c)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div><p id="none" class="callout" hidden>${e(r.noResults)}</p><p class="fine">${e(r.tableNote)}</p><p class="fine">${e(r.modNote)}</p></div></section>`;
  },
  partnership: (t) => { const p = t.partner; return `${pageHead(p.eyebrow, p.h1, p.lead)}<section class="sec"><div class="wrap"><ol class="opps">${p.items.map(([a, b, c], i) => `<li><span class="no">${ltr(String(i + 1).padStart(2, '0'))}</span><h2>${e(a)}</h2><p>${e(b)}</p><p class="need"><b>${e(p.needLabel)}:</b> ${e(c)}</p></li>`).join('')}</ol></div></section><section class="sec dark" id="enquiry"><div class="wrap split"><div>${head(p.eyebrow, p.screenTitle)}${contactBtn(t)}</div><ol class="check">${p.screen.map((x) => `<li>${e(x)}</li>`).join('')}</ol></div></section><section class="sec-t"><div class="wrap"><p class="fine">${e(p.note)}</p></div></section>`; },
};

// Keep numeric ranges and limits in reading order inside right-to-left text.
const isolate = (html, t) => (t.dir !== 'rtl' ? html : html.replace(/>([^<]+)</g, (_, x) => `>${x.replace(/(?:TDS|COD|SS|SDI) &lt; [\d,.]+|\d[\d,.]*–\d[\d,.]*/g, (m) => `<bdi dir="ltr">${m}</bdi>`)}<`));

function layout(lang, slug) {
  const t = L[lang], d = slug ? 2 : 1;
  const [title, desc] = t.meta[slug];
  const fullTitle = slug ? `${title} | ${t.brandShort}` : title;
  const urlFor = (l) => `${site.url}/${l}/${slug ? `${slug}/` : ''}`;
  const navItems = site.pages.map((s) => `<a href="${link(d, lang, s)}"${s === slug ? ' aria-current="page"' : ''}>${e(t.nav[s])}</a>`).join('');
  const langs = site.locales.map((l) => `<a class="lg" lang="${l}" hreflang="${l}" href="${link(d, l, slug)}"${l === lang ? ' aria-current="true"' : ''}>${e(L[l].langName)}</a>`).join('');
  return `<!doctype html><html lang="${lang}" dir="${t.dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(fullTitle)}</title><meta name="description" content="${e(desc)}"><meta name="theme-color" content="#0d2733"><link rel="canonical" href="${urlFor(lang)}">${site.locales.map((l) => `<link rel="alternate" hreflang="${l}" href="${urlFor(l)}">`).join('')}<link rel="alternate" hreflang="x-default" href="${urlFor('en')}"><meta property="og:type" content="website"><meta property="og:title" content="${e(fullTitle)}"><meta property="og:description" content="${e(desc)}"><meta property="og:url" content="${urlFor(lang)}"><link rel="icon" href="${'../'.repeat(d)}assets/icon.svg" type="image/svg+xml"><link rel="stylesheet" href="${'../'.repeat(d)}assets/styles.css"><script defer src="${'../'.repeat(d)}assets/app.js"></script></head><body>
<a class="skip" href="#main">${e(t.skip)}</a><header class="top"><div class="wrap bar"><a class="brand" href="${link(d, lang, '')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 8c3-3 5-3 8 0s5 3 8 0 3-2 4-2M2 15c3-3 5-3 8 0s5 3 8 0 3-2 4-2"/></svg><span>${e(t.brandShort)}</span></a><nav class="nav" aria-label="${e(t.menu)}">${navItems.replace(/<a href="[^"]*"( aria-current="page")?>[^<]*<\/a>/, '')}</nav><div class="langs" role="group" aria-label="${e(t.langLabel)}">${langs}</div><details class="mnav"><summary>${e(t.menu)}</summary><nav aria-label="${e(t.menu)}">${navItems}</nav></details></div></header>
<main id="main">${isolate(P[slug](t, lang, d), t)}</main>
<footer class="foot"><div class="wrap"><div class="foot-g"><div><p class="f-b">${e(t.brand)}</p><p>${e(t.footer.about)}</p>${contactBtn(t)}</div><nav aria-label="${e(t.menu)}">${navItems}</nav></div><p class="fine">${e(t.footer.disclaimer)}</p><p class="fine">${e(t.footer.legal)}</p></div></footer></body></html>`;
}

/* ---------- Build ---------- */
function keys(o, p = '') { return Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keys(v, `${p}${k}.`) : [`${p}${k}`])); }
const base = keys(en).sort().join('|');
for (const l of ['ar', 'zh']) if (keys(L[l]).sort().join('|') !== base) throw new Error(`Locale ${l} does not match the English content structure`);

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, 'assets'), { recursive: true });
for (const f of readdirSync(join(root, 'assets'))) copyFileSync(join(root, 'assets', f), join(dist, 'assets', f));
const urls = [];
for (const lang of site.locales) for (const slug of site.pages) {
  const dir = join(dist, lang, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), layout(lang, slug));
  urls.push(`${site.url}/${lang}/${slug ? `${slug}/` : ''}`);
}
const redirect = (href) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${e(en.meta[''][0])}</title><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${href}"><link rel="canonical" href="${site.url}/en/"></head><body><a href="${href}">English</a> · <a href="ar/">العربية</a> · <a href="zh/">中文</a></body></html>`;
writeFileSync(join(dist, 'index.html'), redirect('en/'));
writeFileSync(join(dist, '404.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Page not found</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font:18px system-ui;margin:20vh auto;max-width:32rem;padding:0 16px;color:#0d2733}</style></head><body><h1>Page not found</h1><p><a href="${site.url}/en/">English</a> · <a href="${site.url}/ar/">العربية</a> · <a href="${site.url}/zh/">中文</a></p></body></html>`);
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${u}</loc></url>`).join('')}</urlset>`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
writeFileSync(join(dist, '.nojekyll'), '');
console.log(`Built ${urls.length} pages, ${references.length} references, ${new Set(references.map((r) => r.c)).size} countries, ${modules.length} models`);
