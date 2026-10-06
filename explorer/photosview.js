/* ICCPDC explorer — Partea a IV-a (Fotografii): galleries, lightbox, photo-volume browser.
   Data: ICCPDC.photos (pipeline/s27_photo_export.py). Images: ../work/vol4/img/panels/ (local only, git-ignored).
   Used by app.js (building pages) and by the map (map.js loads the same data file). */
(() => {
const P = (window.ICCPDC || {}).photos;
const ROOTP = (location.pathname.includes("/map/") || location.pathname.includes("/explorer/")) ? "../" : "";
const LBL = {
  ro: {photos: "Fotografii", title: "Fotografii — Partea a IV-a", intro: "Fotografiile din sinteza ICCPDC (1978), în ordinea listei originale. Fiecare fotografie este legată de clădirea sau locul pe care îl arată.",
    all_sections: "toate capitolele", all_moments: "toate momentele", search: "Caută în legende…", page: "pagina", building: "Clădire", place: "Loc",
    generic: "subiect general / procedeu", on_map: "pe hartă", open_b: "pagina clădirii", close: "Închide", prev: "‹", next: "›", n_photos: "fotografii",
    list_entry: "Lista fotografiilor", technique: "procedeu"},
  en: {photos: "Photos", title: "Photos — Part IV", intro: "The photographs of the ICCPDC synthesis (1978), in the order of the original list. Each photo is linked to the building or place it shows.",
    all_sections: "all chapters", all_moments: "all moments", search: "Search captions…", page: "page", building: "Building", place: "Place",
    generic: "general subject / technique", on_map: "on the map", open_b: "building page", close: "Close", prev: "‹", next: "›", n_photos: "photos",
    list_entry: "List of photographs", technique: "technique"}};
const lang = () => (window.ICX ? window.ICX.lang() : (document.documentElement.lang || "ro"));
const tt = k => (LBL[lang()] || LBL.ro)[k] || k;
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const panelIndex = {};
const photoOf = {};
if (P) for (const ph of P.photos) for (const pn of ph.panels) { panelIndex[pn.panel_id] = pn; photoOf[pn.panel_id] = ph; }
const MCOL = {before: "#4f7d5c", after_overview: "#E64833", damage_detail: "#ef8a3c", shoring: "#b58a2e", works: "#2f6d8a", after_retrofit: "#3fb6c9", drawing: "#7d8a8c", other: "#9aa5a6"};
const mlabel = m => (P && P.moments[m] ? P.moments[m][lang() === "en" ? 1 : 0] : m);
const bname = id => (window.ICX && window.ICX.bname(id) !== id ? window.ICX.bname(id) : (P && P.buildings_v4[id] ? P.buildings_v4[id].name : id));

function gallery(ids, opts = {}) {
  if (!P || !ids || !ids.length) return "";
  const uniq = [...new Set(ids)].filter(i => panelIndex[i]);
  return `<div class="pgal ${opts.small ? "small" : ""}">${uniq.map(i => { const pn = panelIndex[i], ph = photoOf[i];
    return `<figure class="pthumb" data-ph="${esc(i)}" data-set="${esc(uniq.join(","))}" title="Foto ${ph.no}${esc(pn.letter)} — ${esc(mlabel(pn.moment))}">
      <img loading="lazy" src="${ROOTP}${esc(pn.thumb)}" alt="Foto ${ph.no}${esc(pn.letter)}"><figcaption><i style="background:${MCOL[pn.moment] || "#999"}"></i>Foto ${ph.no}${esc(pn.letter)}</figcaption></figure>`; }).join("")}</div>`;
}
function captionHTML(pn) {
  const ph = photoOf[pn.panel_id];
  const c = ph.captions.find(x => x.caption_id === pn.caption_id) || ph.captions[0];
  const item = c.items[pn.letter] || "";
  const blinks = pn.buildings.map(b => `<a href="${location.pathname.includes("/map/") ? "../explorer/" : ""}#buildings/${encodeURIComponent(b)}">${esc(bname(b))}</a>
    · <a href="${location.pathname.includes("/map/") ? "" : "../map/"}?b=${encodeURIComponent(b)}">${tt("on_map")} ↗</a>`).join("<br>");
  return `<div class="lb-kicker">Foto ${ph.no}${esc(pn.letter)} · ${tt("page")} ${esc(c.printed_page)} · <span class="mbadge" style="background:${MCOL[pn.moment] || "#999"}">${esc(mlabel(pn.moment))}</span></div>
    <div class="lb-cap">${esc(c.text)}</div>${item ? `<div class="lb-item"><b>${esc(pn.letter)})</b> ${esc(item)}</div>` : ""}
    ${blinks ? `<div class="lb-links"><b>${tt("building")}:</b><br>${blinks}</div>` : pn.subject_type === "generic" ? `<div class="lb-links">${tt("generic")}${pn.techniques.length ? ": " + pn.techniques.map(t => esc(window.ICX ? window.ICX.vlabel(t) : t)).join(", ") : ""}</div>` : ""}
    ${pn.place && !blinks ? `<div class="lb-links"><b>${tt("place")}:</b> ${esc(pn.place)}</div>` : ""}`;
}
let lbSet = [], lbIdx = 0, lbReturn = null;
function closeLB() { const el = document.getElementById("lightbox"); if (el) el.hidden = true; if (lbReturn && lbReturn.focus) lbReturn.focus(); }
function openLB(id, set) {
  lbSet = set && set.length ? set : [id]; lbIdx = Math.max(0, lbSet.indexOf(id)); lbReturn = document.activeElement;
  let el = document.getElementById("lightbox");
  if (!el) { el = document.createElement("div"); el.id = "lightbox"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); document.body.appendChild(el); }
  renderLB(); const x = el.querySelector(".lb-x"); if (x) x.focus();
}
function renderLB() {
  const el = document.getElementById("lightbox"); const pn = panelIndex[lbSet[lbIdx]]; if (!pn) return;
  el.setAttribute("aria-label", `Foto ${photoOf[pn.panel_id].no}${pn.letter}`);
  el.innerHTML = `<div class="lb-back" data-lbclose></div><div class="lb-box">
    <button class="lb-x" data-lbclose aria-keyshortcuts="Escape" aria-label="${tt("close")}">×</button>
    <div class="lb-img">${lbSet.length > 1 ? `<button class="lb-nav l" data-lbnav="-1">${tt("prev")}</button>` : ""}
      <img src="${ROOTP}${esc(pn.full)}" alt="Foto ${photoOf[pn.panel_id].no}${esc(pn.letter)}"><span class="lb-count">${lbIdx + 1} / ${lbSet.length}</span>
      ${lbSet.length > 1 ? `<button class="lb-nav r" data-lbnav="1">${tt("next")}</button>` : ""}</div>
    <div class="lb-side">${captionHTML(pn)}</div></div>`;
  el.hidden = false;
}
document.addEventListener("click", e => {
  const th = e.target.closest("[data-ph]");
  if (th) { e.preventDefault(); e.stopPropagation(); openLB(th.dataset.ph, (th.dataset.set || "").split(",").filter(Boolean)); return; }
  if (e.target.closest("[data-lbclose]")) { closeLB(); return; }
  const nv = e.target.closest("[data-lbnav]");
  if (nv) { lbIdx = (lbIdx + Number(nv.dataset.lbnav) + lbSet.length) % lbSet.length; renderLB(); }
}, true);
document.addEventListener("keydown", e => {
  const el = document.getElementById("lightbox"); if (!el || el.hidden) return;
  if (e.key === "Escape") closeLB();
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") { lbIdx = (lbIdx + (e.key === "ArrowRight" ? 1 : -1) + lbSet.length) % lbSet.length; renderLB(); }
});

// ---------- photo-volume browser (explorer view #photos)
const PV = {sec: "", mom: "", q: ""};
function fold(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
function viewPhotos() {
  if (!P) return `<div class="card">photos.js missing — run pipeline/s27_photo_export.py</div>`;
  const q = fold(PV.q);
  const rows = P.photos.filter(ph => (!PV.sec || ph.section === PV.sec)
    && (!PV.mom || ph.panels.some(p => p.moment === PV.mom))
    && (!q || fold(ph.captions.map(c => c.text + " " + Object.values(c.items).join(" ")).join(" ") + " " + ph.entries.map(e => e.text).join(" ")).includes(q)));
  const n = rows.reduce((a, ph) => a + ph.panels.length, 0);
  return `<h2 style="margin-bottom:4px">${tt("title")}</h2><p class="muted">${tt("intro")}</p>
    <div class="row" style="gap:8px;margin:10px 0;flex-wrap:wrap">
      <select id="pv-sec" aria-label="${esc(tt("all_sections"))}"><option value="">${tt("all_sections")}</option>${P.sections.map(s => `<option ${s === PV.sec ? "selected" : ""}>${esc(s)}</option>`).join("")}</select>
      <select id="pv-mom" aria-label="${esc(tt("all_moments"))}"><option value="">${tt("all_moments")}</option>${Object.keys(P.moments).map(m => `<option value="${m}" ${m === PV.mom ? "selected" : ""}>${esc(mlabel(m))}</option>`).join("")}</select>
      <input id="pv-q" type="search" aria-label="${esc(tt("search"))}" placeholder="${esc(tt("search"))}" value="${esc(PV.q)}" style="flex:1;min-width:200px">
      <span class="small muted">${rows.length} × Foto · ${n} ${tt("n_photos")}</span></div>
    ${rows.map(ph => { const pans = ph.panels.filter(p => !PV.mom || p.moment === PV.mom);
      const bs = [...new Set(ph.panels.flatMap(p => p.buildings))];
      return `<div class="card pcard"><div class="row" style="justify-content:space-between;align-items:baseline">
        <h3 style="margin:0">Foto ${ph.no}</h3><span class="small muted">${esc(ph.section)}</span></div>
        ${ph.captions.map(c => `<div class="small"><b>${esc(c.letters ? c.letters.split("").join(",") : "")}</b> ${esc(c.text)} <span class="muted">· ${tt("page")} ${esc(c.printed_page)}</span></div>`).join("")}
        ${gallery(pans.map(p => p.panel_id))}
        ${bs.length ? `<div class="chips" style="margin-top:6px">${bs.map(b => `<span class="chip" data-b="${esc(b)}">${esc(bname(b))}</span>`).join("")}</div>` : ""}</div>`; }).join("")}`;
}
function bindPhotos() {
  const re = () => { document.getElementById("main").innerHTML = viewPhotos(); bindPhotos(); };
  const s = document.getElementById("pv-sec"); if (s) s.onchange = () => { PV.sec = s.value; re(); };
  const m = document.getElementById("pv-mom"); if (m) m.onchange = () => { PV.mom = m.value; re(); };
  const q = document.getElementById("pv-q"); if (q) q.oninput = () => { PV.q = q.value; clearTimeout(PV._t); PV._t = setTimeout(() => { re(); const n = document.getElementById("pv-q"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 300); };
}
window.PhotosUI = {gallery, openLB, viewPhotos, bindPhotos, byBuilding: id => (P && P.by_building[id]) || [], byPlace: id => (P && P.by_place[id]) || [],
  v4: () => (P ? P.buildings_v4 : {}), mlabel, MCOL};
})();
