/* ============================================================
   Lee's Kitchen: site config
   Everything marked PLACEHOLDER should be replaced with real info.
   ============================================================ */
const CONFIG = {
  whatsapp: "2348012345678",                 // PLACEHOLDER: international format, no "+" or spaces
  phoneDisplay: "+234 801 234 5678",         // PLACEHOLDER
  email: "hello@leeskitchen.ng",             // PLACEHOLDER
  address: "Ilorin, Kwara State, Nigeria",   // PLACEHOLDER
  socials: {                                 // PLACEHOLDER handles
    instagram: "https://instagram.com/leeskitchen",
    tiktok: "https://tiktok.com/@leeskitchen",
    facebook: "https://facebook.com/leeskitchen",
  },
  hours: [                                   // PLACEHOLDER
    ["Mon – Fri", "9:00 AM – 9:00 PM"],
    ["Saturday", "10:00 AM – 10:00 PM"],
    ["Sunday", "12:00 PM – 8:00 PM"],
  ],
  offer: { amount: "₦500", code: "LEE500" }, // PLACEHOLDER discount

  // MailerLite (account + forms created for this site)
  mailerlite: {
    accountId: "2604305",
    signupFormId: "199958681115166601",   // → group "Lee's Kitchen - Website Leads"
    cateringFormId: "199958682134381712", // → group "Lee's Kitchen - Catering Leads"
  },

  // PLACEHOLDER menu and prices
  menu: [
    { name: "Jollof Rice & Chicken", desc: "Smoky party jollof with well-seasoned chicken and plantain.", price: 2500, img: "jollof.jpg", tag: "Bestseller" },
    { name: "Fried Rice & Beef", desc: "Veggie-loaded fried rice with tender beef chunks.", price: 2500, img: "fried-rice-beef.jpg" },
    { name: "Grilled Chicken", desc: "Well-marinated, flame-grilled chicken with pepper sauce.", price: 2000, img: "grilled-chicken.jpg", tag: "Spicy" },
    { name: "Efo Riro & Assorted", desc: "Rich spinach stew loaded with assorted meat.", price: 3000, img: "efo-riro.jpg" },
    { name: "Classic Fried Rice", desc: "Fried rice with peas, carrots and chicken bits.", price: 2200, img: "fried-rice.jpg" },
    { name: "Peppered Chicken", desc: "Juicy chicken tossed in spicy pepper sauce and greens.", price: 2800, img: "peppered-chicken.jpg" },
    { name: "Beef Stew & Potatoes", desc: "Hearty tomato beef stew with potatoes and carrots.", price: 2700, img: "beef-stew.jpg" },
    { name: "Dodo & Efo", desc: "Sweet fried plantain with vegetable stew.", price: 2000, img: "plantain-efo.jpg", tag: "New" },
  ],
};

/* ============================================================ */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const naira = (n) => "₦" + n.toLocaleString("en-NG");

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  sset(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
};
const isSubscribed = () => store.get("lk_subscribed") === "1";

function waLink(message) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}
function orderMessage(dish) {
  let msg = dish ? `Hi Lee's Kitchen! I'd like to order: ${dish}.` : "Hi Lee's Kitchen! I'd like to place an order.";
  if (isSubscribed()) msg += ` I'm using my first-order code ${CONFIG.offer.code}.`;
  return msg;
}

/* ---------- Fill config-driven content ---------- */
function renderConfig() {
  $$("[data-config-phone]").forEach((a) => { a.textContent = CONFIG.phoneDisplay; a.href = "tel:+" + CONFIG.whatsapp; });
  $$("[data-config-email]").forEach((a) => { a.textContent = CONFIG.email; a.href = "mailto:" + CONFIG.email; });
  $$("[data-config-address]").forEach((el) => { el.textContent = CONFIG.address; });
  $$("[data-config-social]").forEach((a) => {
    a.href = CONFIG.socials[a.dataset.configSocial] || "#";
    a.target = "_blank"; a.rel = "noopener";
  });
  const hours = $("[data-config-hours]");
  if (hours) hours.innerHTML = CONFIG.hours.map(([d, t]) => `<li><span>${d}</span><span>${t}</span></li>`).join("");
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
  $$("[data-whatsapp]").forEach((a) => { a.href = waLink(orderMessage()); a.target = "_blank"; a.rel = "noopener"; });
}

function renderMenu() {
  const grid = $("#menuGrid");
  if (!grid) return;
  grid.innerHTML = CONFIG.menu.map((d) => `
    <article class="dish reveal">
      ${d.tag ? `<span class="dish__tag">${d.tag}</span>` : ""}
      <img src="assets/img/${d.img}" alt="${d.name}" loading="lazy">
      <div class="dish__body">
        <h3>${d.name}</h3>
        <p>${d.desc}</p>
        <div class="dish__price">${naira(d.price)}</div>
        <a class="btn btn--ghost btn--sm" href="${waLink(orderMessage(d.name))}" target="_blank" rel="noopener" data-whatsapp="menu" data-dish="${d.name}">Order Now</a>
      </div>
    </article>`).join("");
}

/* ---------- MailerLite submission ---------- */
async function submitToMailerLite(formId, fields) {
  const { accountId } = CONFIG.mailerlite;
  const url = `https://assets.mailerlite.com/jsonp/${accountId}/forms/${formId}/subscribe`;
  const build = () => {
    const body = new FormData();
    Object.entries(fields).forEach(([k, v]) => { if (v) body.append(`fields[${k}]`, v); });
    body.append("ml-submit", "1");
    body.append("anticsrf", "true");
    return body;
  };
  try {
    const res = await fetch(url, { method: "POST", body: build() });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false) return { ok: true };
    const err = data?.errors?.fields ? Object.values(data.errors.fields).flat()[0] : null;
    return { ok: false, error: err || "Something went wrong. Please try again." };
  } catch {
    // CORS/network hiccup: fall back to a fire-and-forget post
    try { await fetch(url, { method: "POST", body: build(), mode: "no-cors" }); return { ok: true }; }
    catch { return { ok: false, error: "Network error. Please check your connection and try again." }; }
  }
}

const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

function setMsg(form, text, type) {
  const msg = $(".lead-form__msg", form);
  if (!msg) return;
  msg.textContent = text;
  msg.className = "lead-form__msg" + (type ? ` is-${type}` : "");
}

function bindLeadForms() {
  $$("[data-lead-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const val = (n) => (form.elements.namedItem(n)?.value || "").trim();
      const email = val("email");
      if (!emailOk(email)) { setMsg(form, "Please enter a valid email address.", "error"); form.elements.namedItem("email").focus(); return; }
      const btn = $("button[type=submit]", form);
      const label = btn.textContent;
      btn.disabled = true; btn.textContent = "Sending…";
      const source = form.dataset.source === "popup" ? (modalState.source || "popup") : form.dataset.source;
      const result = await submitToMailerLite(CONFIG.mailerlite.signupFormId, {
        email,
        name: val("name"),
        phone: val("phone"),
        lead_source: source,
      });
      btn.disabled = false; btn.textContent = label;
      if (!result.ok) { setMsg(form, result.error, "error"); return; }

      store.set("lk_subscribed", "1");
      renderConfig(); // WhatsApp links now include the code
      form.classList.add("is-done");
      setMsg(form, `🎉 You're in! Your code is ${CONFIG.offer.code}. We've also sent it to your email.`, "success");
      if (form.closest("#leadModal")) showModalSuccess();
      if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { source });
    });
  });
}

function bindCateringForm() {
  const form = $("[data-catering-form]");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(form));
    if (!f.name.trim()) { setMsg(form, "Please tell us your name.", "error"); return; }
    if (!emailOk(f.email.trim())) { setMsg(form, "Please enter a valid email address.", "error"); return; }
    if (!f.phone.trim()) { setMsg(form, "Please add your WhatsApp number so we can send your quote.", "error"); return; }
    const btn = $("button[type=submit]", form);
    btn.disabled = true; btn.textContent = "Sending…";
    const result = await submitToMailerLite(CONFIG.mailerlite.cateringFormId, {
      email: f.email.trim(), name: f.name.trim(), phone: f.phone.trim(),
      event_date: f.event_date, guest_count: f.guest_count, lead_source: "catering",
    });
    btn.disabled = false; btn.textContent = "Request my quote";
    if (!result.ok) { setMsg(form, result.error, "error"); return; }
    form.classList.add("is-done");
    const msg = `Hi Lee's Kitchen! I just requested a catering quote.\nName: ${f.name}\nDate: ${f.event_date || "TBC"}\nGuests: ${f.guest_count || "TBC"}`;
    const m = $(".lead-form__msg", form);
    m.className = "lead-form__msg is-success";
    m.innerHTML = `✅ Request received! We'll get back to you within 24 hours.<br><br>
      <a class="btn btn--primary btn--block" href="${waLink(msg)}" target="_blank" rel="noopener">Want it faster? Chat on WhatsApp</a>`;
  });
}

/* ---------- Lead modal ---------- */
const modal = $("#leadModal");
const modalState = { source: null, pendingDish: undefined, lastFocus: null };
const MODAL_COPY = {
  exit: { eyebrow: "Wait! Before you go…", title: `Take ${CONFIG.offer.amount} off your first order`, text: "Drop your email and we'll send your discount code right away. It takes 5 seconds." },
  claim: { eyebrow: "Welcome offer", title: `Your ${CONFIG.offer.amount} discount is waiting`, text: "Tell us where to send it. You'll also be first to hear about new dishes and weekly specials." },
  order: { eyebrow: "Quick one before you order 👋", title: `Want ${CONFIG.offer.amount} off this order?`, text: "Get your first-order code in seconds, and we'll add it to your WhatsApp message automatically." },
};

function openModal(mode, source, dish) {
  if (!modal || !modal.hidden) return;
  const copy = MODAL_COPY[mode];
  $("#leadModalEyebrow").textContent = copy.eyebrow;
  $("#leadModalTitle").textContent = copy.title;
  $("#leadModalText").textContent = copy.text;
  modalState.source = source;
  modalState.pendingDish = mode === "order" ? (dish || null) : undefined;
  $(".modal__skip", modal).textContent = mode === "order" ? "No thanks, continue to WhatsApp" : "No thanks, I'll pay full price";
  modalState.lastFocus = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  store.sset("lk_popup_seen", "1");
  setTimeout(() => $("input[name=email]", modal)?.focus(), 50);
}

function closeModal() {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = "";
  modalState.lastFocus?.focus?.();
}

function showModalSuccess() {
  if (modalState.pendingDish !== undefined) {
    const msg = $(".lead-form__msg", modal);
    msg.innerHTML += `<br><br><a class="btn btn--primary btn--block" href="${waLink(orderMessage(modalState.pendingDish))}" target="_blank" rel="noopener">Continue to WhatsApp with my code →</a>`;
    $("a", msg).addEventListener("click", closeModal);
  }
  $(".modal__skip", modal).hidden = true;
}

function bindModal() {
  if (!modal) return;
  $$("[data-close-modal]", modal).forEach((el) => el.addEventListener("click", closeModal));
  $("[data-skip-modal]", modal).addEventListener("click", () => {
    const dish = modalState.pendingDish;
    closeModal();
    if (dish !== undefined) window.open(waLink(orderMessage(dish)), "_blank", "noopener");
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  $$("[data-open-lead]").forEach((b) => b.addEventListener("click", () => {
    if (isSubscribed()) { alert(`You're already in! Your code is ${CONFIG.offer.code}.`); return; }
    openModal("claim", b.dataset.openLead);
  }));

  // Intercept the first WhatsApp order click per visit to offer the discount
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-whatsapp]");
    if (!a || isSubscribed() || store.sget("lk_order_prompted")) return;
    e.preventDefault();
    store.sset("lk_order_prompted", "1");
    openModal("order", "before-order-" + a.dataset.whatsapp, a.dataset.dish || null);
  });

  // Exit intent (desktop) + engaged-visitor trigger (mobile)
  const canAutoOpen = () => !isSubscribed() && !store.sget("lk_popup_seen") && modal.hidden;
  document.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget && e.clientY <= 0 && canAutoOpen()) openModal("exit", "exit-intent");
  });
  if (matchMedia("(pointer: coarse)").matches) {
    let fired = false;
    const fire = () => { if (!fired && canAutoOpen()) { fired = true; openModal("exit", "timed-popup"); } };
    setTimeout(fire, 30000);
    addEventListener("scroll", () => {
      const depth = (scrollY + innerHeight) / document.body.scrollHeight;
      if (depth > 0.6) fire();
    }, { passive: true });
  }
}

/* ---------- Countdown to end of week (Sunday 23:59) ---------- */
function startCountdown() {
  const els = $$("[data-countdown]");
  if (!els.length) return;
  const end = () => {
    const d = new Date();
    d.setDate(d.getDate() + ((7 - d.getDay()) % 7));
    d.setHours(23, 59, 59, 999);
    return d;
  };
  const tick = () => {
    let s = Math.max(0, Math.floor((end() - Date.now()) / 1000));
    const days = Math.floor(s / 86400); s %= 86400;
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    const txt = (days ? `${days}d ` : "") + `${h}:${m}:${sec}`;
    els.forEach((el) => { el.textContent = txt; });
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- UI niceties ---------- */
function bindNav() {
  const toggle = $("#navToggle"), nav = $("#nav");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$("a", nav).forEach((a) => a.addEventListener("click", () => { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", false); }));
}

function reveal() {
  $$(".section h2, .why__item, .steps li, .review, .offer-card, .catering, .about__media").forEach((el) => el.classList.add("reveal"));
  if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((el) => el.classList.add("is-visible")); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));
}

function countUp() {
  $$("[data-count-to]").forEach((el) => {
    const to = +el.dataset.countTo; let n = 0;
    const step = () => { n = Math.min(to, n + Math.ceil(to / 40)); el.textContent = n; if (n < to) requestAnimationFrame(step); };
    step();
  });
}

function welcomeBack() {
  if (!isSubscribed()) return;
  $$("[data-lead-form]").forEach((form) => {
    form.classList.add("is-done");
    setMsg(form, `Welcome back! Your first-order code is ${CONFIG.offer.code}.`, "success");
  });
}

renderMenu();
renderConfig();
bindLeadForms();
bindCateringForm();
bindModal();
bindNav();
startCountdown();
reveal();
countUp();
welcomeBack();
