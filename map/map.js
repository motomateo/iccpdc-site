/* ICCPDC 1977 — map. MapLibre GL, CARTO basemaps, layers exported by pipeline/s23_map_export.py. */
(() => {
  const IDX = window.ICCPDC_MAP || {statements: {}, by_place: {}, by_building: {}, county_metrics: {}, county_mentions: {}, county_areas: {}};
  const $ = s => document.querySelector(s);
  const store = {get(k, d) { try { return localStorage.getItem("iccpdc-map-" + k) ?? d; } catch { return d; } },
                 set(k, v) { try { localStorage.setItem("iccpdc-map-" + k, v); } catch {} }};

  // ---------- i18n
  const T = {
    ro: {kicker: "Cutremurul din 4 martie 1977", title: "Harta sintezei ICCPDC", search: "Caută clădire, localitate…", layers: "Straturi",
      l_buildings: "Clădiri", l_footprints: "Amprenta actuală a parcelei", l_groups: "Grupuri și zone", l_places: "Locuri din text",
      l_counties: "Avarii pe județe (tab. II.1)", l_register: "Registrul actual (dupacutremur)", outcome: "Efect în 1977",
      certainty: "Siguranța localizării", basemap: "Fundal", b_auto: "auto", b_dark: "întunecat", b_light: "luminos", b_voyager: "stradal",
      to_explorer: "↗ Exploratorul de cunoștințe", credits: "Date: ICCPDC 1978; OSM; Wikidata; harta.dupacutremur.ro. Fundal © CARTO © OSM.",
      collapsed: "prăbușită", demolished_after: "demolată ulterior", severe: "avarii grave", moderate: "avarii medii", light: "avarii ușoare",
      none: "comportare bună", unknown: "necunoscut", verified: "verificată (≥2 surse)", probable: "probabilă", single: "o singură sursă",
      area: "zonă", conflict: "surse în conflict", building: "Clădire", group: "Grup / zonă", place: "Loc", county: "Județ",
      address77: "Adresa în 1977", modern: "Adresa actuală", today: "Azi", geo: "Localizare", precision: "Precizie", sources: "Surse",
      statements: "Afirmații din text", open_expl: "Deschide în explorator", metrics: "Date raportate (tab. II.1)", mentions: "Menționat de",
      damaged: "clădiri avariate raportate", nodata: "fără date numerice", mentioned: "doar menționat", legend_b: "Clădiri — efect în 1977",
      legend_c: "Clădiri avariate raportate", stmts: "afirmații", standing: "în picioare", demolished: "demolată", replaced: "înlocuită",
      register: "Registrul de risc seismic (azi)", approx: "contur aproximativ al județului din 1977", part_of: "în 1977 parte din jud. Ilfov",
      height: "Regim de înălțime", period: "Perioada", system: "Structură", n_src: "surse independente", agree: "acord", why: "Observații",
      quote: "Citat din text", verified_review: "verificată la revizie", review: "Decizie de revizie", in_text: "în text", photos_only: "Doar cu fotografii (Partea IV)", why_pre: "Note de cercetare (înainte de decizia de revizie)", photos: "Fotografii (Partea IV)", to_stats: "Toate statisticile pe zone", simpl_only: "Consolidare parțială / simplificată / locală", c_simpl: "consolidare redusă", simpl_other: "alte consolidări locale (din text)", simpl_none: "nu e în dosar", simpl_tip: "Clădirile din dosarul „Consolidări reduse” (proiecte simplificate, limitate la elementele avariate sau doar restabilire); gradul = tăria dovezii", simpl: "Consolidare redusă", simpl_A: "A — reducere explicită", simpl_B: "B — redus / sferă limitată", simpl_C: "C — doar restabilire", simpl_X: "X — contra-exemplu", simpl_more: "dosarul complet",
      iv_title: "Intervenții (din text)", iv_all: "toate", iv_local: "consolidare locală", iv_global: "consolidare de ansamblu", iv_supports: "elemente suplimentare de susținere", iv_loads: "intervenții la acoperiș",
      iv_ground: "teren / infrastructură", iv_demolition: "demolare", iv_temporary: "sprijinire provizorie", iv_none: "fără informații", iv_repair: "reparații", iv_generic: "consolidare nespecificată",
      legend_iv: "Clădiri — soluția de consolidare", k_proposed: "propusă / neaplicată", k_assessed: "apreciere a specialiștilor străini", colorby: "Colorează după", c_outcome: "efect 1977", c_iv: "consolidare",
      nav_flow: "Argument", nav_network: "Rețea", nav_buildings: "Clădiri", nav_reader: "Text", nav_stats: "Statistici", back: "Exploratorul", not_on_map: "Clădirea nu are o localizare pe hartă:", not_locatable: "nelocalizabilă", locality_only: "doar localitatea", unresolved: "nerezolvată"},
    en: {kicker: "The 4 March 1977 earthquake", title: "ICCPDC synthesis map", search: "Search building, place…", layers: "Layers",
      l_buildings: "Buildings", l_footprints: "Today's footprint on the site", l_groups: "Groups & areas", l_places: "Places in the text",
      l_counties: "County damage (table II.1)", l_register: "Today's register (dupacutremur)", outcome: "Outcome in 1977",
      certainty: "Location certainty", basemap: "Basemap", b_auto: "auto", b_dark: "dark", b_light: "light", b_voyager: "streets",
      to_explorer: "↗ Knowledge explorer", credits: "Data: ICCPDC 1978; OSM; Wikidata; harta.dupacutremur.ro. Basemap © CARTO © OSM.",
      collapsed: "collapsed", demolished_after: "demolished afterwards", severe: "severe damage", moderate: "moderate damage", light: "light damage",
      none: "behaved well", unknown: "unknown", verified: "verified (≥2 sources)", probable: "probable", single: "single source",
      area: "area", conflict: "sources conflict", building: "Building", group: "Group / area", place: "Place", county: "County",
      address77: "Address in 1977", modern: "Modern address", today: "Today", geo: "Location", precision: "Precision", sources: "Sources",
      statements: "Statements in the text", open_expl: "Open in explorer", metrics: "Reported figures (table II.1)", mentions: "Mentioned by",
      damaged: "damaged buildings reported", nodata: "no figures", mentioned: "mentioned only", legend_b: "Buildings — 1977 outcome",
      legend_c: "Damaged buildings reported", stmts: "statements", standing: "standing", demolished: "demolished", replaced: "replaced",
      register: "Seismic-risk register (today)", approx: "approximate outline of the 1977 county", part_of: "part of Ilfov county in 1977",
      height: "Height", period: "Period", system: "Structure", n_src: "independent sources", agree: "agreement", why: "Notes",
      quote: "Quote from the text", verified_review: "verified on review", review: "Review decision", in_text: "in text", photos_only: "Only with photos (Part IV)", why_pre: "Research notes (before the review decision)", photos: "Photos (Part IV)", to_stats: "All area statistics", simpl_only: "Partial / simplified / local strengthening", c_simpl: "trimmed strengthening", simpl_other: "other local strengthening (from the text)", simpl_none: "not in the dossier", simpl_tip: "Buildings in the trimmed-strengthening dossier (simplified projects, limited to damaged elements, or restoration only); grade = strength of evidence", simpl: "Trimmed strengthening", simpl_A: "A — explicit reduction", simpl_B: "B — reduced / limited scope", simpl_C: "C — restoration only", simpl_X: "X — counter-example", simpl_more: "full dossier",
      iv_title: "Interventions (from the text)", iv_all: "all", iv_local: "local strengthening", iv_global: "global strengthening", iv_supports: "added supporting elements", iv_loads: "roof works",
      iv_ground: "ground / bearings", iv_demolition: "demolition", iv_temporary: "temporary shoring", iv_none: "no information", iv_repair: "repairs", iv_generic: "unspecified strengthening",
      legend_iv: "Buildings — retrofitting solution", k_proposed: "proposed / not applied", k_assessed: "foreign specialists' appraisal", colorby: "Colour by", c_outcome: "1977 outcome", c_iv: "retrofitting",
      nav_flow: "Argument", nav_network: "Network", nav_buildings: "Buildings", nav_reader: "Text", nav_stats: "Statistics", back: "Explorer", not_on_map: "This building has no map location:", not_locatable: "not locatable", locality_only: "locality only", unresolved: "unresolved"}};
  let lang = store.get("lang", "ro");
  const t = k => (T[lang] && T[lang][k]) || k;
  function applyI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(e => e.textContent = t(e.dataset.i18n));
    document.querySelectorAll("[data-i18n-ph]").forEach(e => e.placeholder = t(e.dataset.i18nPh));
    $("#lang").textContent = lang === "ro" ? "EN" : "RO";
  }

  // ---------- theme / basemap
  const BASE = {dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
                light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
                voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"};
  let theme = store.get("theme", "");
  let basemap = store.get("basemap", "auto");
  const isDark = () => theme ? theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  function applyTheme() { if (theme) document.documentElement.dataset.theme = theme; else delete document.documentElement.dataset.theme; }
  const baseDark = () => basemap === "dark" || (basemap === "auto" && isDark());  // map labels follow the basemap, not the panel
  const baseUrl = () => BASE[basemap === "auto" ? (isDark() ? "dark" : "light") : basemap];

  // ---------- palette
  const OUT = {collapsed: "#E64833", demolished_after: "#874F41", severe: "#ef8a3c", moderate: "#e0b75a", light: "#90AEAD", none: "#4f7d5c", unknown: "#9aa5a6"};
  const IV = {local: "#3fb6c9", global: "#d9a441", supports: "#e07a5f", loads: "#86b893", ground: "#a58ad1", demolition: "#874F41", temporary: "#e98fb0", generic: "#b9a37e", none: "#7b8a8c"};
  let ivOn = new Set(Object.keys(IV));   // which intervention classes are shown
  let colorBy = store.get("colorby", "outcome");
  const simplCase = id => {  // trimmed-strengthening dossier (explorer #simplification, pipeline s28)
    const S = (window.ICCPDC || {}).simplification; const c = S && S.cases.find(x => x.building_id === id); if (!c) return "";
    const col = {A: "#E64833", B: "#ef8a3c", C: "#90AEAD", X: "#4f7d5c"}[c.strength];
    return `<h3>${t("simpl")}</h3><p style="font-size:13px;border-left:3px solid ${col};padding-left:8px"><b>${t("simpl_" + c.strength)}</b><br>${esc(c.executed)}
      · <a href="../explorer/#simplification">${t("simpl_more")} ↗</a></p>`;
  };
  const textLink = u => u ? ` <a class="tl" href="../explorer/#unit/${encodeURIComponent(u)}">${t("in_text")} ↗</a>` : "";
  // trimmed / partial / local strengthening mode (dossier s28): grades A B C X, plus "other" = local class in the text but not in the dossier
  const SIMPL = {A: "#E64833", B: "#ef8a3c", C: "#90AEAD", X: "#4f7d5c", other: "#3fb6c9"};
  const SIMPL_OF = Object.fromEntries((((window.ICCPDC || {}).simplification || {}).cases || []).map(c => [c.building_id, c.strength]));
  const simplKey = p => SIMPL_OF[p.building_id] || ((p.iv_classes || "").split(";").includes("local") ? "other" : "");
  let simplOnly = store.get("simplonly", "0") === "1";
  const simplOn = new Set(store.get("simplgrades", "A,B,C").split(",").filter(k => k in SIMPL));
  let photosOnly = store.get("photosonly", "0") === "1";   // "only with photos" mode (Partea IV)
  const hasPhotos = id => !!(window.PhotosUI && window.PhotosUI.byBuilding(id).length);
  const placeHasPhotos = id => !!(window.PhotosUI && window.PhotosUI.byPlace(id).length);
  const STATUS = ["verified", "probable", "single", "area"];
  const outcomeOn = new Set(Object.keys(OUT));
  const statusOn = new Set(STATUS.concat(["conflict"]));

  const map = new maplibregl.Map({container: "map", style: baseUrl(), center: [25.6, 45.4], zoom: 6.3, hash: "map", attributionControl: {compact: true}});
  window.__iccpdcMap = map;  // for debugging in the console
  const styleReady = new Promise(r => map.once("style.load", r));  // layers need the style, not the basemap tiles
  const mark = k => { document.body.dataset.mapstate = (document.body.dataset.mapstate || "") + " " + k; };
  map.on("error", e => { console.warn("map error", e && e.error && e.error.message); mark("error:" + (e && e.error && e.error.message || "?").slice(0, 80)); });
  map.on("style.load", () => mark("style")); map.on("load", () => mark("load")); map.on("idle", () => mark("idle"));
  if (new URLSearchParams(location.search).get("debug")) {
    map.on("sourcedata", e => { if (e.sourceId === "buildings" && e.isSourceLoaded) mark("bsrc"); });
    setInterval(() => { try { mark("qrf:" + map.queryRenderedFeatures({layers: ["buildings-pt"]}).length + "/" + map.isStyleLoaded()); } catch (e) { mark("qrferr"); } }, 4000);
  }
  map.addControl(new maplibregl.NavigationControl({visualizePitch: false}), "bottom-right");
  map.addControl(new maplibregl.ScaleControl({unit: "metric"}), "bottom-left");

  const DATA = {};
  const load = n => fetch(`data/${n}.geojson`).then(r => r.ok ? r.json() : {type: "FeatureCollection", features: []}).catch(() => ({type: "FeatureCollection", features: []}));
  const registerUrl = "../work/geo/sources/dupacutremur/puncte.geojson";

  const PLACE_PT_F = ["!", ["in", ["get", "kind"], ["literal", ["county", "country", "region", "river"]]]];
  const PLACE_LBL_F = ["all", [">=", ["get", "n"], 3], ["any", ["in", ["get", "kind"], ["literal", ["locality", "foreign_locality", "feature"]]], [">=", ["zoom"], 11]]];
  function addLayers() {
    const dark = baseDark();
    const halo = dark ? "#0f1e24" : "#ffffff";
    const add = (id, data) => { if (!map.getSource(id)) map.addSource(id, {type: "geojson", data, promoteId: id === "register" ? "building_uid" : undefined}); };
    add("counties", DATA.counties); add("places", DATA.places); add("buildings", DATA.buildings);
    add("footprints", DATA.footprints); add("groups", DATA.groups);
    if (DATA.register) add("register", DATA.register);
    const first = map.getStyle().layers.find(l => l.type === "symbol")?.id;
    // counties: choropleth of the reported number of damaged buildings
    map.addLayer({id: "counties-fill", type: "fill", source: "counties", paint: {
      "fill-color": ["case", ["!=", ["get", "damaged_reported"], null],
        ["interpolate", ["linear"], ["sqrt", ["get", "damaged_reported"]], 30, "#FBE9D0", 70, "#f3b49c", 130, "#E64833", 190, "#8e2a1c"],
        [">", ["get", "n_mentions"], 0], dark ? "#90AEAD" : "#244855", "rgba(0,0,0,0)"],
      "fill-opacity": ["interpolate", ["linear"], ["zoom"], 8, ["case", ["!=", ["get", "damaged_reported"], null], 0.55, [">", ["get", "n_mentions"], 0], 0.12, 0],
                       10.5, ["case", ["!=", ["get", "damaged_reported"], null], 0.08, 0]]}}, first);
    const lineBase = {"line-color": dark ? "#9fb3b2" : "#6c7b7d", "line-width": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 9, 1.4], "line-opacity": 0.55};
    map.addLayer({id: "counties-line", type: "line", source: "counties", filter: ["!=", ["get", "geometry_basis"], "approx_1977_union"], paint: lineBase}, first);
    map.addLayer({id: "counties-line-1977", type: "line", source: "counties", filter: ["==", ["get", "geometry_basis"], "approx_1977_union"],
      paint: {...lineBase, "line-opacity": 0.9, "line-dasharray": [2, 2]}}, first);
    // today's register (context, off by default) — dupacutremur purple
    if (DATA.register) map.addLayer({id: "register-pt", type: "circle", source: "register", minzoom: 11, layout: {visibility: "none"}, paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 1.5, 16, 4], "circle-color": "#bc8afc", "circle-opacity": 0.7}});
    // groups & areas
    map.addLayer({id: "groups-halo", type: "circle", source: "groups", paint: {"circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 7, 14, 18],
      "circle-color": "#7ab3cf", "circle-opacity": 0.18, "circle-stroke-color": "#7ab3cf", "circle-stroke-width": 1.5, "circle-stroke-opacity": 0.8}});
    // places: bubbles sized by number of statements
    map.addLayer({id: "places-pt", type: "circle", source: "places", filter: PLACE_PT_F, paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, ["+", 2, ["*", 1.1, ["sqrt", ["get", "n"]]]], 12, ["+", 5, ["*", 2.2, ["sqrt", ["get", "n"]]]]],
      "circle-color": "#90AEAD", "circle-opacity": ["interpolate", ["linear"], ["zoom"], 11, 0.5, 14, 0.1], "circle-stroke-color": dark ? "#cfe0df" : "#244855", "circle-stroke-width": 1,
      "circle-stroke-opacity": ["match", ["get", "status"], ["verified", "verified_review"], 0.9, 0.4]}});
    map.addLayer({id: "places-label", type: "symbol", source: "places", minzoom: 6, filter: PLACE_LBL_F, layout: {
      "text-field": ["get", "name"], "text-size": ["interpolate", ["linear"], ["get", "n"], 3, 11, 200, 15], "text-offset": [0, 1.1], "text-anchor": "top",
      "text-font": ["Open Sans Regular", "Noto Sans Regular"], "text-optional": true}, paint: {"text-color": dark ? "#f4e6cf" : "#1d3640", "text-halo-color": halo, "text-halo-width": 1.4}});
    // today's footprint on the historic site
    map.addLayer({id: "footprints-fill", type: "fill", source: "footprints", minzoom: 14, paint: {"fill-color": "#ff9f6b", "fill-opacity": 0.45}});
    map.addLayer({id: "footprints-line", type: "line", source: "footprints", minzoom: 14, paint: {"line-color": "#ff7e0d", "line-width": 1.2}});
    // buildings: historic site point, coloured by outcome (dupacutremur "puncte" look: filled circle, white stroke)
    map.addLayer({id: "buildings-pt", type: "circle", source: "buildings", paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 3, 11, 5, 16, 9],
      "circle-color": colorExpr(),
      "circle-stroke-color": "#ffffff", "circle-stroke-width": ["interpolate", ["linear"], ["zoom"], 5, 0.8, 14, 2],
      "circle-opacity": ["match", ["get", "status"], "verified", 1, "probable", 0.9, 0.7]}});
    map.addLayer({id: "buildings-label", type: "symbol", source: "buildings", minzoom: 14, layout: {"text-field": ["get", "name"], "text-size": 12,
      "text-offset": [0, 1.2], "text-anchor": "top", "text-font": ["Open Sans Regular", "Noto Sans Regular"], "text-optional": true},
      paint: {"text-color": dark ? "#f4e6cf" : "#1d3640", "text-halo-color": halo, "text-halo-width": 1.4}});
    // selection glow (dupacutremur uses a cyan glow)
    map.addLayer({id: "sel", type: "circle", source: "buildings", filter: ["==", ["get", "building_id"], ""], paint: {"circle-radius": 14, "circle-color": "rgba(0,0,0,0)",
      "circle-stroke-color": "#00ffff", "circle-stroke-width": 3, "circle-blur": 0.2}});
    map.addLayer({id: "sel-county", type: "line", source: "counties", filter: ["==", ["get", "code"], ""], paint: {"line-color": "#00ffff", "line-width": 2.5}});
    applyVisibility(); applyFilters(); mark("layers:" + map.getStyle().layers.filter(l => l.source && ["buildings","places","counties"].includes(l.source)).length);
  }

  function colorExpr() {
    if (colorBy === "simpl") return ["match", ["get", "building_id"],
      ...Object.entries(SIMPL_OF).flatMap(([id, g]) => [id, SIMPL[g]]),
      ["case", ["in", "local", ["coalesce", ["get", "iv_classes"], ""]], SIMPL.other, "#7b8a8c"]];
    if (colorBy === "iv") return ["case", ...Object.keys(IV).filter(k => k !== "none").flatMap(k => [["in", k, ["coalesce", ["get", "iv_classes"], ""]], IV[k]]), IV.none];
    return ["match", ["get", "outcome_1977"], ...Object.entries(OUT).flat(), "#9aa5a6"];
  }
  const LAYERS = {buildings: ["buildings-pt", "buildings-label", "sel"], footprints: ["footprints-fill", "footprints-line"], groups: ["groups-halo"],
                  places: ["places-pt", "places-label"], counties: ["counties-fill", "counties-line", "counties-line-1977", "sel-county"], register: ["register-pt"]};
  function applyVisibility() {
    const on = k => document.querySelector(`[data-layer="${k}"]`)?.checked;
    document.querySelectorAll("[data-layer]").forEach(cb => (LAYERS[cb.dataset.layer] || []).forEach(id => {
      // footprints belong to buildings: hidden whenever the Buildings layer is off
      const vis = cb.dataset.layer === "footprints" ? (cb.checked && on("buildings")) : cb.checked;
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis ? "visible" : "none"); }));
  }
  // One predicate decides which buildings are visible; points, labels, group halos AND footprint polygons all use the
  // resulting id list, so a footprint can never stay on the map after its point has been filtered out.
  function bVisible(p) {
    const iv = (p.iv_classes || "").split(";").filter(Boolean);
    return outcomeOn.has(p.outcome_1977 || "unknown") && statusOn.has(p.status || "single")
      && [...ivOn].some(k => k === "none" ? !iv.length : iv.includes(k))
      && (!photosOnly || hasPhotos(p.building_id))
      && (!simplOnly || simplOn.has(simplKey(p)));
  }
  function applyFilters() {
    if (!map.getLayer("buildings-pt")) return;
    const ids = (DATA.buildings?.features || []).filter(f => bVisible(f.properties)).map(f => f.properties.building_id);
    const gids = (DATA.groups?.features || []).filter(f => !simplOnly && (!photosOnly || hasPhotos(f.properties.building_id))).map(f => f.properties.building_id);
    const inIds = list => ["in", ["get", "building_id"], ["literal", list]];
    ["buildings-pt", "buildings-label"].forEach(id => map.setFilter(id, inIds(ids)));
    if (map.getLayer("groups-halo")) map.setFilter("groups-halo", inIds(gids));
    ["footprints-fill", "footprints-line"].forEach(id => map.getLayer(id) && map.setFilter(id, inIds([...ids, ...gids])));
    const pids = (DATA.places?.features || []).filter(f => placeHasPhotos(f.properties.place_id)).map(f => f.properties.place_id);
    const pf = base => simplOnly ? ["==", ["get", "place_id"], "__none__"] : photosOnly ? ["all", base, ["in", ["get", "place_id"], ["literal", pids]]] : base;  // places carry no interventions
    if (map.getLayer("places-pt")) map.setFilter("places-pt", pf(PLACE_PT_F));
    if (map.getLayer("places-label")) map.setFilter("places-label", pf(PLACE_LBL_F));
    const n = $("#n-photosonly"); if (n) n.textContent = `${ids.length + gids.length}`;
    const ns = $("#n-simplonly"); if (ns) ns.textContent = simplOnly ? `${ids.length}` : "";
  }

  function chips() {
    const fo = $("#f-outcome"); fo.innerHTML = "";
    Object.entries(OUT).forEach(([k, c]) => {
      const n = (DATA.buildings?.features || []).filter(f => (f.properties.outcome_1977 || "unknown") === k).length;
      const el = document.createElement("span"); el.className = "chip" + (outcomeOn.has(k) ? "" : " off");
      el.innerHTML = `<i style="background:${c}"></i>${t(k)} <small>${n}</small>`;
      el.onclick = () => { outcomeOn.has(k) ? outcomeOn.delete(k) : outcomeOn.add(k); chips(); applyFilters(); };
      fo.appendChild(el);
    });
    const fs = $("#f-status"); fs.innerHTML = "";
    STATUS.concat(["conflict"]).forEach(k => {
      const n = (DATA.buildings?.features || []).filter(f => f.properties.status === k).length;
      if (!n && k === "conflict") return;
      const el = document.createElement("span"); el.className = "chip" + (statusOn.has(k) ? "" : " off");
      el.innerHTML = `${t(k)} <small>${n}</small>`;
      el.onclick = () => { statusOn.has(k) ? statusOn.delete(k) : statusOn.add(k); chips(); applyFilters(); };
      fs.appendChild(el);
    });
  }
  function ivChips() {
    const box = $("#f-iv"); box.innerHTML = "";
    const feats = DATA.buildings?.features || [];
    const all = ivOn.size === Object.keys(IV).length;
    const mk = (label, n, on, onclick, color) => { const el = document.createElement("span"); el.className = "chip" + (on ? "" : " off");
      el.innerHTML = `${color ? `<i style="background:${color}"></i>` : ""}${label} <small>${n}</small>`; el.onclick = onclick; box.appendChild(el); };
    mk(t("iv_all"), feats.length, all, () => { ivOn = new Set(Object.keys(IV)); ivChips(); applyFilters(); });
    Object.entries(IV).forEach(([k, c]) => {
      const n = feats.filter(f => k === "none" ? !f.properties.iv_classes : (f.properties.iv_classes || "").split(";").includes(k)).length;
      if (!n) return;
      mk(t("iv_" + k), n, ivOn.has(k), e => {
        if (e.ctrlKey || e.shiftKey || e.metaKey) { if (all) ivOn = new Set(); ivOn.has(k) ? ivOn.delete(k) : ivOn.add(k); if (!ivOn.size) ivOn = new Set(Object.keys(IV)); }
        else ivOn = (!all && ivOn.size === 1 && ivOn.has(k)) ? new Set(Object.keys(IV)) : new Set([k]);
        ivChips(); applyFilters(); }, c);
    });
    document.querySelectorAll("#colorby button").forEach(b => { b.classList.toggle("on", b.dataset.c === colorBy);
      b.onclick = () => { colorBy = b.dataset.c; store.set("colorby", colorBy);
        if (map.getLayer("buildings-pt")) map.setPaintProperty("buildings-pt", "circle-color", colorExpr()); ivChips(); legend(); }; });
  }
  function simplChips() {
    const box = $("#f-simpl"); if (!box) return; box.innerHTML = ""; box.hidden = !simplOnly;
    const feats = DATA.buildings?.features || [];
    Object.entries(SIMPL).forEach(([k, c]) => {
      const n = feats.filter(f => simplKey(f.properties) === k).length;
      const el = document.createElement("span"); el.className = "chip" + (simplOn.has(k) ? "" : " off");
      el.title = k === "other" ? t("simpl_other") : t("simpl_" + k);
      el.innerHTML = `<i style="background:${c}"></i>${k === "other" ? t("simpl_other") : t("simpl_" + k)} <small>${n}</small>`;
      el.onclick = () => { simplOn.has(k) ? simplOn.delete(k) : simplOn.add(k); store.set("simplgrades", [...simplOn].join(",")); simplChips(); applyFilters(); };
      box.appendChild(el);
    });
  }
  function legend() {
    $("#legend").innerHTML = (colorBy === "simpl"
      ? `<h3>${t("simpl")}</h3>` + Object.entries(SIMPL).map(([k, c]) => `<div class="row"><span class="dot" style="background:${c}"></span>${k === "other" ? t("simpl_other") : t("simpl_" + k)}</div>`).join("") + `<div class="row"><span class="dot" style="background:#7b8a8c"></span>${t("simpl_none")}</div>`
      : colorBy === "iv"
      ? `<h3>${t("legend_iv")}</h3>` + Object.entries(IV).map(([k, c]) => `<div class="row"><span class="dot" style="background:${c}"></span>${t("iv_" + k)}</div>`).join("")
      : `<h3>${t("legend_b")}</h3>` + Object.entries(OUT).map(([k, c]) => `<div class="row"><span class="dot" style="background:${c}"></span>${t(k)}</div>`).join("")) +
      `<h3 style="margin-top:10px">${t("legend_c")}</h3><div class="ramp"></div><div class="ends"><span>~1 000</span><span>35 000+</span></div>` +
      `<div class="row" style="margin-top:6px"><span class="dot" style="background:#90AEAD;border-radius:2px"></span>${t("mentioned")}</div>`;
  }
  function counts() {
    const n = k => (DATA[k]?.features || []).length;
    $("#n-buildings").textContent = n("buildings"); $("#n-footprints").textContent = n("footprints"); $("#n-groups").textContent = n("groups");
    $("#n-places").textContent = n("places"); $("#n-counties").textContent = (DATA.counties?.features || []).filter(f => f.properties.n_metrics || f.properties.n_mentions).length;
    $("#n-register").textContent = DATA.register ? n("register") : "–";
    const reg = document.querySelector('[data-layer="register"]'); if (reg) reg.closest("label").hidden = !DATA.register?.features?.length;  // absent on the public site
  }

  // ---------- detail drawer
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
  const fmt = v => (v === "" || v == null) ? "" : Number(v).toLocaleString(lang === "ro" ? "ro-RO" : "en-GB");
  function stmtList(ids) {
    if (!ids || !ids.length) return "";
    const li = ids.slice(0, 60).map(i => IDX.statements[i]).filter(Boolean).map(([cite, stage, ro, en, u]) =>
      `<li>${esc(lang === "ro" ? ro : (en || ro))}<span class="cite">${esc(cite)} · ${esc(stage)}${textLink(u)}</span></li>`).join("");
    return `<h3>${t("statements")} (${ids.length})</h3><ul class="st">${li}</ul>`;
  }
  function srcList(p) {
    let c = []; try { c = JSON.parse(p.sources || "[]"); } catch {}
    if (!c.length) return "";
    return `<h3>${t("sources")}</h3><ul class="src">` + c.map(s => {
      const ref = String(s.ref || ""); const href = /^https?:/.test(ref) ? ref : /^(way|node|relation)\//.test(ref) ? `https://www.openstreetmap.org/${ref}` :
        /^Q\d+$/.test(ref) ? `https://www.wikidata.org/wiki/${ref}` : "";
      return `<li><b>${esc(s.source)}</b> — ${href ? `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(ref.length > 60 ? ref.slice(0, 60) + "…" : ref)}</a>` : esc(ref)}` +
        `${s.precision ? ` <small>(${esc(s.precision)})</small>` : ""}<br><small>${esc(s.evidence || "")}</small></li>`; }).join("") + "</ul>";
  }
  function ivList(bid) {
    const rows = (IDX.interventions || {})[bid];
    if (!rows || !rows.length) return "";
    const L = IDX.iv_labels || {};
    return `<h3>${t("iv_title")}</h3><ul class="st">` + rows.map(([tech, cls, kind, u, ev, rv]) =>
      `<li><span class="badge" style="background:${IV[cls] || IV.none}">${t("iv_" + cls)}</span> <b>${esc((L[tech] || [tech, tech])[lang === "ro" ? 0 : 1])}</b>
        ${kind !== "applied" ? `<small>(${t("k_" + kind)})</small>` : ""}<span class="cite">„${esc(ev)}”${textLink(u)}</span>${rv ? `<span class="cite" style="border-left:3px solid #00b7c7;padding-left:6px">${t("review")}: ${esc(rv)}</span>` : ""}</li>`).join("") + "</ul>";
  }
  function show(html) { $("#detail").innerHTML = html; $("#drawer").hidden = false; document.body.classList.add("drawer-open"); }
  function showBuilding(f) {
    const p = f.properties;
    map.setFilter("sel", ["==", ["get", "building_id"], p.building_id]);
    const oc = p.outcome_1977 || "unknown";
    show(`<div class="kicker">${t(p.class === "group" ? "group" : "building")} · ${esc(p.locality || "")}</div><h2>${esc(p.name)}</h2>
      <span class="badge" style="background:${OUT[oc]}">${t(oc)}</span><span class="badge" style="background:#244855">${t(p.status || "single")}</span>
      ${p.outcome_quote ? `<div class="quote">„${esc(p.outcome_quote)}”${textLink(p.outcome_unit)}</div>` : ""}
      <dl class="meta">
        ${p.address_1977 ? `<dt>${t("address77")}</dt><dd>${esc(p.address_1977)}</dd>` : ""}
        ${p.modern_address ? `<dt>${t("modern")}</dt><dd>${esc(p.modern_address)}</dd>` : ""}
        ${p.status_today ? `<dt>${t("today")}</dt><dd>${t(p.status_today)}${p.dupacutremur_building_uid ? ` · <a href="https://harta.dupacutremur.ro/" target="_blank" rel="noopener">${t("register")}: ${esc(p.dupacutremur_building_uid)}</a>` : ""}</dd>` : ""}
        ${p.period ? `<dt>${t("period")}</dt><dd>${esc(p.period)}</dd>` : ""}
        ${p.height ? `<dt>${t("height")}</dt><dd>${esc(p.height)}</dd>` : ""}
        <dt>${t("geo")}</dt><dd>${t(p.status || "single")} · ${esc(p.precision || "")}${p.n_sources ? ` · ${p.n_sources} ${t("n_src")}` : ""}${p.agreement_m ? ` · ${t("agree")} ${p.agreement_m} m` : ""}</dd>
      </dl>
      ${simplCase(p.building_id)}
      ${p.review_note ? `<h3>${t("review")}</h3><p style="font-size:13px;border-left:3px solid #00b7c7;padding-left:8px">${esc(p.review_note)}</p>` : ""}
      ${p.notes ? `<h3>${t(p.review_note ? "why_pre" : "why")}</h3><p style="font-size:13px${p.review_note ? ";opacity:.75" : ""}">${esc(p.notes)}</p>` : ""}
      ${window.PhotosUI && window.PhotosUI.byBuilding(p.building_id).length ? `<h3>${t("photos")} (${window.PhotosUI.byBuilding(p.building_id).length})</h3>${window.PhotosUI.gallery(window.PhotosUI.byBuilding(p.building_id), {small: true})}` : ""}
      ${ivList(p.building_id)}
      ${srcList(p)}
      ${stmtList(IDX.by_building[p.building_id])}
      <a class="btn" href="../explorer/#buildings/${encodeURIComponent(p.building_id)}">${t("open_expl")} ↗</a>`);
  }
  function showPlace(f) {
    const p = f.properties;
    show(`<div class="kicker">${t("place")} · ${esc(p.kind)}</div><h2>${esc(p.name)}</h2>
      <span class="badge" style="background:#244855">${t(p.status)}</span> <small>${p.n} ${t("stmts")}</small>
      <dl class="meta"><dt>${t("geo")}</dt><dd>${esc(p.source)} ${p.ref ? `· <a target="_blank" rel="noopener" href="https://www.openstreetmap.org/${esc(p.ref)}">${esc(p.ref)}</a>` : ""}${p.agreement_m ? ` · ${t("agree")} ${p.agreement_m} m` : ""}</dd>
      ${p.raw ? `<dt>1977</dt><dd>${esc(p.raw)}</dd>` : ""}${p.note ? `<dt>${t("why")}</dt><dd>${esc(p.note)}</dd>` : ""}</dl>
      ${window.PhotosUI && window.PhotosUI.byPlace(p.place_id).length ? `<h3>${t("photos")} (${window.PhotosUI.byPlace(p.place_id).length})</h3>${window.PhotosUI.gallery(window.PhotosUI.byPlace(p.place_id), {small: true})}` : ""}
      ${stmtList(IDX.by_place[p.place_id])}`);
  }
  function showCounty(f) {
    const p = f.properties, code = p.code;
    map.setFilter("sel-county", ["==", ["get", "code"], code]);
    const ms = IDX.county_metrics[code] || [], mn = IDX.county_mentions[code] || [];
    const rows = ms.map(m => `<tr><td>${esc(m.measure)}<br><small>${esc(m.object_class)}</small></td><td class="num">${fmt(m.value)} ${m.unit === "pct" ? "%" : ""}${m.of_total_pct ? `<br><small>${esc(m.of_total_pct)} %</small>` : ""}</td>
      <td><small>„${esc(m.quote)}”${textLink(m.unit_id)}${m.note ? `<br><i>${esc(m.note)}</i>` : ""}</small></td></tr>`).join("");
    show(`<div class="kicker">${t("county")}</div><h2>${esc(p.name_1977 || p.name)}</h2>
      ${p.damaged_reported != null ? `<p><b style="font-size:20px">${fmt(p.damaged_reported)}</b> ${t("damaged")} <small>(${esc(p.damaged_class)})</small></p>` : `<p>${t(p.n_mentions ? "mentioned" : "nodata")}</p>`}
      ${p.geometry_basis === "approx_1977_union" ? `<p><small>⚠ ${t("approx")}: ${esc(p.boundary_note)}</small></p>` : ""}
      ${p.part_of_1977 ? `<p><small>${t("part_of")}</small></p>` : ""}
      ${rows ? `<h3>${t("metrics")}</h3><table>${rows}</table>` : ""}
      ${mn.length ? `<h3>${t("mentions")}</h3><ul class="st">${mn.map(m => `<li>${esc(m.organ)} — ${esc(m.role)}${m.value ? ` (${esc(m.value)})` : ""}<span class="cite">„${esc(m.quote)}”${textLink(m.unit_id)}</span></li>`).join("")}</ul>` : ""}
      <a class="btn" href="../explorer/#stats/counties">${t("to_stats")} ↗</a>`);
  }

  map.on("click", e => {
    const hit = map.queryRenderedFeatures(e.point, {layers: ["buildings-pt", "groups-halo", "places-pt", "counties-fill"].filter(l => map.getLayer(l))});
    if (!hit.length) return;
    const f = hit[0];
    if (f.layer.id === "buildings-pt" || f.layer.id === "groups-halo") showBuilding(f);
    else if (f.layer.id === "places-pt") showPlace(f);
    else showCounty(f);
  });
  const hover = new maplibregl.Popup({closeButton: false, closeOnClick: false, offset: 10});
  ["buildings-pt", "groups-halo", "places-pt", "register-pt"].forEach(l => {
    map.on("mouseenter", l, e => { map.getCanvas().style.cursor = "pointer"; const p = e.features[0].properties;
      hover.setLngLat(e.lngLat).setHTML(l === "register-pt" ? `${esc(p.tip_strada)} ${esc(p.adresa)} ${esc(p.numar)} · <b>${esc(p.incadrare)}</b> · ${esc(p.anul_const)}` :
        `<b>${esc(p.name)}</b>${p.n ? ` · ${p.n} ${t("stmts")}` : ""}`).addTo(map); });
    map.on("mouseleave", l, () => { map.getCanvas().style.cursor = ""; hover.remove(); });
  });
  $("#close").onclick = () => { $("#drawer").hidden = true; document.body.classList.remove("drawer-open"); if (map.getLayer("sel")) { map.setFilter("sel", ["==", ["get", "building_id"], ""]); map.setFilter("sel-county", ["==", ["get", "code"], ""]); } };

  // ---------- search
  let index = [];
  function buildIndex() {
    const fold = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    index = [];
    for (const [k, kind] of [["buildings", "building"], ["groups", "group"], ["places", "place"]])
      for (const f of DATA[k]?.features || []) index.push({kind, f, key: fold([f.properties.name, f.properties.raw, f.properties.modern_address, f.properties.address_1977, f.properties.locality].join(" "))});
    for (const f of DATA.counties?.features || []) index.push({kind: "county", f, key: fold(f.properties.name + " " + f.properties.name_1977)});
    const q = $("#q"), ul = $("#results");
    q.oninput = () => {
      const s = fold(q.value.trim()); if (s.length < 2) { ul.hidden = true; return; }
      const hits = index.filter(x => s.split(/\s+/).every(w => x.key.includes(w))).slice(0, 14);
      ul.innerHTML = hits.map((h, i) => `<li data-i="${i}">${esc(h.f.properties.name || h.f.properties.name_1977)}<small>${t(h.kind)}</small></li>`).join("");
      ul.hidden = !hits.length;
      ul.querySelectorAll("li").forEach(li => li.onclick = () => { go(hits[+li.dataset.i]); ul.hidden = true; });
    };
  }
  function go(h) {
    const g = h.f.geometry;
    if (g.type === "Point") map.flyTo({center: g.coordinates, zoom: h.kind === "place" ? 11 : 16});
    else { const b = new maplibregl.LngLatBounds(); (function w(c) { typeof c[0] === "number" ? b.extend(c) : c.forEach(w); })(g.coordinates); map.fitBounds(b, {padding: 60}); }
    if (h.kind === "building" || h.kind === "group") showBuilding(h.f); else if (h.kind === "place") showPlace(h.f); else showCounty(h.f);
  }

  // ---------- controls
  document.querySelectorAll("[data-layer]").forEach(cb => {
    cb.checked = store.get("layer-" + cb.dataset.layer, cb.checked ? "1" : "0") === "1";
    cb.onchange = async () => { store.set("layer-" + cb.dataset.layer, cb.checked ? "1" : "0");
      if (cb.dataset.layer === "register" && cb.checked && !DATA.register) await loadRegister();
      applyVisibility(); };
  });
  async function loadRegister() {
    DATA.register = await fetch(registerUrl).then(r => r.ok ? r.json() : null).catch(() => null);
    if (DATA.register) { map.addSource("register", {type: "geojson", data: DATA.register});
      map.addLayer({id: "register-pt", type: "circle", source: "register", minzoom: 11, paint: {"circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 1.5, 16, 4],
        "circle-color": "#bc8afc", "circle-opacity": 0.7}}, "footprints-fill"); }
    counts();
  }
  const po = $("#photosonly");
  const so = $("#simplonly");
  if (so) { so.checked = simplOnly; so.closest("label").title = t("simpl_tip");
    so.onchange = () => { simplOnly = so.checked; store.set("simplonly", simplOnly ? "1" : "0"); simplChips(); applyFilters(); }; }
  if (po) { po.checked = photosOnly; po.onchange = () => { photosOnly = po.checked; store.set("photosonly", photosOnly ? "1" : "0"); applyFilters(); }; }
  $("#lang").onclick = () => { lang = lang === "ro" ? "en" : "ro"; store.set("lang", lang); applyI18n(); chips(); ivChips(); simplChips(); legend(); };
  $("#theme").onclick = () => { theme = isDark() ? "light" : "dark"; store.set("theme", theme); applyTheme(); restyle(); };
  const setCollapsed = c => { $("#panel").classList.toggle("collapsed", c); const b = $("#collapse"); b.textContent = c ? "+" : "–";
    b.setAttribute("aria-expanded", String(!c)); b.setAttribute("aria-label", c ? (lang === "en" ? "Show filters" : "Arată filtrele") : (lang === "en" ? "Hide filters" : "Ascunde filtrele")); };
  $("#collapse").onclick = () => setCollapsed(!$("#panel").classList.contains("collapsed"));
  if (matchMedia("(max-width: 720px)").matches) setCollapsed(true);   // phones: the map first, filters one tap away
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#drawer").hidden && document.getElementById("lightbox")?.hidden !== false) $("#close").click(); });
  document.querySelectorAll("#basemap button").forEach(b => { b.classList.toggle("on", b.dataset.b === basemap);
    b.onclick = () => { basemap = b.dataset.b; store.set("basemap", basemap); document.querySelectorAll("#basemap button").forEach(x => x.classList.toggle("on", x === b)); restyle(); }; });
  // Basemap switch: carry our sources + layers into the new style (MapLibre transformStyle), so they can never be dropped;
  // then re-apply the theme-dependent paint (label colours, outlines).
  const OUR = ["counties", "places", "buildings", "footprints", "groups", "register"];
  function restyle() {
    map.setStyle(baseUrl(), {transformStyle: (prev, next) => {
      if (!prev) return next;
      const ours = prev.layers.filter(l => OUR.includes(l.source));
      const under = ours.filter(l => l.source === "counties" && !l.id.startsWith("sel"));
      const over = ours.filter(l => !under.includes(l));
      const firstSym = next.layers.findIndex(l => l.type === "symbol");
      const layers = firstSym < 0 ? [...next.layers, ...under, ...over]
        : [...next.layers.slice(0, firstSym), ...under, ...next.layers.slice(firstSym), ...over];
      const sources = {...next.sources};
      OUR.forEach(id => { if (prev.sources[id]) sources[id] = prev.sources[id]; });
      return {...next, sources, layers};
    }});
    map.once("styledata", () => setTimeout(themePaint, 0));  // diffed setStyle fires styledata, not style.load
  }
  function themePaint() {
    const dark = baseDark(), halo = dark ? "#0f1e24" : "#ffffff", ink = dark ? "#f4e6cf" : "#1d3640";
    ["places-label", "buildings-label"].forEach(id => { if (map.getLayer(id)) { map.setPaintProperty(id, "text-color", ink); map.setPaintProperty(id, "text-halo-color", halo); } });
    ["counties-line", "counties-line-1977"].forEach(id => { if (map.getLayer(id)) map.setPaintProperty(id, "line-color", dark ? "#9fb3b2" : "#6c7b7d"); });
    if (map.getLayer("places-pt")) map.setPaintProperty("places-pt", "circle-stroke-color", dark ? "#cfe0df" : "#244855");
    mark("restyled:" + map.getStyle().layers.filter(l => OUR.includes(l.source)).length);
  }

  applyTheme(); applyI18n(); legend();
  Promise.all(["counties", "places", "buildings", "footprints", "groups"].map(n => load(n).then(d => DATA[n] = d))).then(() => {
    const go_ = () => { addLayers(); counts(); chips(); ivChips(); simplChips(); legend(); buildIndex();
      if (store.get("layer-register", "0") === "1") loadRegister().then(applyVisibility);
      const tb = new URLSearchParams(location.search).get("test_basemap");  // self-test hook: switch basemap after load
      if (tb) setTimeout(() => setTimeout(() => { mark("switch"); document.querySelector('#basemap [data-b="' + tb + '"]')?.click(); }, 500), 6000);
      const want = new URLSearchParams(location.search).get("b");
      if (want) {
        const h = index.find(x => (x.kind === "building" || x.kind === "group") && x.f.properties.building_id === want);
        if (h) go(h);
        else { const u = (IDX.unlocated || {})[want];
          show(`<div class="kicker">${t("building")}</div><h2>${esc(u ? u.name : want)}</h2><p>${t("not_on_map")}${u ? ` <b>${esc(t(u.status))}</b>` : ""}</p>
            ${u && u.notes ? `<p style="font-size:13px">${esc(u.notes)}</p>` : ""}${stmtList(IDX.by_building[want])}
            <a class="btn" href="../explorer/#buildings/${encodeURIComponent(want)}">${t("open_expl")} ↗</a>`); }
      } };
    styleReady.then(go_);
  });
})();
