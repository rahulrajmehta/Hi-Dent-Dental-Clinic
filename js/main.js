/**
 * Hi Dent Dental Clinic - Main JavaScript
 * Interactive Appointment Booking, WhatsApp Redirection, Before/After Slider,
 * Doctor Selection Sync, FAQs, and Mobile Navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle with Smooth Slide-in Animation
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileNav) {
    const openMobileNav = () => {
      mobileNav.classList.remove('hidden');
      requestAnimationFrame(() => {
        mobileNav.classList.add('is-open');
      });
      document.body.style.overflow = 'hidden';
    };

    const closeMobileNav = () => {
      mobileNav.classList.remove('is-open');
      setTimeout(() => {
        mobileNav.classList.add('hidden');
      }, 320);
      document.body.style.overflow = '';
    };

    mobileMenuBtn.addEventListener('click', openMobileNav);

    if (mobileNavClose) {
      mobileNavClose.addEventListener('click', closeMobileNav);
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeMobileNav();
    });
  }

  // Header Scroll Shadow
  const mainHeader = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      mainHeader?.classList.add('shadow-md');
    } else {
      mainHeader?.classList.remove('shadow-md');
    }
  });

  // Doctor Card "Book with Doctor" Auto-Select
  const doctorSelect = document.getElementById('preferred-doctor');
  const bookDoctorBtns = document.querySelectorAll('.book-doctor-btn');

  bookDoctorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const docName = btn.getAttribute('data-doctor');
      if (doctorSelect && docName) {
        doctorSelect.value = docName;
      }
      
      const appointmentSection = document.getElementById('appointment');
      if (appointmentSection) {
        appointmentSection.scrollIntoView({ behavior: 'smooth' });
        // Highlight form momentarily
        const formCard = document.getElementById('booking-card');
        if (formCard) {
          formCard.classList.add('ring-4', 'ring-blue-400');
          setTimeout(() => {
            formCard.classList.remove('ring-4', 'ring-blue-400');
          }, 1500);
        }
      }
    });
  });

  // Treatment Card "Book This Treatment" Auto-Select
  const treatmentSelect = document.getElementById('preferred-treatment');
  const bookTreatmentBtns = document.querySelectorAll('.book-treatment-btn');

  bookTreatmentBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const treatmentName = btn.getAttribute('data-treatment');
      if (treatmentSelect && treatmentName) {
        treatmentSelect.value = treatmentName;
      }
      const appointmentSection = document.getElementById('appointment');
      if (appointmentSection) {
        appointmentSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // URL Query Parameters Auto-Select (?doc=... or ?treatment=...)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const docParam = urlParams.get('doc');
    const treatParam = urlParams.get('treatment');
    if (doctorSelect && docParam) {
      const cleanDoc = decodeURIComponent(docParam).toLowerCase().replace(/\+/g, ' ');
      for (let i = 0; i < doctorSelect.options.length; i++) {
        const optText = doctorSelect.options[i].text.toLowerCase();
        const optVal = doctorSelect.options[i].value.toLowerCase();
        if (optText.includes(cleanDoc) || optVal.includes(cleanDoc)) {
          doctorSelect.selectedIndex = i;
          break;
        }
      }
    }
    if (treatmentSelect && treatParam) {
      const cleanTreat = decodeURIComponent(treatParam).toLowerCase().replace(/\+/g, ' ');
      for (let i = 0; i < treatmentSelect.options.length; i++) {
        const optText = treatmentSelect.options[i].text.toLowerCase();
        const optVal = treatmentSelect.options[i].value.toLowerCase();
        if (optText.includes(cleanTreat) || optVal.includes(cleanTreat)) {
          treatmentSelect.selectedIndex = i;
          break;
        }
      }
    }
  } catch (e) {
    // Ignore URL parse errors
  }

  // Before & After Interactive Slider
  const compContainer = document.getElementById('comparison-box');
  const compBefore = document.getElementById('comparison-before');
  const compHandle = document.getElementById('comparison-handle');

  if (compContainer && compBefore && compHandle) {
    let isDragging = false;

    const setPosition = (x) => {
      const rect = compContainer.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width;
      if (pos < 0.05) pos = 0.05;
      if (pos > 0.95) pos = 0.95;
      const pct = pos * 100;
      compBefore.style.width = pct + '%';
      compHandle.style.left = pct + '%';
    };

    const onStart = (e) => {
      isDragging = true;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      if (x) setPosition(x);
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      if (x) setPosition(x);
    };

    const onEnd = () => {
      isDragging = false;
    };

    compContainer.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    compContainer.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  }

  // Treatment Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const treatmentCards = document.querySelectorAll('.treatment-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-blue-600', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-700');
      });
      btn.classList.add('active', 'bg-blue-600', 'text-white');
      btn.classList.remove('bg-slate-100', 'text-slate-700');

      const filter = btn.getAttribute('data-filter');

      treatmentCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // FAQ Accordion
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Appointment Form Submission & WhatsApp Sync
  const appointmentForm = document.getElementById('appointment-form');
  const confirmationModal = document.getElementById('confirmation-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('patient-name')?.value.trim() || 'Patient';
      const phone = document.getElementById('patient-phone')?.value.trim() || '';
      const doctor = document.getElementById('preferred-doctor')?.value || 'Any Available Specialist';
      const treatment = document.getElementById('preferred-treatment')?.value || 'Consultation & Checkup';
      const date = document.getElementById('appointment-date')?.value || 'Earliest Available';
      const time = document.getElementById('appointment-time')?.value || 'Morning (10 AM - 1 PM)';
      const notes = document.getElementById('appointment-notes')?.value.trim() || 'None';

      if (!phone || phone.length < 10) {
        alert('Please enter a valid 10-digit phone number.');
        return;
      }

      // Generate random appointment reference ID
      const refId = 'HD-' + Math.floor(1000 + Math.random() * 9000);

      // Populate confirmation modal slip
      const slipRef = document.getElementById('slip-ref');
      const slipName = document.getElementById('slip-name');
      const slipPhone = document.getElementById('slip-phone');
      const slipDoctor = document.getElementById('slip-doctor');
      const slipTreatment = document.getElementById('slip-treatment');
      const slipDate = document.getElementById('slip-date');

      if (slipRef) slipRef.textContent = refId;
      if (slipName) slipName.textContent = name;
      if (slipPhone) slipPhone.textContent = phone;
      if (slipDoctor) slipDoctor.textContent = doctor;
      if (slipTreatment) slipTreatment.textContent = treatment;
      if (slipDate) slipDate.textContent = `${date} at ${time}`;

      // Open Modal
      if (confirmationModal) {
        confirmationModal.classList.add('active');
      }

      // Prepare WhatsApp URL for direct notification to clinic (7004184115)
      const clinicWhatsAppNumber = '917004184115';
      const message = `*ðŸ¦· New Appointment Request - Hi Dent Dental Clinic*\n` +
                      `*Ref ID:* ${refId}\n` +
                      `*Patient Name:* ${name}\n` +
                      `*Phone:* ${phone}\n` +
                      `*Preferred Specialist:* ${doctor}\n` +
                      `*Treatment:* ${treatment}\n` +
                      `*Preferred Date:* ${date}\n` +
                      `*Preferred Time Slot:* ${time}\n` +
                      `*Notes:* ${notes}\n\n` +
                      `_Location: Heritage Garden, Opp. Surendranath School, Deepatoli, Ranchi - 834001_`;

      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${clinicWhatsAppNumber}?text=${encodedMsg}`;

      // Set up modal's direct WhatsApp confirmation button
      const confirmWhatsappBtn = document.getElementById('confirm-whatsapp-btn');
      if (confirmWhatsappBtn) {
        confirmWhatsappBtn.href = whatsappUrl;
      }
    });
  }

  if (closeModalBtn && confirmationModal) {
    closeModalBtn.addEventListener('click', () => {
      confirmationModal.classList.remove('active');
      appointmentForm.reset();
    });
  }

  // Background Video Controls
  const heroVideo = document.getElementById('hero-video-player');
  const videoToggleBtn = document.getElementById('video-toggle-btn');
  const videoToggleIcon = document.getElementById('video-toggle-icon');
  const videoToggleText = document.getElementById('video-toggle-text');
  const videoSoundBtn = document.getElementById('video-sound-btn');
  const videoSoundIcon = document.getElementById('video-sound-icon');

  if (heroVideo && videoToggleBtn) {
    videoToggleBtn.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play();
        if (videoToggleIcon) videoToggleIcon.className = 'fa-solid fa-pause';
        if (videoToggleText) videoToggleText.textContent = 'Pause Video';
      } else {
        heroVideo.pause();
        if (videoToggleIcon) videoToggleIcon.className = 'fa-solid fa-play';
        if (videoToggleText) videoToggleText.textContent = 'Play Video';
      }
    });
  }

  if (heroVideo && videoSoundBtn) {
    videoSoundBtn.addEventListener('click', () => {
      if (heroVideo.muted) {
        heroVideo.muted = false;
        if (videoSoundIcon) videoSoundIcon.className = 'fa-solid fa-volume-high';
      } else {
        heroVideo.muted = true;
        if (videoSoundIcon) videoSoundIcon.className = 'fa-solid fa-volume-xmark';
      }
    });
  }

  // =========================================================================
  // REVIEWS SLIDING CAROUSEL (TOUCH / SWIPE / MOBILE FRIENDLY)
  // =========================================================================
  function initReviewsCarousel(trackId, prevBtnId, nextBtnId, dotsId) {
    const track = document.getElementById(trackId);
    if (!track) return;

    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsId);
    const cards = track.querySelectorAll('.review-slide-card');
    if (!cards.length) return;

    function getStep() {
      const firstCard = cards[0];
      const gap = 20;
      return (firstCard ? firstCard.offsetWidth : 320) + gap;
    }

    // Build Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      cards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('type', 'button');
        dot.setAttribute('aria-label', 'Slide ' + (idx + 1));
        dot.addEventListener('click', () => {
          const targetCard = cards[idx];
          if (targetCard) {
            track.scrollTo({
              left: targetCard.offsetLeft - track.offsetLeft,
              behavior: 'smooth'
            });
          }
        });
        dotsContainer.appendChild(dot);
      });
    }

    // Update active dot on scroll
    function updateActiveDot() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      const scrollPos = track.scrollLeft;
      let activeIdx = 0;
      let minDiff = Infinity;

      cards.forEach((card, idx) => {
        const cardPos = card.offsetLeft - track.offsetLeft;
        const diff = Math.abs(scrollPos - cardPos);
        if (diff < minDiff) {
          minDiff = diff;
          activeIdx = idx;
        }
      });

      dots.forEach((d, i) => {
        d.classList.toggle('active', i === activeIdx);
      });
    }

    let scrollTimeout;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateActiveDot, 50);
    }, { passive: true });

    // Buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -getStep(), behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 15) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: getStep(), behavior: 'smooth' });
        }
      });
    }

    // Auto-slide every 5 seconds (pauses on hover or touch)
    let autoSlideInterval = null;
    function startAutoSlide() {
      if (autoSlideInterval) return;
      autoSlideInterval = setInterval(() => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 15) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: getStep(), behavior: 'smooth' });
        }
      }, 4800);
    }

    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    }

    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);
    track.addEventListener('touchstart', stopAutoSlide, { passive: true });
    track.addEventListener('touchend', () => {
      setTimeout(startAutoSlide, 2500);
    }, { passive: true });

    startAutoSlide();
  }

  initReviewsCarousel('reviews-slider-track', 'reviews-prev-btn', 'reviews-next-btn', 'reviews-dots');
  initReviewsCarousel('page-reviews-slider-track', 'page-reviews-prev-btn', 'page-reviews-next-btn', 'page-reviews-dots');

  // =========================================================================
  // AUTOMATIC AUTO-SLIDING GALLERY CAROUSEL
  // =========================================================================
  function initGalleryAutoSlider(trackId, prevBtnId, nextBtnId, dotsId) {
    const track = document.getElementById(trackId);
    if (!track) return;

    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsId);
    const cards = track.querySelectorAll('.gallery-slide-card');
    if (!cards.length) return;

    function getStep() {
      const card = cards[0];
      const gap = 20;
      return (card ? card.offsetWidth : 320) + gap;
    }

    // Build Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      cards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('type', 'button');
        dot.setAttribute('aria-label', 'Photo slide ' + (idx + 1));
        dot.addEventListener('click', () => {
          const card = cards[idx];
          if (card) {
            track.scrollTo({
              left: card.offsetLeft - track.offsetLeft,
              behavior: 'smooth'
            });
          }
        });
        dotsContainer.appendChild(dot);
      });
    }

    function updateActiveDot() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      const scrollPos = track.scrollLeft;
      let activeIdx = 0;
      let minDiff = Infinity;

      cards.forEach((card, idx) => {
        const cardPos = card.offsetLeft - track.offsetLeft;
        const diff = Math.abs(scrollPos - cardPos);
        if (diff < minDiff) {
          minDiff = diff;
          activeIdx = idx;
        }
      });

      dots.forEach((d, i) => {
        d.classList.toggle('active', i === activeIdx);
      });
    }

    let scrollTimeout;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateActiveDot, 50);
    }, { passive: true });

    function slideNext() {
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 15) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: getStep(), behavior: 'smooth' });
      }
    }

    function slidePrev() {
      if (track.scrollLeft <= 15) {
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: -getStep(), behavior: 'smooth' });
      }
    }

    if (nextBtn) nextBtn.addEventListener('click', slideNext);
    if (prevBtn) prevBtn.addEventListener('click', slidePrev);

    // AUTOMATIC SLIDING: Every 3 seconds slides automatically
    let autoSlideInterval = null;
    function startAutoSlide() {
      if (autoSlideInterval) return;
      autoSlideInterval = setInterval(slideNext, 3000);
    }

    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    }

    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);
    track.addEventListener('touchstart', stopAutoSlide, { passive: true });
    track.addEventListener('touchend', () => {
      setTimeout(startAutoSlide, 2500);
    }, { passive: true });

    // Start auto slide automatically
    startAutoSlide();
  }

  initGalleryAutoSlider('gallery-slider-track', 'gallery-prev-btn', 'gallery-next-btn', 'gallery-dots');

  // =========================================================================
  // ANIMATED STATS COUNTERS (Intersection Observer & 60fps Easing)
  // =========================================================================
  function initStatCounters() {
    const counterElements = document.querySelectorAll('[data-counter]');
    if (!counterElements.length) return;

    function animateCounter(el) {
      const targetStr = el.getAttribute('data-counter');
      const target = parseFloat(targetStr);
      if (isNaN(target)) return;

      const duration = 1400; // 1.4s smooth duration
      const isDecimal = targetStr.includes('.') || el.getAttribute('data-decimals');
      const decimals = isDecimal ? 1 : 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth easeOutExpo curve
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = target * ease;

        if (decimals > 0) {
          el.textContent = prefix + currentVal.toFixed(1) + suffix;
        } else {
          el.textContent = prefix + Math.floor(currentVal).toLocaleString() + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          if (decimals > 0) {
            el.textContent = prefix + target.toFixed(1) + suffix;
          } else {
            el.textContent = prefix + Math.floor(target).toLocaleString() + suffix;
          }
        }
      }

      requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });

      counterElements.forEach(el => observer.observe(el));
    } else {
      counterElements.forEach(el => animateCounter(el));
    }
  }

  // =========================================================================
  // SCROLL-TRIGGERED REVEAL ANIMATIONS (Intersection Observer)
  // =========================================================================
  function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal-on-scroll, .reveal-fade-in');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      reveals.forEach(el => observer.observe(el));
    } else {
      reveals.forEach(el => el.classList.add('is-revealed'));
    }
  }

  // =========================================================================
  // STICKY NAVBAR SCROLL ELEVATION & SHRINK
  // =========================================================================
  function initNavbarScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;

    function handleScroll() {
      if (window.scrollY > 40) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // =========================================================================
  // SMOOTH ANCHOR LINK SCROLLING WITH HEADER OFFSET
  // =========================================================================
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || href.length <= 1) return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const header = document.getElementById('main-header');
          const headerHeight = header ? header.offsetHeight : 70;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // =========================================================================
  // CARD-LEVEL SCROLL ENTRANCE ANIMATIONS (Mobile & Desktop)
  // =========================================================================
  function initCardAnimations() {
    const cards = document.querySelectorAll(
      '.doctor-card, .treatment-card, .service-card, .feature-card, .gallery-card, .review-slide-card, .values-grid article'
    );
    if (!cards.length) return;

    cards.forEach(card => card.classList.add('animate-card-enter'));

    if ('IntersectionObserver' in window) {
      const cardObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('card-visible');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
      });

      cards.forEach(card => cardObserver.observe(card));
    } else {
      cards.forEach(card => card.classList.add('card-visible'));
    }
  }

  // Initialize animations
  initStatCounters();
  initScrollReveals();
  initCardAnimations();
  initNavbarScroll();
  initSmoothAnchors();
});
