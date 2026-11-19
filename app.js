/* ==========================================================
   Martin Todorov — Portfolio
   Vanilla JS. No dependencies.
   ========================================================== */

(function () {
  "use strict";

  // Tell CSS that JS is running (enables reveal animations).
  document.documentElement.classList.add("js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Nav: background on scroll ---------- */
  const nav = document.getElementById("nav");

  function updateNav() {
    nav.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  /* ---------- Nav: mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  function setMenu(open) {
    links.classList.toggle("is-open", open);
    nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close the menu after picking a link.
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });

  // Close the menu with Escape.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Nav: highlight current section ---------- */
  const navLinks = links.querySelectorAll("a[href^='#']");
  const sections = document.querySelectorAll("main section[id]");

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ---------- Hero: rotating word ---------- */
  const rotator = document.getElementById("rotator");
  const words = ["strategy", "content", "brand", "SEO", "growth"];
  let wordIndex = 0;

  if (rotator && !reduceMotion) {
    setInterval(function () {
      rotator.classList.add("is-swapping");
      setTimeout(function () {
        wordIndex = (wordIndex + 1) % words.length;
        rotator.textContent = words[wordIndex];
        rotator.classList.remove("is-swapping");
      }, 350);
    }, 2400);
  }

  /* ---------- Count-up numbers ---------- */
  function countUp(el) {
    const target = Number(el.dataset.count);
    if (reduceMotion) {
      el.textContent = target;
      return;
    }
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  // Stagger items that share a parent (e.g. skills, cards).
  revealEls.forEach(function (el) {
    const siblings = Array.from(el.parentElement.children).filter(function (c) {
      return c.classList.contains("reveal");
    });
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--delay", i * 0.07 + "s");
  });

  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll("[data-count]").forEach(countUp);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Experience snake: connecting lines ----------
     Draws one SVG segment between each pair of tiles, using their real
     positions. Same row: straight line. Next row on a multi-column
     layout: a curved U-turn on the right. Single column: straight down. */
  const snake = document.getElementById("snake");

  if (snake) {
    const svg = snake.querySelector(".snake__lines");
    const steps = Array.from(snake.querySelectorAll(".step"));
    const SVG_NS = "http://www.w3.org/2000/svg";
    const GAP_START = 6;   // space between a tile and the line start
    const GAP_END = 10;    // space between the arrow tip and the next tile
    const CURVE = 52;      // how far the U-turn bulges out
    const ARROW = 9;       // arrowhead length

    // Position relative to .snake-wrap. offset* ignores CSS transforms,
    // so reveal and hover animations don't skew the lines.
    function box(el) {
      return { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
    }

    function segmentPath(a, b, multiColumn) {
      const sameRow = Math.abs(a.y - b.y) < 2;

      if (sameRow) {
        const y = a.y + a.h / 2;
        const goingRight = b.x > a.x;
        const x1 = goingRight ? a.x + a.w + GAP_START : a.x - GAP_START;
        const x2 = goingRight ? b.x - GAP_END : b.x + b.w + GAP_END;
        return "M" + x1 + " " + y + " L" + x2 + " " + y;
      }

      if (multiColumn) {
        // U-turn out to the right, back into the next tile's right edge.
        const x = a.x + a.w + GAP_START;
        const xEnd = b.x + b.w + GAP_END;
        const y1 = a.y + a.h / 2;
        const y2 = b.y + b.h / 2;
        return "M" + x + " " + y1 +
               " C" + (x + CURVE) + " " + y1 + " " + (xEnd + CURVE) + " " + y2 + " " + xEnd + " " + y2;
      }

      // Single column: straight down.
      const cx = a.x + a.w / 2;
      return "M" + cx + " " + (a.y + a.h + GAP_START) + " L" + cx + " " + (b.y - GAP_END);
    }

    function arrowPath(path, length) {
      const tip = path.getPointAtLength(length);
      const back = path.getPointAtLength(Math.max(0, length - 1));
      const angle = Math.atan2(tip.y - back.y, tip.x - back.x);
      const spread = 0.5; // radians, about 29 degrees
      const p1x = tip.x - ARROW * Math.cos(angle - spread);
      const p1y = tip.y - ARROW * Math.sin(angle - spread);
      const p2x = tip.x - ARROW * Math.cos(angle + spread);
      const p2y = tip.y - ARROW * Math.sin(angle + spread);
      return "M" + tip.x + " " + tip.y + " L" + p1x + " " + p1y + " L" + p2x + " " + p2y + " Z";
    }

    function drawSnake() {
      // Remove old segments, keep <defs>.
      svg.querySelectorAll(".snake__line, .snake__arrow").forEach(function (el) { el.remove(); });

      const width = snake.offsetWidth;
      const height = snake.offsetHeight;
      svg.setAttribute("viewBox", "0 0 " + width + " " + height);

      const grad = svg.querySelector("#snakeGrad");
      grad.setAttribute("x1", 0);
      grad.setAttribute("y1", 0);
      grad.setAttribute("x2", width);
      grad.setAttribute("y2", height);

      const boxes = steps.map(box);
      const multiColumn = boxes.length > 1 && Math.abs(boxes[0].y - boxes[1].y) < 2;

      for (let i = 0; i < boxes.length - 1; i++) {
        const line = document.createElementNS(SVG_NS, "path");
        line.setAttribute("class", "snake__line");
        line.setAttribute("d", segmentPath(boxes[i], boxes[i + 1], multiColumn));
        svg.appendChild(line);

        const length = line.getTotalLength();
        line.style.strokeDasharray = length;
        line.style.setProperty("--len", length);
        line.style.transitionDelay = i * 0.35 + "s";

        const arrow = document.createElementNS(SVG_NS, "path");
        arrow.setAttribute("class", "snake__arrow");
        arrow.setAttribute("d", arrowPath(line, length));
        arrow.style.transitionDelay = i * 0.35 + 0.4 + "s";
        svg.appendChild(arrow);
      }
    }

    drawSnake();

    // Redraw once web fonts have loaded, in case tile sizes changed.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(drawSnake);
    }

    // Redraw on resize, without replaying the animation.
    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        snake.classList.add("no-anim");
        drawSnake();
        requestAnimationFrame(function () { snake.classList.remove("no-anim"); });
      }, 120);
    });

    // Draw the lines in when the section scrolls into view.
    const snakeObserver = new IntersectionObserver(function (entries, observer) {
      if (entries[0].isIntersecting) {
        snake.classList.add("is-drawn");
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    snakeObserver.observe(snake);

    // Flip cards on tap for touch screens.
    // Mouse hover and keyboard focus are handled in CSS.
    if (window.matchMedia("(hover: none)").matches) {
      snake.querySelectorAll(".step--job").forEach(function (step) {
        step.addEventListener("click", function () {
          step.classList.toggle("is-flipped");
        });
      });
    }
  }

  /* ---------- Project cards: cursor spotlight ---------- */
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - rect.left + "px");
      card.style.setProperty("--my", e.clientY - rect.top + "px");
    });
  });

  /* ---------- Copy email ---------- */
  const copyBtn = document.getElementById("copyEmail");
  const copyStatus = document.getElementById("copyStatus");
  let statusTimer;

  function showStatus(message) {
    copyStatus.textContent = message;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(function () { copyStatus.textContent = ""; }, 2500);
  }

  copyBtn.addEventListener("click", function () {
    const email = copyBtn.dataset.email;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(
        function () { showStatus("Email copied to clipboard."); },
        function () { showStatus("Couldn't copy. Please copy it manually."); }
      );
    } else {
      // Fallback for file:// pages and older browsers.
      const field = document.createElement("textarea");
      field.value = email;
      field.setAttribute("readonly", "");
      field.style.position = "absolute";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand("copy");
        showStatus("Email copied to clipboard.");
      } catch (err) {
        showStatus("Couldn't copy. Please copy it manually.");
      }
      document.body.removeChild(field);
    }
  });
})();
