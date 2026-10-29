export function initVisualSpectacle() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  document.documentElement.classList.add("has-spectacle-js");

  initScrollProgress();
  initAmbientAtmosphere(prefersReducedMotion);
  initHeroCinemaSwitcher(prefersReducedMotion);
  initVenuesAccordion();
  initGastronomyPreview();
  initTypographyChoreography(prefersReducedMotion);
  initScrollReveals(prefersReducedMotion);
  initInteractiveTiltAndSpotlight(prefersReducedMotion, isCoarsePointer);
  initMagneticElements(prefersReducedMotion, isCoarsePointer);
  initParallaxHero(prefersReducedMotion);
  initAnimatedNumbers(prefersReducedMotion);
  initPackageSwitchIndicator();
  initActiveSectionNav();
}

function initScrollProgress() {
  const progressBar = document.createElement("div");
  progressBar.className = "spectacle-scroll-progress";
  progressBar.setAttribute("aria-hidden", "true");
  document.body.append(progressBar);

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const ratio = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    progressBar.style.setProperty("--scroll-progress", ratio.toFixed(4));
    document.documentElement.classList.toggle("is-scrolled", scrollTop > 32);
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
}

function initHeroCinemaSwitcher(prefersReducedMotion) {
  const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  const triggers = Array.from(document.querySelectorAll("[data-slide-trigger]"));

  if (slides.length === 0 || triggers.length === 0) {
    return;
  }

  let currentIndex = 0;
  let timerId = 0;

  const activateSlide = (index) => {
    currentIndex = index % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === currentIndex);
    });
    triggers.forEach((btn, i) => {
      btn.classList.toggle("is-active", i === currentIndex);
    });
  };

  const startAutoPlay = () => {
    if (prefersReducedMotion) return;
    window.clearInterval(timerId);
    timerId = window.setInterval(() => {
      activateSlide((currentIndex + 1) % slides.length);
    }, 5200);
  };

  triggers.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      activateSlide(index);
      startAutoPlay();
    });
    btn.addEventListener("pointerenter", () => {
      activateSlide(index);
      startAutoPlay();
    });
  });

  startAutoPlay();
}

function initVenuesAccordion() {
  const panels = Array.from(document.querySelectorAll("[data-venue-panel]"));
  if (panels.length === 0) {
    return;
  }

  panels.forEach((panel) => {
    const setActive = () => {
      panels.forEach((p) => p.classList.toggle("is-active", p === panel));
    };
    panel.addEventListener("pointerenter", setActive);
    panel.addEventListener("focus", setActive);
  });
}

function initGastronomyPreview() {
  const previewImg = document.getElementById("gastronomy-active-img");
  const previewCat = document.getElementById("gastronomy-active-cat");
  const previewTitle = document.getElementById("gastronomy-active-title");
  const menuRows = Array.from(document.querySelectorAll(".menu-row[data-menu-img]"));

  if (!previewImg || !previewCat || !previewTitle || menuRows.length === 0) {
    return;
  }

  const updatePreview = (row) => {
    const nextSrc = row.getAttribute("data-menu-img");
    const nextCat = row.getAttribute("data-menu-cat");
    const nextTitle = row.getAttribute("data-menu-title");

    if (nextSrc && previewImg.getAttribute("src") !== nextSrc) {
      previewImg.style.opacity = "0.35";
      previewImg.style.transform = "scale(1.06)";
      window.setTimeout(() => {
        previewImg.setAttribute("src", nextSrc);
        previewImg.style.opacity = "1";
        previewImg.style.transform = "scale(1)";
      }, 150);
    }

    if (nextCat) previewCat.textContent = nextCat;
    if (nextTitle) previewTitle.textContent = nextTitle;
  };

  menuRows.forEach((row) => {
    row.addEventListener("pointerenter", () => updatePreview(row));
    row.addEventListener("toggle", () => {
      if (row.open) {
        updatePreview(row);
      }
    });
  });
}

function initAmbientAtmosphere(prefersReducedMotion) {
  const ambient = document.createElement("div");
  ambient.className = "spectacle-ambient";
  ambient.setAttribute("aria-hidden", "true");

  const orb1 = document.createElement("span");
  orb1.className = "spectacle-orb spectacle-orb--forest";
  const orb2 = document.createElement("span");
  orb2.className = "spectacle-orb spectacle-orb--gold";
  const orb3 = document.createElement("span");
  orb3.className = "spectacle-orb spectacle-orb--rose";

  const canvas = document.createElement("canvas");
  canvas.className = "spectacle-canvas";

  ambient.append(orb1, orb2, orb3, canvas);
  document.body.prepend(ambient);

  if (prefersReducedMotion) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  let width = 0;
  let height = 0;
  let animationFrameId = 0;

  const palette = [
    "rgba(195, 155, 95, 0.42)",
    "rgba(111, 167, 43, 0.34)",
    "rgba(184, 111, 96, 0.3)",
    "rgba(168, 190, 141, 0.38)"
  ];

  const particles = Array.from({ length: 34 }, (_, i) => ({
    x: (i * 97) % 1000,
    y: (i * 173) % 1000,
    radius: 1.4 + (i % 4) * 1.1,
    vx: ((i % 5) - 2) * 0.14 || 0.12,
    vy: -0.18 - (i % 4) * 0.08,
    alpha: 0.25 + (i % 5) * 0.12,
    phase: i * 0.7,
    color: palette[i % palette.length]
  }));

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });

  let mouseX = width * 0.5;
  let mouseY = height * 0.35;

  window.addEventListener(
    "pointermove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true }
  );

  const render = (time) => {
    ctx.clearRect(0, 0, width, height);

    const t = time * 0.001;
    for (const p of particles) {
      p.x += p.vx + Math.sin(t + p.phase) * 0.18;
      p.y += p.vy;

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.hypot(dx, dy);
      const influence = dist < 180 ? (1 - dist / 180) * 14 : 0;
      const drawX = p.x + (dist > 1 ? (dx / dist) * influence : 0);
      const drawY = p.y + (dist > 1 ? (dy / dist) * influence : 0);

      const pulse = 0.65 + 0.35 * Math.sin(t * 1.8 + p.phase);
      ctx.save();
      ctx.globalAlpha = p.alpha * pulse;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    animationFrameId = window.requestAnimationFrame(render);
  };

  animationFrameId = window.requestAnimationFrame(render);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrameId);
    } else {
      animationFrameId = window.requestAnimationFrame(render);
    }
  });
}

function initTypographyChoreography(prefersReducedMotion) {
  if (prefersReducedMotion) {
    return;
  }

  const heroHeading = document.querySelector(".cinema-title, .garden-detail-hero h1");
  if (heroHeading && !heroHeading.dataset.choreographed) {
    heroHeading.dataset.choreographed = "true";
    heroHeading.classList.add("spectacle-hero-title");
  }
}

function initScrollReveals(prefersReducedMotion) {
  const revealSelectors = [
    ".cinema-hero__stage",
    ".garden-detail-hero",
    ".editorial-header",
    ".garden-media-heading",
    ".garden-other-heading",
    ".review-heading",
    ".faq-heading",
    ".contact-heading",
    ".venue-panel",
    ".gastronomy-preview",
    ".service-card",
    ".package-switch",
    ".package-card",
    ".menu-row",
    ".testimonial-card",
    ".faq-item",
    ".contact-map",
    ".contact-channel",
    ".contact-phone",
    ".garden-gallery",
    ".garden-video-card",
    ".garden-video-empty",
    ".garden-other-card",
    ".garden-detail-cta"
  ];

  const elements = document.querySelectorAll(revealSelectors.join(","));
  elements.forEach((el, index) => {
    el.classList.add("spectacle-reveal");
    const siblingIndex = Array.from(el.parentElement?.children ?? []).indexOf(el);
    const delayMs = Math.min(Math.max(siblingIndex, 0) * 85, 420);
    el.style.setProperty("--reveal-delay", `${delayMs}ms`);
    if (index < 2) {
      el.classList.add("is-visible");
    }
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -48px 0px"
    }
  );

  elements.forEach((el) => {
    if (!el.classList.contains("is-visible")) {
      observer.observe(el);
    }
  });
}

function initInteractiveTiltAndSpotlight(prefersReducedMotion, isCoarsePointer) {
  if (prefersReducedMotion || isCoarsePointer) {
    return;
  }

  const interactiveCards = document.querySelectorAll(
    ".service-card, .package-card, .testimonial-card, .contact-channel, .garden-gallery figure, .garden-other-card, .garden-video-card, .garden-detail-cta"
  );

  interactiveCards.forEach((card) => {
    card.classList.add("spectacle-interactive-card");
    const maxTilt = 4.5;

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const px = (x / rect.width) * 2 - 1;
      const py = (y / rect.height) * 2 - 1;

      const rotateX = (-py * maxTilt).toFixed(2);
      const rotateY = (px * maxTilt).toFixed(2);

      card.style.setProperty("--spot-x", `${x.toFixed(1)}px`);
      card.style.setProperty("--spot-y", `${y.toFixed(1)}px`);
      card.style.setProperty("--tilt-x", `${rotateX}deg`);
      card.style.setProperty("--tilt-y", `${rotateY}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

function initMagneticElements(prefersReducedMotion, isCoarsePointer) {
  if (prefersReducedMotion || isCoarsePointer) {
    return;
  }

  const magneticTargets = document.querySelectorAll(
    ".btn-luxe, .button, .garden-hero-primary, .garden-detail-back, .contact-map-bar a, .garden-gallery-toggle"
  );

  magneticTargets.forEach((el) => {
    el.classList.add("spectacle-magnetic");

    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + rect.width / 2);
      const offsetY = event.clientY - (rect.top + rect.height / 2);
      el.style.setProperty("--mag-x", `${(offsetX * 0.2).toFixed(1)}px`);
      el.style.setProperty("--mag-y", `${(offsetY * 0.25).toFixed(1)}px`);
    });

    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--mag-x", "0px");
      el.style.setProperty("--mag-y", "0px");
    });
  });
}

function initParallaxHero(prefersReducedMotion) {
  if (prefersReducedMotion) {
    return;
  }

  const heroContainer = document.querySelector(".cinema-hero, .garden-detail-hero");
  const heroImages = heroContainer?.querySelectorAll(".cinema-hero__bg-img, picture img, :scope > img");

  if (!heroContainer || !heroImages || heroImages.length === 0) {
    return;
  }

  const updateParallax = () => {
    const rect = heroContainer.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      return;
    }
    const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), -0.3), 1);
    const translateY = (progress * 44).toFixed(1);
    heroImages.forEach((img) => {
      img.style.setProperty("--hero-parallax-y", `${translateY}px`);
    });
  };

  updateParallax();
  window.addEventListener("scroll", updateParallax, { passive: true });

  heroContainer.addEventListener(
    "pointermove",
    (e) => {
      const rect = heroContainer.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * -14;
      const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * -10;
      heroImages.forEach((img) => {
        img.style.setProperty("--hero-pan-x", `${nx.toFixed(1)}px`);
        img.style.setProperty("--hero-pan-y", `${ny.toFixed(1)}px`);
      });
    },
    { passive: true }
  );
}

function initAnimatedNumbers(prefersReducedMotion) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    return;
  }

  const reviewSpans = document.querySelectorAll(".review-heading h2 span");
  if (reviewSpans.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);

        const original = el.textContent?.trim() ?? "";
        if (original === "214") {
          animateCounter(el, 0, 214, 1500, (v) => String(Math.round(v)));
        } else if (original === "4,4/5") {
          animateCounter(el, 0, 4.4, 1500, (v) => `${v.toFixed(1).replace(".", ",")}/5`);
        }
      });
    },
    { threshold: 0.5 }
  );

  reviewSpans.forEach((span) => observer.observe(span));
}

function animateCounter(element, start, end, duration, formatter) {
  const startTime = performance.now();

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = start + (end - start) * eased;
    element.textContent = formatter(current);

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    }
  };

  window.requestAnimationFrame(tick);
}

function initPackageSwitchIndicator() {
  const packageTabs = document.querySelector(".package-tabs");
  const packageSwitch = packageTabs?.querySelector(".package-switch");
  const photoInput = document.getElementById("photo-packages");
  const hennaInput = document.getElementById("henna-packages");

  if (!packageTabs || !packageSwitch || !photoInput || !hennaInput) {
    return;
  }

  const syncSwitchState = () => {
    packageSwitch.dataset.activeTab = hennaInput.checked ? "henna" : "photo";
  };

  syncSwitchState();
  photoInput.addEventListener("change", syncSwitchState);
  hennaInput.addEventListener("change", syncSwitchState);
}

function initActiveSectionNav() {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"], .mobile-bottom-nav a[href^="#"]'));
  if (navLinks.length === 0) {
    return;
  }

  const sectionIds = [...new Set(navLinks.map((a) => a.getAttribute("href")?.slice(1)).filter(Boolean))];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  if (sections.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const activeHash = `#${visible.target.id}`;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === activeHash);
      });
    },
    {
      threshold: [0.18, 0.45],
      rootMargin: "-18% 0px -45% 0px"
    }
  );

  sections.forEach((sec) => observer.observe(sec));
}
