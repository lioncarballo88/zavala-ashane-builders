/* ============================================================
   ZAVALA ASHANE BUILDERS — main.js
   Navigation, scroll effects, reveal animations, form handling
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Helpers
     ---------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /**
   * Throttle a function to run at most once per animation frame.
   * @param {Function} fn
   * @returns {Function}
   */
  function rafThrottle(fn) {
    let ticking = false;
    return function throttled() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        fn();
        ticking = false;
      });
    };
  }

  /* ----------------------------------------------------------
     1. Sticky header + back-to-top visibility
     ---------------------------------------------------------- */
  const header = document.getElementById('site-header');
  const backToTop = document.querySelector('.back-to-top');

  function updateOnScroll() {
    const scrollY = window.scrollY;

    if (header) {
      header.classList.toggle('is-scrolled', scrollY > 40);
    }

    if (backToTop) {
      backToTop.classList.toggle('is-visible', scrollY > 640);
    }
  }

  window.addEventListener('scroll', rafThrottle(updateOnScroll), {
    passive: true,
  });
  updateOnScroll();

  /* ----------------------------------------------------------
     2. Mobile navigation
     ---------------------------------------------------------- */
  const nav = document.getElementById('primary-nav');
  const navToggle = document.getElementById('nav-toggle');

  if (nav && navToggle) {
    const navLinks = nav.querySelectorAll('.nav__link');

    function openNav() {
      nav.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
      if (navLinks.length) navLinks[0].focus();
    }

    function closeNav() {
      if (!nav.classList.contains('is-open')) return;
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close the menu when a link is chosen
    navLinks.forEach((link) => link.addEventListener('click', closeNav));

    // Close on Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });

    // Reset state when resizing back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 900) closeNav();
    });
  }

  /* ----------------------------------------------------------
     3. Active navigation link highlighting
     ---------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');

  if (sections.length && 'IntersectionObserver' in window) {
    const navLinkMap = new Map();
    document.querySelectorAll('.nav__link').forEach((link) => {
      const id = link.getAttribute('href').replace('#', '');
      navLinkMap.set(id, link);
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const link = navLinkMap.get(entry.target.id);
          if (!link) return;
          document
            .querySelectorAll('.nav__link.is-active')
            .forEach((active) => active.classList.remove('is-active'));
          link.classList.add('is-active');
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ----------------------------------------------------------
     4. Scroll reveal animations
     ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('is-visible'));
    } else {
      // Stagger items that share the same parent grid
      const groups = new Map();
      revealElements.forEach((el) => {
        const parent = el.parentElement;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(el);
      });
      groups.forEach((items) => {
        items.forEach((el, index) => {
          el.style.setProperty('--reveal-delay', `${Math.min(index * 90, 450)}ms`);
        });
      });

      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
      );

      revealElements.forEach((el) => revealObserver.observe(el));
    }
  }

  /* ----------------------------------------------------------
     5. Contact form — client-side validation
     ----------------------------------------------------------
     NOTE: This demo form validates and shows a success state.
     Wire it to a real service (Formspree, Netlify Forms,
     Web3Forms) or a backend endpoint via the action attribute
     in index.html before launch. */
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form) {
    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const messageField = form.querySelector('#message');
    const phoneField = form.querySelector('#phone');
    const projectTypeField = form.querySelector('#project-type');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const endpoint = (form.dataset.formEndpoint || '').trim();
    const fallbackMailto = (
      form.dataset.mailto ||
      'mailto:info@zavalaashanebuilders.com?subject=Website%20Inquiry'
    ).trim();

    function markInvalid(field, invalid) {
      field.classList.toggle('is-invalid', invalid);
    }

    function validateField(field) {
      if (field === emailField) {
        return emailPattern.test(field.value.trim());
      }
      return field.value.trim().length > 0;
    }

    function buildMailtoLink() {
      const name = nameField.value.trim();
      const email = emailField.value.trim();
      const phone = phoneField ? phoneField.value.trim() : '';
      const projectType = projectTypeField ? projectTypeField.value.trim() : '';
      const details = messageField.value.trim();

      const subject = projectType
        ? `Website inquiry: ${projectType}`
        : 'Website inquiry';

      const bodyLines = [
        `Name: ${name || 'N/A'}`,
        `Email: ${email || 'N/A'}`,
        phone ? `Phone: ${phone}` : null,
        projectType ? `Project type: ${projectType}` : null,
        '',
        'Project details:',
        details || 'N/A',
      ].filter(Boolean);

      const mailtoUrl = new URL(fallbackMailto);
      mailtoUrl.searchParams.set('subject', subject);
      mailtoUrl.searchParams.set('body', bodyLines.join('\n'));
      return mailtoUrl.toString();
    }

    function submitViaWebhook() {
      const formData = new FormData(form);
      const requestOptions = {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      };

      return fetch(endpoint, requestOptions).then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response;
      });
    }

    [nameField, emailField, messageField].forEach((field) => {
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) {
          markInvalid(field, !validateField(field));
        }
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const fields = [nameField, emailField, messageField];
      let firstInvalid = null;

      fields.forEach((field) => {
        const valid = validateField(field);
        markInvalid(field, !valid);
        if (!valid && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        formStatus.className = 'contact-form__status is-error';
        formStatus.textContent =
          'Please complete the highlighted fields and try again.';
        firstInvalid.focus();
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      formStatus.className = 'contact-form__status';
      formStatus.textContent = 'Sending your message…';

      const sendRequest = endpoint
        ? submitViaWebhook()
        : Promise.resolve().then(() => {
            window.location.href = buildMailtoLink();
          });

      sendRequest
        .then(() => {
          formStatus.className = 'contact-form__status is-success';
          formStatus.textContent =
            'Thank you! Your message has been sent. We will get back to you within one business day.';
          form.reset();
        })
        .catch(() => {
          formStatus.className = 'contact-form__status is-error';
          formStatus.textContent =
            'We could not send the form automatically. Your email app was opened so you can send the message manually.';
          window.location.href = buildMailtoLink();
        })
        .finally(() => {
          submitButton.disabled = false;
        });
    });
  }

  /* ----------------------------------------------------------
     6. Footer copyright year
     ---------------------------------------------------------- */
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
