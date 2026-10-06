/* ICCPDC explorer — "Statistici" view. Data: ICCPDC.stats (pipeline/s25_statistics.py).
   Stated numbers (printed in the 1978 text) and derived numbers (computed by us, with method + inputs) are kept apart;
   every number links back to the text (statement drawer, building page or #unit/<id> in the reader). */
(() => {
const S = (window.ICCPDC || {}).stats;
const SV = {tab: "derived", q: "", ch: "", open: {}};
const L = {
  ro: {title: "Statistici", intro: "Cifrele <b>prezentate</b> în sinteza din 1978 și cifrele <b>deduse</b> de noi din informații răspândite în text. Fiecare număr duce înapoi la text.",
    t_derived: "Deduse din text", t_stated: "Prezentate în text", t_counties: "Pe județe (tab. II.1–II.2)",
    method: "Metodă", inputs: "Surse în text", caveat: "Atenție", show: "arată elementele", hide: "ascunde", items: "elemente",
    g_comparisons: "Comparații și calcule din cifrele textului", g_damage: "Efecte asupra clădirilor numite", g_buildings: "Clădirile din text",
    g_interventions: "Consolidări", g_text: "Structura textului", g_geography: "Geografie", filter: "Filtrează cifrele…", all_ch: "toate capitolele",
    value: "valoare", unit: "unitate", statement: "afirmație", cite: "loc", area: "zona", measure: "indicator", object: "obiect", pct: "% din total",
    quote: "citat", in_text: "în text", mentions: "Mențiuni ale județelor (tab. II.2 și concluzii)", organ: "sursa", role: "rol", n_shown: "afișate",
    derived_badge: "dedus", stated_badge: "din text", map: "pe hartă"},
  en: {title: "Statistics", intro: "Figures <b>presented</b> in the 1978 synthesis and figures <b>derived</b> by us from information scattered through the text. Every number leads back to the text.",
    t_derived: "Derived from the text", t_stated: "Presented in the text", t_counties: "By county (Tables II.1–II.2)",
    method: "Method", inputs: "Sources in the text", caveat: "Caveat", show: "show items", hide: "hide", items: "items",
    g_comparisons: "Comparisons and calculations from the text's figures", g_damage: "Effects on the named buildings", g_buildings: "Buildings in the text",
    g_interventions: "Retrofitting", g_text: "Structure of the text", g_geography: "Geography", filter: "Filter the figures…", all_ch: "all chapters",
    value: "value", unit: "unit", statement: "statement", cite: "location", area: "area", measure: "indicator", object: "object", pct: "% of total",
    quote: "quote", in_text: "in text", mentions: "County mentions (Table II.2 and conclusions)", organ: "source", role: "role", n_shown: "shown",
    derived_badge: "derived", stated_badge: "from the text", map: "on the map"}};
const X = () => window.ICX;
const tt = k => (L[X().lang()] || L.ro)[k] || k;
const lx = a => Array.isArray(a) ? (X().lang() === "en" ? (a[1] || a[0]) : a[0]) : a;
const esc = s => X().esc(s);
const unitLink = u => u ? `<a class="small" href="#unit/${encodeURIComponent(u)}">${tt("in_text")} →</a>` : "";
const fmt = v => Array.isArray(v) ? esc(lx(v)) : typeof v === "number" ? v.toLocaleString(X().lang() === "en" ? "en-GB" : "ro-RO") : esc(v);

function chipsFor(ids) {
  return `<div class="chips" style="margin-top:6px">${ids.slice(0, 120).map(id => `<span class="chip" data-b="${esc(id)}">${esc(X().bname(id))}</span>`).join("")}${ids.length > 120 ? ` … +${ids.length - 120}` : ""}</div>`;
}
function bar(n, max) { return `<span class="sbar"><i style="width:${max ? Math.max(2, 100 * n / max) : 0}%"></i></span>`; }

function derivedCard(d) {
  const open = SV.open[d.id];
  let body = "";
  if (Array.isArray(d.table)) {
    const max = Math.max(...d.table.map(r => typeof r[1] === "number" ? r[1] : 0));
    body = `<table class="t stat">${d.table.map((r, i) => {
      const ids = Array.isArray(r[2]) ? r[2] : null; const key = d.id + ":" + i;
      return `<tr><td>${esc(lx(r[0]))}</td><td class="num">${fmt(r[1])}</td><td>${typeof r[1] === "number" ? bar(r[1], max) : esc(r[2] || "")}</td>
        <td>${ids && ids.length ? `<a href="javascript:void 0" data-sopen="${key}" class="small">${SV.open[key] ? tt("hide") : tt("show")}</a>` : r[3] ? `<span class="small muted">${esc(r[3])}</span>` : ""}</td></tr>
        ${ids && SV.open[key] ? `<tr><td colspan="4">${chipsFor(ids)}</td></tr>` : ""}`; }).join("")}</table>`;
  } else if (d.table && d.table.rows) {
    body = `<div style="overflow:auto"><table class="t stat cross"><tr><th></th>${d.table.col_labels.map(c => `<th>${esc(lx(c))}</th>`).join("")}</tr>
      ${d.table.rows.map((r, i) => `<tr><td>${esc(lx(r[0]))}</td>${r[1].map((n, j) => { const key = d.id + ":" + i + ":" + j;
        return `<td class="num">${n ? `<a href="javascript:void 0" data-sopen="${key}">${n}</a>` : "·"}</td>`; }).join("")}</tr>
        ${d.table.cols.map((c, j) => SV.open[d.id + ":" + i + ":" + j] ? `<tr><td colspan="${d.table.cols.length + 1}">${chipsFor(r[2][c])}</td></tr>` : "").join("")}`).join("")}</table></div>`;
  }
  const inputs = (d.inputs || []).map(inp => inp.type === "statement" ? X().stItemById(inp.id) :
    inp.type === "metric" ? `<span class="chip">${esc(inp.id)}</span>` : "").join("");
  return `<div class="card statcard" id="stat-${esc(d.id)}">
    <div class="row"><span class="badge derived">${tt("derived_badge")}</span><h3 style="margin:0">${esc(lx(d.title))}</h3></div>
    <div class="bigval">${fmt(d.value)}</div>
    <p class="small"><b>${tt("method")}:</b> ${esc(lx(d.method))}</p>
    ${lx(d.caveat) ? `<p class="small caveat"><b>${tt("caveat")}:</b> ${esc(lx(d.caveat))}</p>` : ""}
    ${body}
    ${inputs ? `<h4>${tt("inputs")}</h4><div class="list">${inputs}</div>` : ""}
  </div>`;
}

function viewDerived() {
  const groups = ["comparisons", "damage", "interventions", "buildings", "geography", "text"];
  return groups.map(g => {
    const ds = S.derived.filter(d => d.group === g);
    return ds.length ? `<h2 class="sgroup">${tt("g_" + g)}</h2><div class="statgrid">${ds.map(derivedCard).join("")}</div>` : "";
  }).join("");
}
function viewStated() {
  const q = X().fold(SV.q);
  const chs = [...new Set(S.stated_numbers.map(n => n.ch).filter(Boolean))].sort();
  const rows = S.stated_numbers.filter(n => (!SV.ch || n.ch === SV.ch) && (!q || X().fold(`${n.q} ${n.unit} ${n.ro} ${n.en} ${n.cite}`).includes(q)));
  return `<div class="row" style="gap:8px;margin:10px 0"><input id="s-q" placeholder="${esc(tt("filter"))}" value="${esc(SV.q)}" style="flex:1">
    <select id="s-ch"><option value="">${esc(tt("all_ch"))}</option>${chs.map(c => `<option ${c === SV.ch ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
    <span class="small muted">${rows.length} ${tt("n_shown")}</span></div>
    <table class="t stat"><tr><th>${tt("value")}</th><th>${tt("unit")}</th><th>${tt("statement")}</th><th>${tt("cite")}</th></tr>
    ${rows.slice(0, 500).map(n => `<tr><td class="num"><b>${esc(n.q)}</b></td><td>${esc(n.unit)}</td>
      <td><a href="javascript:void 0" data-st="${esc(n.id)}">${esc(X().lang() === "en" ? (n.en || n.ro) : n.ro)}</a>${n.assertion !== "stated" ? ` <span class="badge">${esc(n.assertion)}</span>` : ""}</td>
      <td class="small">${esc(n.cite)}<br>${unitLink(n.u)}</td></tr>`).join("")}</table>`;
}
function viewCounties() {
  const by = {};
  S.county.forEach(m => (by[m.area] = by[m.area] || []).push(m));
  return Object.entries(by).map(([area, ms]) => `<div class="card"><h3 style="margin-top:0">${esc(area)} <a class="small" href="../map/#map=7/45.3/25.8">${tt("map")} ↗</a></h3>
    <table class="t stat"><tr><th>${tt("measure")}</th><th>${tt("object")}</th><th>${tt("value")}</th><th>${tt("pct")}</th><th>${tt("quote")}</th></tr>
    ${ms.map(m => `<tr><td>${esc(m.measure)}</td><td>${esc(m.object_class)}</td><td class="num">${fmt(Number(m.value))}${m.unit === "pct" ? " %" : ""}</td>
      <td class="num">${esc(m.of_total_pct)}</td><td class="small">„${esc(m.quote)}” ${unitLink(m.unit_id)}${m.note ? `<br><i class="muted">${esc(m.note)}</i>` : ""}</td></tr>`).join("")}</table></div>`).join("") +
    `<h3>${tt("mentions")}</h3><table class="t stat"><tr><th>${tt("area")}</th><th>${tt("organ")}</th><th>${tt("role")}</th><th>${tt("value")}</th><th>${tt("quote")}</th></tr>
    ${S.county_mentions.map(m => `<tr><td>${esc(m.area)}</td><td>${esc(m.organ)}</td><td>${esc(m.role)}</td><td class="num">${esc(m.value)}</td><td class="small">„${esc(m.quote)}” ${unitLink(m.unit_id)}</td></tr>`).join("")}</table>`;
}

window.StatsView = {
  view(sub) {
    if (!S) return `<div class="card">stats.js missing — run pipeline/s25_statistics.py</div>`;
    if (sub) SV.tab = sub === "counties" ? "counties" : sub === "stated" ? "stated" : "derived";
    const tabs = ["derived", "stated", "counties"].map(k => `<a href="#stats/${k}" class="${SV.tab === k ? "on" : ""}">${tt("t_" + k)}</a>`).join("");
    return `<h2 style="margin-bottom:4px">${tt("title")}</h2><p class="muted">${tt("intro")}</p>
      <nav class="subtabs">${tabs}</nav>
      <div id="stats-body">${SV.tab === "stated" ? viewStated() : SV.tab === "counties" ? viewCounties() : viewDerived()}</div>`;
  },
  bind() {
    const q = document.getElementById("s-q");
    if (q) { q.oninput = () => { SV.q = q.value; clearTimeout(SV._t); SV._t = setTimeout(() => { document.getElementById("stats-body").innerHTML = viewStated(); window.StatsView.bind(); const n = document.getElementById("s-q"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250); }; }
    const ch = document.getElementById("s-ch");
    if (ch) ch.onchange = () => { SV.ch = ch.value; document.getElementById("stats-body").innerHTML = viewStated(); window.StatsView.bind(); };
    document.querySelectorAll("[data-sopen]").forEach(a => a.onclick = () => { SV.open[a.dataset.sopen] = !SV.open[a.dataset.sopen];
      document.getElementById("stats-body").innerHTML = viewDerived(); window.StatsView.bind(); });
  },
};
})();
