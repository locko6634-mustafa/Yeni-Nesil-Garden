export function initVisualSpectacle() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  document.documentElement.classList.add("has-spectacle-js");

  initScrollProgress();
  initAmbientAtmosphere(prefersReducedMotion, isCoarsePointer);
  initHeroCinemaSwitcher(prefersReducedMotion);
  initVenuesAccordion();
  initTypographyChoreography(prefersReducedMotion);
  initScrollReveals(prefersReducedMotion);
  initInteractiveTiltAndSpotlight(prefersReducedMotion, isCoarsePointer);
  initMagneticElements(prefersReducedMotion, isCoarsePointer);
  initParallaxHero(prefersReducedMotion, isCoarsePointer);
  initAnimatedNumbers(prefersReducedMotion);
  initPackageSwitchIndicator();
  initActiveSectionNav();
}

function initScrollProgress() {
  const progressBar = document.createElement("div");
  progressBar.className = "spectacle-scroll-progress";
  progressBar.setAttribute("aria-hidden", "true");
  document.body.append(progressBar);

  let maxScroll = 1;
  let rafId = 0;
  let isScrolledState = false;

  const measureScrollBounds = () => {
    maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  };

  const renderProgress = () => {
    rafId = 0;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const ratio = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    progressBar.style.setProperty("--scroll-progress", ratio.toFixed(4));

    const nextScrolled = scrollTop > 32;
    if (nextScrolled !== isScrolledState) {
      isScrolledState = nextScrolled;
      document.documentElement.classList.toggle("is-scrolled", nextScrolled);
    }
  };

  const requestUpdate = () => {
    if (!rafId) {
      rafId = window.requestAnimationFrame(renderProgress);
    }
  };

  measureScrollBounds();
  renderProgress();

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      measureScrollBounds();
      requestUpdate();
    },
    { passive: true }
  );
  window.addEventListener("load", measureScrollBounds, { once: true, passive: true });
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


function createGlowSprite(coreColor, midColor) {
  const size = 32;
  const offscreen = document.createElement("canvas");
  offscreen.width = size;
  offscreen.height = size;
  const octx = offscreen.getContext("2d");
  if (!octx) return offscreen;

  const half = size / 2;
  const grad = octx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, coreColor);
  grad.addColorStop(0.32, midColor);
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  octx.fillStyle = grad;
  octx.fillRect(0, 0, size, size);
  return offscreen;
}

function initAmbientAtmosphere(prefersReducedMotion, isCoarsePointer) {
  const ambient = document.createElement("div");
  ambient.className = "spectacle-ambient";
  ambient.setAttribute("aria-hidden", "true");

  const orb1 = document.createElement("span");
  orb1.className = "spectacle-orb spectacle-orb--forest";
  const orb2 = document.createElement("span");
  orb2.className = "spectacle-orb spectacle-orb--gold";
  const orb3 = document.createElement("span");
  orb3.className = "spectacle-orb spectacle-orb--rose";

  ambient.append(orb1, orb2, orb3);
  document.body.prepend(ambient);

  if (prefersReducedMotion || isCoarsePointer) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.className = "spectacle-canvas";
  ambient.append(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    return;
  }

  let width = 0;
  let height = 0;
  let animationFrameId = 0;

  const sprites = [
    createGlowSprite("rgba(195, 155, 95, 0.9)", "rgba(195, 155, 95, 0.28)"),
    createGlowSprite("rgba(111, 167, 43, 0.85)", "rgba(111, 167, 43, 0.24)"),
    createGlowSprite("rgba(184, 111, 96, 0.82)", "rgba(184, 111, 96, 0.22)"),
    createGlowSprite("rgba(168, 190, 141, 0.86)", "rgba(168, 190, 141, 0.25)")
  ];

  const particles = Array.from({ length: 22 }, (_, i) => ({
    x: (i * 127) % 1200,
    y: (i * 193) % 900,
    drawSize: (1.5 + (i % 4) * 1.1) * 7,
    vx: ((i % 5) - 2) * 0.13 || 0.11,
    vy: -0.16 - (i % 4) * 0.07,
    alpha: 0.24 + (i % 5) * 0.11,
    phase: i * 0.7,
    sprite: sprites[i % sprites.length]
  }));

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
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
      p.x += p.vx + Math.sin(t + p.phase) * 0.16;
      p.y += p.vy;

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const distSq = dx * dx + dy * dy;
      let drawX = p.x;
      let drawY = p.y;

      if (distSq < 32400 && distSq > 1) {
        const dist = Math.sqrt(distSq);
        const influence = (1 - dist / 180) * 14;
        drawX += (dx / dist) * influence;
        drawY += (dy / dist) * influence;
      }

      const pulse = 0.65 + 0.35 * Math.sin(t * 1.8 + p.phase);
      const half = p.drawSize * 0.5;
      ctx.globalAlpha = p.alpha * pulse;
      ctx.drawImage(p.sprite, drawX - half, drawY - half, p.drawSize, p.drawSize);
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
    ".service-card, .package-card, .testimonial-card, .contact-channel, .venue-panel, .cinema-switcher__item, .menu-row, .faq-item, .garden-gallery figure, .garden-other-card, .garden-video-card, .garden-detail-cta"
  );

  interactiveCards.forEach((card) => {
    card.classList.add("spectacle-interactive-card");
    const maxTilt = 4.2;
    let cachedRect = null;
    let rafId = 0;
    let lastX = 0;
    let lastY = 0;

    const applyCardTilt = () => {
      rafId = 0;
      if (!cachedRect || !cachedRect.width || !cachedRect.height) return;

      const x = lastX - cachedRect.left;
      const y = lastY - cachedRect.top;
      const px = (x / cachedRect.width) * 2 - 1;
      const py = (y / cachedRect.height) * 2 - 1;

      const rotateX = (-py * maxTilt).toFixed(2);
      const rotateY = (px * maxTilt).toFixed(2);

      card.style.setProperty("--spot-x", `${x.toFixed(1)}px`);
      card.style.setProperty("--spot-y", `${y.toFixed(1)}px`);
      card.style.setProperty("--tilt-x", `${rotateX}deg`);
      card.style.setProperty("--tilt-y", `${rotateY}deg`);
    };

    card.addEventListener(
      "pointerenter",
      () => {
        cachedRect = card.getBoundingClientRect();
        card.classList.add("is-pointer-active");
      },
      { passive: true }
    );

    card.addEventListener(
      "pointermove",
      (event) => {
        lastX = event.clientX;
        lastY = event.clientY;
        if (!cachedRect) {
          cachedRect = card.getBoundingClientRect();
        }
        if (!rafId) {
          rafId = window.requestAnimationFrame(applyCardTilt);
        }
      },
      { passive: true }
    );

    card.addEventListener(
      "pointerleave",
      () => {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
        cachedRect = null;
        card.classList.remove("is-pointer-active");
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      },
      { passive: true }
    );
  });
}

function initMagneticElements(prefersReducedMotion, isCoarsePointer) {
  if (prefersReducedMotion || isCoarsePointer) {
    return;
  }

  const magneticTargets = document.querySelectorAll(
    ".btn-luxe, .button, .nav-cta, .venue-panel__cta, .review-heading a, .contact-phone, .garden-hero-primary, .garden-detail-back, .contact-map-bar a, .garden-gallery-toggle"
  );

  magneticTargets.forEach((el) => {
    el.classList.add("spectacle-magnetic");
    let cachedRect = null;
    let rafId = 0;
    let lastX = 0;
    let lastY = 0;

    const applyMagnet = () => {
      rafId = 0;
      if (!cachedRect) return;
      const offsetX = lastX - (cachedRect.left + cachedRect.width / 2);
      const offsetY = lastY - (cachedRect.top + cachedRect.height / 2);
      el.style.setProperty("--mag-x", `${(offsetX * 0.2).toFixed(1)}px`);
      el.style.setProperty("--mag-y", `${(offsetY * 0.25).toFixed(1)}px`);
    };

    el.addEventListener(
      "pointerenter",
      () => {
        cachedRect = el.getBoundingClientRect();
        el.classList.add("is-pointer-active");
      },
      { passive: true }
    );

    el.addEventListener(
      "pointermove",
      (event) => {
        lastX = event.clientX;
        lastY = event.clientY;
        if (!cachedRect) {
          cachedRect = el.getBoundingClientRect();
        }
        if (!rafId) {
          rafId = window.requestAnimationFrame(applyMagnet);
        }
      },
      { passive: true }
    );

    el.addEventListener(
      "pointerleave",
      () => {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
        cachedRect = null;
        el.classList.remove("is-pointer-active");
        el.style.setProperty("--mag-x", "0px");
        el.style.setProperty("--mag-y", "0px");
      },
      { passive: true }
    );
  });
}

function initParallaxHero(prefersReducedMotion, isCoarsePointer) {
  if (prefersReducedMotion) {
    return;
  }

  const heroContainer = document.querySelector(".cinema-hero, .garden-detail-hero");
  const heroImages = heroContainer?.querySelectorAll(".cinema-hero__bg-img, picture img, :scope > img");
  const heroStage = heroContainer?.querySelector(".cinema-hero__stage, .garden-detail-hero > div");

  if (!heroContainer || !heroImages || heroImages.length === 0) {
    return;
  }

  let heroTop = 0;
  let heroWidth = 1;
  let heroHeight = 1;
  let scrollRafId = 0;
  let panRafId = 0;
  let pointerX = 0;
  let pointerY = 0;

  const measureHero = () => {
    const rect = heroContainer.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    heroTop = rect.top + scrollTop;
    heroWidth = Math.max(rect.width, 1);
    heroHeight = Math.max(rect.height, 1);
  };

  const renderParallax = () => {
    scrollRafId = 0;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const relativeTop = heroTop - scrollTop;
    if (relativeTop + heroHeight < 0 || relativeTop > window.innerHeight) {
      return;
    }
    const progress = Math.min(Math.max(-relativeTop / heroHeight, -0.3), 1);
    const translateY = `${(progress * 48).toFixed(1)}px`;
    heroImages.forEach((img) => {
      img.style.setProperty("--hero-parallax-y", translateY);
    });
    if (heroStage) {
      heroStage.style.setProperty("--hero-stage-y", `${(-progress * 22).toFixed(1)}px`);
    }
  };

  const requestParallax = () => {
    if (!scrollRafId) {
      scrollRafId = window.requestAnimationFrame(renderParallax);
    }
  };

  measureHero();
  renderParallax();

  window.addEventListener("scroll", requestParallax, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      measureHero();
      requestParallax();
    },
    { passive: true }
  );

  if (isCoarsePointer) {
    return;
  }

  const renderPan = () => {
    panRafId = 0;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const relativeTop = heroTop - scrollTop;
    const nx = ((pointerX / heroWidth) - 0.5) * -14;
    const ny = (((pointerY - relativeTop) / heroHeight) - 0.5) * -10;
    const panX = `${nx.toFixed(1)}px`;
    const panY = `${ny.toFixed(1)}px`;
    heroImages.forEach((img) => {
      img.style.setProperty("--hero-pan-x", panX);
      img.style.setProperty("--hero-pan-y", panY);
    });
  };

  heroContainer.addEventListener(
    "pointermove",
    (e) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!panRafId) {
        panRafId = window.requestAnimationFrame(renderPan);
      }
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
