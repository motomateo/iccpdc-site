/* ICCPDC explorer — "Consolidări reduse": evidence that initial strengthening projects were trimmed to local repairs (1977).
   Data: ICCPDC.simplification (pipeline/s28_simplification.py). Report evidence and external context are shown apart. */
(() => {
const S = (window.ICCPDC || {}).simplification;
const L = {
  ro: {title: "Consolidări reduse (1977)", intro: "Dosar: proiecte de consolidare concepute inițial pentru sporirea siguranței antiseismice care au fost simplificate, neaplicate sau limitate la remedieri locale. Dovezile din sinteza ICCPDC (citate exacte, cu trimitere la text) sunt separate de contextul extern.",
    cases: "Clădiri", timeline: "Cronologie", policy: "Politica generală (din sinteză)", method: "Metodă", strength: "Grad", designer: "Proiectant",
    initial: "Inițial / recomandat", executed: "Executat", verify: "de verificat (sinteza)", evidence: "Dovezi", in_text: "în text", map: "pe hartă",
    s_A: "A — reducere explicită", s_B: "B — redus față de expertiză / sferă limitată", s_C: "C — doar restabilirea capacității inițiale", s_X: "X — contra-exemplu (peste restabilire)",
    src_report: "sinteza ICCPDC", src_external: "sursă externă", src_user: "context (utilizator) — de documentat", verification: "verificare",
    method_txt: "Toate pasajele despre consolidare (cap. IV.A, IV.D, V.E, VI.C) au fost citite integral; fiecare citat este validat automat față de textul transcris. Gradele: A = sinteza spune explicit că proiectul inițial a fost simplificat sau neaplicat; B = proiect executat strict local în contrast cu soluția revizuită de experți sau recomandată de aceștia, ori sinteza subliniază limitarea („s-a limitat”, „s-a rezumat numai”, „de fapt”); C = proiect orientat doar spre restabilirea capacității dinainte de cutremur (abordarea impusă prin directive, IV.D.1 §4); X = contra-exemple. Sinteza nu datează proiectele individuale; cronologia combină datele din sinteză cu sursa externă ordinulcriminal.ro, marcată distinct.",
    photos: "fotografii"},
  en: {title: "Trimmed strengthening (1977)", intro: "Dossier: strengthening projects initially designed to raise seismic safety that were simplified, not applied, or limited to local repairs. Evidence from the ICCPDC synthesis (exact quotes, linked to the text) is kept apart from external context.",
    cases: "Buildings", timeline: "Chronology", policy: "General policy (from the synthesis)", method: "Method", strength: "Grade", designer: "Designer",
    initial: "Initial / recommended", executed: "Executed", verify: "to be verified (synthesis)", evidence: "Evidence", in_text: "in text", map: "on the map",
    s_A: "A — explicit reduction", s_B: "B — reduced vs expert review / limited scope", s_C: "C — restoration of initial capacity only", s_X: "X — counter-example (beyond restoration)",
    src_report: "ICCPDC synthesis", src_external: "external source", src_user: "context (user) — to be sourced", verification: "verification",
    method_txt: "All passages on strengthening (ch. IV.A, IV.D, V.E, VI.C) were read in full; every quote is validated automatically against the transcribed text. Grades: A = the synthesis states the initial project was simplified or not applied; B = executed strictly locally in contrast with the solution reviewed or recommended by experts, or the synthesis stresses the limitation ('s-a limitat', 's-a rezumat numai', 'de fapt'); C = aimed only at restoring the pre-earthquake capacity (the approach imposed by directives, IV.D.1 §4); X = counter-examples. The synthesis does not date individual projects; the chronology combines the synthesis's dates with the external source ordinulcriminal.ro, marked separately.",
    photos: "photos"}};
const X = () => window.ICX;
const tt = k => (L[X().lang()] || L.ro)[k] || k;
const esc = s => X().esc(s);
const SCOL = {A: "#E64833", B: "#ef8a3c", C: "#90AEAD", X: "#4f7d5c"};
const evById = () => Object.fromEntries((S.evidence || []).map(e => [e.evidence_id, e]));
function quote(e) {
  return `<div class="sq"><span class="badge">${esc(e.evidence_type.replace(/_/g, " "))}</span> «${esc(e.quote)}» <span class="small muted">${esc(e.cite)} · ${esc(e.actor)}</span>
    <a class="small" href="#unit/${encodeURIComponent(e.unit_id)}">${tt("in_text")} →</a>${e.note ? `<div class="small muted">${esc(e.note)}</div>` : ""}</div>`;
}
function view() {
  if (!S) return `<div class="card">simplification.js missing — run pipeline/s28_simplification.py</div>`;
  const ev = evById();
  const cards = ["A", "B", "C", "X"].map(g => {
    const cs = S.cases.filter(c => c.strength === g); if (!cs.length) return "";
    return `<h3 class="sgroup" style="border-left:6px solid ${SCOL[g]};padding-left:10px">${tt("s_" + g)} (${cs.length})</h3>` + cs.map(c => {
      const ph = window.PhotosUI ? window.PhotosUI.byBuilding(c.building_id) : [];
      return `<div class="card simcase"><div class="row" style="justify-content:space-between;align-items:baseline">
        <h3 style="margin:0"><a href="#buildings/${encodeURIComponent(c.building_id)}">${esc(X().bname(c.building_id))}</a></h3>
        <span class="small"><a href="../map/?b=${encodeURIComponent(c.building_id)}">${tt("map")} ↗</a></span></div>
        <div class="kv">${c.designer ? `<div>${tt("designer")}</div><div>${esc(c.designer)}</div>` : ""}
          ${c.initial_or_recommended ? `<div>${tt("initial")}</div><div>${esc(c.initial_or_recommended)}</div>` : ""}
          <div>${tt("executed")}</div><div>${esc(c.executed)}</div></div>
        ${c.flagged_for_verification === "1" ? `<span class="badge" style="background:#b58a2e;color:#fff">${tt("verify")}</span>` : ""}
        ${c.note ? `<p class="small muted">${esc(c.note)}</p>` : ""}
        <h4>${tt("evidence")}</h4>${c.evidence_ids.split(";").filter(Boolean).map(i => quote(ev[i])).join("")}
        ${ph.length ? `<h4>${tt("photos")} (${ph.length})</h4>${window.PhotosUI.gallery(ph, {small: true})}` : ""}</div>`; }).join("");
  }).join("");
  const srcl = s => s === "report" ? tt("src_report") : s === "external" ? tt("src_external") : tt("src_user");
  const tl = `<table class="t stat timeline"><tr><th>data</th><th></th><th>${tt("timeline")}</th><th>${tt("verification")}</th></tr>${S.timeline.map(t =>
    `<tr class="src-${esc(t.source_type)}"><td class="num">${esc(t.date_start)}${t.date_end ? " → " + esc(t.date_end) : ""}</td>
      <td><span class="badge src ${esc(t.source_type)}">${esc(srcl(t.source_type))}</span></td>
      <td>${esc(t.event)}<br><span class="small muted">${/^v1_/.test(t.source_ref) ? `<a href="#unit/${encodeURIComponent(t.source_ref)}">${esc(t.source_ref)}</a>` : /^https?:/.test(t.source_ref) ? `<a href="${esc(t.source_ref)}" target="_blank" rel="noopener">${esc(t.source_ref)}</a>` : esc(t.source_ref)}</span></td>
      <td class="small">${esc(t.verification)}</td></tr>`).join("")}</table>`;
  const pol = S.evidence.filter(e => !e.building_id).map(quote).join("");
  return `<h2 style="margin-bottom:4px">${tt("title")}</h2><p class="muted">${tt("intro")}</p>
    <div class="card"><h3 style="margin-top:0">${tt("method")}</h3><p class="small">${tt("method_txt")}</p></div>
    <h2 class="sgroup">${tt("timeline")}</h2>${tl}
    <h2 class="sgroup">${tt("policy")}</h2><div class="card">${pol}</div>
    <h2 class="sgroup">${tt("cases")} (${S.cases.length})</h2>${cards}`;
}
window.SimplifyView = {view, bind() {}};
})();
