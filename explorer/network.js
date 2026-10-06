/* Topic network (mind map) — bubbles = vocabulary topics sized by how many statements carry them,
   edges = co-occurrence in a statement (co) and/or across argument links (lk).
   Data: ICCPDC.topicgraph (from pipeline/s18_export_explorer.py). Uses d3 v7 (vendor). */
(function () {
"use strict";
const GROUP_COLORS = {
  cause: "#874F41", structural_system: "#244855", building_category: "#5f8f8d", element: "#b58a2e",
  material: "#8a7a66", damage: "#E64833", measure: "#4f7d5c", phenomenon: "#2f6d8a", code: "#6d5a8c", institution: "#7d8a8c"
};
const GROUP_LABEL = {
  ro: { cause: "cauze", structural_system: "sisteme structurale", building_category: "categorii de clădiri", element: "elemente",
        material: "materiale", damage: "avarii", measure: "măsuri", phenomenon: "fenomene", code: "normative", institution: "instituții" },
  en: { cause: "causes", structural_system: "structural systems", building_category: "building categories", element: "elements",
        material: "materials", damage: "damage", measure: "measures", phenomenon: "phenomena", code: "codes", institution: "institutions" }
};
const STATE = { groups: null, stage: "", ch: "", edge: "both", minw: 3, sel: "", q: "" };
let sim = null;

function view() {
  const X = window.ICX, t = X.t, esc = X.esc, lang = X.lang();
  const groups = Object.keys(GROUP_COLORS);
  if (!STATE.groups) STATE.groups = new Set(groups);
  const intro = lang === "en"
    ? "Each bubble is a topic; its size is the number of statements that mention it. Lines join topics that appear in the same statement (or in statements linked by the argument). Drag, zoom, hover to see neighbours, click to open the statements."
    : "Fiecare bulă este o temă; mărimea ei este numărul de afirmații care o pomenesc. Liniile unesc temele care apar în aceeași afirmație (sau în afirmații legate pe firul argumentului). Trage, mărește, treci cu mouse-ul pentru vecini, apasă ca să deschizi afirmațiile.";
  return `<h2>${esc(lang === "en" ? "Topic network" : "Rețeaua temelor")}</h2><p class="muted" style="max-width:920px">${esc(intro)}</p>
  <div class="facets">
    ${groups.map(g => `<label class="gchip ${STATE.groups.has(g) ? "on" : ""}" data-g="${g}"><span class="dot" style="background:${GROUP_COLORS[g]}"></span>${esc(GROUP_LABEL[lang][g])}</label>`).join("")}
  </div>
  <div class="facets">
    <label for="n-st">${esc(t("nav_flow"))}</label><select id="n-st"><option value="">${esc(t("all"))}</option>${["hazard","effect","observation","cause","lesson","solution","recommendation","future_step"].map(s => `<option value="${s}" ${STATE.stage === s ? "selected" : ""}>${esc(t("st_" + s))}</option>`).join("")}</select>
    <label for="n-ch">${esc(t("chapter"))}</label><select id="n-ch"><option value="">${esc(t("all"))}</option>${["INTRO","I","II","III","IV","V","VI"].map(c => `<option value="${c}" ${STATE.ch === c ? "selected" : ""}>${c}</option>`).join("")}</select>
    <label for="n-edge">${esc(lang === "en" ? "Edges" : "Legături")}</label><select id="n-edge">
      <option value="both" ${STATE.edge === "both" ? "selected" : ""}>${esc(lang === "en" ? "co-occurrence + argument" : "co-apariție + argument")}</option>
      <option value="co" ${STATE.edge === "co" ? "selected" : ""}>${esc(lang === "en" ? "same statement" : "aceeași afirmație")}</option>
      <option value="lk" ${STATE.edge === "lk" ? "selected" : ""}>${esc(lang === "en" ? "argument links" : "legături de argument")}</option></select>
    <label for="n-minw">${esc(lang === "en" ? "min. strength" : "tărie min.")} <b id="n-minw-v">${STATE.minw}</b></label><input id="n-minw" type="range" min="1" max="20" value="${STATE.minw}">
    <input id="n-q" aria-label="${esc(lang === "en" ? "find a topic" : "caută o temă")}" placeholder="${esc(lang === "en" ? "find a topic…" : "caută o temă…")}" value="${esc(STATE.q)}" style="min-width:180px">
  </div>
  <div class="netwrap"><svg id="net"></svg><div id="net-side" class="card net-side"></div></div>`;
}

function weightOf(n) {
  if (STATE.stage && STATE.ch) return 0; // combined filter not tracked per node; fall back below
  if (STATE.stage) return n.st[STATE.stage] || 0;
  if (STATE.ch) return n.ch[STATE.ch] || 0;
  return n.n;
}

function bind() {
  const X = window.ICX, G = window.ICCPDC.topicgraph, lang = X.lang();
  const $ = s => document.querySelector(s);
  document.querySelectorAll(".gchip").forEach(el => el.onclick = () => {
    const g = el.dataset.g; STATE.groups.has(g) ? STATE.groups.delete(g) : STATE.groups.add(g); X.render();
  });
  $("#n-st").onchange = e => { STATE.stage = e.target.value; X.render(); };
  $("#n-ch").onchange = e => { STATE.ch = e.target.value; X.render(); };
  $("#n-edge").onchange = e => { STATE.edge = e.target.value; X.render(); };
  $("#n-minw").oninput = e => { $("#n-minw-v").textContent = e.target.value; };
  $("#n-minw").onchange = e => { STATE.minw = +e.target.value; X.render(); };
  $("#n-q").onchange = e => { STATE.q = e.target.value; const v = X.fold(STATE.q); const hit = nodes.find(n => X.fold(n.label).includes(v)); if (hit) select(hit.id); };

  // statements per topic under the current stage/chapter filter (exact counts, even when both filters are set)
  const stOK = s => (!STATE.stage || s.st === STATE.stage) && (!STATE.ch || X.chapterOf(s.sec) === STATE.ch);
  const cnt = new Map();
  for (const s of window.ICCPDC.statements) if (stOK(s)) for (const tp of new Set(s.tp)) cnt.set(tp, (cnt.get(tp) || 0) + 1);
  const nodes = G.nodes
    .map(n => ({ id: n.id, n: cnt.get(n.id) || 0, label: X.vlabel(n.id), g: (X.vocab.get(n.id) || {}).v || "" }))
    .filter(n => n.n > 0 && STATE.groups.has(n.g));
  const ids = new Set(nodes.map(n => n.id));
  const w = e => STATE.edge === "co" ? e.co : STATE.edge === "lk" ? e.lk : e.co + e.lk;
  const links = G.edges.filter(e => ids.has(e.s) && ids.has(e.t) && w(e) >= STATE.minw)
    .map(e => ({ source: e.s, target: e.t, w: w(e), co: e.co, lk: e.lk }));
  const svg = d3.select("#net"); svg.selectAll("*").remove();
  const W = svg.node().clientWidth || 900, H = svg.node().clientHeight || 600;
  nodes.forEach((n, i) => { const a = i * 2.39996, rr = 8 * Math.sqrt(i); n.x = W / 2 + rr * Math.cos(a); n.y = H / 2 + rr * Math.sin(a); });
  const g = svg.append("g");
  const zoom = d3.zoom().scaleExtent([0.15, 6]).on("zoom", ev => g.attr("transform", ev.transform));
  svg.call(zoom);
  function fit() {
    const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y); if (!xs.length) return;
    const x0 = d3.min(xs) - 40, x1 = d3.max(xs) + 40, y0 = d3.min(ys) - 40, y1 = d3.max(ys) + 40;
    const k = Math.min(2, 0.95 * Math.min(W / (x1 - x0), H / (y1 - y0)));
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity.translate(W / 2, H / 2).scale(k).translate(-(x0 + x1) / 2, -(y0 + y1) / 2));
  }
  const r = n => 4 + 2.1 * Math.sqrt(n.n);
  const maxW = d3.max(links, l => l.w) || 1;
  const link = g.append("g").attr("class", "links").selectAll("line").data(links).join("line")
    .attr("stroke-width", l => 0.6 + 3.4 * l.w / maxW).attr("class", l => l.lk && !l.co ? "lk" : "");
  const node = g.append("g").attr("class", "nodes").selectAll("g").data(nodes).join("g").attr("class", "nd")
    .call(d3.drag().on("start", (ev, d) => { if (!ev.active) sim.alphaTarget(0.2).restart(); d.fx = d.x; d.fy = d.y; })
      .on("drag", (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
      .on("end", (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));
  node.append("circle").attr("r", r).attr("fill", n => GROUP_COLORS[n.g] || "#999");
  const labelMin = d3.quantile(nodes.map(n => n.n).sort(d3.ascending), 0.86) || 1;
  node.append("text").attr("dy", n => r(n) + 12).attr("text-anchor", "middle").text(n => n.label)
    .attr("class", n => n.n >= labelMin ? "lbl big" : "lbl");
  node.append("title").text(n => `${n.label} — ${n.n}`);
  const nbr = new Map(nodes.map(n => [n.id, new Set()]));
  links.forEach(l => { nbr.get(l.source).add(l.target); nbr.get(l.target).add(l.source); });
  node.on("mouseenter", (ev, d) => focus(d.id)).on("mouseleave", () => focus(STATE.sel || null)).on("click", (ev, d) => select(d.id));
  function focus(id) {
    if (!id) { node.classed("dim", false); link.classed("dim", false).classed("hot", false); return; }
    const nb = nbr.get(id) || new Set();
    node.classed("dim", d => d.id !== id && !nb.has(d.id));
    link.classed("dim", l => (l.source.id || l.source) !== id && (l.target.id || l.target) !== id)
        .classed("hot", l => (l.source.id || l.source) === id || (l.target.id || l.target) === id);
  }
  function select(id) {
    STATE.sel = id; focus(id);
    node.classed("sel", d => d.id === id);
    const n = nodes.find(x => x.id === id); if (!n) return;
    const sts = window.ICCPDC.statements.filter(s => s.tp.includes(id) && stOK(s));
    const byStage = d3.rollup(sts, v => v.length, s => s.st);
    const nbList = links.filter(l => l.source.id === id || l.target.id === id)
      .map(l => ({ o: l.source.id === id ? l.target : l.source, w: l.w })).sort((a, b) => b.w - a.w).slice(0, 14);
    const esc = X.esc, t = X.t;
    const total = sts.length || 1;
    document.getElementById("net-side").innerHTML = `
      <div class="small muted">${esc(GROUP_LABEL[lang][n.g] || n.g)}</div>
      <h3 style="margin-top:2px">${esc(n.label)}</h3>
      <div class="small muted">${esc(X.vlabelAlt(id))}</div>
      <div class="stagebar">${["hazard","effect","observation","cause","lesson","solution","recommendation","future_step"].map(s => byStage.get(s) ? `<span title="${esc(t("st_" + s))}: ${byStage.get(s)}" style="flex:${byStage.get(s)};background:var(--${s})"></span>` : "").join("")}</div>
      <div class="small">${sts.length} ${esc(t("statements"))} · <a href="javascript:void 0" id="n-open">${esc(t("nav_flow"))} →</a></div>
      ${nbList.length ? `<h3>${esc(lang === "en" ? "Strongest neighbours" : "Vecini puternici")}</h3><div class="chips">${nbList.map(x => `<span class="chip" data-nsel="${x.o.id}">${esc(x.o.label)} · ${x.w}</span>`).join("")}</div>` : ""}
      <h3>${esc(t("statements"))}</h3><div class="list">${sts.slice(0, 25).map(X.stItem).join("")}</div>
      ${sts.length > 25 ? `<div class="small muted" style="margin-top:6px">+${sts.length - 25}</div>` : ""}`;
    document.querySelectorAll("[data-nsel]").forEach(el => el.onclick = () => select(el.dataset.nsel));
    document.getElementById("n-open").onclick = () => X.openFlowTopic(id, STATE.stage);
  }
  sim = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(l => 40 + 120 / Math.sqrt(l.w)).strength(l => Math.min(1, 0.08 + l.w / maxW)))
    .force("charge", d3.forceManyBody().strength(n => -30 - 6 * Math.sqrt(n.n)))
    .force("collide", d3.forceCollide(n => r(n) + 3))
    .force("center", d3.forceCenter(W / 2, H / 2))
    .force("x", d3.forceX(W / 2).strength(0.06)).force("y", d3.forceY(H / 2).strength(0.08))
    .on("tick", () => {
      link.attr("x1", l => l.source.x).attr("y1", l => l.source.y).attr("x2", l => l.target.x).attr("y2", l => l.target.y);
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    })
    .on("end", fit);
  setTimeout(fit, 1200);
  document.getElementById("net-side").innerHTML = `<div class="small muted">${nodes.length} ${lang === "en" ? "topics" : "teme"} · ${links.length} ${lang === "en" ? "links" : "legături"}</div>`;
  if (STATE.sel && ids.has(STATE.sel)) select(STATE.sel);
}
window.NetworkView = { view, bind, stop: () => sim && sim.stop() };
})();
