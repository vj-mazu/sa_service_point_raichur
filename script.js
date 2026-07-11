/* SA Service Point — script.js */
/* ponytail: minimal, dependency-free vanilla JS */

// ── Loader ──
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader")?.classList.add("hide");
  }, 200);
});

// ── Mobile Menu ──
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

// ── Hero Carousel ──
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.getElementById("heroPrev");
const nextBtn = document.getElementById("heroNext");
let cur = 0;
let timer;

function goTo(i) {
  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));
  cur = (i + slides.length) % slides.length;
  slides[cur].classList.add("active");
  dots[cur].classList.add("active");
}

function autoPlay() {
  clearInterval(timer);
  timer = setInterval(() => goTo(cur + 1), 5000);
}

nextBtn?.addEventListener("click", () => { goTo(cur + 1); autoPlay(); });
prevBtn?.addEventListener("click", () => { goTo(cur - 1); autoPlay(); });
dots.forEach(d => d.addEventListener("click", () => { goTo(+d.dataset.i); autoPlay(); }));

if (slides.length > 0) autoPlay();

// ── Scroll Reveal ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".anim-up").forEach(el => observer.observe(el));

// ── Video Play ──
function playVideo(card, url) {
  if (card.classList.contains("playing")) return;
  card.classList.add("playing");
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.setAttribute("allowfullscreen", "");
  iframe.setAttribute("allow", "autoplay; encrypted-media");
  card.appendChild(iframe);
}

// ── Header shrink on scroll ──
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;
  if (window.scrollY > 100) {
    header.style.height = "64px";
    header.style.boxShadow = "0 4px 20px rgba(0,0,0,.06)";
  } else {
    header.style.height = "";
    header.style.boxShadow = "";
  }
}, { passive: true });

// ── Booking Form Submission ──
const bookingForm = document.getElementById("bookingForm");
const formSuccess = document.getElementById("formSuccess");
const bookPhone = document.getElementById("bookPhone");

// Prevent typing non-numeric characters and restrict to exactly 10 digits
bookPhone?.addEventListener("input", (e) => {
  let val = e.target.value.replace(/\D/g, "");
  if (val.length > 10) val = val.slice(0, 10);
  e.target.value = val;
});

bookingForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  
  // Show beautiful success alert details inside form
  if (formSuccess) {
    formSuccess.style.display = "flex";
    bookingForm.querySelector(".btn-block").style.display = "none";
    
    // Auto reset and hide success message after 5 seconds
    setTimeout(() => {
      bookingForm.reset();
      formSuccess.style.display = "none";
      bookingForm.querySelector(".btn-block").style.display = "inline-flex";
    }, 5000);
  }
});
