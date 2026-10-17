
(() => {
  const cards = document.querySelectorAll('.video-card[data-video-id]');

  function showThumbnail(card) {
    const frame = card.querySelector('[data-video-frame]');
    if (!frame) return;

    frame.querySelector('iframe')?.remove();
    frame.querySelector('.player-fallback')?.remove();
    frame.querySelector('.video-thumb')?.remove();
    frame.querySelector('.play-button')?.remove();

    const videoId = card.dataset.videoId;
    const img = document.createElement('img');
    img.className = 'video-thumb';
    img.src = `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
    img.alt = 'فيديو توعوي من تِك وردي';
    img.loading = 'lazy';

    const button = document.createElement('button');
    button.className = 'play-button';
    button.type = 'button';
    button.setAttribute('aria-label', 'تشغيل الفيديو');
    button.innerHTML = '<span aria-hidden="true">▶</span>';

    frame.prepend(img, button);
  }

  cards.forEach((card) => {
    const frame = card.querySelector('[data-video-frame]');
    const videoId = card.dataset.videoId;

    if (!frame || !videoId) return;

    frame.addEventListener('click', (event) => {
      const button = event.target.closest('.play-button');
      if (!button) return;

      // إيقاف الفيديو السابق وإرجاع صورته
      cards.forEach((otherCard) => {
        if (otherCard !== card) {
          showThumbnail(otherCard);
        }
      });

      const iframe = document.createElement('iframe');
      iframe.className = 'video-player';
      iframe.src =
        `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
      iframe.title = button.getAttribute('aria-label') || 'فيديو توعوي من تِك وردي';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;

      const fallback = document.createElement('a');
      fallback.className = 'player-fallback';
      fallback.href = `https://youtu.be/${encodeURIComponent(videoId)}`;
      fallback.target = '_blank';
      fallback.rel = 'noopener noreferrer';
      fallback.textContent = 'إذا لم يعمل المشغّل، افتحيه على YouTube ↗';

      frame.querySelector('.video-thumb')?.remove();
      button.remove();
      frame.append(iframe, fallback);
    });
  });

  // الفيديو الرابع لا يملك رابطًا حتى الآن.
})();

/* =========================================
   TECH WARDI — Navigation والفقاعة الوردية
   ========================================= */
(() => {
  const nav = document.querySelector(".nav-links");
  const toggle = document.querySelector(".menu-toggle");

  if (!nav || !toggle) return;

  const links = [...nav.querySelectorAll("a")];
  if (!links.length) return;

  let bubble = nav.querySelector(".nav-bubble");

  if (!bubble) {
    bubble = document.createElement("span");
    bubble.className = "nav-bubble";
    bubble.setAttribute("aria-hidden", "true");
    nav.prepend(bubble);
  }

  const activeLink = () =>
    nav.querySelector('a[aria-current="page"]') || links[0];

  function moveBubble(link) {
    if (!link || !nav.getClientRects().length) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    bubble.style.left =
      `${linkRect.left - navRect.left - nav.clientLeft + nav.scrollLeft}px`;

    bubble.style.top =
      `${linkRect.top - navRect.top - nav.clientTop + nav.scrollTop}px`;

    bubble.style.width = `${linkRect.width}px`;
    bubble.style.height = `${linkRect.height}px`;

    nav.classList.add("bubble-ready");
  }

  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "فتح القائمة");
  }

  toggle.addEventListener("click", () => {
    const opening = toggle.getAttribute("aria-expanded") !== "true";

    if (opening) {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "إغلاق القائمة");

      requestAnimationFrame(() => moveBubble(activeLink()));
    } else {
      closeMenu();
    }
  });

  links.forEach(link => {
    link.addEventListener("pointerenter", () => moveBubble(link));
    link.addEventListener("focus", () => moveBubble(link));
    link.addEventListener("click", closeMenu);
  });

  nav.addEventListener("pointerleave", () => {
    moveBubble(activeLink());
  });

  nav.addEventListener("focusout", event => {
    if (!nav.contains(event.relatedTarget)) {
      moveBubble(activeLink());
    }
  });

  document.addEventListener("click", event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) closeMenu();
    requestAnimationFrame(() => moveBubble(activeLink()));
  });

  window.addEventListener("load", () => {
    moveBubble(activeLink());
  });

  requestAnimationFrame(() => moveBubble(activeLink()));
})();
