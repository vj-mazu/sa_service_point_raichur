/* SA Service Point — script.js */
/* ponytail: minimal, dependency-free vanilla JS */

// ── Loader ──
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader")?.classList.add("hide");
  }, 3000);
});

// ── Mobile Menu ──
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    menuBtn?.classList.remove("open");
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
  if (dots[cur]) dots[cur].classList.add("active");
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
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;
  if (window.scrollY > 100) {
    header.style.height = "58px";
    header.style.boxShadow = "0 4px 20px rgba(0,0,0,.06)";
  } else {
    header.style.height = "";
    header.style.boxShadow = "";
  }
}, { passive: true });

// ── Review Carousel: duplicate cards for infinite scroll ──
const reviewTrack = document.getElementById("reviewTrack");
if (reviewTrack) {
  const cards = reviewTrack.innerHTML;
  reviewTrack.innerHTML = cards + cards; // duplicate for seamless loop
}

// ── Booking Form → WhatsApp Redirect ──
const bookingForm = document.getElementById("bookingForm");
const bookPhone = document.getElementById("bookPhone");

// Restrict phone to 10 digits only
bookPhone?.addEventListener("input", (e) => {
  let val = e.target.value.replace(/\D/g, "");
  if (val.length > 10) val = val.slice(0, 10);
  e.target.value = val;
});

// Set min date to today
const bookDate = document.getElementById("bookDate");
if (bookDate) {
  const today = new Date().toISOString().split("T")[0];
  bookDate.setAttribute("min", today);
}

bookingForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("bookName")?.value || "";
  const phone = document.getElementById("bookPhone")?.value || "";
  const service = document.getElementById("bookService")?.value || "";
  const date = document.getElementById("bookDate")?.value || "";
  const address = document.getElementById("bookAddress")?.value || "";

  // Build WhatsApp message
  const msg = `Hello SA Service Point! 🙏\n\nI'd like to book a service:\n\n📅 Date: ${date}\n🔧 Service: ${service}\n👤 Name: ${name}\n📞 Phone: ${phone}\n📍 Address: ${address}\n\nPlease confirm my booking. Thank you!`;

  const waURL = `https://wa.me/917411741418?text=${encodeURIComponent(msg)}`;
  window.open(waURL, "_blank");
});
