/* RENT KUDLA — main.js */
'use strict';

// ── PHONE CONFIG ──
const PHONE_NUMBER = '9449219908';
const INT_PHONE_NUMBER = '+919449219908';
const WA_PHONE_NUMBER = '919449219908';

// ── TOAST NOTIFICATIONS ──
const toastContainer = document.getElementById('toast-container');
function showToast(message, type = 'default') {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = message;
  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

// ── MODAL SYSTEM ──
const callModal = document.getElementById('call-modal');
const policyModal = document.getElementById('policy-modal');

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modals when clicking close button or background overlay
document.querySelectorAll('.modal-overlay').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal-overlay');
    if (modal) closeModal(modal);
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal(callModal);
    closeModal(policyModal);
  }
});

// Copy Phone Number Function
const copyNumberBtn = document.getElementById('modal-copy-btn');
if (copyNumberBtn) {
  copyNumberBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(PHONE_NUMBER).then(() => {
      copyNumberBtn.innerHTML = '✅ Copied ' + PHONE_NUMBER + '!';
      copyNumberBtn.style.background = '#e6fffa';
      copyNumberBtn.style.color = '#047857';
      showToast(`📋 Copied <strong>${PHONE_NUMBER}</strong> to clipboard!`, 'success');
      setTimeout(() => {
        copyNumberBtn.innerHTML = `📋 Copy Number (${PHONE_NUMBER})`;
        copyNumberBtn.style.background = '';
        copyNumberBtn.style.color = '';
      }, 2500);
    }).catch(() => {
      showToast(`📞 Phone: ${PHONE_NUMBER}`);
    });
  });
}

// Call Now Buttons — Hook up desktop modal and instant dial
const callBtn = document.getElementById('nav-call-btn');
if (callBtn) {
  callBtn.addEventListener('click', (e) => {
    // If on larger screens, open the Quick Connect modal with options
    if (window.innerWidth > 768) {
      e.preventDefault();
      openModal(callModal);
    }
    // On mobile devices, native href="tel:+919449219908" dials immediately
  });
}

// Also open call modal for contact phone click on desktop if desired
const contactPhoneLink = document.getElementById('contact-phone-link');
if (contactPhoneLink) {
  contactPhoneLink.addEventListener('click', (e) => {
    if (window.innerWidth > 768) {
      e.preventDefault();
      openModal(callModal);
    }
  });
}

// Privacy Policy & Terms Modal triggers
const privacyLink = document.getElementById('footer-privacy-link');
const termsLink = document.getElementById('footer-terms-link');
if (privacyLink) {
  privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('policy-modal-title').textContent = 'Privacy Policy — Rent Kudla';
    openModal(policyModal);
  });
}
if (termsLink) {
  termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('policy-modal-title').textContent = 'Terms of Service — Rent Kudla';
    openModal(policyModal);
  });
}

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger-btn');
const navLinks  = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('.nav-link, .nav-mobile-call, .nav-mobile-wa').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
    }
  });
}

// ── COUNTER ANIMATION ──
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step     = target / (duration / 16);
  let   current  = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); }
    else                   { el.textContent = Math.floor(current).toLocaleString(); }
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(n => counterObserver.observe(n));

// ── SCROLL-REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(
  '.service-card, .property-card, .step-card, .testimonial-card, .showcase-item, .contact-item'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  revealObserver.observe(el);
});

// ── FAVOURITE TOGGLE WITH LOCAL STORAGE & TOAST ──
const SAVED_FAVS_KEY = 'rent_kudla_saved_favourites';
let savedFavs = [];
try {
  savedFavs = JSON.parse(localStorage.getItem(SAVED_FAVS_KEY)) || [];
} catch (e) {
  savedFavs = [];
}

document.querySelectorAll('.prop-fav').forEach(btn => {
  const card = btn.closest('.property-card');
  const cardId = btn.dataset.id || card?.id;
  const propTitle = card?.dataset.title || 'Property';

  // Restore saved state
  if (cardId && savedFavs.includes(cardId)) {
    btn.classList.add('active');
    btn.textContent = '♥';
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('active');
    const isFav = btn.classList.contains('active');
    btn.textContent = isFav ? '♥' : '♡';

    if (cardId) {
      if (isFav) {
        if (!savedFavs.includes(cardId)) savedFavs.push(cardId);
        showToast(`❤️ Added <strong>${propTitle}</strong> to your saved favourites!`, 'success');
      } else {
        savedFavs = savedFavs.filter(id => id !== cardId);
        showToast(`Removed <strong>${propTitle}</strong> from favourites.`);
      }
      try {
        localStorage.setItem(SAVED_FAVS_KEY, JSON.stringify(savedFavs));
      } catch (err) {}
    }
  });
});

// ── PROPERTY SEARCH AND FILTER FUNCTIONALITY ──
const searchBtn = document.getElementById('search-properties-btn');
const searchLocation = document.getElementById('search-location');
const searchType = document.getElementById('search-type');
const searchBudget = document.getElementById('search-budget');
const propertiesGrid = document.getElementById('properties-grid');
const searchResultsInfo = document.getElementById('search-results-info');
const searchResultsText = document.getElementById('search-results-text');
const searchResetBtn = document.getElementById('search-reset-btn');
const viewAllPropsBtn = document.getElementById('view-all-properties-btn');

function filterProperties() {
  const locVal = (searchLocation ? searchLocation.value.trim() : '').toLowerCase();
  const typeVal = (searchType ? searchType.value.trim() : '').toLowerCase();
  const budgetVal = searchBudget ? searchBudget.value : '';

  const allCards = document.querySelectorAll('.property-card');
  let matchCount = 0;

  // Remove existing empty state message if any
  const existingEmpty = document.querySelector('.search-empty-state');
  if (existingEmpty) existingEmpty.remove();

  allCards.forEach(card => {
    const cardLoc = (card.dataset.location || '').toLowerCase();
    const cardType = (card.dataset.type || '').toLowerCase();
    const cardPrice = parseInt(card.dataset.price || '0', 10);

    let locMatches = !locVal || cardLoc.includes(locVal);
    let typeMatches = !typeVal || cardType.includes(typeVal);
    let budgetMatches = true;

    if (budgetVal === 'Under ₹8,000') {
      budgetMatches = cardPrice < 8000;
    } else if (budgetVal === '₹8,000 – ₹15,000') {
      budgetMatches = cardPrice >= 8000 && cardPrice <= 15000;
    } else if (budgetVal === '₹15,000 – ₹25,000') {
      budgetMatches = cardPrice > 15000 && cardPrice <= 25000;
    } else if (budgetVal === '₹25,000+') {
      budgetMatches = cardPrice > 25000;
    }

    if (locMatches && typeMatches && budgetMatches) {
      card.style.display = '';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
      matchCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const isFiltering = locVal || typeVal || budgetVal;

  if (searchResultsInfo) {
    if (isFiltering) {
      searchResultsInfo.style.display = 'flex';
      searchResultsText.innerHTML = `Found <strong>${matchCount}</strong> ${matchCount === 1 ? 'property' : 'properties'} matching your criteria in Mangaluru.`;
    } else {
      searchResultsInfo.style.display = 'none';
    }
  }

  if (matchCount === 0 && propertiesGrid) {
    const emptyState = document.createElement('div');
    emptyState.className = 'search-empty-state';
    emptyState.innerHTML = `
      <div class="search-empty-icon">🔎</div>
      <h4 class="search-empty-title">No matching properties found</h4>
      <p class="search-empty-sub">We couldn't find an exact match for your selected filter combination right now. Let us find one for you!</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-outline-dark btn-sm" id="empty-reset-btn">Reset Filters</button>
        <a href="#contact" class="btn btn-primary btn-sm" id="empty-custom-enquire-btn">Request Custom Search</a>
      </div>
    `;
    propertiesGrid.appendChild(emptyState);

    document.getElementById('empty-reset-btn')?.addEventListener('click', resetSearchFilters);
    document.getElementById('empty-custom-enquire-btn')?.addEventListener('click', () => {
      prefillContactForm('Find a Rental Property', `Hi Rent Kudla, I am looking for a rental property: Location: ${searchLocation.value || 'Any'}, Type: ${searchType.value || 'Any'}, Budget: ${searchBudget.value || 'Any'}.`);
    });
  }
}

function resetSearchFilters() {
  if (searchLocation) searchLocation.value = '';
  if (searchType) searchType.value = '';
  if (searchBudget) searchBudget.value = '';
  filterProperties();
  showToast('Showing all verified properties across Kudla');
}

if (searchBtn) {
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    filterProperties();
  });
}
if (searchLocation) searchLocation.addEventListener('change', filterProperties);
if (searchType) searchType.addEventListener('change', filterProperties);
if (searchBudget) searchBudget.addEventListener('change', filterProperties);

if (searchResetBtn) {
  searchResetBtn.addEventListener('click', resetSearchFilters);
}

if (viewAllPropsBtn) {
  viewAllPropsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resetSearchFilters();
    const propsSection = document.getElementById('properties');
    if (propsSection) {
      window.scrollTo({ top: propsSection.offsetTop - 70, behavior: 'smooth' });
    }
  });
}

// ── PREFILL CONTACT FORM HELPER ──
function prefillContactForm(serviceName, messageText) {
  const formSection = document.getElementById('contact');
  const serviceSelect = document.getElementById('form-service');
  const messageInput = document.getElementById('form-message');
  const nameInput = document.getElementById('form-name');
  const formElement = document.getElementById('contact-form');

  if (serviceSelect && serviceName) {
    serviceSelect.value = serviceName;
  }
  if (messageInput && messageText) {
    messageInput.value = messageText;
  }

  if (formSection) {
    window.scrollTo({ top: formSection.offsetTop - 70, behavior: 'smooth' });
  }

  if (formElement) {
    formElement.classList.remove('highlight-form');
    void formElement.offsetWidth; // re-flow to re-trigger animation
    formElement.classList.add('highlight-form');
  }

  if (nameInput) {
    setTimeout(() => nameInput.focus(), 600);
  }
}

// ── PROPERTY ENQUIRE BUTTONS ──
document.querySelectorAll('.prop-enquire-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const propDetails = btn.dataset.prop || 'Rental Property';
    prefillContactForm('Find a Rental Property', `Hi Rent Kudla, I am interested in: ${propDetails}. Please contact me with photos and visit timings.`);
    showToast(`Inquiring for <strong>${propDetails}</strong> — Please fill in your contact info below.`, 'success');
  });
});

// ── SERVICE CARD LINKS & SHOWCASE CTAs ──
document.querySelectorAll('.service-link[data-service], #shifting-cta-btn, #cleaning-cta-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const service = btn.dataset.service;
    if (service) {
      e.preventDefault();
      prefillContactForm(service, `Hi Rent Kudla, I would like to book or enquire about ${service} in Mangaluru.`);
      showToast(`Selected: <strong>${service}</strong>. Complete the form to get a quick callback!`, 'success');
    }
  });
});

// ── HERO "FIND A PROPERTY" & BANNER "FIND A PROPERTY" ──
const heroFindBtn = document.getElementById('hero-find-property');
const ctaBannerFindBtn = document.getElementById('cta-banner-find-btn');
[heroFindBtn, ctaBannerFindBtn].forEach(btn => {
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const propSection = document.getElementById('properties');
      if (propSection) {
        window.scrollTo({ top: propSection.offsetTop - 70, behavior: 'smooth' });
      }
      setTimeout(() => {
        if (searchLocation) searchLocation.focus();
      }, 600);
    });
  }
});

// ── INSTAGRAM TILES INTERACTIVITY ──
document.querySelectorAll('.insta-tile').forEach(tile => {
  tile.style.cursor = 'pointer';
  tile.addEventListener('click', () => {
    window.open('https://instagram.com/rentkudla', '_blank');
  });
});

// ── CONTACT FORM SUBMISSION ──
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameEl  = document.getElementById('form-name');
    const phoneEl = document.getElementById('form-phone');
    const serviceEl = document.getElementById('form-service');
    const messageEl = document.getElementById('form-message');

    const name  = nameEl.value.trim();
    const phone = phoneEl.value.trim();
    const service = serviceEl ? serviceEl.value : 'General Enquiry';
    const message = messageEl ? messageEl.value.trim() : '';

    if (!name) {
      showToast('⚠️ Please enter your name.', 'error');
      nameEl.focus();
      return;
    }
    // Basic phone validation (allow digits, spaces, plus)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      showToast('⚠️ Please enter a valid 10-digit phone number.', 'error');
      phoneEl.focus();
      return;
    }

    const btn  = document.getElementById('form-submit-btn');
    const text = document.getElementById('form-btn-text');
    btn.disabled = true;
    text.textContent = 'Sending Enquiry…';

    setTimeout(() => {
      const successDiv = document.getElementById('form-success');
      if (successDiv) {
        successDiv.style.display = 'block';
        const waLink = document.getElementById('form-success-wa-link');
        if (waLink) {
          const waMsg = encodeURIComponent(
            `Hello Rent Kudla! I submitted an enquiry on your website:\n*Name:* ${name}\n*Phone:* ${phone}\n*Service:* ${service || 'General'}\n*Message:* ${message || 'Please call me.'}`
          );
          waLink.href = `https://wa.me/${WA_PHONE_NUMBER}?text=${waMsg}`;
        }
      }

      showToast(`🎉 Thank you, <strong>${name}</strong>! We will call you at <strong>${phone}</strong> within 15 minutes.`, 'success');
      form.reset();
      btn.disabled = false;
      text.textContent = 'Send Message';
    }, 1000);
  });
}

// ── SMOOTH SCROLL FOR NAV AND ANCHOR LINKS ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 76;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// ── ACTIVE NAV LINK HIGHLIGHT ──
const sections  = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navItems.forEach(item => {
    item.style.fontWeight = item.getAttribute('href') === '#' + current ? '700' : '500';
  });
}, { passive: true });
