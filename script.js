const loader = document.getElementById("loader");
const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursorRing");
const parallax = document.querySelector(".parallax");
const revealItems = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
const counters = document.querySelectorAll("[data-count]");

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 850);
});

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  if (cursor) {
    cursor.style.left = `${mouseX - 4}px`;
    cursor.style.top = `${mouseY - 4}px`;
  }
});

function animateCursorRing() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;

  if (ring) {
    ring.style.left = `${ringX - 18}px`;
    ring.style.top = `${ringY - 18}px`;
  }

  requestAnimationFrame(animateCursorRing);
}

animateCursorRing();

document.querySelectorAll("a, button, .media-card, .program-card, .performance-card, .masonry img").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    if (!ring) return;
    ring.style.width = "58px";
    ring.style.height = "58px";
    ring.style.borderColor = "rgba(232, 184, 75, 0.85)";
  });

  item.addEventListener("mouseleave", () => {
    if (!ring) return;
    ring.style.width = "36px";
    ring.style.height = "36px";
    ring.style.borderColor = "rgba(201, 149, 42, 0.55)";
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const item = entry.target;
      const target = Number(item.dataset.count);
      const duration = 1500;
      const startedAt = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        item.textContent = Math.floor(target * eased).toLocaleString("en-IN");

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          item.textContent = target.toLocaleString("en-IN");
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(item);
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

function onScroll() {
  const scrollY = window.scrollY;
  header.classList.toggle("scrolled", scrollY > 40);

  if (parallax && window.innerWidth > 680) {
    parallax.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0) scale(${1 + scrollY * 0.00004})`;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
