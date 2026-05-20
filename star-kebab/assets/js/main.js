/* =====================================================================
   STAR KEBAB — LE THOR · script principal
   ---------------------------------------------------------------------
   Tout ce qui est "vivant" sur le site est ici :
     - statut ouvert / fermé en direct
     - compte à rebours avant fermeture
     - thème jour / nuit, bandeau saisonnier, easter egg, etc.
   ===================================================================== */

/* =====================================================================
   1) HORAIRES — ÉDITEZ UNIQUEMENT CET OBJET POUR CHANGER LES HEURES
   ---------------------------------------------------------------------
   Clés : jour de la semaine
     0 = Dimanche · 1 = Lundi · 2 = Mardi · 3 = Mercredi
     4 = Jeudi    · 5 = Vendredi · 6 = Samedi
   Valeurs : liste de créneaux [ "ouverture", "fermeture" ] au format 24h.
   Plusieurs créneaux possibles dans la journée (midi + soir).
   Jour fermé : mettez un tableau vide  ->  []
   ===================================================================== */
const HORAIRES = {
  0: [["18:00", "23:00"]],                       // Dimanche — soir uniquement
  1: [["11:00", "14:30"], ["18:00", "23:00"]],   // Lundi
  2: [["11:00", "14:30"], ["18:00", "23:00"]],   // Mardi
  3: [["11:00", "14:30"], ["18:00", "23:00"]],   // Mercredi
  4: [["11:00", "14:30"], ["18:00", "23:00"]],   // Jeudi
  5: [["11:00", "14:30"], ["18:00", "23:30"]],   // Vendredi — tard
  6: [["11:00", "23:30"]],                        // Samedi — service continu
};

/* Libellés des jours (utilisés pour "ouvre mardi à 11h", etc.) */
const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

/* =====================================================================
   2) OUTILS HORAIRES
   ===================================================================== */
const toMin = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/* "11:00" -> "11h" ; "14:30" -> "14h30" */
const fmtH = (hhmm) => {
  const [h, m] = hhmm.split(":");
  return m === "00" ? `${parseInt(h, 10)}h` : `${parseInt(h, 10)}h${m}`;
};

/* Calcule le statut courant à partir de l'objet HORAIRES */
function getStatus(now = new Date()) {
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = HORAIRES[day] || [];

  // Sommes-nous dans un créneau ouvert maintenant ?
  for (const [open, close] of today) {
    const om = toMin(open), cm = toMin(close);
    if (mins >= om && mins < cm) {
      const left = cm - mins;
      return {
        open: true,
        closeAt: close,
        minutesToClose: left,
        closingSoon: left <= 60,
        label: "Ouvert",
        detail: `ferme à ${fmtH(close)}`,
      };
    }
  }

  // Fermé : chercher la prochaine ouverture (plus tard aujourd'hui…)
  for (const [open] of today) {
    if (toMin(open) > mins) {
      return closed(`ouvre aujourd'hui à ${fmtH(open)}`);
    }
  }
  // …sinon les jours suivants
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const slots = HORAIRES[d] || [];
    if (slots.length) {
      const when = i === 1 ? "demain" : JOURS[d];
      return closed(`ouvre ${when} à ${fmtH(slots[0][0])}`);
    }
  }
  return closed("horaires à venir");
}
function closed(detail) {
  return { open: false, label: "Fermé", detail, minutesToClose: null, closingSoon: false };
}

/* =====================================================================
   3) RENDU DU STATUT + COMPTE À REBOURS
   ===================================================================== */
function renderStatus() {
  const s = getStatus();

  document.querySelectorAll("[data-status]").forEach((el) => {
    el.dataset.open = String(s.open);
    const dot = el.querySelector("[data-status-dot]");
    const txt = el.querySelector("[data-status-text]");
    if (dot) {
      dot.classList.toggle("is-open", s.open);
      dot.classList.toggle("is-closed", !s.open);
    }
    if (txt) txt.textContent = `${s.label} — ${s.detail}`;
  });

  // Compteur "ferme dans X min" (moins d'1h avant la fermeture)
  document.querySelectorAll("[data-closing]").forEach((el) => {
    if (s.open && s.closingSoon) {
      el.hidden = false;
      const m = el.querySelector("[data-closing-min]");
      if (m) m.textContent = s.minutesToClose;
    } else {
      el.hidden = true;
    }
  });
}

/* =====================================================================
   4) THÈME JOUR / NUIT
   ===================================================================== */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem("sk-theme", t); } catch (e) {}
  document.querySelectorAll("[data-theme-toggle]").forEach((b) =>
    b.setAttribute("aria-pressed", String(t === "dark"))
  );
}
function initTheme() {
  const cur = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(cur === "dark"));
    btn.addEventListener("click", () => {
      const now = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(now);
    });
  });
}

/* =====================================================================
   5) BANDEAU SAISONNIER (dismissible, mémorisé)
   ===================================================================== */
function initBanner() {
  const banner = document.querySelector("[data-season-banner]");
  if (!banner) return;
  try {
    if (localStorage.getItem("sk-banner") === "off") banner.hidden = true;
  } catch (e) {}
  banner.querySelector("[data-banner-close]")?.addEventListener("click", () => {
    banner.hidden = true;
    try { localStorage.setItem("sk-banner", "off"); } catch (e) {}
  });
}

/* =====================================================================
   6) ANIMATIONS : reveal au scroll + parallax léger
   ===================================================================== */
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (REDUCE || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((el) => io.observe(el));
}

function initParallax() {
  if (REDUCE) return;
  const els = document.querySelectorAll("[data-parallax]");
  if (!els.length) return;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    els.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
    ticking = false;
  };
  addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* =====================================================================
   7) CURSEUR CUSTOM (desktop, pointeur fin uniquement)
   ===================================================================== */
function initCursor() {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.appendChild(dot);

  addEventListener("mousemove", (e) => {
    dot.style.opacity = "1";
    dot.style.transform =
      `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    if (dot.classList.contains("cursor-dot--big"))
      dot.style.transform += " ";
  });
  addEventListener("mouseleave", () => (dot.style.opacity = "0"));

  const big = () => dot.classList.add("cursor-dot--big");
  const small = () => dot.classList.remove("cursor-dot--big");
  document.querySelectorAll('a, button, [data-cursor="big"]').forEach((el) => {
    el.addEventListener("mouseenter", big);
    el.addEventListener("mouseleave", small);
  });
}

/* =====================================================================
   8) NAVIGATION MOBILE
   ===================================================================== */
function initNav() {
  const btn = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const backdrop = document.querySelector("[data-nav-backdrop]");
  if (!btn || !nav) return;

  const set = (open) => {
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    btn.setAttribute("aria-expanded", String(open));
    if (backdrop) backdrop.classList.toggle("is-shown", open);
  };

  btn.addEventListener("click", () => set(!nav.classList.contains("is-open")));
  backdrop?.addEventListener("click", () => set(false));
  nav.querySelectorAll("a, [data-nav-close]").forEach((el) =>
    el.addEventListener("click", () => set(false))
  );
  addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
}

/* =====================================================================
   9) CTA STICKY (flottant desktop) — apparaît après défilement
   ===================================================================== */
function initStickyCta() {
  const cta = document.querySelector("[data-sticky-cta]");
  if (!cta) return;
  const onScroll = () => cta.classList.toggle("is-shown", window.scrollY > 620);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* =====================================================================
   10) EASTER EGG — 10s d'inactivité sur l'accueil
   ===================================================================== */
function initEasterEgg() {
  if (document.body.dataset.page !== "home" || REDUCE) return;
  const egg = document.querySelector("[data-egg]");
  if (!egg) return;
  let timer;
  const arm = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try { if (sessionStorage.getItem("sk-egg")) return; } catch (e) {}
      egg.classList.add("is-shown");
      try { sessionStorage.setItem("sk-egg", "1"); } catch (e) {}
    }, 10000);
  };
  ["mousemove", "scroll", "keydown", "touchstart", "click"].forEach((ev) =>
    addEventListener(ev, arm, { passive: true })
  );
  egg.querySelector("[data-egg-close]")?.addEventListener("click", () =>
    egg.classList.remove("is-shown")
  );
  arm();
}

/* =====================================================================
   11) IMAGES — chaîne de repli si une photo ne charge pas
   Unsplash (principal) -> LoremFlickr (photo réelle par mot-clé)
                        -> tuile dégradée de marque
   ===================================================================== */
function initImageFallback() {
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    let stage = 0;
    img.addEventListener("error", () => {
      stage++;
      if (stage === 1) {
        const kw = encodeURIComponent(img.dataset.fallback || "kebab,food");
        img.src = `https://loremflickr.com/800/600/${kw}`;
      } else {
        brandedTile(img);
      }
    });
  });
}
function brandedTile(img) {
  const wrap = img.closest("[data-img]") || img.parentElement;
  img.style.display = "none";
  if (wrap && !wrap.querySelector(".img-fallback")) {
    const div = document.createElement("div");
    div.className = "img-fallback";
    div.innerHTML = `<span>${img.getAttribute("alt") || "Star Kebab"}</span>`;
    wrap.appendChild(div);
  }
}

/* =====================================================================
   12) HORAIRES DE LA SEMAINE (page Contact) — généré depuis HORAIRES
   ===================================================================== */
function initHours() {
  const list = document.querySelector("[data-hours-list]");
  if (!list) return;
  const labels = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const order = [1, 2, 3, 4, 5, 6, 0]; // affichage lundi -> dimanche
  const todayIdx = new Date().getDay();

  list.innerHTML = order.map((d) => {
    const slots = HORAIRES[d] || [];
    const txt = slots.length
      ? slots.map(([o, c]) => `${fmtH(o)} – ${fmtH(c)}`).join(" · ")
      : "Fermé";
    const isToday = d === todayIdx;
    return `<li class="receipt-line py-2 ${isToday ? "font-bold text-paprika" : ""}">
        <span>${labels[d]}${isToday ? " ·" : ""}</span>
        <span class="dots"></span>
        <span>${txt}</span>
      </li>`;
  }).join("");
}

/* =====================================================================
   13) DIVERS — année du footer
   ===================================================================== */
function initMisc() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* =====================================================================
   INITIALISATION
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderStatus();
  setInterval(renderStatus, 30000); // rafraîchit le statut toutes les 30s
  initTheme();
  initBanner();
  initReveal();
  initParallax();
  initCursor();
  initNav();
  initStickyCta();
  initEasterEgg();
  initImageFallback();
  initHours();
  initMisc();
});
