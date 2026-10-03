/* Centru de Sticlă · site engine. Conținutul se editează în data.js */
const SITE = "https://centrudesticla.ro";
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(pointer: fine)").matches;

/* ---------- intro: one termopan built on the line (once per visit) ---------- */
function pageReady(){ document.documentElement.classList.add("ready"); }
(function(){
  const I = $("#intro"); if (!I) { pageReady(); return; } let seen = false;
  try { seen = sessionStorage.getItem("cds_seen2") === "1"; } catch (e) {}
  if (REDUCED || seen) { I.remove(); pageReady(); return; }
  try { sessionStorage.setItem("cds_seen2", "1"); } catch (e) {}
  document.documentElement.style.overflow = "hidden";
  const steps = [...document.querySelectorAll("#isteps span")], timers = [];
  const mark = k => steps.forEach((s, i) => { s.classList.toggle("on", i === k); s.classList.toggle("done", i < k); });
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  const finish = () => { timers.forEach(clearTimeout); I.classList.add("out"); document.documentElement.style.overflow = ""; pageReady(); setTimeout(() => I.remove(), 1000); };
  const no = $("#unitNo"), n0 = 1240 + Math.floor(Math.random() * 300);
  no.textContent = String(n0).padStart(4, "0");
  at(80,   () => I.classList.add("s1"));
  at(1150, () => { I.classList.add("s0"); mark(0); });
  at(1800, () => { I.classList.add("s2"); mark(1); });
  at(2350, () => { I.classList.add("s3"); mark(2); });
  at(2800, () => { I.classList.add("s4"); mark(3); });
  at(3250, () => { I.classList.add("s5"); mark(4); });
  at(3700, () => { I.classList.add("s6"); mark(5); no.textContent = String(n0 + 1).padStart(4, "0"); });
  at(4250, () => { I.classList.add("s7"); mark(6); });
  at(5600, finish);
  $("#skip").onclick = finish;
})();

/* ---------- menu ---------- */
(function(){
  const m = $("#mnav"), b = $("#menuBtn");
  const set = o => { m.classList.toggle("open", o); b.setAttribute("aria-expanded", String(o)); if (o) $("#menuClose").focus(); };
  b.onclick = () => set(true); $("#menuClose").onclick = () => set(false);
  m.querySelectorAll("a").forEach(a => a.addEventListener("click", () => set(false)));
  addEventListener("keydown", e => { if (e.key === "Escape") set(false); });
})();

/* ---------- hero panes follow the pointer ---------- */
if (FINE && !REDUCED && $("#stack")) {
  const st = $("#stack"), gs = [...st.querySelectorAll(".glass")];
  st.parentElement.addEventListener("pointermove", e => {
    const r = st.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    gs.forEach(g => { const d = +g.dataset.d; g.style.transform = `translate3d(${x * d}px,${y * d}px,0) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`; });
  });
}


/* ---------- shared: page-aware content ---------- */
const prodUrl = p => `${p[2]}.html`;
const findProd = slug => PRODUCTS.find(p => p[2] === slug);
const q = new URLSearchParams(location.search);

/* products: featured on home, all with filters on produse.html */
(function(){
  const list = $("#plist"); if (!list) return;
  const mode = list.dataset.mode || "all";
  let cur = "toate";
  const render = () => {
    const f = $("#filters");
    if (f) f.innerHTML = FILTERS.map(([k, l]) => `<button type="button" data-f="${k}" aria-pressed="${k === cur}">${esc(l)}</button>`).join("");
    const items = mode === "featured" ? PRODUCTS.slice(0, 6) : PRODUCTS.filter(p => cur === "toate" || p[3].includes(cur));
    list.innerHTML = items.map(p => { const [c1, c2] = p[4].split(",");
      return `<li><a href="${prodUrl(p)}"><span class="sw" style="background:linear-gradient(135deg,${c1},${c2})"></span><div><b>${esc(p[0])}</b><span>${esc(p[1])}</span></div></a></li>`; }).join("");
  };
  const f = $("#filters"); if (f) f.addEventListener("click", e => { const b = e.target.closest("[data-f]"); if (b) { cur = b.dataset.f; render(); } });
  render();
})();

/* related products on a product page */
(function(){
  const box = $("#related"); if (!box) return;
  const me = findProd(document.body.dataset.slug), tag = me ? me[3][0] : "";
  const rel = PRODUCTS.filter(p => p !== me && p[3].includes(tag)).concat(PRODUCTS.filter(p => p !== me && !p[3].includes(tag))).slice(0, 3);
  box.innerHTML = rel.map(p => { const [c1, c2] = p[4].split(",");
    return `<li><a href="${prodUrl(p)}"><span class="sw" style="background:linear-gradient(135deg,${c1},${c2})"></span><div><b>${esc(p[0])}</b><span>${esc(p[1])}</span></div></a></li>`; }).join("");
})();

/* promotions: strip on home, grid with "reserve" on promotii.html */
(function(){
  const card = (x, i, reserve) => { const [n, sz, pr, av] = x;
    return `<a class="tagc" href="contact.html?promo=${i}"><span class="sz">${esc(sz)}</span><b>${esc(n)}</b><span class="pr">${esc(pr)}</span><span class="av">${esc(av || "Piesă unică")}</span>${reserve ? '<span class="res">Rezervă piesa →</span>' : ""}</a>`; };
  const s = $("#strip"); if (s) s.innerHTML = PROMOS.slice(0, 6).map((x, i) => card(x, i, false)).join("");
  const g = $("#promoGrid"); if (g) g.innerHTML = PROMOS.map((x, i) => card(x, i, true)).join("");
})();

/* blog list: live from their WordPress, opens inside this site */
(function(){
  const box = $("#posts"); if (!box) return;
  const n = +box.dataset.n || 3;
  const strip = h => { const d = document.createElement("div"); d.innerHTML = h || ""; return (d.textContent || "").trim(); };
  box.innerHTML = POSTS.slice(0, n).map(([t, u]) => `<a class="post" href="${SITE}${esc(u)}" target="_blank" rel="noopener"><b>${esc(t)}</b><span>Citește articolul</span></a>`).join("");
  fetch(`${CONFIG.wpBase}/wp-json/wp/v2/posts?per_page=${n}&_fields=id,title,date,excerpt`).then(r => r.ok ? r.json() : Promise.reject()).then(list => {
    if (!Array.isArray(list) || !list.length) return;
    box.innerHTML = list.map(p => { const ex = strip(p.excerpt && p.excerpt.rendered).slice(0, 140);
      return `<a class="post" href="articol.html?id=${p.id}"><time datetime="${esc(p.date)}">${new Date(p.date).toLocaleDateString("ro-RO", { day:"numeric", month:"long", year:"numeric" })}</time><b>${esc(strip(p.title && p.title.rendered))}</b><span>${esc(ex)}${ex.length >= 140 ? "…" : ""}</span></a>`; }).join("");
  }).catch(() => {});
})();

/* one article, shown in this site's design */
(function(){
  const box = $("#article"); if (!box) return;
  const id = parseInt(q.get("id"), 10);
  const fail = () => { box.innerHTML = `<p>Articolul nu a putut fi încărcat acum.</p><p><a class="btn btn-line" href="blog.html">Înapoi la blog</a></p>`; };
  if (!id) { fail(); return; }
  fetch(`${CONFIG.wpBase}/wp-json/wp/v2/posts/${id}?_fields=title,content,date,link`).then(r => r.ok ? r.json() : Promise.reject()).then(p => {
    const d = document.createElement("div"); d.innerHTML = p.title.rendered; const title = d.textContent.trim();
    document.title = `${title} · Centru de Sticlă`;
    $("#artTitle").textContent = title;
    $("#artDate").textContent = new Date(p.date).toLocaleDateString("ro-RO", { day:"numeric", month:"long", year:"numeric" });
    const doc = new DOMParser().parseFromString(p.content.rendered, "text/html");
    doc.querySelectorAll("script,style,link,form").forEach(x => x.remove());
    doc.querySelectorAll("*").forEach(el => [...el.attributes].forEach(a => { if (/^on/i.test(a.name)) el.removeAttribute(a.name); }));
    box.innerHTML = doc.body.innerHTML;
  }).catch(fail);
})();

/* quote form: product list, pre-filled from the page that sent the visitor */
(function(){
  const sel = $("#prod"); if (!sel) return;
  sel.innerHTML = `<option value="">Alege un produs</option>` + PRODUCTS.map(p => `<option>${esc(p[0])}</option>`).join("") + `<option>Piesă din promoții</option><option>Altceva</option>`;
  const ps = findProd(q.get("produs")); if (ps) sel.value = ps[0];
  const pi = q.get("promo");
  if (pi !== null && PROMOS[+pi]) { const x = PROMOS[+pi]; sel.value = "Piesă din promoții"; $("#msg").value = `Vreau să rezerv: ${x[0]}, ${x[1]}, ${x[2]}.`; }
  $("#form").addEventListener("submit", async e => {
    e.preventDefault();
    const v = id => $("#" + id).value.trim(), err = $("#err");
    if (!v("prod")) { err.textContent = "Alege produsul care te interesează."; sel.focus(); return; }
    if (!v("nm")) { err.textContent = "Scrie-ți numele."; $("#nm").focus(); return; }
    if (v("ph").replace(/\D/g, "").length < 9) { err.textContent = "Lasă un număr de telefon complet, ca să te putem suna."; $("#ph").focus(); return; }
    err.textContent = "";
    const data = { produs:v("prod"), dimensiuni:v("dim"), localitate:v("city"), nume:v("nm"), telefon:v("ph"), detalii:v("msg"), pagina:location.pathname };
    if (CONFIG.formWebhook) {
      try { await fetch(CONFIG.formWebhook, { method:"POST", mode:"no-cors", body:new URLSearchParams(data) }); $("#form").hidden = true; $("#ok").hidden = false; }
      catch (x) { err.textContent = "Cererea nu a putut fi trimisă. Sună-ne la 0265 248 430."; }
    } else {
      const body = Object.entries(data).filter(([, x]) => x).map(([k, x]) => `${k}: ${x}`).join("\n");
      location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Cerere ofertă: " + data.produs)}&body=${encodeURIComponent(body)}`;
    }
  });
})();

/* phone action bar appears after the first screen */
(function(){
  const m = $("#mbar"); if (!m) return;
  const f = () => m.classList.toggle("on", scrollY > innerHeight * .6);
  addEventListener("scroll", f, { passive:true }); f();
})();
/* ---------- the glass staircase ---------- */
(function(){
  if (!$("#stairs")) return;
  const cv = $("#stair"), cx = cv.getContext("2d"), sec = $("#stairs");
  const N = 18, STEP = 0.42, RISE = 0.155, R0 = 0.17, R1 = 1.25, T = 0.05, W = STEP * 0.9, HR = 0.82;
  const H = N * RISE, SEG = 5;
  let w = 0, h = 0, dpr = 1, prog = 0, ps = 0, spin = 0, vel = 0, dragging = false, shown = REDUCED ? 1 : 0, vis = true, t = 0;
  function size(){ dpr = Math.min(2, devicePixelRatio || 1); w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  size(); addEventListener("resize", size);
  const P = (r, a, y) => [r * Math.cos(a), y, r * Math.sin(a)];
  function arc(r, a0, a1, y){ const out = []; for (let k = 0; k <= SEG; k++) out.push(P(r, a0 + (a1 - a0) * k / SEG, y)); return out; }
  // build the model once
  const faces = [];
  for (let i = 0; i < N; i++) {
    const a0 = i * STEP, a1 = a0 + W, y = i * RISE + RISE;
    const top = arc(R0, a0, a1, y).concat(arc(R1, a1, a0, y));
    const bot = arc(R0, a0, a1, y - T).concat(arc(R1, a1, a0, y - T));
    const outer = arc(R1, a0, a1, y).concat(arc(R1, a1, a0, y - T));
    faces.push({ i, k:"top", pts:top }, { i, k:"bot", pts:bot }, { i, k:"edge", pts:outer },
      { i, k:"edge", pts:[P(R0, a0, y), P(R1, a0, y), P(R1, a0, y - T), P(R0, a0, y - T)] },
      { i, k:"edge", pts:[P(R0, a1, y), P(R1, a1, y), P(R1, a1, y - T), P(R0, a1, y - T)] });
    const rp = R1 + 0.03;
    faces.push({ i, k:"panel", pts:arc(rp, a0 - 0.01, a1 + STEP * 0.1, y).concat(arc(rp, a1 + STEP * 0.1, a0 - 0.01, y + HR)) });
    faces.push({ i, k:"rail", line:[P(rp, a0 - 0.01, y + HR), P(rp, a1 + STEP * 0.1, y + HR + RISE * 0.2)] });
    // central column segment
    const CS = 12, cr = 0.11;
    for (let s = 0; s < CS; s++) { const b0 = s / CS * Math.PI * 2, b1 = (s + 1) / CS * Math.PI * 2;
      faces.push({ i, k:"col", pts:[P(cr, b0, i * RISE), P(cr, b1, i * RISE), P(cr, b1, (i + 1) * RISE + .002), P(cr, b0, (i + 1) * RISE + .002)] }); }
  }
  const L = (() => { const v = [-0.45, 0.75, -0.5], m = Math.hypot(...v); return v.map(x => x / m); })();
  function draw(){
    t += 1 / 60;
    ps += (prog - ps) * 0.09;                      // smoothed scroll progress
    if (!dragging) { spin += vel; vel *= 0.94; }    // drag inertia
    const target = REDUCED ? 1 : Math.min(1, ps * 1.25);
    shown += (target - shown) * 0.12;
    const theta = -ps * Math.PI * 2.0 - (REDUCED ? 0.6 : t * 0.03) + spin;
    const phi = 0.42, D = 5.6, ct = Math.cos(theta), stt = Math.sin(theta), cp = Math.cos(phi), sp = Math.sin(phi);
    const mob = w < 900, f = mob ? Math.min(w * 1.3, h * 0.58) : Math.min(h * 0.98, w * 0.6), ox = mob ? w * 0.5 : w * 0.66, oy = h * (mob ? 0.39 : 0.61);
    const proj = ([x, y, z], drop) => {
      const X = x * ct - z * stt, Z = x * stt + z * ct, Y = (y + drop) - H / 2;
      const Y2 = Y * cp - Z * sp, Z2 = Y * sp + Z * cp + D;
      return [ox + f * X / Z2, oy - f * Y2 / Z2, Z2, X, Y2];
    };
    cx.clearRect(0, 0, w, h);
    // floor glow
    const gr = Math.min(f * 0.55, w * 0.48), gy = oy + f * 0.3;
    cx.save(); cx.translate(ox, gy); cx.scale(1, 0.28);
    const g = cx.createRadialGradient(0, 0, 0, 0, 0, gr);
    g.addColorStop(0, "rgba(127,184,174,.22)"); g.addColorStop(1, "rgba(127,184,174,0)");
    cx.fillStyle = g; cx.beginPath(); cx.arc(0, 0, gr, 0, 7); cx.fill(); cx.restore();
    const list = [];
    for (const fc of faces) {
      const a = Math.min(1, Math.max(0, shown * N * 1.08 - fc.i));
      if (a <= 0.01) continue;
      const drop = (1 - a) * 0.6;
      if (fc.line) { const p = fc.line.map(q => proj(q, drop)); list.push({ fc, p, z:(p[0][2] + p[1][2]) / 2, a }); continue; }
      const p = fc.pts.map(q => proj(q, drop));
      let z = 0; for (const q of p) z += q[2]; z /= p.length;
      list.push({ fc, p, z, a });
    }
    list.sort((A, B) => B.z - A.z);
    const sheen = (Math.sin(t * 0.6) + 1) / 2;
    for (const it of list) {
      const { fc, p, a } = it;
      if (fc.line) {
        cx.strokeStyle = `rgba(200,164,106,${0.9 * a})`; cx.lineWidth = Math.max(1.5, f * 0.018 / p[0][2]); cx.lineCap = "round";
        cx.beginPath(); cx.moveTo(p[0][0], p[0][1]); cx.lineTo(p[1][0], p[1][1]); cx.stroke(); continue;
      }
      // normal in camera space
      const u = [p[1][3] - p[0][3], p[1][4] - p[0][4], p[1][2] - p[0][2]], v = [p[2][3] - p[0][3], p[2][4] - p[0][4], p[2][2] - p[0][2]];
      let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; const nl = Math.hypot(...n) || 1; n = n.map(x => x / nl);
      const facing = n[2] < 0;
      const b = Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]), b2 = Math.abs(b);
      cx.beginPath(); cx.moveTo(p[0][0], p[0][1]); for (let k = 1; k < p.length; k++) cx.lineTo(p[k][0], p[k][1]); cx.closePath();
      if (fc.k === "col") {
        if (!facing) continue;
        const l = 0.35 + 0.65 * Math.abs(n[0] * -0.6 + n[2] * -0.8);
        cx.fillStyle = `rgba(${40 + 130 * l | 0},${52 + 128 * l | 0},${60 + 125 * l | 0},${a})`; cx.fill(); continue;
      }
      if (fc.k === "edge") { cx.fillStyle = `rgba(${70 + 60 * b2 | 0},${150 + 50 * b2 | 0},${135 + 40 * b2 | 0},${0.55 * a})`; cx.fill(); cx.strokeStyle = `rgba(190,235,225,${0.35 * a})`; cx.lineWidth = 1; cx.stroke(); continue; }
      if (fc.k === "panel") {
        cx.fillStyle = `rgba(185,225,232,${(0.06 + 0.1 * b2) * a})`; cx.fill();
        cx.strokeStyle = `rgba(230,245,248,${(0.22 + 0.25 * sheen) * a})`; cx.lineWidth = 1; cx.stroke(); continue;
      }
      // tread top/bottom
      cx.fillStyle = `rgba(200,236,240,${(fc.k === "top" ? 0.16 + 0.22 * b2 : 0.07) * a})`; cx.fill();
      cx.strokeStyle = `rgba(255,255,255,${(fc.k === "top" ? 0.55 : 0.18) * a})`; cx.lineWidth = 1; cx.stroke();
      if (fc.k === "top") { // moving highlight across the glass
        const s = Math.pow(Math.max(0, Math.sin(t * 0.8 + fc.i * 0.35)), 12) * 0.35;
        if (s > 0.01) { cx.fillStyle = `rgba(255,255,255,${s * a})`; cx.fill(); }
      }
    }
    if (vis && !REDUCED) requestAnimationFrame(draw);
  }
  // scroll progress drives rotation, assembly and the text
  const slides = [...document.querySelectorAll(".slide")], stN = $("#stN"), bar = $("#stBar"), cta = $("#stCta"), dots = [...document.querySelectorAll("#stDots button")], hint = $("#stHint");
  // jump to a step
  dots.forEach((d, i) => d.addEventListener("click", () => { const total = sec.offsetHeight - innerHeight; scrollTo({ top: sec.offsetTop + total * (i + 0.5) / 4, behavior: REDUCED ? "auto" : "smooth" }); }));
  // drag (mouse or finger, sideways) to rotate the staircase
  let lx = 0;
  cv.addEventListener("pointerdown", e => { dragging = true; lx = e.clientX; vel = 0; cv.classList.add("grab"); try { cv.setPointerCapture(e.pointerId); } catch (x) {} hint.classList.add("gone"); });
  cv.addEventListener("pointermove", e => { if (!dragging) return; const dx = e.clientX - lx; lx = e.clientX; spin += dx * 0.009; vel = dx * 0.009; });
  const up = () => { dragging = false; cv.classList.remove("grab"); };
  cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up); cv.addEventListener("pointerleave", up);
  function onScroll(){
    const r = sec.getBoundingClientRect(), total = sec.offsetHeight - innerHeight;
    prog = REDUCED ? 1 : Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
    const idx = Math.min(3, Math.floor(prog * 4.0001));
    slides.forEach((s, i) => s.classList.toggle("on", REDUCED || i === idx));
    dots.forEach((d, i) => d.setAttribute("aria-current", String(i === idx)));
    stN.textContent = String(Math.max(1, Math.min(N, Math.round(Math.min(1, prog * 1.25) * N)))).padStart(2, "0");
    bar.style.transform = `scaleX(${prog})`;
    cta.classList.toggle("on", REDUCED || prog > 0.8);
    const hd = document.querySelector("header.top"); if (hd) hd.classList.toggle("ondark", r.top <= 72 && r.bottom > 72);
  }
  addEventListener("scroll", onScroll, { passive:true }); onScroll();
  if ("IntersectionObserver" in window) new IntersectionObserver(es => { const v = es[0].isIntersecting; if (v && !vis) { vis = true; requestAnimationFrame(draw); } vis = v; }).observe(sec);
  requestAnimationFrame(draw);
  if (REDUCED) { shown = 1; draw(); }
})();

/* ---------- motion layer: reveals, counters, marquee, drag, previews ---------- */
(function(){
  const splitWords = el => {
    let k = 0;
    const walk = n => [...n.childNodes].forEach(ch => {
      if (ch.nodeType === 3) {
        const frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) frag.append(w); else { const s = document.createElement("span"); s.className = "w"; s.innerHTML = `<i style="--d:${k++}">${esc(w)}</i>`; frag.append(s); } });
        ch.replaceWith(frag);
      } else if (ch.nodeType === 1) walk(ch);
    });
    walk(el);
  };
  document.documentElement.classList.add("js");
  if (document.querySelector(".hero h1")) splitWords(document.querySelector(".hero h1"));
  document.querySelectorAll("h2.disp").forEach(splitWords);
  // numbered services
  document.querySelectorAll(".svc").forEach((s, i) => s.insertAdjacentHTML("afterbegin", `<span class="no">0${i + 1}</span>`));
  // reveal targets with stagger
  const groups = [".facts li", ".lede:not(.hero .lede)", ".filters", ".svc", ".prows li", ".loc", "#form", ".pnote", ".phead .btn"];
  groups.forEach(sel => document.querySelectorAll(sel).forEach((el, i) => { el.classList.add("rv"); el.style.setProperty("--d", i % 6); }));
  const watchList = () => [...document.querySelectorAll(".rv:not(.in), h2.disp:not(.in), .plist li:not(.in), .post:not(.in)")];
  const reveal = el => el.classList.add("in");
  let io = null;
  if (!REDUCED && "IntersectionObserver" in window) io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }), { threshold:.12, rootMargin:"0px 0px -6% 0px" });
  const observe = () => watchList().forEach((el, i) => {
    if (!el.classList.contains("rv") && !el.matches("h2.disp")) { el.classList.add("rv"); el.style.setProperty("--d", i % 6); }
    io ? io.observe(el) : reveal(el);
  });
  observe();
  // re-observe when products are filtered or blog posts arrive
  ["#plist", "#posts", "#promoGrid"].forEach(id => { const n = document.querySelector(id); if (n && "MutationObserver" in window) new MutationObserver(observe).observe(n, { childList:true }); });

  // counters
  const count = el => { const end = +el.dataset.count; if (REDUCED) { el.textContent = end; return; } const t0 = performance.now(), d = 1500;
    (function f(){ const p = Math.min(1, Math.max(0, (performance.now() - t0) / d)); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(f); })(); };
  if ("IntersectionObserver" in window) { const c = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { count(e.target); c.unobserve(e.target); } }), { threshold:.8 }); document.querySelectorAll("[data-count]").forEach(x => { x.textContent = "0"; c.observe(x); }); }

  // marquee of products, speed follows scrolling
  const mq = $("#mq"), words = PRODUCTS.map(p => p[0]).slice(0, 10);
  const row = words.map(w => `<em>${esc(w)}</em><i></i>`).join("");
  if (mq) mq.innerHTML = [0, 1, 2, 3].map(() => `<span>${row}</span>`).join("");
  let mx = 0, lastY = scrollY, v = 0, dir = 1;
  const prog = document.createElement("div"); prog.className = "progress"; document.body.appendChild(prog);
  (function loop(){
    const y = scrollY, dy = y - lastY; lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight; prog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (!REDUCED) {
      if (dy) dir = dy > 0 ? 1 : -1; v += (Math.min(50, Math.abs(dy)) - v) * .1;
      if (mq) { const half = mq.scrollWidth / 2; mx -= (.7 + v * .3) * dir; if (mx < -half) mx += half; if (mx > 0) mx -= half;
      mq.style.transform = `translate3d(${mx}px,0,0)`; }
    }
    requestAnimationFrame(loop);
  })();

  // promotions: drag to scroll with momentum, tilt on hover
  const strip = $("#strip") || $("#promoGrid");
  if (strip) {
    let down = false, sx = 0, sl = 0, moved = 0, vx = 0, last = 0;
    strip.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = 0; sx = e.clientX; sl = strip.scrollLeft; last = e.clientX; strip.classList.add("grab"); });
    addEventListener("pointermove", e => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); strip.scrollLeft = sl - dx; vx = e.clientX - last; last = e.clientX; });
    addEventListener("pointerup", () => { if (!down) return; down = false; strip.classList.remove("grab");
      (function glide(){ if (Math.abs(vx) < .5) return; strip.scrollLeft -= vx; vx *= .92; requestAnimationFrame(glide); })(); });
    strip.addEventListener("click", e => { if (moved > 6) { e.preventDefault(); moved = 0; } }, true);
    if (FINE && !REDUCED) strip.addEventListener("pointermove", e => { const c = e.target.closest(".tagc"); if (!c || down) return; const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `translateY(-6px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`; });
    strip.addEventListener("pointerout", e => { const c = e.target.closest(".tagc"); if (c && !c.contains(e.relatedTarget)) c.style.transform = ""; });
  }

  // projects: a floating glass preview follows the cursor
  if (FINE && !REDUCED) {
    const pv = document.createElement("div"); pv.className = "pv"; document.body.appendChild(pv);
    let px = 0, py = 0, tx = 0, ty = 0, on = false;
    document.querySelectorAll(".prows li").forEach(li => {
      li.addEventListener("pointerenter", () => { pv.innerHTML = `<div><b>${esc(li.querySelector("b").textContent)}</b><small>${esc(li.querySelector("em").textContent)}</small></div>`; pv.classList.add("on"); on = true; });
      li.addEventListener("pointerleave", () => { pv.classList.remove("on"); on = false; });
    });
    addEventListener("pointermove", e => { tx = e.clientX + 150; ty = e.clientY; });
    (function f(){ px += (tx - px) * .15; py += (ty - py) * .15; pv.style.left = px + "px"; pv.style.top = py + "px"; requestAnimationFrame(f); })();
    // soft glow under the cursor + magnetic buttons
    const g = document.createElement("div"); g.className = "cglow"; document.body.appendChild(g);
    let gx = 0, gy = 0, cx2 = 0, cy2 = 0;
    addEventListener("pointermove", e => { cx2 = e.clientX; cy2 = e.clientY; g.classList.add("on"); });
    (function f2(){ gx += (cx2 - gx) * .12; gy += (cy2 - gy) * .12; g.style.transform = `translate3d(${gx}px,${gy}px,0)`; requestAnimationFrame(f2); })();
    document.querySelectorAll(".btn").forEach(b => { b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .28}px)`; }); b.addEventListener("pointerleave", () => b.style.transform = ""); });
  }
})();
