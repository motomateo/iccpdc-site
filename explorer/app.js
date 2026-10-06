/* ICCPDC 1977 explorer — static, no build step. Data: window.ICCPDC (explorer/data/*.js) */
(function () {
"use strict";
const D = window.ICCPDC;
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fold = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/* ---------- i18n ---------- */
let LANG = localStorage.getItem("iccpdc_lang") || "ro";
const T = {
  ro: {
    title: "Cutremurul din 4 martie 1977", subtitle: "ICCPDC · Sinteza monografiei, partea I (1978) — explorator",
    nav_flow: "Firul argumentului", nav_network: "Rețeaua temelor", nav_buildings: "Clădiri", nav_reader: "Text", nav_search: "Căutare", nav_sources: "Surse", nav_stats: "Statistici", nav_photos: "Fotografii", nav_simpl: "Consolidări reduse", photos: "Fotografii (Partea a IV-a)", part_iv: "Partea IV", v4_note: "Clădire cunoscută doar din volumul de fotografii", nav_map: "Hartă ↗", on_map: "vezi pe hartă",
    flow_intro: "Raportul urmează un fir: ce a fost cutremurul, ce a produs, cum s-au comportat construcțiile, de ce, ce s-a învățat, ce s-a făcut și ce se recomandă. Alege o etapă; deschide o afirmație ca să-i vezi legăturile înainte și înapoi pe fir.",
    all: "toate", chapter: "Capitol", event: "Eveniment", topic: "Temă", assertion: "Tip", filter: "Filtrează…",
    showing: "afișate", of: "din", more: "Mai multe", statements: "afirmații", quote: "Citat (text original, 1978)",
    summary: "Rezumat", context: "Context (paragraful sursă)", scan: "Vezi pe pagina scanată", links_in: "Vine din", links_out: "Duce la",
    buildings: "Clădiri", places: "Locuri", topics: "Teme", cite: "Sursa", inferred: "legătură dedusă între capitole",
    explicit: "legătură afirmată în text", b_search: "Caută clădire, adresă, localitate…", b_class: "Tip", structure: "construcție",
    group: "grup", attributes: "Caracteristici", facts: "Fapte din text", mentions: "Apariții în text", related: "Afirmații despre clădire",
    relations: "Relații", none: "—", inherited_basis: "dedus din contextul secțiunii", reader_pick: "Alege o secțiune din cuprins.",
    diplomatic: "Diplomatic (1978)", modern: "Ortografie modernă", search_ph: "Caută în text, afirmații și clădiri (fără diacritice e ok)…",
    res_units: "Paragrafe", res_st: "Afirmații", res_b: "Clădiri", biblio: "Bibliografie", errata: "Erată", discrep: "Discrepanțe în original",
    rescans: "Pagini refotografiate", page: "pagina", hypothesis: "ipoteză", foreign_view: "opinie străină", stated: "afirmat",
    ev_1977: "1977", ev_1940: "1940", ev_general: "general", ev_other: "alt cutremur", n_found: "rezultate",
    st_hazard: "Hazard", st_effect: "Efecte", st_observation: "Comportare", st_cause: "Cauze", st_lesson: "Învățăminte",
    st_solution: "Soluții aplicate", st_recommendation: "Recomandări", st_future_step: "Pași viitori",
    sd_hazard: "ce a fost cutremurul", sd_effect: "ce a produs", sd_observation: "cum s-au comportat construcțiile",
    sd_cause: "de ce", sd_lesson: "ce s-a învățat", sd_solution: "ce s-a făcut", sd_recommendation: "ce trebuie făcut", sd_future_step: "acțiuni planificate",
    r_explains: "explică", r_evidence_for: "susține", r_addresses: "răspunde la", r_leads_to: "conduce la", r_refines: "detaliază", r_contradicts: "contrazice",
    ri_explains: "explicat de", ri_evidence_for: "susținut de", ri_addresses: "abordat de", ri_leads_to: "rezultă din", ri_refines: "detaliat de", ri_contradicts: "contrazis de",
  },
  en: {
    title: "The 4 March 1977 earthquake", subtitle: "ICCPDC · Synthesis of the monograph, part I (1978) — explorer",
    nav_flow: "Argument flow", nav_network: "Topic network", nav_buildings: "Buildings", nav_reader: "Text", nav_search: "Search", nav_sources: "Sources", nav_stats: "Statistics", nav_photos: "Photos", nav_simpl: "Trimmed strengthening", photos: "Photos (Part IV)", part_iv: "Part IV", v4_note: "Building known only from the photo volume", nav_map: "Map ↗", on_map: "view on map",
    flow_intro: "The report follows a thread: what the earthquake was, what it caused, how buildings behaved, why, what was learned, what was done and what is recommended. Pick a stage; open a statement to follow its links up and down the thread.",
    all: "all", chapter: "Chapter", event: "Event", topic: "Topic", assertion: "Type", filter: "Filter…",
    showing: "showing", of: "of", more: "More", statements: "statements", quote: "Quote (original text, 1978)",
    summary: "Summary", context: "Context (source paragraph)", scan: "Show on the scanned page", links_in: "Comes from", links_out: "Leads to",
    buildings: "Buildings", places: "Places", topics: "Topics", cite: "Source", inferred: "inferred cross-chapter link",
    explicit: "link stated in the text", b_search: "Search building, address, town…", b_class: "Class", structure: "structure",
    group: "group", attributes: "Attributes", facts: "Facts from the text", mentions: "Mentions in the text", related: "Statements about this building",
    relations: "Relations", none: "—", inherited_basis: "inferred from section context", reader_pick: "Pick a section from the contents.",
    diplomatic: "Diplomatic (1978)", modern: "Modern spelling", search_ph: "Search text, statements and buildings (diacritics optional)…",
    res_units: "Paragraphs", res_st: "Statements", res_b: "Buildings", biblio: "Bibliography", errata: "Errata", discrep: "Discrepancies in the original",
    rescans: "Re-photographed pages", page: "page", hypothesis: "hypothesis", foreign_view: "foreign view", stated: "stated",
    ev_1977: "1977", ev_1940: "1940", ev_general: "general", ev_other: "other quake", n_found: "results",
    st_hazard: "Hazard", st_effect: "Effects", st_observation: "Behaviour", st_cause: "Causes", st_lesson: "Lessons",
    st_solution: "Solutions applied", st_recommendation: "Recommendations", st_future_step: "Future steps",
    sd_hazard: "what the earthquake was", sd_effect: "what it caused", sd_observation: "how buildings behaved",
    sd_cause: "why", sd_lesson: "what was learned", sd_solution: "what was done", sd_recommendation: "what should be done", sd_future_step: "planned actions",
    r_explains: "explains", r_evidence_for: "supports", r_addresses: "addresses", r_leads_to: "leads to", r_refines: "refines", r_contradicts: "contradicts",
    ri_explains: "explained by", ri_evidence_for: "supported by", ri_addresses: "addressed by", ri_leads_to: "follows from", ri_refines: "refined by", ri_contradicts: "contradicted by",
  }
};
const t = k => (T[LANG][k] ?? T.ro[k] ?? k);
const STAGES = ["hazard", "effect", "observation", "cause", "lesson", "solution", "recommendation", "future_step"];
const CHAPTERS = [["INTRO", "Intro"], ["I", "I"], ["II", "II"], ["III", "III"], ["IV", "IV"], ["V", "V"], ["VI", "VI"]];

/* ---------- indexes ---------- */
const units = new Map(D.units.map(u => [u.id, u]));
const pages = new Map(D.pages.map(p => [p.id, p]));
const pageOrder = D.pages.map(p => p.id);
const sections = new Map(D.sections.map(s => [s.id, s]));
const st = new Map(D.statements.map(s => [s.id, s]));
// buildings known only from Partea IV (photo volume) join the list as minimal records
if (window.PhotosUI) for (const [id, v] of Object.entries(window.PhotosUI.v4()))
  if (!D.buildings.some(b => b.id === id)) D.buildings.push({id, name: v.name, aliases: [], cls: v.cls || "structure", type: v.type, addr: v.addr, loc: v.loc,
    county: "", period: "", year: "", height: v.height, ss: v.ss, designer: "", inst: "", notes: "", rel: [], facts: [], mentions: [], basis: [], v4: true, evidence: v.evidence});
const bld = new Map(D.buildings.map(b => [b.id, b]));
const vocab = new Map(D.vocab.map(v => [v.id, v]));
const outL = new Map(), inL = new Map();
for (const l of D.links) {
  if (!st.has(l.f) || !st.has(l.t)) continue;
  (outL.get(l.f) || outL.set(l.f, []).get(l.f)).push(l);
  (inL.get(l.t) || inL.set(l.t, []).get(l.t)).push(l);
}
const stByUnit = new Map();
for (const s of D.statements) (stByUnit.get(s.u) || stByUnit.set(s.u, []).get(s.u)).push(s);
const stByBuilding = new Map();
for (const s of D.statements) for (const b of s.b) (stByBuilding.get(b) || stByBuilding.set(b, []).get(b)).push(s);
const chapterOf = sec => { const s = sections.get(sec); return s ? s.ch : ""; };
const vlabel = id => { const v = vocab.get(id); return v ? (LANG === "en" ? v.en || v.ro : v.ro || v.en) : id; };
const summ = s => (LANG === "en" ? s.en || s.ro : s.ro || s.en);

/* ---------- shared bits ---------- */
const stageBadge = stg => `<span class="badge stage ${stg}">${esc(t("st_" + stg))}</span>`;
const asBadge = a => a && a !== "stated" ? `<span class="badge">${esc(t(a))}</span>` : "";
const evBadge = e => e ? `<span class="badge">${esc(t("ev_" + e))}</span>` : "";
function stItem(s) {
  return `<div class="item" style="--c:var(--${s.st})" data-st="${s.id}">
    <div class="s">${esc(summ(s))}</div>
    <div class="q">«${esc(s.q)}»</div>
    <div class="meta">${stageBadge(s.st)}${evBadge(s.ev)}${asBadge(s.as)}<span class="small muted">${esc(s.cite)}</span>
    ${s.b.length ? `<span class="small muted">· ${s.b.length} ${esc(t("buildings").toLowerCase())}</span>` : ""}</div></div>`;
}
document.addEventListener("click", e => {
  const a = e.target.closest("[data-st]"); if (a) { openStatement(a.dataset.st); return; }
  const b = e.target.closest("[data-b]"); if (b) { location.hash = "#buildings/" + b.dataset.b; return; }
  const sc = e.target.closest("[data-scan]"); if (sc) { openScanForUnit(sc.dataset.scan); return; }
  const pg = e.target.closest("[data-page]"); if (pg) { openScanPage(pg.dataset.page, []); return; }
  const tp = e.target.closest("[data-topic]"); if (tp) { FLOW.topic = tp.dataset.topic; FLOW.limit = 60; closeDrawer(); location.hash = "#flow"; render(); return; }
});

/* ---------- drawer (statement detail) ---------- */
const drawerStack = [];
function openDrawer(title, html, push = true) {
  if (push) drawerStack.push([title, html]);
  $("#drawer-title").textContent = title; $("#drawer-body").innerHTML = html; $("#drawer-body").scrollTop = 0;
  const wasOpen = $("#drawer").classList.contains("open");
  $("#drawer").classList.add("open"); $("#drawer").setAttribute("aria-hidden", "false");
  if (!wasOpen) { drawerReturn = document.activeElement; $("#drawer-close").focus({preventScroll: true}); }
}
let drawerReturn = null;
function closeDrawer() { drawerStack.length = 0; $("#drawer").classList.remove("open"); $("#drawer").setAttribute("aria-hidden", "true"); if (drawerReturn && drawerReturn.isConnected) drawerReturn.focus({preventScroll: true}); }
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#drawer").classList.contains("open") && document.getElementById("lightbox")?.hidden !== false) closeDrawer(); });
$("#drawer-close").onclick = closeDrawer;
$("#drawer-back").onclick = () => { drawerStack.pop(); const p = drawerStack[drawerStack.length - 1]; p ? openDrawer(p[0], p[1], false) : closeDrawer(); };
function markQuote(text, q) {
  const i = text.indexOf(q);
  if (i < 0) return esc(text);
  return esc(text.slice(0, i)) + "<mark>" + esc(q) + "</mark>" + esc(text.slice(i + q.length));
}
function linkList(arr, dir) {
  if (!arr || !arr.length) return "";
  const groups = {};
  for (const l of arr) { const k = (dir === "out" ? "r_" : "ri_") + l.r; (groups[k] = groups[k] || []).push(l); }
  return Object.entries(groups).map(([k, ls]) => `<div class="linkgroup"><div class="lh">${esc(t(k))}</div>${ls.map(l => {
    const o = st.get(dir === "out" ? l.t : l.f); const inf = l.x === "inferred_xchapter";
    return `<div class="li ${inf ? "inf" : ""}" data-st="${o.id}" title="${esc(inf ? t("inferred") : t("explicit"))}">
      ${stageBadge(o.st)} ${esc(summ(o))} <span class="small muted">· ${esc(o.cite)}</span>
      ${l.note ? `<div class="why">${inf ? "↔ " : ""}${esc(l.note)}</div>` : ""}</div>`;
  }).join("")}</div>`).join("");
}
function openStatement(id) {
  const s = st.get(id); if (!s) return;
  const u = units.get(s.u);
  const html = `<div class="row">${stageBadge(s.st)}${evBadge(s.ev)}${asBadge(s.as)}<span class="small muted">${esc(s.cite)}</span></div>
    <h3>${esc(t("summary"))}</h3><div>${esc(summ(s))}</div>
    <div class="small muted" style="margin-top:4px">${esc(LANG === "en" ? s.ro : s.en)}</div>
    <h3>${esc(t("quote"))}</h3><div class="quote">«${esc(s.q)}»</div>
    ${s.n ? `<div class="small">${esc(s.n)} ${esc(s.nu)}</div>` : ""}
    <h3>${esc(t("context"))}</h3><div class="ctx">${u ? markQuote(u.t, s.q) : ""}</div>
    <div class="row" style="margin-top:8px"><button data-scan="${s.u}">${esc(t("scan"))}</button><a href="#reader/${esc(s.sec)}/${esc(s.u)}" class="small">${esc(t("nav_reader"))} →</a></div>
    ${s.b.length ? `<h3>${esc(t("buildings"))}</h3><div class="chips">${s.b.map(b => `<span class="chip" data-b="${b}">${esc(bld.get(b)?.name || b)}</span>`).join("")}</div>` : ""}
    ${s.tp.length ? `<h3>${esc(t("topics"))}</h3><div class="chips">${s.tp.map(x => `<span class="chip" data-topic="${x}">${esc(vlabel(x))}</span>`).join("")}</div>` : ""}
    ${s.pl.length ? `<h3>${esc(t("places"))}</h3><div class="small">${s.pl.map(esc).join(" · ")}</div>` : ""}
    ${(inL.get(id) || []).length ? `<h3>${esc(t("links_in"))}</h3>${linkList(inL.get(id), "in")}` : ""}
    ${(outL.get(id) || []).length ? `<h3>${esc(t("links_out"))}</h3>${linkList(outL.get(id), "out")}` : ""}
    <div class="small muted" style="margin-top:18px">${esc(id)} · ${esc(s.u)}</div>`;
  openDrawer(t("st_" + s.st), html);
}

/* ---------- scan viewer ---------- */
let SCAN = { page: null, marks: [] };
function openScanForUnit(uid) {
  const u = units.get(uid); if (!u) return;
  const p = (u.loc[0] && u.loc[0][0]) || u.p0;
  openScanPage(p, u.loc);
}
function openScanPage(pid, marks) {
  SCAN = { page: pid, marks: marks || [] };
  const p = pages.get(pid); if (!p) return;
  $("#scan-title").textContent = `${t("page")} ${p.label || p.id} · ${p.id}`;
  const img = $("#scan-img");
  img.onload = () => drawMarks($("#scan-marks"), img, p, SCAN.marks.filter(m => m[0] === pid));
  img.src = p.img;
  $("#scan").classList.add("open"); $("#scan").setAttribute("aria-hidden", "false");
  if (img.complete) img.onload();
}
function drawMarks(layer, img, p, marks) {
  const k = img.clientWidth / p.w;
  layer.innerHTML = marks.map(m => `<div class="mk" style="left:${m[1] * k - 3}px;top:${m[2] * k - 3}px;width:${(m[3] - m[1]) * k + 6}px;height:${(m[4] - m[2]) * k + 6}px"></div>`).join("");
  const first = layer.querySelector(".mk"); if (first) first.scrollIntoView({ block: "center" });
}
const stepScan = d => { const i = pageOrder.indexOf(SCAN.page) + d; if (i >= 0 && i < pageOrder.length) openScanPage(pageOrder[i], SCAN.marks); };
$("#scan-close").onclick = () => { $("#scan").classList.remove("open"); $("#scan").setAttribute("aria-hidden", "true"); };
$("#scan-prev").onclick = () => stepScan(-1); $("#scan-next").onclick = () => stepScan(1);
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { if ($("#scan").classList.contains("open")) $("#scan-close").onclick(); else closeDrawer(); }
  if ($("#scan").classList.contains("open") && (e.key === "ArrowLeft" || e.key === "ArrowRight")) stepScan(e.key === "ArrowLeft" ? -1 : 1);
});
window.addEventListener("resize", () => { if ($("#scan").classList.contains("open")) openScanPage(SCAN.page, SCAN.marks); });

/* ---------- FLOW view ---------- */
const FLOW = { stage: "cause", ch: "", ev: "", topic: "", as: "", q: "", limit: 60 };
function flowFilter(s) {
  if (FLOW.ch && chapterOf(s.sec) !== FLOW.ch) return false;
  if (FLOW.ev && s.ev !== FLOW.ev) return false;
  if (FLOW.as && s.as !== FLOW.as) return false;
  if (FLOW.topic && !s.tp.includes(FLOW.topic)) return false;
  if (FLOW.q) { const q = fold(FLOW.q); if (!fold(s.ro + " " + s.en + " " + s.q).includes(q)) return false; }
  return true;
}
function viewFlow() {
  const base = D.statements.filter(flowFilter);
  const counts = Object.fromEntries(STAGES.map(x => [x, 0])); base.forEach(s => counts[s.st]++);
  const list = base.filter(s => s.st === FLOW.stage);
  const topics = [...new Set(D.statements.flatMap(s => s.tp))].map(id => [id, vlabel(id), vocab.get(id)?.v || ""])
    .sort((a, b) => a[2].localeCompare(b[2]) || a[1].localeCompare(b[1]));
  const vocabGroups = {}; topics.forEach(([id, l, g]) => (vocabGroups[g] = vocabGroups[g] || []).push([id, l]));
  return `<h2>${esc(t("nav_flow"))}</h2><p class="muted" style="max-width:900px">${esc(t("flow_intro"))}</p>
  <div class="chain">${STAGES.map(x => `<div class="step ${x === FLOW.stage ? "on" : ""}" style="--c:var(--${x})" data-stage="${x}">
    <div class="n">${counts[x]}</div><div class="l">${esc(t("st_" + x))}</div><div class="d">${esc(t("sd_" + x))}</div></div>`).join("")}</div>
  <div class="facets">
    <label for="f-ch">${esc(t("chapter"))}</label><select id="f-ch"><option value="">${esc(t("all"))}</option>${CHAPTERS.map(([k, l]) => `<option value="${k}" ${FLOW.ch === k ? "selected" : ""}>${l}</option>`).join("")}</select>
    <label for="f-ev">${esc(t("event"))}</label><select id="f-ev"><option value="">${esc(t("all"))}</option>${["1977", "1940", "general", "other"].map(k => `<option value="${k}" ${FLOW.ev === k ? "selected" : ""}>${esc(t("ev_" + k))}</option>`).join("")}</select>
    <label for="f-as">${esc(t("assertion"))}</label><select id="f-as"><option value="">${esc(t("all"))}</option>${["stated", "hypothesis", "foreign_view"].map(k => `<option value="${k}" ${FLOW.as === k ? "selected" : ""}>${esc(t(k))}</option>`).join("")}</select>
    <label for="f-tp">${esc(t("topic"))}</label><select id="f-tp" style="max-width:300px"><option value="">${esc(t("all"))}</option>${Object.entries(vocabGroups).map(([g, arr]) => `<optgroup label="${esc(g)}">${arr.map(([id, l]) => `<option value="${id}" ${FLOW.topic === id ? "selected" : ""}>${esc(l)}</option>`).join("")}</optgroup>`).join("")}</select>
    <input id="f-q" aria-label="${esc(t("filter"))}" placeholder="${esc(t("filter"))}" value="${esc(FLOW.q)}" style="min-width:220px">
  </div>
  <div class="small muted" style="margin-bottom:8px">${esc(t("st_" + FLOW.stage))}: ${t("showing")} ${Math.min(FLOW.limit, list.length)} ${t("of")} ${list.length} ${t("statements")}</div>
  <div class="list">${list.slice(0, FLOW.limit).map(stItem).join("")}</div>
  ${list.length > FLOW.limit ? `<button class="more" id="f-more">${esc(t("more"))}</button>` : ""}`;
}
function bindFlow() {
  document.querySelectorAll(".step").forEach(el => el.onclick = () => { FLOW.stage = el.dataset.stage; FLOW.limit = 60; render(); });
  const on = (id, k) => { const el = $(id); if (el) el.onchange = el.oninput = () => { FLOW[k] = el.value; FLOW.limit = 60; if (k !== "q") render(); else debounce(render, 250); }; };
  on("#f-ch", "ch"); on("#f-ev", "ev"); on("#f-as", "as"); on("#f-tp", "topic"); on("#f-q", "q");
  const m = $("#f-more"); if (m) m.onclick = () => { FLOW.limit += 120; render(); };
}
let _deb; function debounce(fn, ms) { clearTimeout(_deb); _deb = setTimeout(() => { const f = document.activeElement?.id; fn(); if (f) { const el = $("#" + f); if (el) { el.focus(); const v = el.value; el.setSelectionRange?.(v.length, v.length); } } }, ms); }

/* ---------- BUILDINGS view ---------- */
const BV = { q: "", cls: "", sel: "" };
function bMatch(b) {
  if (BV.cls && b.cls !== BV.cls) return false;
  if (!BV.q) return true;
  const q = fold(BV.q);
  return fold([b.name, ...b.aliases, b.addr, b.loc, b.inst, vlabel(b.type)].join(" ")).includes(q);
}
function viewBuildings(selId) {
  if (selId) BV.sel = selId;
  const list = D.buildings.filter(bMatch).sort((a, b) => (a.loc || "~").localeCompare(b.loc || "~") || a.name.localeCompare(b.name));
  return `<h2>${esc(t("nav_buildings"))}</h2>
  <div class="split"><div>
    <div class="row" style="margin-bottom:8px"><input id="b-q" aria-label="${esc(t("b_search"))}" placeholder="${esc(t("b_search"))}" value="${esc(BV.q)}" style="flex:1">
    <select id="b-cls" aria-label="${esc(t("nav_buildings"))}"><option value="">${esc(t("all"))}</option><option value="structure" ${BV.cls === "structure" ? "selected" : ""}>${esc(t("structure"))}</option><option value="group" ${BV.cls === "group" ? "selected" : ""}>${esc(t("group"))}</option></select></div>
    <div class="small muted" style="margin-bottom:6px">${list.length} ${t("of")} ${D.buildings.length}</div>
    <div class="blist">${list.map(b => `<div class="bitem ${b.id === BV.sel ? "on" : ""}" data-bsel="${b.id}">
      <div class="nm">${esc(b.name)}${b.cls === "group" ? ` <span class="badge">${esc(t("group"))}</span>` : ""}${b.v4 ? ` <span class="badge">${esc(t("part_iv"))}</span>` : ""}${window.PhotosUI && window.PhotosUI.byBuilding(b.id).length ? ` <span class="badge photo">📷 ${window.PhotosUI.byBuilding(b.id).length}</span>` : ""}</div>
      <div class="ad">${esc([b.addr, b.loc].filter(Boolean).join(" · ")) || "&nbsp;"}</div></div>`).join("")}</div>
  </div><div id="b-detail">${BV.sel ? buildingDetail(BV.sel) : `<div class="card muted">${list.length} ${esc(t("buildings").toLowerCase())}</div>`}</div></div>`;
}
function buildingDetail(id) {
  const b = bld.get(id); if (!b) return "";
  const basis = Object.fromEntries(b.basis.map(x => [x.attr, x.basis]));
  const attr = (k, v, key) => v ? `<div>${esc(k)}</div><div>${esc(v)}${basis[key] ? ` <span class="badge inherited" title="${esc(basis[key])}">${esc(t("inherited_basis"))}</span>` : ""}</div>` : "";
  const ss = b.ss ? b.ss.split(" | ").map(vlabel).join(" | ") : "";
  const sts = stByBuilding.get(id) || [];
  const factsBy = {}; b.facts.forEach(f => (factsBy[f.a] = factsBy[f.a] || []).push(f));
  return `<div class="card">
    <h2 style="margin-top:0">${esc(b.name)}</h2>
    ${b.aliases.length ? `<div class="small muted">${b.aliases.map(esc).join(" · ")}</div>` : ""}
    <h3>${esc(t("attributes"))}</h3><div class="kv">
      ${attr(t("b_class"), b.cls === "group" ? t("group") : t("structure"))}
      ${attr("type", b.type ? b.type.split(" | ").map(vlabel).join(" | ") : "")}
      ${attr("adresă / address", b.addr)}${attr("localitate / town", b.loc)}${attr("județ / county", b.county)}
      ${attr("perioadă / period", b.period, "period_text")}${attr("an / year", b.year)}${attr("regim / storeys", b.height)}
      ${attr("structură / structure", ss, "structural_system")}${attr("proiectant / designer", b.designer)}${attr("instituție", b.inst)}
    </div>
    ${b.notes ? `<p class="small muted">${esc(b.notes)}</p>` : ""}
    ${b.v4 ? `<p class="small muted">${esc(t("v4_note"))}: «${esc(b.evidence || "")}»</p>` : ""}
    ${window.PhotosUI && window.PhotosUI.byBuilding(id).length ? `<h3>${esc(t("photos"))} (${window.PhotosUI.byBuilding(id).length})</h3>${window.PhotosUI.gallery(window.PhotosUI.byBuilding(id))}` : ""}
    ${b.rel.length ? `<h3>${esc(t("relations"))}</h3><div class="chips">${b.rel.map(r => `<span class="chip" data-b="${r.to}">${esc(r.r.replace(/_/g, " "))}: ${esc(bld.get(r.to)?.name || r.to)}</span>`).join("")}</div>` : ""}
    ${b.facts.length ? `<h3>${esc(t("facts"))}</h3>${Object.entries(factsBy).map(([a, fs]) => fs.map(f => `<div class="fact"><span class="badge">${esc(a)}</span> ${esc(f.v)} ${esc(f.unit || "")}
      <span class="small muted">· ${esc(units.get(f.u)?.cite || "")}</span> <a href="javascript:void 0" data-scan="${f.u}" class="small">scan</a></div>`).join("")).join("")}` : ""}
    <h3>${esc(t("mentions"))}</h3>${b.mentions.map(m => `<div class="fact"><span class="small muted">${esc(units.get(m.u)?.cite || "")}</span>
      <div class="quote" style="font-size:14.5px">«${esc(m.q)}»</div><button data-scan="${m.u}" class="small">${esc(t("scan"))}</button></div>`).join("") || t("none")}
    ${sts.length ? `<h3>${esc(t("related"))} (${sts.length})</h3><div class="list">${sts.map(stItem).join("")}</div>` : ""}
    <div class="small muted" style="margin-top:14px">${esc(id)} · <a href="../map/?b=${encodeURIComponent(id)}">${esc(t("on_map"))} ↗</a></div></div>`;
}
function bindBuildings() {
  const q = $("#b-q"); q.oninput = () => { BV.q = q.value; debounce(render, 200); };
  $("#b-cls").onchange = e => { BV.cls = e.target.value; render(); };
  document.querySelectorAll("[data-bsel]").forEach(el => el.onclick = () => { location.hash = "#buildings/" + el.dataset.bsel; });
  const on = document.querySelector(".bitem.on"); if (on) on.scrollIntoView({ block: "nearest" });
}

/* ---------- READER view ---------- */
const RV = { sec: "", unit: "", layer: "t" };
function sectionUnits(secId) {
  const ids = new Set([secId]); let grew = true;
  while (grew) { grew = false; for (const s of D.sections) if (ids.has(s.parent) && !ids.has(s.id)) { ids.add(s.id); grew = true; } }
  return D.units.filter(u => ids.has(u.sec));
}
function viewReader(sec, unit) {
  if (sec) RV.sec = sec; if (unit !== undefined) RV.unit = unit || "";
  const toc = D.sections.map(s => `<a class="l${Math.min(s.lvl, 5)} ${s.id === RV.sec ? "on" : ""}" href="#reader/${esc(s.id)}">${esc(s.code ? s.code + " " : "")}${esc(s.title)}</a>`).join("");
  let body = `<div class="muted">${esc(t("reader_pick"))}</div>`;
  if (RV.sec) {
    const us = sectionUnits(RV.sec); let lastPage = "";
    body = us.map(u => {
      let pg = "";
      if (u.p0 !== lastPage) { lastPage = u.p0; const p = pages.get(u.p0); pg = `<div class="pg"><a href="javascript:void 0" data-page="${u.p0}">${esc(t("page"))} ${esc(p?.label || u.p0)}</a></div>`; }
      const n = (stByUnit.get(u.id) || []).length;
      return pg + `<div class="u ${u.kind} ${u.id === RV.unit ? "on" : ""}" data-unit="${u.id}" id="u-${u.id}">${esc(RV.layer === "m" ? u.m || u.t : u.t)}${n ? `<span class="cnt badge">${n}</span>` : ""}</div>`;
    }).join("");
  }
  return `<div class="row" style="justify-content:space-between"><h2>${esc(t("nav_reader"))}</h2>
    <div><button data-layer="t" class="${RV.layer === "t" ? "on" : ""}">${esc(t("diplomatic"))}</button> <button data-layer="m" class="${RV.layer === "m" ? "on" : ""}">${esc(t("modern"))}</button></div></div>
  <div class="reader"><nav class="toc card">${toc}</nav><div class="text card">${body}</div><div class="inline-scan" id="r-scan"><div class="muted small">${esc(t("scan"))}</div></div></div>`;
}
function bindReader() {
  document.querySelectorAll("[data-layer]").forEach(b => b.onclick = () => { RV.layer = b.dataset.layer; render(); });
  document.querySelectorAll(".text .u").forEach(el => el.onclick = () => { RV.unit = el.dataset.unit; document.querySelectorAll(".text .u.on").forEach(x => x.classList.remove("on")); el.classList.add("on"); showInlineScan(RV.unit); history.replaceState(null, "", `#reader/${RV.sec}/${RV.unit}`); });
  const tocOn = document.querySelector(".toc a.on"); if (tocOn) tocOn.scrollIntoView({ block: "center" });
  if (RV.unit) { const el = document.getElementById("u-" + RV.unit); if (el) { el.scrollIntoView({ block: "center" }); showInlineScan(RV.unit); } }
  else if (RV.sec) { const first = document.querySelector(".text .u"); if (first) showInlineScan(first.dataset.unit, true); }
}
function showInlineScan(uid, noMarks) {
  const u = units.get(uid); if (!u) return;
  const pid = (u.loc[0] && u.loc[0][0]) || u.p0; const p = pages.get(pid);
  const sts = stByUnit.get(uid) || [];
  $("#r-scan").innerHTML = `<div class="row small" style="margin-bottom:6px"><b>${esc(t("page"))} ${esc(p?.label || pid)}</b><span class="grow"></span><a href="javascript:void 0" data-scan="${uid}">⤢</a></div>
    <div class="ipage"><img id="r-img" src="${esc(p.img)}" alt=""><div id="r-marks"></div></div>
    ${sts.length ? `<h3>${esc(t("statements"))} (${sts.length})</h3><div class="list">${sts.map(stItem).join("")}</div>` : ""}`;
  const img = $("#r-img");
  const draw = () => drawMarks($("#r-marks"), img, p, noMarks ? [] : u.loc.filter(m => m[0] === pid));
  img.onload = draw; if (img.complete) draw();
}

/* ---------- SEARCH view ---------- */
let SQ = "";
function hl(text, q) { const f = fold(text), i = f.indexOf(q); if (i < 0) return esc(text.slice(0, 220)); const a = Math.max(0, i - 80); return (a ? "…" : "") + esc(text.slice(a, i)) + `<span class="hl">${esc(text.slice(i, i + q.length))}</span>` + esc(text.slice(i + q.length, i + q.length + 140)) + "…"; }
function viewSearch() {
  const q = fold(SQ.trim());
  let res = "";
  if (q.length >= 2) {
    const us = D.units.filter(u => fold(u.t + " " + u.m).includes(q)).slice(0, 200);
    const ss = D.statements.filter(s => fold(s.ro + " " + s.en + " " + s.q).includes(q)).slice(0, 200);
    const bs = D.buildings.filter(b => fold([b.name, ...b.aliases, b.addr, b.loc].join(" ")).includes(q)).slice(0, 100);
    res = `<h3>${esc(t("res_b"))} (${bs.length})</h3><div class="chips">${bs.map(b => `<span class="chip" data-b="${b.id}">${esc(b.name)}${b.loc ? " · " + esc(b.loc) : ""}</span>`).join("") || t("none")}</div>
      <h3>${esc(t("res_st"))} (${ss.length}${ss.length === 200 ? "+" : ""})</h3><div class="list">${ss.slice(0, 60).map(stItem).join("") || t("none")}</div>
      <h3>${esc(t("res_units"))} (${us.length}${us.length === 200 ? "+" : ""})</h3><div class="list">${us.slice(0, 80).map(u => `<a class="item" style="display:block" href="#reader/${esc(u.sec)}/${esc(u.id)}"><div class="q" style="color:var(--ink)">${hl(u.t, q) }</div><div class="meta"><span class="small muted">${esc(u.cite)}</span></div></a>`).join("") || t("none")}</div>`;
  }
  return `<h2>${esc(t("nav_search"))}</h2><input id="s-q" class="searchbox" type="search" aria-label="${esc(t("search_ph"))}" placeholder="${esc(t("search_ph"))}" value="${esc(SQ)}" autofocus>${res}`;
}
function bindSearch() { const q = $("#s-q"); q.oninput = () => { SQ = q.value; debounce(render, 250); }; q.focus(); }

/* ---------- SOURCES view ---------- */
function viewSources() {
  const S = D.sources;
  const page = l => { const p = D.pages.find(x => x.label === l); return p ? `<a href="javascript:void 0" data-page="${p.id}">${esc(l)}</a>` : esc(l); };
  return `<h2>${esc(t("nav_sources"))}</h2>
  <h3>${esc(t("biblio"))} (${S.bibliography.length})</h3><table class="t"><tr><th>#</th><th>autor</th><th>titlu / sursă</th><th>an</th></tr>
    ${S.bibliography.map(b => `<tr><td>${esc(b.ref_no)}</td><td>${esc(b.authors)}</td><td>${esc(b.title_source)}</td><td>${esc(b.year)}</td></tr>`).join("")}</table>
  <h3>${esc(t("errata"))} (${S.errata.length})</h3><table class="t"><tr><th>#</th><th>pag.</th><th>rînd</th><th>în loc de</th><th>se va citi</th></tr>
    ${S.errata.map(e => `<tr><td>${esc(e.errata_no)}</td><td>${page(e.page_ref)}</td><td>${esc(e.line_ref)}</td><td>${esc(e.wrong)}${e.instruction ? ` <i class="muted">${esc(e.instruction)}</i>` : ""}</td><td>${esc(e.correct)}</td></tr>`).join("")}</table>
  <h3>${esc(t("discrep"))} (${S.discrepancies.length})</h3><table class="t"><tr><th>tip</th><th>pagina</th><th>text</th><th>alt loc / TOC</th><th>notă</th></tr>
    ${S.discrepancies.map(d => `<tr><td>${esc(d.kind)}</td><td><a href="javascript:void 0" data-page="${esc(d.page_id)}">${esc(d.page_id)}</a></td><td>${esc(d.text_value)}</td><td>${esc(d.toc_value)}</td><td class="small">${esc(d.note)}</td></tr>`).join("")}</table>
  <h3>${esc(t("rescans"))}</h3><table class="t"><tr><th>pagina</th><th>fișier</th><th>claritate veche → nouă</th></tr>
    ${S.rescans.map(r => `<tr><td><a href="javascript:void 0" data-page="${esc(r.page_id)}">${esc(r.page_id)}</a></td><td>${esc(r.source_file)}</td><td>${esc(r.old_sharpness)} → ${esc(r.new_sharpness)}</td></tr>`).join("")}</table>`;
}

/* ---------- helpers exported to other views (network.js) ---------- */
window.ICX = {
  t, esc, fold, stItem, vocab, chapterOf, render: () => render(), lang: () => LANG,
  stItemById: id => st.get(id) ? stItem(st.get(id)) : "", bname: id => (bld.get(id) || {}).name || id,
  vlabel, vlabelAlt: id => { const v = vocab.get(id); return v ? (LANG === "en" ? v.ro : v.en) : ""; },
  openFlowTopic: (topic, stage) => { FLOW.topic = topic; if (stage) FLOW.stage = stage; FLOW.limit = 60; location.hash = "#flow"; render(); },
};

/* ---------- router ---------- */
function render() {
  if (window.NetworkView) window.NetworkView.stop();
  const [view, a, b] = (location.hash.slice(1) || "flow").split("/").map(decodeURIComponent);
  document.querySelectorAll("#tabs a").forEach(x => x.classList.toggle("on", x.dataset.view === view));
  const m = $("#main");
  if (view === "unit") {  // external deep link (map, statistics): #unit/<unit_id> -> reader at that unit
    const u = units.get(a); location.replace(u ? `#reader/${encodeURIComponent(u.sec)}/${encodeURIComponent(a)}` : "#reader"); return;
  }
  if (view === "photos" && window.PhotosUI) { m.innerHTML = window.PhotosUI.viewPhotos(); window.PhotosUI.bindPhotos(); }
  else if (view === "simplification" && window.SimplifyView) { m.innerHTML = window.SimplifyView.view(); window.SimplifyView.bind(); }
  else if (view === "stats" && window.StatsView) { m.innerHTML = window.StatsView.view(a); window.StatsView.bind(); }
  else if (view === "buildings") { m.innerHTML = viewBuildings(a); bindBuildings(); }
  else if (view === "reader") { m.innerHTML = viewReader(a, b); bindReader(); }
  else if (view === "search") { m.innerHTML = viewSearch(); bindSearch(); }
  else if (view === "sources") { m.innerHTML = viewSources(); }
  else if (view === "network" && window.NetworkView) { m.innerHTML = window.NetworkView.view(); window.NetworkView.bind(); }
  else { m.innerHTML = viewFlow(); bindFlow(); }
}
function applyLang() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
  document.querySelectorAll("[data-lang]").forEach(b => b.classList.toggle("on", b.dataset.lang === LANG));
}
const themeBtn = document.getElementById("theme");
function applyTheme(th) { if (th) document.documentElement.dataset.theme = th; else delete document.documentElement.dataset.theme; }
applyTheme((() => { try { return localStorage.getItem("iccpdc_theme"); } catch (e) { return null; } })());
if (themeBtn) themeBtn.onclick = () => {
  const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const th = dark ? "light" : "dark"; applyTheme(th); try { localStorage.setItem("iccpdc_theme", th); } catch (e) { }
  if (location.hash.startsWith("#network")) render();
};
document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { LANG = b.dataset.lang; try { localStorage.setItem("iccpdc_lang", LANG); } catch (e) { } applyLang(); render(); });
window.addEventListener("hashchange", render);
applyLang(); render();
})();
