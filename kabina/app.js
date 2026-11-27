(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. Sticky Header State
     ------------------------------------------------------------------------ */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------------
     2. Hero Editorial Visual Subtle Tilt
     ------------------------------------------------------------------------ */
  const heroSection = document.querySelector('.hero');
  const heroVisualTilt = document.getElementById('hero-visual-tilt');
  if (heroSection && heroVisualTilt && !prefersReducedMotion) {
    heroSection.addEventListener('pointermove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroVisualTilt.style.transform = `rotateX(${(-y * 3.5).toFixed(2)}deg) rotateY(${(x * 4.5).toFixed(2)}deg) translate3d(${(x * 6).toFixed(1)}px, ${(y * 5).toFixed(1)}px, 0)`;
    });

    heroSection.addEventListener('pointerleave', () => {
      heroVisualTilt.style.transform = 'rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
    });
  }

  /* ------------------------------------------------------------------------
     3. Subtle Studio Ember Particles (Hero Atmosphere)
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('ember-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      let width = 0;
      let height = 0;
      let particles = [];

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const createParticles = () => {
        const count = Math.min(34, Math.max(16, Math.floor(width / 42)));
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: height * (0.45 + Math.random() * 0.6),
          r: 0.9 + Math.random() * 1.9,
          vy: 0.16 + Math.random() * 0.36,
          vx: (Math.random() - 0.5) * 0.25,
          alpha: 0.18 + Math.random() * 0.5
        }));
      };

      const tick = () => {
        ctx.clearRect(0, 0, width, height);
        for (const p of particles) {
          p.y -= p.vy;
          p.x += p.vx;
          if (p.y < height * 0.12) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 146, 68, ${p.alpha})`;
          ctx.fill();
        }
        window.requestAnimationFrame(tick);
      };

      resize();
      createParticles();
      tick();
      window.addEventListener('resize', () => {
        resize();
        createParticles();
      });
    }
  }

  /* ------------------------------------------------------------------------
     4. Studio Lighting / Brand Mood Switcher (Viewfinder)
     ------------------------------------------------------------------------ */
  const reelVisual = document.getElementById('reel-visual');
  const reelModeTag = document.getElementById('reel-mode-tag');
  const moodButtons = document.querySelectorAll('.mood-btn');
  const moodLabels = {
    amber: 'FONDO: ÁMBAR KABINA',
    cobalt: 'FONDO: AZUL EDITORIAL',
    emerald: 'FONDO: VERDE MENTOR'
  };

  moodButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.mood || 'amber';
      moodButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      if (reelVisual) {
        reelVisual.dataset.activeMood = mood;
      }
      if (reelModeTag) {
        reelModeTag.textContent = moodLabels[mood] || moodLabels.amber;
      }
    });
  });

  /* ------------------------------------------------------------------------
     5. Interactive 4-Card Stacked Deck Accordion
     ------------------------------------------------------------------------ */
  const deckCards = Array.from(document.querySelectorAll('.deck-card'));
  deckCards.forEach((card) => {
    const trigger = card.querySelector('.deck-trigger');
    if (!trigger) return;

    const activateCard = () => {
      deckCards.forEach((item) => {
        const isCurrent = item === card;
        item.classList.toggle('is-active', isCurrent);
        const itemTrigger = item.querySelector('.deck-trigger');
        if (itemTrigger) {
          itemTrigger.setAttribute('aria-expanded', String(isCurrent));
        }
      });
    };

    trigger.addEventListener('click', activateCard);
    card.addEventListener('click', (e) => {
      if (e.target === trigger || trigger.contains(e.target)) return;
      if (!card.classList.contains('is-active')) {
        activateCard();
      }
    });
  });

  /* ------------------------------------------------------------------------
     6. Pricing Mode Toggle (Tarifa Regular vs Cupos Piloto -35%) + Counter Roll
     ------------------------------------------------------------------------ */
  let activePricingMode = 'regular';
  const pricingBtns = document.querySelectorAll('.pricing-toggle__btn');
  const pilotNote = document.getElementById('pilot-note');
  const priceFigures = document.querySelectorAll('.plate-figure');
  const priceSubLabels = document.querySelectorAll('.plate-meta strong');
  const metricCards = document.querySelectorAll('.metric-card');

  const animatePriceNumber = (el, targetText) => {
    const targetNum = parseInt(targetText.replace(/[^0-9]/g, ''), 10);
    const currentNum = parseInt((el.textContent || '').replace(/[^0-9]/g, ''), 10);
    if (prefersReducedMotion || Number.isNaN(targetNum) || Number.isNaN(currentNum) || targetNum === currentNum) {
      el.textContent = targetText;
      return;
    }

    const duration = 420;
    const startTime = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(currentNum + (targetNum - currentNum) * eased);
      el.textContent = `$${val}K`;
      if (t < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = targetText;
      }
    };
    window.requestAnimationFrame(step);
  };

  pricingBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.pricingMode === 'piloto' ? 'piloto' : 'regular';
      if (mode === activePricingMode) return;
      activePricingMode = mode;

      pricingBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });

      priceFigures.forEach((el) => {
        const nextText = mode === 'piloto' ? el.dataset.piloto : el.dataset.regular;
        animatePriceNumber(el, nextText || '');
      });

      priceSubLabels.forEach((el) => {
        el.textContent = mode === 'piloto' ? el.dataset.piloto : el.dataset.regular;
      });

      if (!prefersReducedMotion) {
        metricCards.forEach((card) => {
          card.classList.remove('is-price-flash');
          void card.offsetWidth;
          card.classList.add('is-price-flash');
        });
      }

      if (pilotNote) {
        pilotNote.innerHTML =
          mode === 'piloto'
            ? '<strong>Cupos Piloto activos (-35%):</strong> 3 a 5 cupos de lanzamiento a cambio de testimonio y permiso para mostrar el resultado.'
            : 'Activa <strong>Cupos Piloto</strong> para acceder al descuento de lanzamiento (3 a 5 cupos a cambio de testimonio y permiso de portafolio).';
      }
    });
  });

  /* ------------------------------------------------------------------------
     7. Accessible FAQ Accordion (single-open)
     ------------------------------------------------------------------------ */
  const faqButtons = document.querySelectorAll('.faq-btn');
  faqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      faqButtons.forEach((otherBtn) => {
        const otherPanelId = otherBtn.getAttribute('aria-controls');
        const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
        otherBtn.setAttribute('aria-expanded', 'false');
        if (otherPanel) {
          otherPanel.hidden = true;
        }
      });

      if (!expanded) {
        const panelId = btn.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        btn.setAttribute('aria-expanded', 'true');
        if (panel) {
          panel.hidden = false;
        }
      }
    });
  });

  /* ------------------------------------------------------------------------
     8. Native <dialog> Modals + closedby="any" Fallback
     ------------------------------------------------------------------------ */
  const bookingDialog = document.getElementById('booking-dialog');
  const reelDialog = document.getElementById('reel-dialog');
  const packageSelect = document.getElementById('lead-package');
  const bookingForm = document.getElementById('booking-form');
  const bookingStatus = document.getElementById('booking-status');

  const openBooking = (pkg) => {
    if (!bookingDialog) return;
    if (packageSelect) {
      const targetPkg = activePricingMode === 'piloto' && pkg !== 'piloto' ? 'piloto' : (pkg || 'piloto');
      packageSelect.value = targetPkg;
    }
    if (bookingStatus) {
      bookingStatus.hidden = true;
      bookingStatus.textContent = '';
    }
    bookingDialog.showModal();
  };

  document.querySelectorAll('[data-open-booking]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openBooking(btn.dataset.openBooking);
    });
  });

  const openReelBtn = document.getElementById('open-reel-btn');
  if (openReelBtn && reelDialog) {
    openReelBtn.addEventListener('click', () => {
      reelDialog.showModal();
    });
  }

  const tourToBooking = document.getElementById('tour-to-booking');
  if (tourToBooking && reelDialog) {
    tourToBooking.addEventListener('click', () => {
      reelDialog.close();
      openBooking('express');
    });
  }

  document.querySelectorAll('[data-close-dialog]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dlg = btn.closest('dialog');
      if (dlg) dlg.close('cancel');
    });
  });

  // Reset returnValue on close so stale values never leak across openings
  document.querySelectorAll('dialog.kabina-dialog').forEach((dlg) => {
    dlg.addEventListener('close', () => {
      dlg.returnValue = '';
    });
  });

  // Fallback for browsers without native closedby="any" support (e.g. Safari)
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    document.querySelectorAll('dialog[closedby="any"]').forEach((dialog) => {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => {
        pressedOutside = isOutside(e, dialog);
      });
      dialog.addEventListener('pointerup', (e) => {
        if (pressedOutside && isOutside(e, dialog)) {
          dialog.close();
        }
        pressedOutside = false;
      });
    });
  }

  // Booking Form Submission
  if (bookingForm && bookingStatus) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!bookingForm.reportValidity()) return;

      const data = new FormData(bookingForm);
      const name = String(data.get('name') || '').trim();
      const pkgMap = {
        piloto: 'Cupo Piloto (-35% OFF)',
        express: 'Sesión Express',
        mensual: 'Contenido Mensual',
        curso: 'Curso Completo'
      };
      const pkgLabel = pkgMap[String(data.get('package'))] || 'tu sesión';

      bookingStatus.hidden = false;
      bookingStatus.textContent = `¡Solicitud recibida, ${name}! Guardamos tu interés en ${pkgLabel}. Te contactaremos por WhatsApp en menos de 24 horas con horarios disponibles en Viña del Mar.`;
      bookingForm.reset();
    });
  }

  /* ------------------------------------------------------------------------
     9. Scroll Reveal (IntersectionObserver)
     ------------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------------
     10. Marquee Pause / Play Control (WCAG 2.2.2)
     ------------------------------------------------------------------------ */
  const marqueeStrip = document.getElementById('marquee-strip');
  const marqueeToggle = document.getElementById('marquee-toggle');
  if (marqueeStrip && marqueeToggle) {
    marqueeToggle.addEventListener('click', () => {
      const paused = marqueeStrip.classList.toggle('is-paused');
      marqueeToggle.textContent = paused ? 'Reanudar' : 'Pausar';
      marqueeToggle.setAttribute(
        'aria-label',
        paused ? 'Reanudar desplazamiento de rubros' : 'Pausar desplazamiento de rubros'
      );
    });
  }

  /* ------------------------------------------------------------------------
     11. Scroll Progress Bar & Hero Parallax Fallbacks (when scroll-timeline unsupported)
     ------------------------------------------------------------------------ */
  const scrollProgressEl = document.getElementById('scroll-progress');
  if (scrollProgressEl && !prefersReducedMotion && !CSS.supports('animation-timeline', 'scroll()')) {
    const updateScrollProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      scrollProgressEl.style.transform = `scaleX(${ratio.toFixed(4)})`;
    };
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
  }

  const emblemStage = document.getElementById('hero-emblem-stage');
  if (
    heroSection &&
    emblemStage &&
    !prefersReducedMotion &&
    !CSS.supports('(animation-timeline: view()) and (animation-range: entry)')
  ) {
    const onParallax = () => {
      const h = heroSection.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / h));
      emblemStage.style.transform = `translateY(${(-p * 80).toFixed(1)}px) scale(${(1 - p * 0.06).toFixed(3)})`;
      emblemStage.style.opacity = String((1 - p * 0.65).toFixed(2));
    };
    window.addEventListener('scroll', onParallax, { passive: true });
  }

  /* ------------------------------------------------------------------------
     12. Live 24fps Studio Viewfinder Timecode
     ------------------------------------------------------------------------ */
  const timecodeEl = document.getElementById('studio-timecode');
  const studioSection = document.getElementById('estudio');
  if (timecodeEl && studioSection) {
    if (prefersReducedMotion) {
      timecodeEl.textContent = '00:04:24:12';
    } else {
      let frameCount = 4 * 60 * 24 + 12 * 24;
      let timerId = null;
      const pad = (n) => String(n).padStart(2, '0');
      const renderTC = () => {
        frameCount += 3;
        const frames = frameCount % 24;
        const totalSec = Math.floor(frameCount / 24);
        const secs = totalSec % 60;
        const mins = Math.floor(totalSec / 60) % 60;
        const hrs = Math.floor(totalSec / 3600) % 24;
        timecodeEl.textContent = `${pad(hrs)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
      };
      const startTC = () => {
        if (timerId === null) timerId = window.setInterval(renderTC, 125);
      };
      const stopTC = () => {
        if (timerId !== null) {
          window.clearInterval(timerId);
          timerId = null;
        }
      };

      if ('IntersectionObserver' in window) {
        const tcObs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => (entry.isIntersecting ? startTC() : stopTC()));
          },
          { threshold: 0.05 }
        );
        tcObs.observe(studioSection);
      } else {
        startTC();
      }
    }
  }

  /* ------------------------------------------------------------------------
     13. Interactive Studio Key-Light Cursor Spotlight, 3D Card Tilt & Magnetic CTAs
     ------------------------------------------------------------------------ */
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (hasFinePointer && !prefersReducedMotion) {
    // Cursor spotlight on interactive dark surfaces
    const spotlightTargets = document.querySelectorAll(
      '.metric-card, .roadmap-card, .extras-grid li, .final-cta-card'
    );
    spotlightTargets.forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${(e.clientX - rect.left).toFixed(1)}px`);
        el.style.setProperty('--my', `${(e.clientY - rect.top).toFixed(1)}px`);
      });
    });

    // Subtle 3D tilt on package cards
    document.querySelectorAll('.metric-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) translateY(-6px) rotateX(${(-y * 5.5).toFixed(2)}deg) rotateY(${(x * 5.5).toFixed(2)}deg)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });

    // Subtle magnetic hover pull on pill CTAs
    document.querySelectorAll('.pill-cta').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
        const y = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
        btn.style.transform = `translate3d(${x.toFixed(1)}px, ${(y - 2).toFixed(1)}px, 0)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });
  }
})();
