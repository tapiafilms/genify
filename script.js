// ─── Supabase ────────────────────────────────────────────────────────────
const SUPABASE_URL  = 'https://nzvoglbztklzwteulols.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56dm9nbGJ6dGtsend0ZXVsb2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzY1NjIsImV4cCI6MjA5MjQ1MjU2Mn0.CNGwukG1eoqB9UZFdGZ45XjxLoOCG2JtKCXWiuMoTfs';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ─── Navbar ──────────────────────────────────────────────────────────────
const navbar   = document.getElementById("navbar");
const menuBtn  = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 12);
});

const toggleMenu = (force) => {
  const isOpen = force !== undefined ? force : !menuBtn.classList.contains("open");
  menuBtn.classList.toggle("open", isOpen);
  navLinks.classList.toggle("open", isOpen);
  menuBtn.setAttribute("aria-expanded", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
};

menuBtn.addEventListener("click", () => toggleMenu());

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => toggleMenu(false));
});

// ─── Reveal on scroll ────────────────────────────────────────────────────
const revealItems    = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);
revealItems.forEach((item) => revealObserver.observe(item));

// ─── Showcase strip ──────────────────────────────────────────────────────
const projectsData = {
  'item-1': {
    title: 'Plataforma Social',
    description: 'Celigot es un ecosistema digital para la vida sin gluten, conectando gastronomía, comercio y comunidad. Impulsado por IA para descubrir opciones seguras y tomar decisiones informadas. La infraestructura que redefine la experiencia celíaca.',
    logo: './img/logo-celigot.webp',
    image: './img/img-celigot.webp',
    url: 'https://celigot.cl'
  },
  'item-2': {
    title: 'Experiencias Móviles',
    description: 'Wufly es una plataforma que integra todo el ecosistema de mascotas en una sola experiencia digital. Desde servicios hasta adopción, potenciado por IA y conexión en tiempo real. Redefiniendo el cuidado y la gestión del mundo animal.',
    logo: './img/logo-wufly.webp',
    image: './img/img-wufly.webp',
    url: 'https://wufly.cl/'
  },
  'item-3': {
    title: 'Conexión Digital',
    description: 'Maestrio es Marketplace inteligente para servicios del hogar, rápido, confiable y escalable. Conecta usuarios con profesionales verificados mediante IA. La nueva forma de resolver lo cotidiano.',
    logo: './img/logo-maestrio.webp',
    image: './img/img-maestrio.webp',
    url: 'https://pwa-maestrio.vercel.app/'
  },
  'item-4': {
    title: 'Viajes Interurbanos',
    description: 'Un Cupo es una red de movilidad compartida para optimizar viajes interurbanos. Conecta pasajeros y conductores en tiempo real, reduciendo costos y fricción. Infraestructura digital para una nueva forma de viajar.',
    logo: './img/logo-uncupo.webp',
    image: './img/img-uncupo.webp',
    url: 'https://uncupo.vercel.app'
  }
};

const item1          = document.getElementById("item-1");
const purpleStrip    = document.getElementById("purpleStrip");
const showcaseGrid   = document.getElementById("showcaseGrid");
const stripTitle     = document.querySelector(".strip-title");
const stripDescEl    = document.querySelector(".strip-description");
const stripLogo      = document.getElementById("stripLogo");
const stripImage     = document.getElementById("stripImage");
const stripButton    = document.getElementById("stripButton");

let isAnimated   = false;
let currentItem  = null;
let isResponsive = window.innerWidth < 1024;

window.addEventListener("resize", () => {
  isResponsive = window.innerWidth < 1024;
});

const toggleAnimation = (clickedItem) => {
  if (isAnimated && currentItem === clickedItem) { closeCurrent(); return; }
  if (isAnimated && currentItem !== clickedItem) {
    if (isResponsive) {
      purpleStrip.classList.remove("active");
      setTimeout(() => openItem(clickedItem), 300);
    } else {
      closeCurrent();
      setTimeout(() => openItem(clickedItem), 800);
    }
    return;
  }
  openItem(clickedItem);
};

const openItem = (clickedItem) => {
  isAnimated  = true;
  currentItem = clickedItem;

  const projectInfo = projectsData[clickedItem.id];
  if (projectInfo) {
    stripTitle.textContent    = projectInfo.title;
    stripDescEl.textContent   = projectInfo.description;
    stripLogo.src             = projectInfo.logo;
    stripImage.src            = projectInfo.image;
    stripButton.href          = projectInfo.url;
  }

  if (isResponsive) {
    clickedItem.after(purpleStrip);
    void purpleStrip.offsetWidth;
    setTimeout(() => {
      purpleStrip.classList.add("active");
      setTimeout(() => {
        const offset          = 100;
        const elementRect     = clickedItem.getBoundingClientRect().top;
        const offsetPosition  = elementRect + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }, 150);
    }, 50);
  } else {
    const rect1      = item1.getBoundingClientRect();
    const rectCurrent = clickedItem.getBoundingClientRect();
    const deltaX     = rect1.left - rectCurrent.left;
    const deltaY     = rect1.top  - rectCurrent.top;
    const allItems   = Array.from(document.querySelectorAll(".showcase-item"));
    const otherItems = allItems.filter(i => i !== item1 && i !== clickedItem);
    otherItems.forEach(i => i.classList.add("fade-out"));
    clickedItem.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    clickedItem.classList.add("move-to-first");
    purpleStrip.classList.add("active");
  }
};

const closeCurrent = () => {
  purpleStrip.classList.remove("active");
  if (!isResponsive && currentItem) {
    currentItem.style.transform = "";
    currentItem.classList.remove("move-to-first");
    setTimeout(() => {
      document.querySelectorAll(".showcase-item").forEach(i => i.classList.remove("fade-out"));
    }, 800);
  }
  isAnimated  = false;
  currentItem = null;
};

document.querySelectorAll(".showcase-item").forEach(item => {
  item.addEventListener("click", () => toggleAnimation(item));
});

// Prevent strip button click from bubbling to showcase-item
document.getElementById("stripButton").addEventListener("click", (e) => {
  e.stopPropagation();
});

document.querySelector(".close-strip").addEventListener("click", (e) => {
  e.stopPropagation();
  if (isAnimated) closeCurrent();
});

// ─── Formulario de contacto con Supabase ─────────────────────────────────
const form       = document.getElementById("contactForm");
const formError  = document.getElementById("formError");
const formSuccess = document.getElementById("formSuccess");
const submitBtn  = document.getElementById("submitBtn");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent   = "";
  formSuccess.textContent = "";

  const nombre  = form.name.value.trim();
  const email   = form.email.value.trim();
  const mensaje = form.message.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!nombre || !email || !mensaje) {
    formError.textContent = "Completa todos los campos antes de enviar.";
    return;
  }
  if (!emailPattern.test(email)) {
    formError.textContent = "Ingresa un email válido.";
    return;
  }
  if (mensaje.length < 10) {
    formError.textContent = "El mensaje debe tener al menos 10 caracteres.";
    return;
  }

  submitBtn.disabled     = true;
  submitBtn.textContent  = "Enviando...";

  try {
    const { error } = await supabaseClient
      .from('leads')
      .insert([{ nombre, email, mensaje }]);

    if (error) throw error;

    form.reset();
    formSuccess.textContent = "¡Mensaje enviado! Te contactaremos pronto.";
  } catch (err) {
    console.error("Error al enviar:", err);
    formError.textContent = "Ocurrió un error al enviar. Intentalo de nuevo.";
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = "Enviar mensaje";
  }
});
  
  
// ── iPhone Modal ──
document.addEventListener('DOMContentLoaded', () => {
  const iphoneModal   = document.getElementById('iphoneModal');
  const iphoneVideo   = document.getElementById('iphoneVideo');
  const iphoneClose   = document.getElementById('iphoneClose');
  const iphoneTitle   = document.getElementById('iphoneTitle');
  const iphoneDesc    = document.getElementById('iphoneDesc');
  const iphoneFeatures = document.getElementById('iphoneFeatures');
  const iphoneCtaBtn  = document.getElementById('iphoneCtaBtn');
  const cards         = document.querySelectorAll('#servicios article.card');

  const products = [
    {
      url: 'https://plannia-woad.vercel.app/',
      title: 'Plannia',
      desc: 'Tu centro de control personal. Tareas, hábitos, metas y finanzas en un solo lugar, potenciado por IA real que entiende tu contexto.',
      features: []
    },
    {
      video: 'https://res.cloudinary.com/dpkqqsjwk/video/upload/v1778193039/pantalla1_1_voyze0.mp4',
      title: 'Etapa Escolar',
      desc: 'Plataforma educativa que conecta colegios, docentes, estudiantes y familias en un solo ecosistema digital. Simplifica la gestión académica y mejora la comunicación en tiempo real.',
      features: ['Agenda y comunicados digitales', 'Seguimiento del progreso estudiantil', 'Mensajería directa docente-familia', 'Panel administrativo centralizado']
    },
    {
      video: 'https://res.cloudinary.com/dpkqqsjwk/video/upload/v1778120718/video1_wmojo.mp4',
      title: 'TalentFlow — RRHH',
      desc: 'Solución integral para la gestión de personas en organizaciones modernas. Automatiza procesos de selección, onboarding y seguimiento de desempeño con IA.',
      features: ['Reclutamiento y onboarding digital', 'Evaluaciones de desempeño automatizadas', 'Gestión de vacaciones y permisos', 'Reportes y analíticas de equipo']
    },
    {
      video: 'https://res.cloudinary.com/dpkqqsjwk/video/upload/v1778120718/video1_wmojo.mp4',
      title: 'Nubli — Primera Infancia',
      desc: 'Conecta educadoras de párvulos y familias en tiempo real. Comparte avances, fotos, actividades y comunicaciones del día a día de forma simple y segura.',
      features: ['Registro diario de actividades', 'Galería privada para familias', 'Comunicación directa educadora-apoderado', 'Control de asistencia y alimentación']
    }
  ];

  const openModal = (i) => {
    const p = products[i];
    if (p.url) { window.open(p.url, '_blank'); return; }
    iphoneVideo.src       = p.video;
    iphoneTitle.textContent = p.title;
    iphoneDesc.textContent  = p.desc;
    iphoneFeatures.innerHTML = p.features.map(f => `<li>${f}</li>`).join('');
    iphoneCtaBtn.onclick = (e) => {
      e.stopPropagation();
      prefillContact(p.title);
      iphoneModal.classList.remove('active');
      iphoneVideo.pause();
    };
    iphoneModal.classList.add('active');
    iphoneVideo.currentTime = 0;
    iphoneVideo.play();
  };

  cards.forEach((card, i) => {
    card.classList.add('card-clickable');
    card.addEventListener('click', () => openModal(i));
  });

  const closeModal = () => {
    iphoneModal.classList.remove('active');
    iphoneVideo.pause();
  };

  iphoneClose.addEventListener('click', closeModal);
  iphoneModal.addEventListener('click', (e) => {
    if (e.target === iphoneModal) closeModal();
  });
});

// ─── Estrellas en el hero ─────────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let heroContent = document.querySelector('.hero-content');

  const resize = () => {
    canvas.width  = heroContent.offsetWidth;
    canvas.height = heroContent.offsetHeight;
    buildStars();
  };

  const buildStars = () => {
    const count = Math.floor((canvas.width * canvas.height) / 2500);
    stars = Array.from({ length: count }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 0.7 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.003,
      dir:   Math.random() > 0.5 ? 1 : -1,
      phase: Math.random() * Math.PI * 2,
    }));
  };

  const draw = (t) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.alpha = 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(t * s.speed * s.dir + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha.toFixed(2)})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };

  const resizeObserver = new ResizeObserver(() => {
    resize();
  });
  
  resizeObserver.observe(heroContent);
  resize();
  requestAnimationFrame(draw);
})();

// ─── LUCIÉRNAGAS EN EL FOOTER ────────────────────────────────────────────
(function () {
  const contenedor = document.getElementById('luciernagasFooter');
  if (!contenedor) return;

  const NUMERO_LUCIERNAGAS = 20;
  const luciernagas = [];

  // Crear luciérnagas
  for (let i = 0; i < NUMERO_LUCIERNAGAS; i++) {
    const luciernaga = document.createElement('div');
    luciernaga.className = 'luciernaga';
    
    // Posición inicial aleatoria dentro del contenedor
    const x = 15 + Math.random() * 70;
    const y = 10 + Math.random() * 80;
    
    // Tamaño aleatorio (más pequeño)
    const tamaño = Math.random() * 2 + 1.5;
    
    // Duración de animaciones aleatorias
    const duracionVuelo = Math.random() * 5 + 4;
    const duracionBrillo = Math.random() * 1.5 + 0.8;
    
    // Retraso aleatorio
    const retraso = Math.random() * 4;
    
    luciernaga.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${tamaño}px;
      height: ${tamaño}px;
      animation-duration: ${duracionVuelo}s, ${duracionBrillo}s;
      animation-delay: ${retraso}s;
      background: #ffffff;
      box-shadow: 0 0 ${tamaño * 1.5}px #ffffff,
                 0 0 ${tamaño * 3}px #f0f0ff,
                 0 0 ${tamaño * 6}px #e0e0ff;
    `;
    
    contenedor.appendChild(luciernaga);
    
    // Guardar referencia y datos de movimiento
    luciernagas.push({
      element: luciernaga,
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    });
  }

  // Animar posición sutilmente
  function animarLuciernagas() {
    luciernagas.forEach(lucy => {
      // Movimiento aleatorio suave
      lucy.vx += (Math.random() - 0.5) * 0.08;
      lucy.vy += (Math.random() - 0.5) * 0.08;
      
      // Limitar velocidad (más lento)
      const maxVel = 0.3;
      lucy.vx = Math.max(-maxVel, Math.min(maxVel, lucy.vx));
      lucy.vy = Math.max(-maxVel, Math.min(maxVel, lucy.vy));
      
      // Actualizar posición
      lucy.x += lucy.vx;
      lucy.y += lucy.vy;
      
      // Mantener dentro del área central del contenedor
      if (lucy.x < 10) { lucy.x = 10; lucy.vx *= -1; }
      if (lucy.x > 90) { lucy.x = 90; lucy.vx *= -1; }
      if (lucy.y < 5) { lucy.y = 5; lucy.vy *= -1; }
      if (lucy.y > 95) { lucy.y = 95; lucy.vy *= -1; }
      
      // Aplicar posición
      lucy.element.style.left = lucy.x + '%';
      lucy.element.style.top = lucy.y + '%';
    });
    
    requestAnimationFrame(animarLuciernagas);
  }

  animarLuciernagas();
})();

// ─── Tilt 3D en cards de Smart Service Platforms ─────────────────────────
(function () {
  const cards = document.querySelectorAll('#servicios .card');
  const MAX_TILT = 12;
  const SCALE = 1.04;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -MAX_TILT;
      const rotY = ((x - cx) / cx) *  MAX_TILT;
      const mxPct = ((x / rect.width)  * 100).toFixed(1) + '%';
      const myPct = ((y / rect.height) * 100).toFixed(1) + '%';
      card.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
      card.style.transform  = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${SCALE})`;
      card.style.setProperty('--mx', mxPct);
      card.style.setProperty('--my', myPct);
    });

    const reset = () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease, border-color 0.4s ease';
      card.style.transform  = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
    };

    card.addEventListener('mouseleave', reset);
    card.addEventListener('blur',       reset);
  });
})();

// ─── Entertainment Tabs ──────────────────────────────────────────────────
document.querySelectorAll('.ent-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.ent-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.ent-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const activePanel = document.getElementById('tab-' + target);
    activePanel.classList.add('active');

    // Pausar videos en tabs inactivos
    document.querySelectorAll('.ent-panel:not(.active) video').forEach(v => v.pause());

    // Reproducir video del tab activo muteado (el usuario activa audio con el botón)
    const videoInPanel = activePanel.querySelector('video');
    if (videoInPanel) {
      videoInPanel.play();
    }
  });
});

// ─── Sistema global de audio ─────────────────────────────────────────────────
// Los videos arrancan silenciados (requerido por los navegadores para autoplay).
// Al primer click/toque del usuario en cualquier parte de la página se activan
// todos los audios. Cada botón permite silenciar/activar individualmente.

const MUTE_BTNS = [
  { videoId: 'avatarVideo',          btnId: 'avatarMuteBtn'          },
  { videoId: 'personajeVideo',       btnId: 'personajeMuteBtn'       },
  { videoId: 'accordionAvatarVideo', btnId: 'accordionAvatarMuteBtn' },
  { videoId: 'wuflyVideo',           btnId: 'wuflyMuteBtn'           },
  { videoId: 'intentMeterVideo',     btnId: 'intentMeterMuteBtn'     },
];

function syncBtn(btn, muted) {
  if (btn) btn.textContent = muted ? '🔇' : '🔊';
}

// Registrar botones individuales
MUTE_BTNS.forEach(({ videoId, btnId }) => {
  const video = document.getElementById(videoId);
  const btn   = document.getElementById(btnId);
  if (!video) return;
  video.muted = true;
  syncBtn(btn, true);
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      syncBtn(btn, video.muted);
    });
  }
});

// Al primer gesto del usuario, activar audio en todos
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  MUTE_BTNS.forEach(({ videoId, btnId }) => {
    const video = document.getElementById(videoId);
    const btn   = document.getElementById(btnId);
    if (!video) return;
    // solo desmutear los que ya están reproduciendo; los pausados se desbloquean en fadeIn
    if (!video.paused) video.muted = false;
    syncBtn(btn, false);
  });
  document.removeEventListener('scroll',  unlockAudio);
  document.removeEventListener('keydown', unlockAudio);
}
document.addEventListener('scroll',  unlockAudio, { passive: true });
document.addEventListener('keydown', unlockAudio);

// ─── IntersectionObserver para play/pause por visibilidad ───────────────────
function makeVideoObserver(videoId) {
  const video = document.getElementById(videoId);
  if (!video) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { video.play(); }
      else                       { video.pause(); }
    });
  }, { threshold: 0.4 });
  observer.observe(video);
}

makeVideoObserver('avatarVideo');
makeVideoObserver('wuflyVideo');
makeVideoObserver('intentMeterVideo');

// ─── Portrait Accordion (handles all instances) ───────────────────────────────
(function () {
  document.querySelectorAll('.portrait-accordion').forEach(function (accordion) {
    const cards    = accordion.querySelectorAll('.portrait-card');
    const featured = accordion.querySelector('.portrait-card--featured');
    const video    = accordion.querySelector('video');

    const setActive = (card) => {
      cards.forEach(c => c.classList.remove('is-active'));
      if (card) card.classList.add('is-active');

      // Play/pause el video según si su card está activa
      if (video) {
        if (card && card.contains(video)) {
          video.play();
        } else {
          video.pause();
        }
      }
    };

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => setActive(card));
    });

    // Al salir del accordion, vuelve la card featured y pausa el video
    accordion.addEventListener('mouseleave', () => setActive(featured));

    // Estado inicial: video pausado
    setActive(featured);
  });
})();

// ─── Prefill contact form from product CTAs ──────────────────────────────────
function prefillContact(product) {
  const messageField = document.getElementById('message');
  if (messageField && !messageField.value) {
    messageField.value = `Hola, me interesa conocer más sobre ${product}.`;
  }
}
