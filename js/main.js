/**
 * MEGALATHA — EDITORIAL DESIGNER × PRODUCT THINKER × AI INTERFACE
 * Interaction Engine: ScrollSpy, Lightbox, 9-Screen Switcher, Resume Viewer & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initStickyHeaderAndNav();
  initMobileMenu();
  initScrollReveal();
  initArtifactLightboxEvents();
  initContactForm();
});

/* ==========================================================================
   1. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const follower = document.getElementById('cursorFollower');
  if (!dot || !follower) return;

  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  const hoverTargets = document.querySelectorAll('a, button, .artifact-card, .sp-chip-btn, .timeline-step-item, input, select, textarea');
  hoverTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => follower.classList.add('hovering'));
    target.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
  });
}

/* ==========================================================================
   2. STICKY HEADER & SCROLLSPY
   ========================================================================== */
function initStickyHeaderAndNav() {
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link[data-nav]');
  const sections = [];

  navLinks.forEach((link) => {
    const targetId = link.getAttribute('data-nav');
    const el = document.getElementById(targetId);
    if (el) sections.push({ id: targetId, element: el, link: link });
  });

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header shadow on scroll
    if (header) {
      if (scrollPos > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // ScrollSpy active link detection
    let currentId = '';
    const offset = 160;

    sections.forEach(({ id, element }) => {
      const top = element.offsetTop - offset;
      const height = element.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = id;
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        if (link.getAttribute('data-nav') === currentId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }, { passive: true });
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileBackdrop');
  const closeBtn = document.getElementById('mobileCloseBtn');

  if (!toggle || !drawer || !backdrop) return;

  function openMenu() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });

  window.closeMobileMenu = closeMenu;
}

/* ==========================================================================
   4. FINAL UI: 9-SCREEN SWITCHER
   ========================================================================== */
function switchFinalScreen(screenId, triggerBtn) {
  const allScreens = document.querySelectorAll('.final-screen-view');
  const allButtons = document.querySelectorAll('.screen-tab-btn');

  allScreens.forEach((view) => view.classList.remove('active'));
  allButtons.forEach((btn) => btn.classList.remove('active'));

  const targetView = document.getElementById(screenId);
  if (targetView) targetView.classList.add('active');

  if (triggerBtn) {
    triggerBtn.classList.add('active');
  } else {
    const matchingBtn = Array.from(allButtons).find(btn => btn.getAttribute('onclick')?.includes(screenId));
    if (matchingBtn) matchingBtn.classList.add('active');
  }

  // Smooth scroll into view if called from nested button
  const viewerBox = document.getElementById('screenViewerBox');
  if (viewerBox && window.innerWidth < 768) {
    viewerBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
window.switchFinalScreen = switchFinalScreen;

/* ==========================================================================
   5. FULL-SCREEN ARTIFACT LIGHTBOX (Mandatory Process Gallery)
   ========================================================================== */
const ARTIFACTS_DATA = [
  {
    src: "assets/images/WhatsApp Image 2026-03-11 at 10.54.18 AM.jpeg",
    title: "React App User Authentication & Login Flow",
    tag: "INTERNSHIP FRONTEND MODULE",
    desc: "Localhost module implementation verifying form validation, secure credentials state, and user redirection during Abservetech practicum."
  },
  {
    src: "assets/images/WhatsApp Image 2026-03-11 at 11.12.46 AM.jpeg",
    title: "IdeaGalaxy Dashboard & Discovery Feed",
    tag: "WEB APPLICATION INTERFACE",
    desc: "Responsive web dashboard designed for student innovators to browse, submit, and collaborate on technology ideas."
  },
  {
    src: "assets/images/WhatsApp Image 2026-03-11 at 11.12.47 AM.jpeg",
    title: "Student Profile & Saved Concept Cards",
    tag: "USER EXPERIENCE ARCHITECTURE",
    desc: "Card-based management UI displaying concept status indicators (Approved, Pending), category tags, and deletion actions."
  },
  {
    src: "assets/images/WhatsApp Image 2026-03-11 at 8.20.18 PM.jpeg",
    title: "Collaborative Peer Feedback & Discussion Feed",
    tag: "INTERACTION DESIGN & COLLABORATION",
    desc: "Real-time communication thread with team members (Poorani, Dharani, Megalatha) reviewing design viability and user suggestions."
  },
  {
    src: "assets/images/WhatsApp Image 2026-03-11 at 8.20.21 PM.jpeg",
    title: "Concept Moderation & Filter Management",
    tag: "ADMINISTRATIVE WORKFLOW",
    desc: "Administrative portal with state filtering (All, Pending, Approved, Rejected) and categorized tag taxonomies."
  },
  {
    src: "assets/images/Screenshot 2026-03-12 130145.png",
    title: "Technical Architecture & UI Training Specification",
    tag: "UX DOCUMENTATION",
    desc: "Comprehensive engineering report detailing React state architecture, navigation flows, and user onboarding training manuals."
  },
  {
    src: "assets/images/spotify_ai_case_study.jpg",
    title: "Spotify AI Mood Multi-Device System",
    tag: "FLAGSHIP UI/UX CASE STUDY",
    desc: "Presentation mockup displaying tablet and mobile mood exploration interface across Spotify Dark (#121212) aesthetics."
  },
  {
    src: "assets/images/spotify_ai_mockup.jpg",
    title: "Mobile Discovery & Mood Orb Visualizer",
    tag: "VISUAL INTERACTION DESIGN",
    desc: "High-fidelity mobile screens demonstrating user flow from mood wheel selection to personalized audio playback."
  },
  {
    src: "assets/images/internship_ui_design_system.jpg",
    title: "Component Hierarchy & Design Token Architecture",
    tag: "DESIGN SYSTEMS & PATTERNS",
    desc: "Figma components tree, color tokens, and atomic wireframes proving structured design-to-development handoffs."
  }
];

let currentArtifactIndex = 0;

function openLightbox(index) {
  if (index < 0 || index >= ARTIFACTS_DATA.length) return;
  currentArtifactIndex = index;
  renderLightboxArtifact();

  const lightbox = document.getElementById('artifactLightbox');
  if (lightbox) {
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}
window.openLightbox = openLightbox;

function openLightboxBySrc(src) {
  const foundIndex = ARTIFACTS_DATA.findIndex(item => item.src === src);
  if (foundIndex !== -1) {
    openLightbox(foundIndex);
  } else {
    // If not in index, display dynamically
    const imgEl = document.getElementById('lightboxActiveImg');
    const titleEl = document.getElementById('lightboxTitle');
    const descEl = document.getElementById('lightboxDesc');
    const tagEl = document.getElementById('lightboxTag');
    const counterEl = document.getElementById('lightboxCounter');

    if (imgEl) imgEl.src = src;
    if (titleEl) titleEl.textContent = "Practicum Artifact";
    if (descEl) descEl.textContent = "Real process work from internship practicum.";
    if (tagEl) tagEl.textContent = "INTERNSHIP WORK";
    if (counterEl) counterEl.textContent = "Artifact Preview";

    const lightbox = document.getElementById('artifactLightbox');
    if (lightbox) {
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }
}
window.openLightboxBySrc = openLightboxBySrc;

function closeLightbox() {
  const lightbox = document.getElementById('artifactLightbox');
  if (lightbox) {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}
window.closeLightbox = closeLightbox;

function changeLightboxArtifact(delta) {
  currentArtifactIndex = (currentArtifactIndex + delta + ARTIFACTS_DATA.length) % ARTIFACTS_DATA.length;
  renderLightboxArtifact();
}
window.changeLightboxArtifact = changeLightboxArtifact;

function renderLightboxArtifact() {
  const item = ARTIFACTS_DATA[currentArtifactIndex];
  if (!item) return;

  const imgEl = document.getElementById('lightboxActiveImg');
  const titleEl = document.getElementById('lightboxTitle');
  const descEl = document.getElementById('lightboxDesc');
  const tagEl = document.getElementById('lightboxTag');
  const counterEl = document.getElementById('lightboxCounter');

  if (imgEl) {
    imgEl.style.opacity = '0';
    imgEl.src = item.src;
    imgEl.alt = item.title;
    imgEl.onload = () => {
      imgEl.style.opacity = '1';
    };
  }
  if (titleEl) titleEl.textContent = item.title;
  if (descEl) descEl.textContent = item.desc;
  if (tagEl) tagEl.textContent = item.tag;
  if (counterEl) counterEl.textContent = `Artifact ${currentArtifactIndex + 1} of ${ARTIFACTS_DATA.length}`;
}

function initArtifactLightboxEvents() {
  const lightbox = document.getElementById('artifactLightbox');
  if (!lightbox) return;

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeLightboxArtifact(-1);
    if (e.key === 'ArrowRight') changeLightboxArtifact(1);
  });

  // Click on background closes
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-main-stage') || e.target.classList.contains('lightbox-image-container')) {
      closeLightbox();
    }
  });

  // Touch Swipe for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        changeLightboxArtifact(1); // Swipe left = next
      } else {
        changeLightboxArtifact(-1); // Swipe right = prev
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   6. RESUME MODAL & PRINT/DOWNLOAD
   ========================================================================== */
function openResumeModal(e) {
  if (e && e.preventDefault) e.preventDefault();
  const modal = document.getElementById('resumeModal');
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}
window.openResumeModal = openResumeModal;

function closeResumeModal() {
  const modal = document.getElementById('resumeModal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}
window.closeResumeModal = closeResumeModal;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const resumeModal = document.getElementById('resumeModal');
    if (resumeModal && resumeModal.classList.contains('open')) {
      closeResumeModal();
    }
  }
});

const resumeModal = document.getElementById('resumeModal');
if (resumeModal) {
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResumeModal();
  });
}

/* ==========================================================================
   7. PROCESS TIMELINE STEP INTERACTION
   ========================================================================== */
function highlightProcessStep(el) {
  const allSteps = document.querySelectorAll('.timeline-step-item');
  allSteps.forEach(step => step.classList.remove('highlighted'));
  el.classList.add('highlighted');
  
  const stepName = el.querySelector('h4')?.textContent || 'Step';
  showToast(`Exploring Step: ${stepName} ✦`);
}
window.highlightProcessStep = highlightProcessStep;

/* ==========================================================================
   8. PROJECT MODAL (Freelancer Portfolio)
   ========================================================================== */
function openProjectModal(key) {
  if (key === 'freelance') {
    showToast('Freelancer Portfolio: HTML, CSS & Responsive Web Design');
    // Scroll smoothly to contact or open lightbox with the freelance mockup
    openLightboxBySrc('assets/images/freelance_portfolio_mockup.jpg');
  }
}
window.openProjectModal = openProjectModal;

/* ==========================================================================
   9. CONTACT FORM & TOAST NOTIFICATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  window.handleContactSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('senderName')?.value || 'Friend';
    showToast(`Thank you, ${name}! Megalatha will respond promptly 🚀`);
    form.reset();
  };
}

function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3600);
}
window.showToast = showToast;

/* ==========================================================================
   10. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   11. SCROLL TO TOP
   ========================================================================== */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
window.scrollToTop = scrollToTop;
